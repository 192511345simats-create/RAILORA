"""
RAILORA - Route Optimization Engine
Graph-based routing (Dijkstra & Multi-Criteria Path Search) for Indian Railway Network.
Supports Direct and Connecting Journeys with realistic transfer layovers and budget calculations.
"""

import heapq
from datetime import datetime, timedelta
from database import get_db_connection, get_all_routes, get_all_stations


def parse_time_to_minutes(time_str):
    """Converts 'HH:MM' string to minutes from midnight."""
    h, m = map(int, time_str.split(":"))
    return h * 60 + m


def minutes_to_time_str(mins):
    """Converts minutes to 'HH:MM'."""
    mins = int(mins) % 1440
    h = mins // 60
    m = mins % 60
    return f"{h:02d}:{m:02d}"


def format_duration(total_minutes):
    """Formats minutes into 'Xh Ym'."""
    h = total_minutes // 60
    m = total_minutes % 60
    if h == 0:
        return f"{m}m"
    if m == 0:
        return f"{h}h"
    return f"{h}h {m}m"


def calculate_layover_minutes(arrival_str, next_departure_str):
    """Calculates waiting time between two connecting trains."""
    arr = parse_time_to_minutes(arrival_str)
    dep = parse_time_to_minutes(next_departure_str)
    diff = dep - arr
    if diff < 0:
        diff += 1440  # Next day departure
    return diff


def build_network_graph():
    """Builds an adjacency list graph representation of the railway network."""
    routes = get_all_routes()
    graph = {}
    for r in routes:
        u = r["from_station"]
        v = r["to_station"]
        if u not in graph:
            graph[u] = []
        graph[u].append(r)
    return graph


def search_direct_routes(from_code, to_code, travel_class="fare_sleeper"):
    """Finds all direct trains between two stations."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.*, t.train_name, t.train_type, t.speed_category,
               s1.name as from_station_name, s1.city as from_city,
               s2.name as to_station_name, s2.city as to_city
        FROM routes r
        JOIN trains t ON r.train_number = t.train_number
        JOIN stations s1 ON r.from_station = s1.code
        JOIN stations s2 ON r.to_station = s2.code
        WHERE r.from_station = ? AND r.to_station = ?
    """, (from_code, to_code))
    rows = cursor.fetchall()
    conn.close()

    direct_routes = []
    for r in rows:
        row = dict(r)
        fare = row.get(travel_class, row["fare_sleeper"])
        direct_routes.append({
            "id": f"direct-{row['id']}",
            "route_type": "Direct",
            "transfers": 0,
            "train_identifiers": f"{row['train_number']} {row['train_name']}",
            "total_duration_minutes": row["duration_minutes"],
            "formatted_duration": format_duration(row["duration_minutes"]),
            "departure_time": row["departure_time"],
            "arrival_time": row["arrival_time"],
            "departure_station_code": row["from_station"],
            "departure_station_name": row["from_station_name"],
            "departure_city": row["from_city"],
            "arrival_station_code": row["to_station"],
            "arrival_station_name": row["to_station_name"],
            "arrival_city": row["to_city"],
            "total_fare": fare,
            "total_distance_km": row["distance_km"],
            "layover_minutes": 0,
            "formatted_layover": "None (Direct Train)",
            "legs": [{
                "leg_index": 1,
                "train_number": row["train_number"],
                "train_name": row["train_name"],
                "train_type": row["train_type"],
                "speed_category": row["speed_category"],
                "from_station": row["from_station"],
                "from_station_name": row["from_station_name"],
                "to_station": row["to_station"],
                "to_station_name": row["to_station_name"],
                "departure_time": row["departure_time"],
                "arrival_time": row["arrival_time"],
                "duration_minutes": row["duration_minutes"],
                "distance_km": row["distance_km"],
                "fare": fare,
            }],
            "path_stations": [
                {"code": row["from_station"], "name": row["from_station_name"], "is_transfer": False, "role": "Origin"},
                {"code": row["to_station"], "name": row["to_station_name"], "is_transfer": False, "role": "Destination"}
            ]
        })
    return direct_routes


def search_one_transfer_routes(from_code, to_code, travel_class="fare_sleeper"):
    """
    Finds connecting journeys with 1 transfer:
    Source -> Intermediate Hub X -> Destination.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            r1.id as leg1_id, r1.train_number as leg1_train_num, r1.from_station as leg1_from,
            r1.to_station as hub_code, r1.departure_time as leg1_dep, r1.arrival_time as leg1_arr,
            r1.duration_minutes as leg1_dur, r1.distance_km as leg1_dist,
            r1.fare_sleeper as leg1_fare_sl, r1.fare_3ac as leg1_fare_3ac, r1.fare_2ac as leg1_fare_2ac, r1.fare_general as leg1_fare_gen,
            t1.train_name as leg1_name, t1.train_type as leg1_type, t1.speed_category as leg1_spd,

            r2.id as leg2_id, r2.train_number as leg2_train_num, r2.from_station as leg2_from,
            r2.to_station as leg2_to, r2.departure_time as leg2_dep, r2.arrival_time as leg2_arr,
            r2.duration_minutes as leg2_dur, r2.distance_km as leg2_dist,
            r2.fare_sleeper as leg2_fare_sl, r2.fare_3ac as leg2_fare_3ac, r2.fare_2ac as leg2_fare_2ac, r2.fare_general as leg2_fare_gen,
            t2.train_name as leg2_name, t2.train_type as leg2_type, t2.speed_category as leg2_spd,

            s_orig.name as orig_name, s_orig.city as orig_city,
            s_hub.name as hub_name, s_hub.city as hub_city,
            s_dest.name as dest_name, s_dest.city as dest_city

        FROM routes r1
        JOIN routes r2 ON r1.to_station = r2.from_station
        JOIN trains t1 ON r1.train_number = t1.train_number
        JOIN trains t2 ON r2.train_number = t2.train_number
        JOIN stations s_orig ON r1.from_station = s_orig.code
        JOIN stations s_hub ON r1.to_station = s_hub.code
        JOIN stations s_dest ON r2.to_station = s_dest.code
        WHERE r1.from_station = ?
          AND r2.to_station = ?
          AND r1.to_station != ?
          AND r1.to_station != ?
    """, (from_code, to_code, from_code, to_code))

    rows = cursor.fetchall()
    conn.close()

    connecting_routes = []
    class_map = {
        "fare_sleeper": ("leg1_fare_sl", "leg2_fare_sl"),
        "fare_3ac": ("leg1_fare_3ac", "leg2_fare_3ac"),
        "fare_2ac": ("leg1_fare_2ac", "leg2_fare_2ac"),
        "fare_general": ("leg1_fare_gen", "leg2_fare_gen"),
    }
    f1_key, f2_key = class_map.get(travel_class, ("leg1_fare_sl", "leg2_fare_sl"))

    for r in rows:
        row = dict(r)
        layover = calculate_layover_minutes(row["leg1_arr"], row["leg2_dep"])

        # Realistic buffer: at least 35 minutes to change trains, max 10 hours for a demo connection
        if layover < 35:
            # If layover is too tight (< 35 mins), next train might depart next day or needs reasonable buffer
            layover += 1440

        total_duration = row["leg1_dur"] + layover + row["leg2_dur"]
        fare1 = row[f1_key]
        fare2 = row[f2_key]
        total_fare = fare1 + fare2
        total_dist = row["leg1_dist"] + row["leg2_dist"]

        connecting_routes.append({
            "id": f"conn1-{row['leg1_id']}-{row['leg2_id']}",
            "route_type": "1 Transfer",
            "transfers": 1,
            "train_identifiers": f"{row['leg1_train_num']} {row['leg1_name']} ➔ {row['leg2_train_num']} {row['leg2_name']}",
            "transfer_station": row["hub_name"],
            "transfer_station_code": row["hub_code"],
            "total_duration_minutes": total_duration,
            "formatted_duration": format_duration(total_duration),
            "departure_time": row["leg1_dep"],
            "arrival_time": row["leg2_arr"],
            "departure_station_code": row["leg1_from"],
            "departure_station_name": row["orig_name"],
            "departure_city": row["orig_city"],
            "arrival_station_code": row["leg2_to"],
            "arrival_station_name": row["dest_name"],
            "arrival_city": row["dest_city"],
            "total_fare": total_fare,
            "total_distance_km": total_dist,
            "layover_minutes": layover,
            "formatted_layover": format_duration(layover),
            "legs": [
                {
                    "leg_index": 1,
                    "train_number": row["leg1_train_num"],
                    "train_name": row["leg1_name"],
                    "train_type": row["leg1_type"],
                    "speed_category": row["leg1_spd"],
                    "from_station": row["leg1_from"],
                    "from_station_name": row["orig_name"],
                    "to_station": row["hub_code"],
                    "to_station_name": row["hub_name"],
                    "departure_time": row["leg1_dep"],
                    "arrival_time": row["leg1_arr"],
                    "duration_minutes": row["leg1_dur"],
                    "distance_km": row["leg1_dist"],
                    "fare": fare1,
                },
                {
                    "leg_index": 2,
                    "train_number": row["leg2_train_num"],
                    "train_name": row["leg2_name"],
                    "train_type": row["leg2_type"],
                    "speed_category": row["leg2_spd"],
                    "from_station": row["hub_code"],
                    "from_station_name": row["hub_name"],
                    "to_station": row["leg2_to"],
                    "to_station_name": row["dest_name"],
                    "departure_time": row["leg2_dep"],
                    "arrival_time": row["leg2_arr"],
                    "duration_minutes": row["leg2_dur"],
                    "distance_km": row["leg2_dist"],
                    "fare": fare2,
                }
            ],
            "path_stations": [
                {"code": row["leg1_from"], "name": row["orig_name"], "is_transfer": False, "role": "Origin"},
                {"code": row["hub_code"], "name": f"{row['hub_name']} (Interchange)", "is_transfer": True, "role": "Transfer"},
                {"code": row["leg2_to"], "name": row["dest_name"], "is_transfer": False, "role": "Destination"}
            ]
        })

    return connecting_routes


def dijkstra_multi_criteria_search(from_code, to_code, criterion="best_value", travel_class="fare_sleeper"):
    """
    Dijkstra's Shortest Path Algorithm on Railway Graph.
    Edge weights are computed based on the optimization objective:
    - 'cheapest': edge fare
    - 'fastest': travel time + layover
    - 'best_value': weighted multi-objective cost
    """
    graph = build_network_graph()
    stations_by_code = {s["code"]: s for s in get_all_stations()}

    if from_code not in graph or to_code not in stations_by_code:
        return []

    # Priority queue item: (cost, current_node, path_segments, total_time, total_fare, total_distance)
    pq = [(0, from_code, [], 0, 0, 0)]
    visited = {}

    found_solutions = []

    while pq and len(found_solutions) < 6:
        cost, curr, path, t_time, t_fare, t_dist = heapq.heappop(pq)

        if curr == to_code and path:
            found_solutions.append((cost, path, t_time, t_fare, t_dist))
            continue

        state_key = (curr, len(path))
        if state_key in visited and visited[state_key] <= cost:
            continue
        visited[state_key] = cost

        # Prune paths with more than 3 legs
        if len(path) >= 3:
            continue

        for edge in graph.get(curr, []):
            nxt = edge["to_station"]
            # Avoid cycling through visited station
            if any(p["from_station"] == nxt or p["to_station"] == nxt for p in path):
                continue

            leg_fare = edge.get(travel_class, edge["fare_sleeper"])
            leg_dur = edge["duration_minutes"]
            leg_dist = edge["distance_km"]

            layover = 0
            if path:
                prev_arr = path[-1]["arrival_time"]
                curr_dep = edge["departure_time"]
                layover = calculate_layover_minutes(prev_arr, curr_dep)
                if layover < 35:
                    layover += 1440

            new_time = t_time + leg_dur + layover
            new_fare = t_fare + leg_fare
            new_dist = t_dist + leg_dist

            # Objective weight
            if criterion == "cheapest":
                edge_cost = leg_fare + (layover * 0.1)
            elif criterion == "fastest":
                edge_cost = leg_dur + layover
            else:  # best_value
                edge_cost = (leg_dur + layover) * 0.6 + leg_fare * 0.4 + (150 if path else 0)

            new_cost = cost + edge_cost

            new_path = path + [{
                **edge,
                "leg_fare": leg_fare,
                "layover_minutes": layover
            }]

            heapq.heappush(pq, (new_cost, nxt, new_path, new_time, new_fare, new_dist))

    # Format found solutions into route recommendations
    dijkstra_routes = []
    for idx, (_, path, tot_time, tot_fare, tot_dist) in enumerate(found_solutions):
        if len(path) == 0:
            continue

        transfers = len(path) - 1
        orig_s = stations_by_code.get(path[0]["from_station"], {})
        dest_s = stations_by_code.get(path[-1]["to_station"], {})

        legs_data = []
        path_stations = [
            {"code": orig_s.get("code", from_code), "name": orig_s.get("name", from_code), "is_transfer": False, "role": "Origin"}
        ]

        total_layover = sum(p.get("layover_minutes", 0) for p in path[1:])

        train_identifiers_list = []
        for i, leg in enumerate(path):
            train_identifiers_list.append(f"{leg['train_number']} {leg['train_name']}")
            legs_data.append({
                "leg_index": i + 1,
                "train_number": leg["train_number"],
                "train_name": leg["train_name"],
                "train_type": leg["train_type"],
                "speed_category": leg["speed_category"],
                "from_station": leg["from_station"],
                "from_station_name": leg["from_station_name"],
                "to_station": leg["to_station"],
                "to_station_name": leg["to_station_name"],
                "departure_time": leg["departure_time"],
                "arrival_time": leg["arrival_time"],
                "duration_minutes": leg["duration_minutes"],
                "distance_km": leg["distance_km"],
                "fare": leg["leg_fare"],
                "layover_minutes": leg.get("layover_minutes", 0)
            })

            if i < len(path) - 1:
                hub_s = stations_by_code.get(leg["to_station"], {})
                path_stations.append({
                    "code": leg["to_station"],
                    "name": f"{hub_s.get('name', leg['to_station'])} (Interchange)",
                    "is_transfer": True,
                    "role": "Transfer"
                })

        path_stations.append({
            "code": dest_s.get("code", to_code),
            "name": dest_s.get("name", to_code),
            "is_transfer": False,
            "role": "Destination"
        })

        route_type = "Direct" if transfers == 0 else f"{transfers} Transfer" + ("s" if transfers > 1 else "")

        dijkstra_routes.append({
            "id": f"dijkstra-{idx + 1}-{'-'.join(str(p['id']) for p in path)}",
            "route_type": route_type,
            "transfers": transfers,
            "train_identifiers": " ➔ ".join(train_identifiers_list),
            "total_duration_minutes": tot_time,
            "formatted_duration": format_duration(tot_time),
            "departure_time": path[0]["departure_time"],
            "arrival_time": path[-1]["arrival_time"],
            "departure_station_code": path[0]["from_station"],
            "departure_station_name": orig_s.get("name", from_code),
            "departure_city": orig_s.get("city", ""),
            "arrival_station_code": path[-1]["to_station"],
            "arrival_station_name": dest_s.get("name", to_code),
            "arrival_city": dest_s.get("city", ""),
            "total_fare": tot_fare,
            "total_distance_km": tot_dist,
            "layover_minutes": total_layover,
            "formatted_layover": format_duration(total_layover) if total_layover > 0 else "None",
            "legs": legs_data,
            "path_stations": path_stations
        })

    return dijkstra_routes


def find_optimized_routes(from_code, to_code, max_budget=None, passengers=1, sort_by="best_value", travel_class="fare_sleeper"):
    """
    Comprehensive Route Optimizer:
    1. Gathers Direct routes
    2. Gathers 1-Transfer routes
    3. Runs Dijkstra multi-criteria search
    4. Merges & eliminates duplicates
    5. Calculates remaining budget and suitability
    6. Sorts by requested criterion (cheapest, fastest, best_value)
    """
    all_candidates = []
    seen_train_signatures = set()

    # 1. Direct trains
    directs = search_direct_routes(from_code, to_code, travel_class)
    for d in directs:
        sig = d["train_identifiers"]
        if sig not in seen_train_signatures:
            seen_train_signatures.add(sig)
            all_candidates.append(d)

    # 2. 1-Transfer connecting journeys
    conn1 = search_one_transfer_routes(from_code, to_code, travel_class)
    for c in conn1:
        sig = c["train_identifiers"]
        if sig not in seen_train_signatures:
            seen_train_signatures.add(sig)
            all_candidates.append(c)

    # 3. Dijkstra multi-criteria (discovers additional optimal paths)
    dijkstra_results = dijkstra_multi_criteria_search(from_code, to_code, criterion=sort_by, travel_class=travel_class)
    for dr in dijkstra_results:
        sig = dr["train_identifiers"]
        if sig not in seen_train_signatures:
            seen_train_signatures.add(sig)
            all_candidates.append(dr)

    # Calculate budget and scores
    passengers = max(1, int(passengers))
    for r in all_candidates:
        total_trip_fare = r["total_fare"] * passengers
        r["total_trip_fare"] = total_trip_fare
        r["per_passenger_fare"] = r["total_fare"]
        r["passengers"] = passengers

        if max_budget is not None and max_budget > 0:
            remaining = max_budget - total_trip_fare
            r["remaining_budget"] = remaining
            r["budget_utilization_pct"] = round((total_trip_fare / max_budget) * 100, 1)
            r["fits_budget"] = remaining >= 0
        else:
            r["remaining_budget"] = None
            r["budget_utilization_pct"] = None
            r["fits_budget"] = True

        # Composite score for best_value: lower score is better
        # Balance fare (weight 0.4) and time in hours (weight 0.6) + transfer penalty
        hours = r["total_duration_minutes"] / 60.0
        r["value_score"] = round(r["total_fare"] * 0.4 + hours * 35.0 + r["transfers"] * 90.0, 2)

    # Sorting
    if sort_by == "cheapest":
        all_candidates.sort(key=lambda x: (x["total_fare"], x["total_duration_minutes"]))
    elif sort_by == "fastest":
        all_candidates.sort(key=lambda x: (x["total_duration_minutes"], x["total_fare"]))
    else:  # best_value
        all_candidates.sort(key=lambda x: x["value_score"])

    return all_candidates

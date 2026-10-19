"""
RAILORA - Smart Railway Route Optimization & Budget Planning System
Backend API Server (Flask + SQLite)
College-level engineering project integrating route optimization, budget planning,
and operating system concurrency demonstrations.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_all_stations, get_all_routes
from router import find_optimized_routes
import os_lab

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests from React dev server


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "system": "RAILORA",
        "tagline": "Every journey has another way.",
        "version": "2.0.0-pro"
    })


@app.route("/api/stations", methods=["GET"])
def get_stations():
    try:
        stations = get_all_stations()
        return jsonify({
            "status": "success",
            "count": len(stations),
            "stations": stations
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/search", methods=["POST"])
def search_routes():
    try:
        data = request.get_json() or {}
        from_code = data.get("from_station", "").strip().upper()
        to_code = data.get("to_station", "").strip().upper()
        journey_date = data.get("journey_date", "")
        max_budget = data.get("max_budget")
        passengers = int(data.get("passengers", 1))
        sort_by = data.get("sort_by", "best_value")
        travel_class = data.get("travel_class", "fare_sleeper")

        # Validations
        if not from_code or not to_code:
            return jsonify({
                "status": "error",
                "message": "Both departure (From) and arrival (To) stations are required."
            }), 400

        if from_code == to_code:
            return jsonify({
                "status": "error",
                "message": "Departure and arrival stations cannot be identical. Please select two distinct stations."
            }), 400

        if passengers < 1:
            passengers = 1

        if max_budget is not None and max_budget != "":
            try:
                max_budget = float(max_budget)
            except ValueError:
                max_budget = None
        else:
            max_budget = None

        routes = find_optimized_routes(
            from_code=from_code,
            to_code=to_code,
            max_budget=max_budget,
            passengers=passengers,
            sort_by=sort_by,
            travel_class=travel_class
        )

        return jsonify({
            "status": "success",
            "query": {
                "from_station": from_code,
                "to_station": to_code,
                "journey_date": journey_date,
                "max_budget": max_budget,
                "passengers": passengers,
                "sort_by": sort_by,
                "travel_class": travel_class
            },
            "total_found": len(routes),
            "routes": routes,
            "demo_disclaimer": "Simulated schedules and fares are for demonstration purposes only. RAILORA does not connect to live IRCTC systems."
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/budget/calculate", methods=["POST"])
def calculate_budget():
    try:
        data = request.get_json() or {}
        total_budget = float(data.get("total_budget", 0))
        train_fare = float(data.get("train_fare", 0))
        passengers = max(1, int(data.get("passengers", 1)))
        local_transit = float(data.get("local_transit", 0))
        food_expenses = float(data.get("food_expenses", 0))
        other_expenses = float(data.get("other_expenses", 0))

        total_train_fare = train_fare * passengers
        additional_expenses = local_transit + food_expenses + other_expenses
        total_expenditure = total_train_fare + additional_expenses

        remaining_budget = total_budget - total_expenditure
        utilization_pct = round((total_expenditure / max(1.0, total_budget)) * 100, 1) if total_budget > 0 else 0
        fits_budget = remaining_budget >= 0

        if remaining_budget >= total_budget * 0.2:
            status_label = "Comfortable Budget"
            status_color = "success"
            message = f"Journey fits well within budget! You will have ₹{int(remaining_budget):,} remaining for emergency reserves."
        elif remaining_budget >= 0:
            status_label = "Tight Budget"
            status_color = "warning"
            message = f"Journey fits within budget, but safety margin is under 20% (₹{int(remaining_budget):,} remaining)."
        else:
            status_label = "Budget Exceeded"
            status_color = "danger"
            message = f"Warning: Estimated expenses exceed your travel budget by ₹{abs(int(remaining_budget)):,}! Consider sleeper class or alternative connecting routes."

        return jsonify({
            "status": "success",
            "calculation": {
                "total_budget": total_budget,
                "train_fare_per_passenger": train_fare,
                "passengers": passengers,
                "total_train_fare": total_train_fare,
                "local_transit": local_transit,
                "food_expenses": food_expenses,
                "other_expenses": other_expenses,
                "additional_expenses": additional_expenses,
                "total_expenditure": total_expenditure,
                "remaining_budget": remaining_budget,
                "utilization_pct": utilization_pct,
                "fits_budget": fits_budget,
                "status_label": status_label,
                "status_color": status_color,
                "advisory_message": message
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ============================================================================
# OS CONCEPTS LAB ENDPOINTS
# ============================================================================

@app.route("/api/os/process-threads", methods=["POST"])
def os_process_threads():
    try:
        data = request.get_json() or {}
        worker_count = int(data.get("worker_count", 4))
        result = os_lab.run_process_threads_simulation(worker_count=worker_count)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/os/cpu-scheduling", methods=["POST"])
def os_cpu_scheduling():
    try:
        data = request.get_json() or {}
        time_quantum = int(data.get("time_quantum", 3))
        processes = data.get("processes", None)
        result = os_lab.run_cpu_round_robin(time_quantum=time_quantum, processes=processes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/os/synchronization", methods=["POST"])
def os_synchronization():
    try:
        data = request.get_json() or {}
        initial_seats = int(data.get("initial_seats", 5))
        concurrent_requests = int(data.get("concurrent_requests", 15))
        use_mutex = bool(data.get("use_mutex", False))
        result = os_lab.run_synchronization_simulation(
            initial_seats=initial_seats,
            concurrent_requests=concurrent_requests,
            use_mutex=use_mutex
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/os/deadlock", methods=["POST"])
def os_deadlock():
    try:
        data = request.get_json() or {}
        strategy = data.get("strategy", "uncontrolled")
        result = os_lab.run_deadlock_simulation(strategy=strategy)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/os/performance-benchmark", methods=["POST"])
def os_performance_benchmark():
    try:
        data = request.get_json() or {}
        iterations = int(data.get("iterations", 12))
        workers = int(data.get("workers", 4))
        result = os_lab.run_performance_benchmark(iterations=iterations, concurrency_workers=workers)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    init_db(force_reseed=False)
    print("RAILORA Backend running on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)

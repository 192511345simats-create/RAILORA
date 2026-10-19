"""
RAILORA - Railway Route Optimization & Budget Planning System
Database initialization with rich Indian Railway network.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "railway.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(force_reseed=True):
    conn = get_db_connection()
    cursor = conn.cursor()

    if force_reseed:
        cursor.execute("DROP TABLE IF EXISTS routes;")
        cursor.execute("DROP TABLE IF EXISTS trains;")
        cursor.execute("DROP TABLE IF EXISTS stations;")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS stations (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zone TEXT NOT NULL,
        latitude REAL,
        longitude REAL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trains (
        train_number TEXT PRIMARY KEY,
        train_name TEXT NOT NULL,
        train_type TEXT NOT NULL,
        speed_category TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_number TEXT NOT NULL,
        from_station TEXT NOT NULL,
        to_station TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        distance_km INTEGER NOT NULL,
        fare_general INTEGER NOT NULL,
        fare_sleeper INTEGER NOT NULL,
        fare_3ac INTEGER NOT NULL,
        fare_2ac INTEGER NOT NULL,
        FOREIGN KEY (train_number) REFERENCES trains(train_number),
        FOREIGN KEY (from_station) REFERENCES stations(code),
        FOREIGN KEY (to_station) REFERENCES stations(code)
    );
    """)

    cursor.execute("SELECT COUNT(*) FROM stations;")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()
    print("Database initialized and seeded successfully at:", DB_PATH)


def seed_data(cursor):
    # Realistic Indian Railway Hubs across all zones
    stations = [
        ("NDLS", "New Delhi", "New Delhi", "Delhi", "NR", 28.6430, 77.2195),
        ("MMCT", "Mumbai Central", "Mumbai", "Maharashtra", "WR", 18.9696, 72.8193),
        ("CSMT", "Mumbai CSMT", "Mumbai", "Maharashtra", "CR", 18.9402, 72.8356),
        ("HWH", "Howrah Junction", "Kolkata", "West Bengal", "ER", 22.5839, 88.3433),
        ("MAS", "Chennai Central", "Chennai", "Tamil Nadu", "SR", 13.0827, 80.2707),
        ("SBC", "KSR Bengaluru", "Bengaluru", "Karnataka", "SWR", 12.9781, 77.5696),
        ("HYB", "Hyderabad Deccan", "Hyderabad", "Telangana", "SCR", 17.3923, 78.4738),
        ("SC", "Secunderabad Junction", "Hyderabad", "Telangana", "SCR", 17.4339, 78.5042),
        ("ADI", "Ahmedabad Junction", "Ahmedabad", "Gujarat", "WR", 23.0225, 72.6006),
        ("PUNE", "Pune Junction", "Pune", "Maharashtra", "CR", 18.5284, 73.8739),
        ("JP", "Jaipur Junction", "Jaipur", "Rajasthan", "NWR", 26.9200, 75.7878),
        ("LKO", "Lucknow Charbagh", "Lucknow", "Uttar Pradesh", "NR", 26.8322, 80.9197),
        ("CNB", "Kanpur Central", "Kanpur", "Uttar Pradesh", "NCR", 26.4542, 80.3507),
        ("PNBE", "Patna Junction", "Patna", "Bihar", "ECR", 25.6022, 85.1376),
        ("BSB", "Varanasi Junction", "Varanasi", "Uttar Pradesh", "NER", 25.3283, 82.9866),
        ("BPL", "Bhopal Junction", "Bhopal", "Madhya Pradesh", "WCR", 23.2694, 77.4126),
        ("NGP", "Nagpur Junction", "Nagpur", "Maharashtra", "CR", 21.1524, 79.0888),
        ("BBS", "Bhubaneswar", "Bhubaneswar", "Odisha", "ECoR", 20.2666, 85.8436),
        ("MAO", "Madgaon Junction", "Goa", "Goa", "KR", 15.2750, 73.9780),
        ("CDG", "Chandigarh Junction", "Chandigarh", "Punjab/Haryana", "NR", 30.7022, 76.8220),
        ("ASR", "Amritsar Junction", "Amritsar", "Punjab", "NR", 31.6340, 74.8723),
        ("ST", "Surat", "Surat", "Gujarat", "WR", 21.2049, 72.8407),
        ("BRC", "Vadodara Junction", "Vadodara", "Gujarat", "WR", 22.3107, 73.1812),
        ("AGC", "Agra Cantt", "Agra", "Uttar Pradesh", "NCR", 27.1593, 77.9942),
        ("GWL", "Gwalior Junction", "Gwalior", "Madhya Pradesh", "NCR", 26.2183, 78.1828),
        ("VGLB", "Virangana Lakshmibai (Jhansi)", "Jhansi", "Uttar Pradesh", "NCR", 25.4484, 78.5685),
        ("PRYJ", "Prayagraj Junction", "Prayagraj", "Uttar Pradesh", "NCR", 25.4439, 81.8252),
        ("BZA", "Vijayawada Junction", "Vijayawada", "Andhra Pradesh", "SCR", 16.5186, 80.6200),
        ("CBE", "Coimbatore Junction", "Coimbatore", "Tamil Nadu", "SR", 11.0016, 76.9628),
        ("ERS", "Ernakulam Junction", "Kochi", "Kerala", "SR", 9.9678, 76.2917),
        ("KOTA", "Kota Junction", "Kota", "Rajasthan", "WCR", 25.2138, 75.8648),
        ("R", "Raipur Junction", "Raipur", "Chhattisgarh", "SECR", 21.2570, 81.6296),
        ("VSKP", "Visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "ECoR", 17.7215, 83.2872),
        ("GHY", "Guwahati", "Guwahati", "Assam", "NFR", 26.1806, 91.7539),
        ("JBP", "Jabalpur", "Jabalpur", "Madhya Pradesh", "WCR", 23.1686, 79.9339),
    ]

    cursor.executemany("""
    INSERT INTO stations (code, name, city, state, zone, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, stations)

    trains = [
        ("12951", "Mumbai Rajdhani Express", "Rajdhani", "Superfast"),
        ("12952", "New Delhi Rajdhani Express", "Rajdhani", "Superfast"),
        ("12953", "August Kranti Rajdhani", "Rajdhani", "Superfast"),
        ("12954", "August Kranti Rajdhani (Up)", "Rajdhani", "Superfast"),
        ("12301", "Howrah Rajdhani Express", "Rajdhani", "Superfast"),
        ("12302", "New Delhi Howrah Rajdhani", "Rajdhani", "Superfast"),
        ("12431", "Trivandrum Rajdhani Express", "Rajdhani", "Superfast"),
        ("12432", "Trivandrum Rajdhani (Up)", "Rajdhani", "Superfast"),
        ("12626", "Kerala Express", "Superfast", "Express"),
        ("12625", "Kerala Express (Up)", "Superfast", "Express"),
        ("12622", "Tamil Nadu Express", "Superfast", "Express"),
        ("12621", "Tamil Nadu Express (Up)", "Superfast", "Express"),
        ("12004", "Lucknow Swarna Shatabdi", "Shatabdi", "Superfast"),
        ("12003", "Lucknow Swarna Shatabdi (Up)", "Shatabdi", "Superfast"),
        ("22436", "Vande Bharat Express (Varanasi)", "Vande Bharat", "High Speed"),
        ("22435", "Vande Bharat Express (Varanasi Up)", "Vande Bharat", "High Speed"),
        ("20901", "Vande Bharat Express (Mumbai-Gandhinagar)", "Vande Bharat", "High Speed"),
        ("20902", "Vande Bharat Express (Gandhinagar-Mumbai)", "Vande Bharat", "High Speed"),
        ("12137", "Punjab Mail", "Mail", "Express"),
        ("12138", "Punjab Mail (Up)", "Mail", "Express"),
        ("12840", "Howrah Mail", "Mail", "Express"),
        ("12839", "Howrah Mail (Up)", "Mail", "Express"),
        ("12163", "LTT Chennai Superfast", "Superfast", "Express"),
        ("12164", "Chennai LTT Superfast", "Superfast", "Express"),
        ("12723", "Telangana Express", "Superfast", "Express"),
        ("12724", "Telangana Express (Up)", "Superfast", "Express"),
        ("12002", "Bhopal Shatabdi Express", "Shatabdi", "Superfast"),
        ("12001", "Bhopal Shatabdi (Up)", "Shatabdi", "Superfast"),
        ("12424", "Dibrugarh Rajdhani", "Rajdhani", "Superfast"),
        ("12423", "Dibrugarh Rajdhani (Up)", "Rajdhani", "Superfast"),
        ("12650", "Karnataka Sampark Kranti", "Sampark Kranti", "Superfast"),
        ("12649", "Karnataka Sampark Kranti (Up)", "Sampark Kranti", "Superfast"),
        ("12979", "Bandra Terminus Jaipur SF", "Superfast", "Express"),
        ("12980", "Jaipur Bandra Terminus SF", "Superfast", "Express"),
        ("12802", "Purushottam Express", "Superfast", "Express"),
        ("12801", "Purushottam Express (Up)", "Superfast", "Express"),
        ("12708", "AP Sampark Kranti", "Sampark Kranti", "Superfast"),
        ("12707", "AP Sampark Kranti (Up)", "Sampark Kranti", "Superfast"),
        ("12296", "Sanghamitra Express", "Superfast", "Express"),
        ("12295", "Sanghamitra Express (Up)", "Superfast", "Express"),
        ("12864", "Howrah Sir M. Visvesvaraya SF", "Superfast", "Express"),
        ("12863", "Sir M. Visvesvaraya Howrah SF", "Superfast", "Express"),
        ("16345", "Netravati Express", "Express", "Express"),
        ("16346", "Netravati Express (Up)", "Express", "Express"),
        ("12051", "Jan Shatabdi Express (Goa)", "Jan Shatabdi", "Superfast"),
        ("12052", "Jan Shatabdi Express (Goa Up)", "Jan Shatabdi", "Superfast"),
        ("12780", "Goa Express", "Superfast", "Express"),
        ("12779", "Goa Express (Up)", "Superfast", "Express"),
        ("12834", "Howrah Express (Ahmedabad)", "Express", "Express"),
        ("12833", "Ahmedabad Howrah Express", "Express", "Express"),
        ("12061", "Jabalpur Jan Shatabdi", "Jan Shatabdi", "Superfast"),
        ("12062", "Jabalpur Jan Shatabdi (Up)", "Jan Shatabdi", "Superfast"),
        ("12192", "Shridham Express", "Superfast", "Express"),
        ("12191", "Shridham Express (Up)", "Superfast", "Express"),
        ("12414", "Pooja SF Express", "Superfast", "Express"),
        ("12413", "Pooja SF Express (Up)", "Superfast", "Express"),
        ("12011", "Kalka Shatabdi", "Shatabdi", "Superfast"),
        ("12012", "Kalka Shatabdi (Up)", "Shatabdi", "Superfast"),
        ("12007", "Chennai Mysore Shatabdi", "Shatabdi", "Superfast"),
        ("12008", "Mysore Chennai Shatabdi", "Shatabdi", "Superfast"),
        ("12658", "Bengaluru Chennai Mail", "Mail", "Express"),
        ("12675", "Kovai Express", "Superfast", "Express"),
        ("12676", "Kovai Express (Up)", "Superfast", "Express"),
        ("12677", "Ernakulam Intercity", "Intercity", "Express"),
        ("12678", "Ernakulam Intercity (Up)", "Intercity", "Express"),
        ("12123", "Deccan Queen", "Superfast", "Express"),
        ("12124", "Deccan Queen (Up)", "Superfast", "Express"),
        ("12702", "Hussainsagar Express", "Express", "Express"),
        ("12701", "Hussainsagar Express (Up)", "Express", "Express"),
        ("12015", "Ajmer Shatabdi", "Shatabdi", "Superfast"),
        ("12016", "Ajmer Shatabdi (Up)", "Shatabdi", "Superfast"),
        ("12459", "New Delhi Amritsar Intercity", "Intercity", "Express"),
        ("12460", "Amritsar New Delhi Intercity", "Intercity", "Express"),
        ("12842", "Coromandel Express", "Superfast", "Express"),
        ("12841", "Coromandel Express (Up)", "Superfast", "Express"),
        ("12786", "Kacheguda Express", "Express", "Express"),
        ("12785", "Kacheguda Express (Up)", "Express", "Express"),
        ("11302", "Udyan Express", "Express", "Express"),
        ("11301", "Udyan Express (Up)", "Express", "Express"),
        ("12345", "Saraighat Express", "Superfast", "Express"),
        ("12346", "Saraighat Express (Up)", "Superfast", "Express"),
    ]

    cursor.executemany("""
    INSERT INTO trains (train_number, train_name, train_type, speed_category)
    VALUES (?, ?, ?, ?);
    """, trains)

    # All route segments
    routes = [
        # --- Delhi <-> Mumbai ---
        ("12952", "NDLS", "MMCT", "16:55", "08:35", 940, 1384, 380, 720, 2150, 3100),
        ("12951", "MMCT", "NDLS", "17:00", "08:32", 932, 1384, 380, 720, 2150, 3100),
        ("12953", "MMCT", "NDLS", "17:10", "10:55", 1065, 1378, 360, 680, 2050, 2980),
        ("12954", "NDLS", "MMCT", "17:15", "10:05", 1010, 1378, 360, 680, 2050, 2980),
        ("12137", "CSMT", "NDLS", "19:35", "19:25", 1430, 1543, 310, 595, 1680, 2450),
        ("12138", "NDLS", "CSMT", "05:15", "07:35", 1580, 1543, 310, 595, 1680, 2450),

        # Delhi <-> Intermediate West
        ("12952", "NDLS", "KOTA", "16:55", "21:30", 275, 465, 160, 280, 890, 1260),
        ("12951", "KOTA", "NDLS", "03:15", "08:32", 317, 465, 160, 280, 890, 1260),
        ("12952", "KOTA", "BRC", "21:35", "03:40", 365, 528, 180, 320, 990, 1420),
        ("12951", "BRC", "KOTA", "21:10", "03:10", 360, 528, 180, 320, 990, 1420),
        ("12952", "BRC", "ST", "03:45", "05:15", 90, 130, 70, 140, 480, 710),
        ("12951", "ST", "BRC", "19:40", "21:05", 85, 130, 70, 140, 480, 710),
        ("12952", "ST", "MMCT", "05:20", "08:35", 195, 263, 110, 190, 620, 920),
        ("12951", "MMCT", "ST", "17:00", "19:35", 155, 263, 110, 190, 620, 920),

        # --- Delhi <-> Kolkata / Howrah ---
        ("12302", "NDLS", "HWH", "16:50", "09:55", 1025, 1451, 390, 740, 2220, 3200),
        ("12301", "HWH", "NDLS", "16:50", "10:05", 1035, 1451, 390, 740, 2220, 3200),
        ("12802", "NDLS", "CNB", "22:40", "04:00", 320, 440, 150, 270, 850, 1200),
        ("12801", "CNB", "NDLS", "21:40", "04:00", 380, 440, 150, 270, 850, 1200),
        ("12802", "CNB", "PRYJ", "04:10", "06:55", 165, 194, 90, 160, 520, 740),
        ("12801", "PRYJ", "CNB", "19:20", "21:30", 130, 194, 90, 160, 520, 740),
        ("12802", "PRYJ", "BSB", "07:05", "09:50", 165, 124, 75, 140, 460, 680),
        ("12801", "BSB", "PRYJ", "16:50", "19:10", 140, 124, 75, 140, 460, 680),
        ("12802", "BSB", "PNBE", "10:00", "14:15", 255, 228, 110, 190, 620, 890),
        ("12801", "PNBE", "BSB", "12:15", "16:40", 265, 228, 110, 190, 620, 890),
        ("12802", "PNBE", "HWH", "14:30", "22:30", 480, 532, 190, 340, 1050, 1520),
        ("12801", "HWH", "PNBE", "04:00", "12:05", 485, 532, 190, 340, 1050, 1520),

        # --- Delhi <-> Chennai / South (Grand Trunk & Kerala Express) ---
        ("12622", "NDLS", "MAS", "21:05", "06:15", 2050, 2182, 450, 860, 2580, 3720),
        ("12621", "MAS", "NDLS", "22:00", "07:40", 2020, 2182, 450, 860, 2580, 3720),
        ("12626", "NDLS", "AGC", "20:10", "22:20", 130, 195, 85, 155, 490, 720),
        ("12625", "AGC", "NDLS", "10:45", "13:15", 150, 195, 85, 155, 490, 720),
        ("12626", "AGC", "GWL", "22:25", "23:45", 80, 118, 65, 130, 420, 610),
        ("12625", "GWL", "AGC", "09:05", "10:35", 90, 118, 65, 130, 420, 610),
        ("12626", "GWL", "VGLB", "23:50", "01:30", 100, 98, 60, 125, 390, 580),
        ("12625", "VGLB", "GWL", "07:15", "08:55", 100, 98, 60, 125, 390, 580),
        ("12626", "VGLB", "BPL", "01:35", "05:20", 225, 292, 120, 220, 710, 1020),
        ("12625", "BPL", "VGLB", "03:40", "07:05", 205, 292, 120, 220, 710, 1020),
        ("12626", "BPL", "NGP", "05:25", "11:45", 380, 390, 150, 270, 880, 1280),
        ("12625", "NGP", "BPL", "21:15", "03:30", 375, 390, 150, 270, 880, 1280),
        ("12626", "NGP", "BZA", "11:55", "20:40", 525, 590, 210, 380, 1190, 1720),
        ("12625", "BZA", "NGP", "12:15", "21:05", 530, 590, 210, 380, 1190, 1720),
        ("12626", "BZA", "MAS", "20:50", "04:15", 445, 431, 160, 290, 920, 1340),
        ("12625", "MAS", "BZA", "06:00", "12:05", 365, 431, 160, 290, 920, 1340),

        # --- South Corridor: Chennai <-> Bengaluru <-> Coimbatore <-> Kochi ---
        ("12007", "MAS", "SBC", "06:00", "11:00", 300, 362, 140, 260, 820, 1180),
        ("12008", "SBC", "MAS", "16:15", "21:30", 315, 362, 140, 260, 820, 1180),
        ("12658", "SBC", "MAS", "22:40", "04:15", 335, 362, 140, 260, 820, 1180),
        ("12675", "MAS", "CBE", "06:50", "14:05", 435, 497, 180, 330, 1040, 1500),
        ("12676", "CBE", "MAS", "15:15", "22:50", 455, 497, 180, 330, 1040, 1500),
        ("12677", "SBC", "ERS", "06:10", "16:55", 645, 584, 210, 380, 1210, 1750),
        ("12678", "ERS", "SBC", "09:10", "19:50", 640, 584, 210, 380, 1210, 1750),

        # --- Delhi <-> Bengaluru (Karnataka Sampark Kranti) ---
        ("12650", "NDLS", "SBC", "06:40", "19:00", 2180, 2378, 480, 890, 2690, 3880),
        ("12649", "SBC", "NDLS", "13:50", "03:50", 2280, 2378, 480, 890, 2690, 3880),

        # --- Mumbai <-> Pune <-> Hyderabad / Chennai ---
        ("12163", "CSMT", "MAS", "18:45", "16:20", 1295, 1281, 330, 620, 1780, 2580),
        ("12164", "MAS", "CSMT", "18:20", "15:40", 1280, 1281, 330, 620, 1780, 2580),
        ("12123", "CSMT", "PUNE", "07:15", "10:30", 195, 192, 95, 170, 530, 780),
        ("12124", "PUNE", "CSMT", "07:15", "10:25", 190, 192, 95, 170, 530, 780),
        ("12702", "HYB", "CSMT", "14:50", "04:55", 845, 790, 260, 480, 1460, 2100),
        ("12701", "CSMT", "HYB", "21:50", "12:10", 860, 790, 260, 480, 1460, 2100),
        ("12723", "HYB", "NDLS", "06:00", "07:40", 1540, 1675, 370, 690, 2100, 3050),
        ("12724", "NDLS", "HYB", "16:00", "17:10", 1510, 1675, 370, 690, 2100, 3050),

        # --- Mumbai <-> Ahmedabad ---
        ("20901", "MMCT", "ADI", "06:10", "11:25", 315, 491, 230, 420, 1310, 1890),
        ("20902", "ADI", "MMCT", "15:00", "20:25", 325, 491, 230, 420, 1310, 1890),
        ("12979", "MMCT", "JP", "17:05", "10:00", 1015, 1159, 310, 580, 1720, 2480),
        ("12980", "JP", "MMCT", "20:25", "14:15", 1070, 1159, 310, 580, 1720, 2480),

        # --- Delhi <-> Jaipur ---
        ("12015", "NDLS", "JP", "06:10", "10:40", 270, 308, 130, 240, 760, 1100),
        ("12016", "JP", "NDLS", "17:45", "22:15", 270, 308, 130, 240, 760, 1100),
        ("12414", "JP", "CDG", "15:30", "01:10", 580, 535, 190, 350, 1090, 1580),
        ("12413", "CDG", "JP", "05:00", "14:45", 585, 535, 190, 350, 1090, 1580),

        # --- Delhi <-> Chandigarh / Amritsar ---
        ("12011", "NDLS", "CDG", "07:40", "11:05", 205, 244, 110, 210, 670, 970),
        ("12012", "CDG", "NDLS", "06:50", "10:15", 205, 244, 110, 210, 670, 970),
        ("12011", "CDG", "NDLS", "18:20", "21:50", 210, 244, 110, 210, 670, 970),
        ("12459", "NDLS", "ASR", "13:50", "22:00", 490, 448, 170, 310, 980, 1420),
        ("12460", "ASR", "NDLS", "06:15", "14:25", 490, 448, 170, 310, 980, 1420),

        # --- Delhi <-> Lucknow / Varanasi ---
        ("12004", "NDLS", "LKO", "06:10", "12:55", 405, 513, 180, 340, 1070, 1550),
        ("12003", "LKO", "NDLS", "15:35", "22:15", 400, 513, 180, 340, 1070, 1550),
        ("22436", "NDLS", "BSB", "06:00", "14:00", 480, 759, 260, 480, 1520, 2200),
        ("22435", "BSB", "NDLS", "15:00", "23:00", 480, 759, 260, 480, 1520, 2200),

        # --- Central Cross Connections: Ahmedabad <-> Nagpur <-> Raipur <-> Howrah ---
        ("12834", "ADI", "HWH", "00:15", "13:30", 2235, 2090, 440, 840, 2540, 3680),
        ("12833", "HWH", "ADI", "23:55", "13:10", 2235, 2090, 440, 840, 2540, 3680),
        ("12834", "ADI", "NGP", "00:15", "19:00", 1125, 960, 280, 520, 1610, 2320),
        ("12833", "NGP", "ADI", "18:00", "07:15", 1155, 960, 280, 520, 1610, 2320),
        ("12834", "NGP", "R", "19:15", "00:50", 335, 302, 130, 230, 730, 1060),
        ("12833", "R", "NGP", "12:20", "17:45", 325, 302, 130, 230, 730, 1060),
        ("12834", "R", "HWH", "01:00", "13:30", 750, 828, 260, 480, 1480, 2130),
        ("12833", "HWH", "R", "23:55", "12:10", 735, 828, 260, 480, 1480, 2130),

        # --- East Coast Corridor: Chennai <-> Vijayawada <-> Visakhapatnam <-> Bhubaneswar <-> Howrah ---
        ("12842", "MAS", "HWH", "07:00", "10:35", 1655, 1662, 380, 710, 2180, 3150),
        ("12841", "HWH", "MAS", "15:20", "18:40", 1640, 1662, 380, 710, 2180, 3150),
        ("12842", "MAS", "BZA", "07:00", "13:30", 390, 431, 160, 290, 920, 1340),
        ("12841", "BZA", "MAS", "12:00", "18:40", 400, 431, 160, 290, 920, 1340),
        ("12842", "BZA", "VSKP", "13:40", "19:30", 350, 350, 140, 260, 810, 1170),
        ("12841", "VSKP", "BZA", "06:15", "11:50", 335, 350, 140, 260, 810, 1170),
        ("12842", "VSKP", "BBS", "19:40", "01:50", 370, 443, 160, 300, 940, 1360),
        ("12841", "BBS", "VSKP", "00:10", "06:05", 355, 443, 160, 300, 940, 1360),
        ("12842", "BBS", "HWH", "02:00", "10:35", 515, 438, 160, 290, 910, 1320),
        ("12841", "HWH", "BBS", "15:20", "23:55", 515, 438, 160, 290, 910, 1320),

        # --- Mumbai <-> Goa (Konkan Railway) ---
        ("12051", "CSMT", "MAO", "05:10", "14:10", 540, 581, 200, 370, 1160, 1680),
        ("12052", "MAO", "CSMT", "15:00", "23:55", 535, 581, 200, 370, 1160, 1680),
        ("12780", "MAO", "PUNE", "16:00", "03:40", 700, 560, 190, 350, 1110, 1610),
        ("12779", "PUNE", "MAO", "00:30", "12:15", 705, 560, 190, 350, 1110, 1610),
        ("12780", "PUNE", "BPL", "03:55", "17:40", 825, 890, 270, 500, 1540, 2220),
        ("12779", "BPL", "PUNE", "10:20", "00:20", 840, 890, 270, 500, 1540, 2220),
        ("12780", "BPL", "NDLS", "17:50", "05:40", 710, 703, 230, 430, 1330, 1920),
        ("12779", "NDLS", "BPL", "22:00", "09:50", 710, 703, 230, 430, 1330, 1920),

        # --- Bengaluru <-> Hyderabad & Pune ---
        ("12786", "SBC", "HYB", "18:20", "05:40", 680, 621, 210, 390, 1220, 1760),
        ("12785", "HYB", "SBC", "19:05", "06:25", 680, 621, 210, 390, 1220, 1760),
        ("11302", "SBC", "PUNE", "20:45", "16:15", 1170, 986, 280, 530, 1640, 2360),
        ("11301", "PUNE", "SBC", "03:40", "23:10", 1170, 986, 280, 530, 1640, 2360),

        # --- Northeast Corridor: Delhi / Kolkata <-> Guwahati ---
        ("12424", "NDLS", "GHY", "16:10", "19:55", 1665, 1894, 430, 810, 2470, 3570),
        ("12423", "GHY", "NDLS", "06:55", "10:30", 1655, 1894, 430, 810, 2470, 3570),
        ("12345", "HWH", "GHY", "15:50", "08:15", 985, 999, 290, 540, 1670, 2410),
        ("12346", "GHY", "HWH", "12:20", "05:15", 1015, 999, 290, 540, 1670, 2410),

        # --- Connecting Hub Interchanges (Central & North-South transfers) ---
        ("12192", "JBP", "BPL", "17:45", "23:30", 345, 336, 140, 250, 780, 1130),
        ("12191", "BPL", "JBP", "00:15", "06:00", 345, 336, 140, 250, 780, 1130),
        ("12192", "BPL", "GWL", "23:45", "05:10", 325, 388, 150, 270, 850, 1230),
        ("12191", "GWL", "BPL", "18:30", "23:55", 325, 388, 150, 270, 850, 1230),
        ("12296", "PNBE", "BZA", "20:10", "07:45", 2135, 1780, 410, 770, 2380, 3440),
        ("12295", "BZA", "PNBE", "22:15", "09:30", 2115, 1780, 410, 770, 2380, 3440),
        ("12296", "BZA", "SBC", "07:55", "16:10", 495, 514, 180, 330, 1050, 1520),
        ("12295", "SBC", "BZA", "09:15", "17:30", 495, 514, 180, 330, 1050, 1520),
    ]

    cursor.executemany("""
    INSERT INTO routes (
        train_number, from_station, to_station, departure_time, arrival_time,
        duration_minutes, distance_km, fare_general, fare_sleeper, fare_3ac, fare_2ac
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, routes)


def get_all_stations():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT code, name, city, state, zone, latitude, longitude FROM stations ORDER BY name ASC;")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_all_routes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.*, t.train_name, t.train_type, t.speed_category,
               s1.name as from_station_name, s1.city as from_city,
               s2.name as to_station_name, s2.city as to_city
        FROM routes r
        JOIN trains t ON r.train_number = t.train_number
        JOIN stations s1 ON r.from_station = s1.code
        JOIN stations s2 ON r.to_station = s2.code;
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


if __name__ == "__main__":
    init_db(force_reseed=True)

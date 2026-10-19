# RAILORA — Smart Railway Route Optimization & Budget Planning System

> **Tagline:** Every journey has another way.  
> **Academic Level:** College-Level Computer Science & Engineering Capstone Project  
> **Focus Areas:** Graph Algorithms, Multi-Criteria Route Optimization, Travel Financial Modeling, Operating System Concurrency Demonstrations.

---

## 1. Project Overview

Direct railway reservations along major Indian trunk routes frequently suffer from severe waitlists, seasonal ticket exhaustion, and limited direct train availability. **RAILORA** is a full-stack engineering solution that discovers **viable alternative train routes**, comparing estimated fares, managing end-to-end travel budgets, and identifying suitable connecting journeys (with realistic layovers and interchange points) when direct trains are unavailable.

Beyond transportation logistics, RAILORA serves as an interactive **Operating Systems Concepts Laboratory**, illustrating how multithreading, CPU scheduling, mutual exclusion locks, and deadlock prevention algorithms power high-contention, distributed ticketing and query routing engines.

---

## 2. Key Features

### 🚄 A. Multi-Criteria Route Optimization Engine
- **Direct & Connecting Journeys:** Seamlessly discovers direct trunk trains (0 transfers) and multi-leg connecting journeys (1 transfer and 2 transfers) through strategic junction hubs (Bhopal, Nagpur, Kanpur, Prayagraj, Pune, Vijayawada, Vadodara, etc.).
- **Graph Algorithm:** Implements Dijkstra's shortest path algorithm over a weighted multi-graph network with custom weight formulations:
  1. **Cheapest Route:** Minimizes ticket fares across classes (Sleeper, 3AC, 2AC, General).
  2. **Fastest Route:** Minimizes cumulative journey time including interchange layovers.
  3. **Best Overall Value:** Balanced composite metric penalizing excessive layovers, transfers, and fare spikes.
- **Dynamic Railway Visualization:** Generates SVG and CSS railway track diagrams showing origin, intermediate stops, transfer interchange nodes (highlighted in railway red), and destination.

### 💰 B. Smart Budget Planner
- **Real-Time Financial Forecasting:** Compares total travel allowances against railway tickets, local transit/cabs, food, and contingency expenses.
- **Budget Margin Analysis:** Computes remaining budget, percentage utilization bar, and actionable warnings (`Comfortable`, `Tight`, `Exceeded`).
- **One-Click Synchronization:** Direct integration with recommended routes to auto-populate fares and passenger multipliers.

### ⚙️ C. Operating System Concepts Lab
Genuine Python backend demonstrations with real interactive controls:
1. **Process & Thread Management:** Concurrent worker threads (`threading.Thread`) searching different railway corridors in parallel. Tracks thread lifecycle states (`NEW` &rarr; `RUNNING` &rarr; `TERMINATED`).
2. **CPU Scheduling:** Discrete-event Round Robin scheduling with configurable Time Quantum ($q$). Computes execution timelines, visual Gantt charts, Context Switch counts, Turnaround Time (TAT), and Waiting Time (WT).
3. **Concurrency & Synchronization:** High-contention seat reservation simulation (e.g., 5 seats vs 15 passenger threads). Demonstrates race conditions (overbooking anomalies) vs atomic protection via Mutex Locks (`threading.Lock`).
4. **Deadlock Management:** Single-track railway junction resource allocation simulating Train 12951 and Train 12626. Demonstrates the 4 Coffman conditions, circular wait deadlocks, and deadlock prevention via strict Resource Hierarchy ($North < South$) and Banker's Algorithm safe states.
5. **Performance Analysis Benchmark:** Real execution comparison measuring single-threaded sequential search vs multi-threaded concurrent search on live route graphs using `time.perf_counter()`. Displays actual latency, speedup ratio ($T_{seq} / T_{conc}$), and query throughput.

---

## 3. Technology Stack

- **Frontend:** React 19, Vite 8, Lucide React icons, Native SVG visualization, Responsive CSS3 Design System.
- **Backend:** Python 3.14, Flask REST API, Flask-CORS.
- **Database:** SQLite 3 (`railway.db`) containing realistic Indian railway stations, trains, and edge segments.
- **Styling Architecture:** Deep navy (`#0e2a47`), muted railway red (`#b32d2e`), warm off-white background (`#f7f9fa`), and soft timetable borders.

---

## 4. Directory Structure

```
RAILORA/
├── backend/
│   ├── app.py                  # Flask server with REST API routes
│   ├── database.py             # SQLite schema, tables, and Indian railway seed dataset
│   ├── router.py               # Dijkstra algorithm & connecting route heuristic engine
│   ├── os_lab.py               # OS Concepts modules (Threads, RR Scheduler, Mutex, Deadlock, Benchmark)
│   ├── railway.db              # SQLite database (auto-generated)
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── package.json
│   ├── vite.config.js          # Vite config with backend proxy to port 5000
│   ├── index.html              # Typography & RAILORA brand metadata
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # Main application state and coordinator
│       ├── index.css           # Production railway design system
│       ├── services/
│       │   └── api.js          # REST client communicating with Flask backend
│       └── components/
│           ├── Navbar.jsx       # Header with distinctive track logo & navigation
│           ├── Hero.jsx         # Authentic passenger train photography & hero copy
│           ├── SearchForm.jsx   # Multi-criteria journey search with Indian station hubs
│           ├── RouteResults.jsx # Timetable layout with sorting, filters, and badges
│           ├── RouteCard.jsx    # Individual journey card with timing, fare & actions
│           ├── RouteDiagram.jsx # Dynamic SVG track topology visualizer
│           ├── BudgetPlanner.jsx# Interactive travel budget calculator & ledger
│           ├── OSLab.jsx        # 5-tab Operating System Concepts Laboratory
│           ├── About.jsx        # Academic scope, architecture, and disclaimer
│           └── Footer.jsx       # Footer with navigation and project details
├── run_railora.bat             # One-click Windows launcher
└── README.md                   # Complete documentation
```

---

## 5. How to Run Locally

### Prerequisites
- **Node.js:** v18+ (tested on Node.js v24.18)
- **Python:** 3.10+ (tested on Python 3.14.5)

### Option 1: One-Click Windows Launcher
Double-click `run_railora.bat` in the project root directory. It will automatically initialize the database, start the backend on port 5000, start the Vite dev server on port 3000, and launch your browser.

### Option 2: Manual Terminal Execution

#### 1. Backend Setup:
```bash
cd backend
py database.py
py app.py
```
Backend will be live at `http://127.0.0.1:5000`.

#### 2. Frontend Setup:
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and visit: `http://localhost:3000`.

---

## 6. Demonstration Disclaimer

RAILORA is an academic engineering project designed for educational demonstration. Train numbers, station codes, and fare figures are computed using a simulated demonstration dataset. The platform does not connect to live IRCTC systems or book real commercial tickets.

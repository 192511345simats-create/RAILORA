import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Clock,
  Lock,
  Unlock,
  AlertTriangle,
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  BarChart3,
  GitCommit,
  Terminal,
  Activity
} from 'lucide-react';
import {
  runProcessThreadsSimulation,
  runCpuSchedulingSimulation,
  runSynchronizationSimulation,
  runDeadlockSimulation,
  runPerformanceBenchmark
} from '../services/api';

export default function OSLab() {
  const [activeTab, setActiveTab] = useState('threads'); // 'threads', 'scheduling', 'sync', 'deadlock', 'benchmark'

  // --- State for Module A: Threads ---
  const [workerCount, setWorkerCount] = useState(4);
  const [threadsData, setThreadsData] = useState(null);
  const [threadsLoading, setThreadsLoading] = useState(false);

  // --- State for Module B: CPU Scheduling ---
  const [timeQuantum, setTimeQuantum] = useState(3);
  const [schedulingData, setSchedulingData] = useState(null);
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  // --- State for Module C: Synchronization ---
  const [initialSeats, setInitialSeats] = useState(5);
  const [concurrentReqs, setConcurrentReqs] = useState(15);
  const [useMutex, setUseMutex] = useState(false);
  const [syncData, setSyncData] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);

  // --- State for Module D: Deadlock ---
  const [deadlockStrategy, setDeadlockStrategy] = useState('uncontrolled');
  const [deadlockData, setDeadlockData] = useState(null);
  const [deadlockLoading, setDeadlockLoading] = useState(false);

  // --- State for Module E: Benchmark ---
  const [benchmarkQueries, setBenchmarkQueries] = useState(12);
  const [benchmarkWorkers, setBenchmarkWorkers] = useState(4);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);

  // --- Handlers ---
  const handleRunThreads = async () => {
    setThreadsLoading(true);
    try {
      const data = await runProcessThreadsSimulation(workerCount);
      setThreadsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setThreadsLoading(false);
    }
  };

  const handleRunScheduling = async () => {
    setSchedulingLoading(true);
    try {
      const data = await runCpuSchedulingSimulation(timeQuantum);
      setSchedulingData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSchedulingLoading(false);
    }
  };

  const handleRunSync = async (mutexOverride) => {
    setSyncLoading(true);
    const mutexVal = mutexOverride !== undefined ? mutexOverride : useMutex;
    try {
      const data = await runSynchronizationSimulation(initialSeats, concurrentReqs, mutexVal);
      setSyncData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleRunDeadlock = async (strat) => {
    setDeadlockLoading(true);
    const selectedStrat = strat || deadlockStrategy;
    try {
      const data = await runDeadlockSimulation(selectedStrat);
      setDeadlockData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDeadlockLoading(false);
    }
  };

  const handleRunBenchmark = async () => {
    setBenchmarkLoading(true);
    try {
      const data = await runPerformanceBenchmark(benchmarkQueries, benchmarkWorkers);
      setBenchmarkData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBenchmarkLoading(false);
    }
  };

  return (
    <section id="os-lab-section" className="section-padding os-lab-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">Systems Engineering</span>
          <h2 className="section-title">Operating System Concepts Lab</h2>
          <p className="section-subtitle">
            Explore the core OS mechanisms powering RAILORA's backend infrastructure:
            multithreaded dispatch, CPU time slicing, synchronization locks, deadlock prevention,
            and real-world concurrency benchmarks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="os-tabs-nav">
          <button
            className={`os-tab-btn ${activeTab === 'threads' ? 'active' : ''}`}
            onClick={() => setActiveTab('threads')}
          >
            <Layers size={17} />
            <span>A. Threads &amp; Processes</span>
          </button>
          <button
            className={`os-tab-btn ${activeTab === 'scheduling' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduling')}
          >
            <Clock size={17} />
            <span>B. CPU Scheduling (RR)</span>
          </button>
          <button
            className={`os-tab-btn ${activeTab === 'sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            <Lock size={17} />
            <span>C. Synchronization</span>
          </button>
          <button
            className={`os-tab-btn ${activeTab === 'deadlock' ? 'active' : ''}`}
            onClick={() => setActiveTab('deadlock')}
          >
            <AlertTriangle size={17} />
            <span>D. Deadlock Management</span>
          </button>
          <button
            className={`os-tab-btn ${activeTab === 'benchmark' ? 'active' : ''}`}
            onClick={() => setActiveTab('benchmark')}
          >
            <Zap size={17} />
            <span>E. Performance Analysis</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="os-lab-card">
          {/* ================================================================= */}
          {/* TAB A: PROCESS & THREAD MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'threads' && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3 className="pane-title">Process &amp; Thread Management</h3>
                  <p className="pane-desc">
                    Demonstrates concurrent route-search tasks running across multiple OS worker threads.
                    The Flask backend spawns genuine Python threads (<code>threading.Thread</code>) that concurrently
                    explore multiple railway corridors, logging state transitions from <code>NEW</code> &rarr; <code>RUNNING</code> &rarr; <code>TERMINATED</code>.
                  </p>
                </div>
                <div className="pane-controls">
                  <div className="control-field">
                    <label>Worker Threads:</label>
                    <select
                      value={workerCount}
                      onChange={(e) => setWorkerCount(Number(e.target.value))}
                      className="form-select select-compact"
                    >
                      <option value="2">2 Worker Threads</option>
                      <option value="4">4 Worker Threads</option>
                      <option value="6">6 Worker Threads</option>
                      <option value="8">8 Worker Threads</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleRunThreads}
                    disabled={threadsLoading}
                  >
                    <Play size={15} />
                    <span>{threadsLoading ? 'Executing Threads...' : 'Run Simulation'}</span>
                  </button>
                </div>
              </div>

              {threadsData && (
                <div className="sim-results-wrapper">
                  {/* Summary Bar */}
                  <div className="sim-summary-grid">
                    <div className="sim-metric-card">
                      <span className="sm-label">Active Worker Threads</span>
                      <span className="sm-val">{threadsData.worker_count}</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Total Corridors Evaluated</span>
                      <span className="sm-val">{threadsData.completed_count}</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Total Wall-Clock Time</span>
                      <span className="sm-val text-navy">{threadsData.total_wall_time_ms} ms</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Average Task Latency</span>
                      <span className="sm-val">{threadsData.summary.average_task_latency_ms} ms</span>
                    </div>
                  </div>

                  {/* Tasks Table */}
                  <div className="table-responsive">
                    <table className="sim-table">
                      <thead>
                        <tr>
                          <th>Task ID</th>
                          <th>Railway Corridor</th>
                          <th>Processed By</th>
                          <th>Routes Found</th>
                          <th>Thread Latency</th>
                          <th>Best Route Discovered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {threadsData.completed_tasks.map((task) => (
                          <tr key={task.task_id}>
                            <td><code>{task.task_id}</code></td>
                            <td><strong>{task.corridor}</strong> ({task.description})</td>
                            <td><span className="thread-badge">{task.processed_by}</span></td>
                            <td>{task.routes_found} options</td>
                            <td>{task.execution_time_ms} ms</td>
                            <td className="small-text">{task.best_route}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Thread Execution Logs */}
                  <div className="log-console-box">
                    <div className="console-title">
                      <Terminal size={14} /> Thread Lifecycle Event Stream
                    </div>
                    <div className="console-stream">
                      {threadsData.lifecycle_events.slice(0, 15).map((evt, idx) => (
                        <div key={idx} className="console-line">
                          <span className="line-ts">[{evt.timestamp}ms]</span>
                          <span className={`line-state state-${evt.state.toLowerCase()}`}>{evt.state}</span>
                          <span className="line-thread">{evt.thread_name}:</span>
                          <span className="line-msg">{evt.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB B: CPU SCHEDULING (ROUND ROBIN) */}
          {/* ================================================================= */}
          {activeTab === 'scheduling' && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3 className="pane-title">CPU Scheduling (Round Robin)</h3>
                  <p className="pane-desc">
                    Simulates discrete-event Round Robin CPU scheduling for incoming route computation bursts.
                    Configure the time quantum ($q$) to observe context switching, average turnaround time (TAT),
                    and average waiting time (WT).
                  </p>
                </div>
                <div className="pane-controls">
                  <div className="control-field">
                    <label>Time Quantum (ms):</label>
                    <select
                      value={timeQuantum}
                      onChange={(e) => setTimeQuantum(Number(e.target.value))}
                      className="form-select select-compact"
                    >
                      <option value="2">Quantum = 2 ms</option>
                      <option value="3">Quantum = 3 ms</option>
                      <option value="4">Quantum = 4 ms</option>
                      <option value="6">Quantum = 6 ms</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleRunScheduling}
                    disabled={schedulingLoading}
                  >
                    <Play size={15} />
                    <span>{schedulingLoading ? 'Simulating Scheduler...' : 'Run Simulation'}</span>
                  </button>
                </div>
              </div>

              {schedulingData && (
                <div className="sim-results-wrapper">
                  {/* Summary Bar */}
                  <div className="sim-summary-grid">
                    <div className="sim-metric-card">
                      <span className="sm-label">Time Quantum ($q$)</span>
                      <span className="sm-val">{schedulingData.time_quantum} ms</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Context Switches</span>
                      <span className="sm-val text-red">{schedulingData.context_switches}</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Avg Turnaround Time</span>
                      <span className="sm-val">{schedulingData.average_turnaround_time} ms</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Avg Waiting Time</span>
                      <span className="sm-val">{schedulingData.average_waiting_time} ms</span>
                    </div>
                  </div>

                  {/* Visual Gantt Chart */}
                  <div className="gantt-chart-box">
                    <h4 className="gantt-title">
                      <Activity size={16} /> Round Robin Execution Gantt Chart
                    </h4>
                    <div className="gantt-timeline-bar">
                      {schedulingData.gantt_chart.map((slice, sIdx) => {
                        const totalTime = schedulingData.total_execution_time || 1;
                        const widthPct = Math.max(4, (slice.duration / totalTime) * 100);
                        return (
                          <div
                            key={sIdx}
                            className={`gantt-slice slice-${slice.process_id.toLowerCase()}`}
                            style={{ width: `${widthPct}%` }}
                            title={`${slice.process_id} (${slice.process_name}): ${slice.start_time}ms ➔ ${slice.end_time}ms (${slice.duration}ms)`}
                          >
                            <span className="slice-label">{slice.process_id}</span>
                            <span className="slice-duration">{slice.duration}ms</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="gantt-axis">
                      <span>0 ms</span>
                      <span>Total Time: {schedulingData.total_execution_time} ms</span>
                    </div>
                  </div>

                  {/* Process Metrics Table */}
                  <div className="table-responsive">
                    <table className="sim-table">
                      <thead>
                        <tr>
                          <th>Process ID</th>
                          <th>Query Burst Name</th>
                          <th>Arrival Time (AT)</th>
                          <th>Burst Time (BT)</th>
                          <th>Completion Time (CT)</th>
                          <th>Turnaround Time ($CT - AT$)</th>
                          <th>Waiting Time ($TAT - BT$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedulingData.process_metrics.map((p) => (
                          <tr key={p.id}>
                            <td><code>{p.id}</code></td>
                            <td>{p.name}</td>
                            <td>{p.arrival_time} ms</td>
                            <td>{p.burst_time} ms</td>
                            <td>{p.completion_time} ms</td>
                            <td><strong>{p.turnaround_time} ms</strong></td>
                            <td><strong>{p.waiting_time} ms</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB C: SYNCHRONIZATION (RACE CONDITION VS MUTEX) */}
          {/* ================================================================= */}
          {activeTab === 'sync' && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3 className="pane-title">Concurrency &amp; Synchronization</h3>
                  <p className="pane-desc">
                    Demonstrates race condition vs. mutual exclusion lock in high-contention booking.
                    When 15 concurrent threads attempt to reserve the last 5 seats without a lock, non-atomic
                    read-modify-write results in <strong>Overbooking</strong> (race hazard). With a <strong>Mutex Lock</strong>,
                    mutual exclusion guarantees that exactly 5 tickets are confirmed and remaining requests are rejected.
                  </p>
                </div>
                <div className="pane-controls">
                  <div className="control-field">
                    <label>Available Seats:</label>
                    <input
                      type="number"
                      value={initialSeats}
                      onChange={(e) => setInitialSeats(Number(e.target.value))}
                      className="form-input input-compact"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="control-field">
                    <label>Concurrent Requests:</label>
                    <input
                      type="number"
                      value={concurrentReqs}
                      onChange={(e) => setConcurrentReqs(Number(e.target.value))}
                      className="form-input input-compact"
                      min="5"
                      max="30"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons to Compare */}
              <div className="sync-actions-row">
                <button
                  className="btn btn-secondary btn-danger-border"
                  onClick={() => {
                    setUseMutex(false);
                    handleRunSync(false);
                  }}
                  disabled={syncLoading}
                >
                  <Unlock size={16} />
                  <span>Run WITHOUT Lock (Trigger Race Condition)</span>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setUseMutex(true);
                    handleRunSync(true);
                  }}
                  disabled={syncLoading}
                >
                  <Lock size={16} />
                  <span>Run WITH Mutex Lock (Thread-Safe Atomic)</span>
                </button>
              </div>

              {syncData && (
                <div className="sim-results-wrapper">
                  {/* Verdict Box */}
                  <div className={`sync-verdict-box ${syncData.data_integrity_preserved ? 'verdict-safe' : 'verdict-danger'}`}>
                    {syncData.data_integrity_preserved ? (
                      <CheckCircle size={28} className="verdict-icon" />
                    ) : (
                      <AlertTriangle size={28} className="verdict-icon" />
                    )}
                    <div>
                      <h4 className="verdict-heading">
                        {syncData.use_mutex
                          ? 'MUTEX PROTECTED: Atomic Concurrency Guaranteed'
                          : 'RACE CONDITION DETECTED: Critical Section Invariant Violated!'}
                      </h4>
                      <p className="verdict-sub">
                        {syncData.use_mutex
                          ? `All ${syncData.total_requests} requests safely serialized. Exactly ${syncData.successful_bookings} seats booked out of ${syncData.initial_seat_capacity}. 0 overbookings.`
                          : `Non-atomic execution caused ${syncData.overbooking_count} ghost reservations! Final seat inventory dropped to ${syncData.final_seat_counter}.`}
                      </p>
                    </div>
                  </div>

                  {/* Summary Tiles */}
                  <div className="sim-summary-grid">
                    <div className="sim-metric-card">
                      <span className="sm-label">Initial Seat Capacity</span>
                      <span className="sm-val">{syncData.initial_seat_capacity}</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Successful Bookings</span>
                      <span className="sm-val">{syncData.successful_bookings}</span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Overbooked Invariant Violations</span>
                      <span className={`sm-val ${syncData.overbooking_count > 0 ? 'text-danger' : 'text-green'}`}>
                        {syncData.overbooking_count}
                      </span>
                    </div>
                    <div className="sim-metric-card">
                      <span className="sm-label">Final Seat Inventory</span>
                      <span className="sm-val">{syncData.final_seat_counter}</span>
                    </div>
                  </div>

                  {/* Transaction Log */}
                  <div className="table-responsive">
                    <table className="sim-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Passenger Thread</th>
                          <th>Status</th>
                          <th>Observed Seats</th>
                          <th>Seats Remaining After</th>
                          <th>Lock Enforced?</th>
                          <th>Anomaly Flag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {syncData.transaction_logs.map((log) => (
                          <tr key={log.request_id} className={log.anomaly_detected ? 'row-anomaly' : ''}>
                            <td><code>{log.request_id}</code></td>
                            <td>{log.passenger}</td>
                            <td>
                              <span className={`status-pill pill-${log.status.toLowerCase()}`}>
                                {log.status}
                              </span>
                            </td>
                            <td>{log.seats_at_decision}</td>
                            <td>{log.seats_remaining_after}</td>
                            <td>{log.lock_acquired ? 'Yes (Mutex)' : 'No (Raw)'}</td>
                            <td>
                              {log.anomaly_detected ? (
                                <span className="anomaly-text">OVERBOOK HAZARD</span>
                              ) : (
                                <span className="normal-text">Normal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB D: DEADLOCK MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'deadlock' && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3 className="pane-title">Deadlock Management &amp; Prevention</h3>
                  <p className="pane-desc">
                    Simulates railway track block allocation at a single-track crossover junction.
                    Two trains (Rajdhani 12951 &amp; Kerala Exp 12626) require two shared track segments (North and South).
                    Demonstrates the 4 Coffman conditions, circular wait deadlock, and prevention via Resource Hierarchy.
                  </p>
                </div>
                <div className="pane-controls">
                  <div className="control-field">
                    <label>Resolution Strategy:</label>
                    <select
                      value={deadlockStrategy}
                      onChange={(e) => {
                        setDeadlockStrategy(e.target.value);
                        handleRunDeadlock(e.target.value);
                      }}
                      className="form-select select-compact"
                    >
                      <option value="uncontrolled">Uncontrolled (Trigger Deadlock)</option>
                      <option value="resource_hierarchy">Resource Ordering (Prevention)</option>
                      <option value="bankers_safety">Banker's Algorithm (Safe State)</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRunDeadlock(deadlockStrategy)}
                    disabled={deadlockLoading}
                  >
                    <Play size={15} />
                    <span>{deadlockLoading ? 'Simulating...' : 'Run Simulation'}</span>
                  </button>
                </div>
              </div>

              {deadlockData && (
                <div className="sim-results-wrapper">
                  {/* Status Banner */}
                  <div className={`deadlock-banner ${deadlockData.deadlock_detected ? 'banner-deadlock' : 'banner-safe'}`}>
                    {deadlockData.deadlock_detected ? (
                      <AlertTriangle size={24} />
                    ) : (
                      <CheckCircle size={24} />
                    )}
                    <div>
                      <h4>
                        {deadlockData.deadlock_detected
                          ? 'CIRCULAR WAIT DEADLOCK DETECTED (Cycle in RAG)'
                          : 'DEADLOCK PREVENTED / SAFE STATE MAINTAINED'}
                      </h4>
                      <p>
                        {deadlockData.deadlock_detected
                          ? 'Train 12951 holds North and waits for South. Train 12626 holds South and waits for North. Neither can proceed.'
                          : 'Strict total resource ordering (North < South) forbids circular wait. Junction clears safely without deadlock.'}
                      </p>
                    </div>
                  </div>

                  {/* Coffman Conditions Grid */}
                  <div className="coffman-grid">
                    <div className="coffman-card">
                      <span className="c-title">1. Mutual Exclusion</span>
                      <p className="c-desc">{deadlockData.coffman_conditions.mutual_exclusion}</p>
                    </div>
                    <div className="coffman-card">
                      <span className="c-title">2. Hold &amp; Wait</span>
                      <p className="c-desc">{deadlockData.coffman_conditions.hold_and_wait}</p>
                    </div>
                    <div className="coffman-card">
                      <span className="c-title">3. No Preemption</span>
                      <p className="c-desc">{deadlockData.coffman_conditions.no_preemption}</p>
                    </div>
                    <div className="coffman-card">
                      <span className="c-title">4. Circular Wait</span>
                      <p className="c-desc">{deadlockData.coffman_conditions.circular_wait}</p>
                    </div>
                  </div>

                  {/* Step-by-Step Junction Timeline */}
                  <div className="junction-timeline">
                    <h4 className="gantt-title">Junction Resource Allocation Timeline</h4>
                    <div className="timeline-steps">
                      {deadlockData.timeline.map((item) => (
                        <div key={item.step} className={`timeline-step step-${item.state.toLowerCase()}`}>
                          <div className="step-num">{item.step}</div>
                          <div className="step-body">
                            <span className="step-actor">{item.train}</span>
                            <span className="step-action">[{item.action}]</span>
                            <p className="step-text">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB E: PERFORMANCE ANALYSIS BENCHMARK */}
          {/* ================================================================= */}
          {activeTab === 'benchmark' && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3 className="pane-title">Performance Analysis (Sequential vs Concurrent)</h3>
                  <p className="pane-desc">
                    Executes genuine graph-based route searches using Python's <code>time.perf_counter()</code>.
                    Measures real wall-clock latency for sequential single-threaded execution vs multi-threaded
                    concurrent execution across live station corridors.
                  </p>
                </div>
                <div className="pane-controls">
                  <div className="control-field">
                    <label>Workload Queries:</label>
                    <select
                      value={benchmarkQueries}
                      onChange={(e) => setBenchmarkQueries(Number(e.target.value))}
                      className="form-select select-compact"
                    >
                      <option value="8">8 Queries</option>
                      <option value="12">12 Queries</option>
                      <option value="16">16 Queries</option>
                      <option value="24">24 Queries</option>
                    </select>
                  </div>
                  <div className="control-field">
                    <label>Concurrency Workers:</label>
                    <select
                      value={benchmarkWorkers}
                      onChange={(e) => setBenchmarkWorkers(Number(e.target.value))}
                      className="form-select select-compact"
                    >
                      <option value="2">2 Workers</option>
                      <option value="4">4 Workers</option>
                      <option value="8">8 Workers</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleRunBenchmark}
                    disabled={benchmarkLoading}
                  >
                    <Zap size={15} />
                    <span>{benchmarkLoading ? 'Benchmarking CPU...' : 'Run Benchmark'}</span>
                  </button>
                </div>
              </div>

              {benchmarkData && (
                <div className="sim-results-wrapper">
                  {/* Real Metrics Disclaimers */}
                  <div className="benchmark-disclaimer">
                    <BarChart3 size={18} />
                    <span><strong>Actual Measured Telemetry:</strong> {benchmarkData.disclaimer}</span>
                  </div>

                  {/* Benchmark Comparison Tiles */}
                  <div className="benchmark-compare-grid">
                    <div className="bench-box bench-seq">
                      <span className="bench-tag">Single Threaded</span>
                      <h4 className="bench-title">Sequential Execution</h4>
                      <div className="bench-val">
                        {benchmarkData.measured_metrics.sequential_wall_time_ms} <span className="ms">ms</span>
                      </div>
                      <span className="bench-sub">
                        Throughput: {benchmarkData.measured_metrics.sequential_throughput_qps} queries/sec
                      </span>
                    </div>

                    <div className="bench-box bench-conc">
                      <span className="bench-tag tag-fast">Multi-Threaded ({benchmarkData.concurrency_workers} Workers)</span>
                      <h4 className="bench-title">Concurrent Execution</h4>
                      <div className="bench-val text-green">
                        {benchmarkData.measured_metrics.concurrent_wall_time_ms} <span className="ms">ms</span>
                      </div>
                      <span className="bench-sub">
                        Throughput: {benchmarkData.measured_metrics.concurrent_throughput_qps} queries/sec
                      </span>
                    </div>

                    <div className="bench-box bench-speedup">
                      <span className="bench-tag">Speedup Factor</span>
                      <h4 className="bench-title">Parallel Speedup</h4>
                      <div className="bench-val text-navy">
                        {benchmarkData.measured_metrics.actual_speedup}x
                      </div>
                      <span className="bench-sub">
                        Saved: {benchmarkData.measured_metrics.time_saved_ms} ms CPU wall-time
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Comparison */}
                  <div className="latency-bar-comparison">
                    <h4 className="gantt-title">Latency Comparison (Lower is Faster)</h4>
                    <div className="bar-row">
                      <span className="bar-name">Sequential:</span>
                      <div className="bar-outer">
                        <div
                          className="bar-inner bar-seq-fill"
                          style={{ width: '100%' }}
                        >
                          {benchmarkData.measured_metrics.sequential_wall_time_ms} ms
                        </div>
                      </div>
                    </div>
                    <div className="bar-row">
                      <span className="bar-name">Concurrent:</span>
                      <div className="bar-outer">
                        <div
                          className="bar-inner bar-conc-fill"
                          style={{
                            width: `${Math.min(100, Math.max(15, (benchmarkData.measured_metrics.concurrent_wall_time_ms / benchmarkData.measured_metrics.sequential_wall_time_ms) * 100))}%`
                          }}
                        >
                          {benchmarkData.measured_metrics.concurrent_wall_time_ms} ms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

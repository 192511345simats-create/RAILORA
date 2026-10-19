/**
 * RAILORA API Service
 * Handles communication with Flask backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchStations() {
  const res = await fetch(`${BASE_URL}/api/stations`);
  if (!res.ok) throw new Error('Failed to load railway stations');
  return res.json();
}

export async function searchJourneyRoutes(searchParams) {
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchParams),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Route search failed');
  }
  return data;
}

export async function calculateTripBudget(budgetParams) {
  const res = await fetch(`${BASE_URL}/api/budget/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budgetParams),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Budget calculation failed');
  }
  return data;
}

// OS Lab API calls
export async function runProcessThreadsSimulation(workerCount = 4) {
  const res = await fetch(`${BASE_URL}/api/os/process-threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worker_count: workerCount }),
  });
  return res.json();
}

export async function runCpuSchedulingSimulation(timeQuantum = 3, processes = null) {
  const res = await fetch(`${BASE_URL}/api/os/cpu-scheduling`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time_quantum: timeQuantum, processes }),
  });
  return res.json();
}

export async function runSynchronizationSimulation(initialSeats = 5, concurrentRequests = 15, useMutex = false) {
  const res = await fetch(`${BASE_URL}/api/os/synchronization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initial_seats: initialSeats,
      concurrent_requests: concurrentRequests,
      use_mutex: useMutex,
    }),
  });
  return res.json();
}

export async function runDeadlockSimulation(strategy = 'uncontrolled') {
  const res = await fetch(`${BASE_URL}/api/os/deadlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strategy }),
  });
  return res.json();
}

export async function runPerformanceBenchmark(iterations = 12, workers = 4) {
  const res = await fetch(`${BASE_URL}/api/os/performance-benchmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iterations, workers }),
  });
  return res.json();
}

import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Info,
  Train,
  Clock,
  IndianRupee,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import RouteCard from './RouteCard';

export default function RouteResults({
  results = [],
  searchQuery = null,
  isLoading = false,
  onSelectRouteForBudget,
  selectedRouteId = null
}) {
  const [sortBy, setSortBy] = useState('best_value'); // 'cheapest', 'fastest', 'best_value'
  const [transferFilter, setTransferFilter] = useState('all'); // 'all', 'direct', 'transfers'
  const [maxFareFilter, setMaxFareFilter] = useState('');
  const [maxDurationHours, setMaxDurationHours] = useState('');

  // Determine highest fare and duration for filters
  const maxPossibleFare = useMemo(() => {
    if (!results.length) return 5000;
    return Math.max(...results.map((r) => r.total_fare));
  }, [results]);

  // Filtering and Sorting
  const filteredAndSortedRoutes = useMemo(() => {
    let list = [...results];

    // Transfer filter
    if (transferFilter === 'direct') {
      list = list.filter((r) => r.transfers === 0);
    } else if (transferFilter === 'transfers') {
      list = list.filter((r) => r.transfers > 0);
    }

    // Max Fare filter
    if (maxFareFilter !== '') {
      const fareLimit = parseFloat(maxFareFilter);
      if (!isNaN(fareLimit)) {
        list = list.filter((r) => r.total_fare <= fareLimit);
      }
    }

    // Duration filter
    if (maxDurationHours !== '') {
      const durLimit = parseFloat(maxDurationHours) * 60;
      if (!isNaN(durLimit)) {
        list = list.filter((r) => r.total_duration_minutes <= durLimit);
      }
    }

    // Sorting
    if (sortBy === 'cheapest') {
      list.sort((a, b) => a.total_fare - b.total_fare || a.total_duration_minutes - b.total_duration_minutes);
    } else if (sortBy === 'fastest') {
      list.sort((a, b) => a.total_duration_minutes - b.total_duration_minutes || a.total_fare - b.total_fare);
    } else {
      // Best value
      list.sort((a, b) => (a.value_score || 0) - (b.value_score || 0));
    }

    return list;
  }, [results, sortBy, transferFilter, maxFareFilter, maxDurationHours]);

  // Quick stats
  const cheapestRoute = useMemo(() => {
    if (!results.length) return null;
    return [...results].sort((a, b) => a.total_fare - b.total_fare)[0];
  }, [results]);

  const fastestRoute = useMemo(() => {
    if (!results.length) return null;
    return [...results].sort((a, b) => a.total_duration_minutes - b.total_duration_minutes)[0];
  }, [results]);

  const bestValueRoute = useMemo(() => {
    if (!results.length) return null;
    return [...results].sort((a, b) => (a.value_score || 0) - (b.value_score || 0))[0];
  }, [results]);

  if (isLoading) {
    return (
      <div className="container results-loading-box">
        <div className="spinner large-spinner" />
        <h3 className="loading-title">Analyzing Railway Topology &amp; Connections...</h3>
        <p className="loading-desc">Executing multi-criteria shortest path and connecting hub discovery.</p>
      </div>
    );
  }

  if (!searchQuery) {
    return null; // Search has not been run yet
  }

  return (
    <section id="results-section" className="results-section">
      <div className="container">
        {/* Results Header */}
        <div className="results-header-bar">
          <div className="results-header-title">
            <span className="section-badge">Optimization Engine Results</span>
            <h2 className="section-title">
              {searchQuery.from_station} <ArrowRight size={20} className="inline-arrow" /> {searchQuery.to_station}
            </h2>
            <p className="section-subtitle">
              Found {results.length} journey option{results.length !== 1 ? 's' : ''} across direct and connecting corridors.
            </p>
          </div>

          {/* Quick Summary Pill Highlights */}
          {results.length > 0 && (
            <div className="corridor-summary-pills">
              {bestValueRoute && (
                <div className="summary-pill pill-best" onClick={() => setSortBy('best_value')}>
                  <span className="pill-kicker">Recommended</span>
                  <span className="pill-main">Best Value</span>
                  <span className="pill-sub">₹{bestValueRoute.total_fare} &bull; {bestValueRoute.formatted_duration}</span>
                </div>
              )}
              {cheapestRoute && (
                <div className="summary-pill pill-cheap" onClick={() => setSortBy('cheapest')}>
                  <span className="pill-kicker">Budget Pick</span>
                  <span className="pill-main">₹{cheapestRoute.total_fare.toLocaleString()}</span>
                  <span className="pill-sub">{cheapestRoute.transfers === 0 ? 'Direct' : `${cheapestRoute.transfers} Transfer`}</span>
                </div>
              )}
              {fastestRoute && (
                <div className="summary-pill pill-fast" onClick={() => setSortBy('fastest')}>
                  <span className="pill-kicker">Shortest Duration</span>
                  <span className="pill-main">{fastestRoute.formatted_duration}</span>
                  <span className="pill-sub">{fastestRoute.train_identifiers.split(' ')[0]}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="demo-banner">
          <Info size={18} className="demo-icon" />
          <div>
            <strong>Demo Railway Dataset:</strong> Schedules, train timetables, and fares shown are computed
            using simulated Indian railway graph data for academic demonstration. RAILORA does not guarantee live
            IRCTC ticket availability or real-time train dispatch.
          </div>
        </div>

        {/* Filters and Sorting Controls Bar */}
        <div className="results-controls-bar">
          <div className="sort-controls-group">
            <span className="controls-label">
              <ArrowUpDown size={15} /> Sort By:
            </span>
            <div className="sort-buttons">
              <button
                className={`btn btn-sm ${sortBy === 'best_value' ? 'btn-navy' : 'btn-secondary'}`}
                onClick={() => setSortBy('best_value')}
              >
                Best Overall Value
              </button>
              <button
                className={`btn btn-sm ${sortBy === 'cheapest' ? 'btn-navy' : 'btn-secondary'}`}
                onClick={() => setSortBy('cheapest')}
              >
                Cheapest Route
              </button>
              <button
                className={`btn btn-sm ${sortBy === 'fastest' ? 'btn-navy' : 'btn-secondary'}`}
                onClick={() => setSortBy('fastest')}
              >
                Fastest Route
              </button>
            </div>
          </div>

          <div className="filter-controls-group">
            <span className="controls-label">
              <SlidersHorizontal size={15} /> Filters:
            </span>

            {/* Transfers Filter */}
            <select
              className="filter-select"
              value={transferFilter}
              onChange={(e) => setTransferFilter(e.target.value)}
              aria-label="Filter by transfers"
            >
              <option value="all">All Transfers</option>
              <option value="direct">Direct Only</option>
              <option value="transfers">Connecting Transfers Only</option>
            </select>

            {/* Max Fare */}
            <div className="filter-input-wrap">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                placeholder="Max Fare"
                className="filter-number-input"
                value={maxFareFilter}
                onChange={(e) => setMaxFareFilter(e.target.value)}
              />
            </div>

            {/* Max Duration */}
            <div className="filter-input-wrap">
              <input
                type="number"
                placeholder="Max Hours"
                className="filter-number-input duration-input"
                value={maxDurationHours}
                onChange={(e) => setMaxDurationHours(e.target.value)}
              />
              <span className="unit-suffix">hrs</span>
            </div>

            {(transferFilter !== 'all' || maxFareFilter !== '' || maxDurationHours !== '') && (
              <button
                className="btn btn-sm btn-subtle"
                onClick={() => {
                  setTransferFilter('all');
                  setMaxFareFilter('');
                  setMaxDurationHours('');
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Timetable Header Row */}
        <div className="timetable-column-headers">
          <div className="header-cell col-train">Train &amp; Route</div>
          <div className="header-cell col-station">Departure</div>
          <div className="header-cell col-transit">Duration &amp; Stops</div>
          <div className="header-cell col-station">Arrival</div>
          <div className="header-cell col-fare">Estimated Fare &amp; Action</div>
        </div>

        {/* Routes List */}
        {filteredAndSortedRoutes.length > 0 ? (
          <div className="routes-list">
            {filteredAndSortedRoutes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isCheapest={cheapestRoute && route.id === cheapestRoute.id}
                isFastest={fastestRoute && route.id === fastestRoute.id}
                isBestValue={bestValueRoute && route.id === bestValueRoute.id}
                onSelectForBudget={onSelectRouteForBudget}
                isSelected={selectedRouteId === route.id}
              />
            ))}
          </div>
        ) : (
          <div className="empty-results-box">
            <ShieldAlert size={42} className="empty-icon" />
            <h3>No matching routes found</h3>
            <p>
              No routes matched your current filters. Try resetting the filters or searching
              for alternative regional hubs (e.g., New Delhi, Bhopal, Nagpur, Mumbai, Chennai, Howrah).
            </p>
            <button
              className="btn btn-navy"
              onClick={() => {
                setTransferFilter('all');
                setMaxFareFilter('');
                setMaxDurationHours('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

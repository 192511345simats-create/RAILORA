import React, { useState } from 'react';
import {
  Train,
  Clock,
  IndianRupee,
  GitBranch,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  CheckCircle,
  AlertTriangle,
  BadgeAlert
} from 'lucide-react';
import RouteDiagram from './RouteDiagram';

export default function RouteCard({
  route,
  isCheapest,
  isFastest,
  isBestValue,
  onSelectForBudget,
  isSelected
}) {
  const [showDiagram, setShowDiagram] = useState(false);

  const isDirect = route.transfers === 0;

  return (
    <article className={`route-card ${isSelected ? 'route-card-selected' : ''}`}>
      {/* Badges Bar */}
      <div className="card-top-bar">
        <div className="card-badges">
          <span className={`route-type-badge ${isDirect ? 'type-direct' : 'type-transfer'}`}>
            <GitBranch size={13} />
            {isDirect ? 'Direct Train' : `${route.transfers} Transfer (${route.transfer_station || 'Interchange'})`}
          </span>

          {isBestValue && (
            <span className="ribbon-badge badge-value">
              Best Overall Value
            </span>
          )}
          {isCheapest && (
            <span className="ribbon-badge badge-cheapest">
              Cheapest Fare
            </span>
          )}
          {isFastest && (
            <span className="ribbon-badge badge-fastest">
              Fastest Journey
            </span>
          )}
        </div>

        {/* Remaining Budget Status */}
        {route.remaining_budget !== null && (
          <div className="budget-status-tag">
            {route.fits_budget ? (
              <span className="budget-tag-safe">
                <CheckCircle size={13} />
                Fits Budget (+₹{route.remaining_budget.toLocaleString()})
              </span>
            ) : (
              <span className="budget-tag-danger">
                <AlertTriangle size={13} />
                Exceeds Budget (₹{Math.abs(route.remaining_budget).toLocaleString()} over)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Timetable Information Grid */}
      <div className="card-timetable-grid">
        {/* Train Identifiers */}
        <div className="timetable-col col-train">
          <div className="train-id-wrapper">
            <Train size={18} className="train-icon" />
            <div>
              <h3 className="train-title">{route.train_identifiers}</h3>
              <span className="train-subtext">
                {isDirect ? 'Single Train Service' : `${route.legs.length} Connecting Services`}
              </span>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div className="timetable-col col-station">
          <span className="time-display">{route.departure_time}</span>
          <span className="station-code">{route.departure_station_code}</span>
          <span className="station-name">{route.departure_station_name}</span>
        </div>

        {/* Travel Timeline / Mid Indicator */}
        <div className="timetable-col col-transit">
          <div className="duration-label">
            <Clock size={13} />
            <span>{route.formatted_duration}</span>
          </div>
          <div className="track-connector">
            <span className="dot dot-start" />
            <div className="connector-line">
              {!isDirect && (
                <span className="transfer-node-icon" title={`Transfer at ${route.transfer_station}`}>
                  {route.transfers}
                </span>
              )}
            </div>
            <span className="dot dot-end" />
          </div>
          <div className="distance-label">
            <span>{route.total_distance_km} km</span>
            {!isDirect && (
              <span className="layover-meta">Wait: {route.formatted_layover}</span>
            )}
          </div>
        </div>

        {/* Arrival */}
        <div className="timetable-col col-station">
          <span className="time-display">{route.arrival_time}</span>
          <span className="station-code">{route.arrival_station_code}</span>
          <span className="station-name">{route.arrival_station_name}</span>
        </div>

        {/* Fare & Selection */}
        <div className="timetable-col col-fare">
          <div className="fare-container">
            <div className="fare-row">
              <span className="currency-symbol">₹</span>
              <span className="fare-amount">{route.total_fare.toLocaleString()}</span>
            </div>
            <span className="fare-per-person">per passenger</span>
            {route.passengers > 1 && (
              <span className="total-group-fare">
                Total ({route.passengers} pax): ₹{route.total_trip_fare.toLocaleString()}
              </span>
            )}
          </div>

          <div className="card-actions">
            <button
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onSelectForBudget(route)}
              title="Send to Budget Planner"
            >
              <Calculator size={14} />
              <span>{isSelected ? 'Selected' : 'Use in Budget'}</span>
            </button>
            <button
              className="btn btn-sm btn-subtle toggle-diagram-btn"
              onClick={() => setShowDiagram(!showDiagram)}
            >
              <span>{showDiagram ? 'Hide Route' : 'View Track'}</span>
              {showDiagram ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Route Track Visualization */}
      {showDiagram && (
        <div className="card-diagram-expand">
          <RouteDiagram route={route} />
        </div>
      )}
    </article>
  );
}

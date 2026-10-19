import React from 'react';
import { ArrowRight, RefreshCw, MapPin } from 'lucide-react';

export default function RouteDiagram({ route }) {
  if (!route || !route.path_stations) return null;

  const stations = route.path_stations;
  const isDirect = route.transfers === 0;

  return (
    <div className="route-diagram-container">
      <div className="diagram-header">
        <span className="diagram-title">Journey Track Visualization</span>
        <span className="diagram-meta">
          {isDirect ? 'Direct Trunk Corridor' : `${route.transfers} Transfer Interchange Journey`}
        </span>
      </div>

      <div className="diagram-svg-wrapper">
        <svg
          viewBox={`0 0 ${Math.max(600, stations.length * 160)} 110`}
          className="route-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Base railway track double line */}
          <line
            x1="50"
            y1="50"
            x2={stations.length * 160 - 50}
            y2="50"
            stroke="#cbd5e1"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="50"
            x2={stations.length * 160 - 50}
            y2="50"
            stroke="#0e2a47"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />

          {/* Render Stations along track */}
          {stations.map((st, index) => {
            const cx = 50 + index * 160;
            const cy = 50;
            const isOrigin = index === 0;
            const isDest = index === stations.length - 1;
            const isTransfer = st.is_transfer;

            // Station node colors
            let nodeColor = '#0e2a47'; // Default intermediate
            let nodeRadius = 8;
            let strokeColor = '#ffffff';

            if (isOrigin) {
              nodeColor = '#1e528a';
              nodeRadius = 10;
            } else if (isDest) {
              nodeColor = '#15803d'; // Green for arrival
              nodeRadius = 10;
            } else if (isTransfer) {
              nodeColor = '#b32d2e'; // Red highlight for transfer point
              nodeRadius = 11;
            }

            return (
              <g key={`st-${index}`} className="station-node-group">
                {/* Outer halo for transfer point */}
                {isTransfer && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={nodeRadius + 4}
                    fill="none"
                    stroke="#b32d2e"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius}
                  fill={nodeColor}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                />

                {/* Inner dot */}
                <circle cx={cx} cy={cy} r={3} fill="#ffffff" />

                {/* Station Code Badge */}
                <text
                  x={cx}
                  y={cy - 18}
                  textAnchor="middle"
                  className={`svg-station-code ${isTransfer ? 'svg-transfer-code' : ''}`}
                >
                  {st.code}
                </text>

                {/* Station Name & Role */}
                <text
                  x={cx}
                  y={cy + 24}
                  textAnchor="middle"
                  className="svg-station-name"
                >
                  {st.name.replace(' (Interchange)', '')}
                </text>

                <text
                  x={cx}
                  y={cy + 38}
                  textAnchor="middle"
                  className={`svg-station-role ${isTransfer ? 'role-transfer' : ''}`}
                >
                  {isOrigin ? 'Origin' : isDest ? 'Destination' : isTransfer ? '⚡ Interchange' : 'Stop'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leg Breakdown Cards if Connecting */}
      {route.legs && route.legs.length > 1 && (
        <div className="legs-breakdown-strip">
          {route.legs.map((leg, lIdx) => (
            <div key={`leg-${lIdx}`} className="leg-mini-card">
              <div className="leg-num-badge">Leg {lIdx + 1}</div>
              <div className="leg-train-info">
                <strong>{leg.train_number}</strong> {leg.train_name}
              </div>
              <div className="leg-times">
                <span>{leg.from_station} ({leg.departure_time})</span>
                <ArrowRight size={13} className="leg-arrow" />
                <span>{leg.to_station} ({leg.arrival_time})</span>
              </div>
              {lIdx < route.legs.length - 1 && (
                <div className="layover-pill">
                  <RefreshCw size={12} />
                  <span>Transfer Layover: {route.formatted_layover}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

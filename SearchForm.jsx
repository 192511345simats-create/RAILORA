import React, { useState } from 'react';
import { Search, ArrowUpDown, Calendar, IndianRupee, Users, AlertCircle, Sparkles } from 'lucide-react';

export default function SearchForm({
  stations = [],
  onSearch,
  isLoading,
  initialValues = {}
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [fromStation, setFromStation] = useState(initialValues.fromStation || 'NDLS');
  const [toStation, setToStation] = useState(initialValues.toStation || 'MMCT');
  const [journeyDate, setJourneyDate] = useState(initialValues.journeyDate || todayStr);
  const [maxBudget, setMaxBudget] = useState(initialValues.maxBudget || '4500');
  const [passengers, setPassengers] = useState(initialValues.passengers || '1');
  const [travelClass, setTravelClass] = useState(initialValues.travelClass || 'fare_sleeper');

  const [errorMsg, setErrorMsg] = useState('');

  // Station swap helper
  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setErrorMsg('');
  };

  // Quick preset corridor routes for instant testing
  const quickCorridors = [
    { label: 'Delhi ➔ Mumbai (Trunk)', from: 'NDLS', to: 'MMCT' },
    { label: 'Chandigarh ➔ Chennai (Connecting)', from: 'CDG', to: 'MAS' },
    { label: 'Mumbai ➔ Goa (Scenic)', from: 'CSMT', to: 'MAO' },
    { label: 'Delhi ➔ Howrah (Rajdhani)', from: 'NDLS', to: 'HWH' },
    { label: 'Goa ➔ Varanasi (Multi-leg)', from: 'MAO', to: 'BSB' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fromStation || !toStation) {
      setErrorMsg('Please select both Origin and Destination stations.');
      return;
    }

    if (fromStation === toStation) {
      setErrorMsg('Source and Destination stations cannot be identical. Please choose distinct stations.');
      return;
    }

    if (!journeyDate) {
      setErrorMsg('Please select a valid journey date.');
      return;
    }

    const budgetVal = maxBudget ? parseFloat(maxBudget) : null;
    if (budgetVal !== null && budgetVal <= 0) {
      setErrorMsg('Budget must be a positive amount in Indian Rupees.');
      return;
    }

    onSearch({
      from_station: fromStation,
      to_station: toStation,
      journey_date: journeyDate,
      max_budget: budgetVal,
      passengers: parseInt(passengers, 10) || 1,
      travel_class: travelClass,
      sort_by: 'best_value',
    });
  };

  return (
    <section id="search-section" className="search-section-wrapper">
      <div className="container">
        <div className="search-box-card">
          <div className="search-card-header">
            <div className="search-header-info">
              <span className="search-kicker">Multi-Criteria Journey Search</span>
              <h2 className="search-title">Plan Your Railway Journey</h2>
            </div>
            <div className="search-tag">
              <span>Demo Dataset Mode</span>
            </div>
          </div>

          {errorMsg && (
            <div className="validation-alert" role="alert">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-grid">
              {/* From Station */}
              <div className="form-group from-group">
                <label className="form-label" htmlFor="from-station">
                  From Station
                </label>
                <select
                  id="from-station"
                  className="form-select"
                  value={fromStation}
                  onChange={(e) => {
                    setFromStation(e.target.value);
                    setErrorMsg('');
                  }}
                  required
                >
                  <option value="" disabled>Select Origin</option>
                  {stations.map((s) => (
                    <option key={`from-${s.code}`} value={s.code}>
                      {s.name} ({s.code}) - {s.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="swap-btn-container">
                <button
                  type="button"
                  className="btn-swap"
                  onClick={handleSwap}
                  title="Swap Origin and Destination"
                  aria-label="Swap stations"
                >
                  <ArrowUpDown size={17} />
                </button>
              </div>

              {/* To Station */}
              <div className="form-group to-group">
                <label className="form-label" htmlFor="to-station">
                  To Station
                </label>
                <select
                  id="to-station"
                  className="form-select"
                  value={toStation}
                  onChange={(e) => {
                    setToStation(e.target.value);
                    setErrorMsg('');
                  }}
                  required
                >
                  <option value="" disabled>Select Destination</option>
                  {stations.map((s) => (
                    <option key={`to-${s.code}`} value={s.code}>
                      {s.name} ({s.code}) - {s.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Journey Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="journey-date">
                  Journey Date
                </label>
                <div className="input-with-icon">
                  <Calendar size={16} className="field-icon" />
                  <input
                    id="journey-date"
                    type="date"
                    className="form-input icon-input"
                    value={journeyDate}
                    min={todayStr}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Maximum Budget */}
              <div className="form-group">
                <label className="form-label" htmlFor="max-budget">
                  Max Budget (₹)
                </label>
                <div className="input-with-icon">
                  <IndianRupee size={16} className="field-icon" />
                  <input
                    id="max-budget"
                    type="number"
                    className="form-input icon-input"
                    placeholder="e.g. 4000"
                    value={maxBudget}
                    min="100"
                    step="50"
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="form-group">
                <label className="form-label" htmlFor="passengers">
                  Passengers
                </label>
                <div className="input-with-icon">
                  <Users size={16} className="field-icon" />
                  <select
                    id="passengers"
                    className="form-select icon-input"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Class */}
              <div className="form-group">
                <label className="form-label" htmlFor="travel-class">
                  Class
                </label>
                <select
                  id="travel-class"
                  className="form-select"
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                >
                  <option value="fare_sleeper">Sleeper Class (SL)</option>
                  <option value="fare_3ac">AC 3 Tier (3A)</option>
                  <option value="fare_2ac">AC 2 Tier (2A)</option>
                  <option value="fare_general">General Second (2S)</option>
                </select>
              </div>
            </div>

            {/* Quick Demo Corridors */}
            <div className="quick-corridors">
              <span className="corridor-title">
                <Sparkles size={14} /> Quick Demo Routes:
              </span>
              <div className="corridor-pills">
                {quickCorridors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className="corridor-pill"
                    onClick={() => {
                      setFromStation(c.from);
                      setToStation(c.to);
                      setErrorMsg('');
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="search-action-row">
              <div className="action-hint">
                <span>Free search &bull; No login required &bull; Connecting journeys evaluated</span>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-search-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    <span>Optimizing Routes...</span>
                  </>
                ) : (
                  <>
                    <Search size={17} />
                    <span>Find Best Routes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

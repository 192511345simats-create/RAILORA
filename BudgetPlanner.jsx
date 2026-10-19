import React, { useState, useEffect } from 'react';
import {
  Calculator,
  IndianRupee,
  Utensils,
  Car,
  Package,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { calculateTripBudget } from '../services/api';

export default function BudgetPlanner({ selectedRoute = null }) {
  const [totalBudget, setTotalBudget] = useState('5000');
  const [trainFare, setTrainFare] = useState('1450');
  const [passengers, setPassengers] = useState(1);
  const [localTransit, setLocalTransit] = useState('450');
  const [foodExpenses, setFoodExpenses] = useState('600');
  const [otherExpenses, setOtherExpenses] = useState('400');

  const [calculation, setCalculation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If a route was selected from the results, prefill fare and passengers
  useEffect(() => {
    if (selectedRoute) {
      if (selectedRoute.total_fare) {
        setTrainFare(String(selectedRoute.total_fare));
      }
      if (selectedRoute.passengers) {
        setPassengers(selectedRoute.passengers);
      }
      if (selectedRoute.max_budget) {
        setTotalBudget(String(selectedRoute.max_budget));
      }
    }
  }, [selectedRoute]);

  // Recalculate whenever inputs change
  useEffect(() => {
    const runCalculation = async () => {
      const budgetNum = parseFloat(totalBudget) || 0;
      const fareNum = parseFloat(trainFare) || 0;
      const transitNum = parseFloat(localTransit) || 0;
      const foodNum = parseFloat(foodExpenses) || 0;
      const otherNum = parseFloat(otherExpenses) || 0;
      const paxNum = parseInt(passengers, 10) || 1;

      try {
        const res = await calculateTripBudget({
          total_budget: budgetNum,
          train_fare: fareNum,
          passengers: paxNum,
          local_transit: transitNum,
          food_expenses: foodNum,
          other_expenses: otherNum,
        });
        if (res.status === 'success') {
          setCalculation(res.calculation);
        }
      } catch (err) {
        // Fallback local calculation
        const totalTrainFare = fareNum * paxNum;
        const additional = transitNum + foodNum + otherNum;
        const totalExp = totalTrainFare + additional;
        const remaining = budgetNum - totalExp;
        const pct = budgetNum > 0 ? Math.round((totalExp / budgetNum) * 100) : 0;
        setCalculation({
          total_budget: budgetNum,
          total_train_fare: totalTrainFare,
          additional_expenses: additional,
          total_expenditure: totalExp,
          remaining_budget: remaining,
          utilization_pct: pct,
          fits_budget: remaining >= 0,
          status_color: remaining >= budgetNum * 0.2 ? 'success' : remaining >= 0 ? 'warning' : 'danger',
          advisory_message: remaining >= 0
            ? `Journey fits well within budget! ₹${remaining.toLocaleString()} remaining.`
            : `Warning: Expenses exceed budget by ₹${Math.abs(remaining).toLocaleString()}!`
        });
      }
    };

    const timer = setTimeout(runCalculation, 250);
    return () => clearTimeout(timer);
  }, [totalBudget, trainFare, passengers, localTransit, foodExpenses, otherExpenses]);

  return (
    <section id="budget-section" className="section-padding budget-planner-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Financial Feasibility</span>
          <h2 className="section-title">Smart Travel Budget Planner</h2>
          <p className="section-subtitle">
            Accurately forecast total itinerary expenses including railway fares, local connections,
            food, and reserves to avoid unexpected travel shortfalls.
          </p>
        </div>

        {selectedRoute && (
          <div className="budget-sync-alert">
            <Sparkles size={16} />
            <span>
              Synchronized with selected route: <strong>{selectedRoute.train_identifiers}</strong> (Fare: ₹{selectedRoute.total_fare}/pax)
            </span>
          </div>
        )}

        <div className="budget-grid">
          {/* Inputs Column */}
          <div className="budget-card input-card">
            <h3 className="card-subhead">
              <Calculator size={18} /> Travel Expense Inputs
            </h3>

            <div className="budget-form-rows">
              {/* Total Budget */}
              <div className="budget-input-item">
                <label className="budget-label" htmlFor="total-budget">
                  Total Travel Budget (₹)
                </label>
                <div className="input-with-icon">
                  <IndianRupee size={16} className="field-icon" />
                  <input
                    id="total-budget"
                    type="number"
                    className="form-input icon-input"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="e.g. 5000"
                    min="0"
                  />
                </div>
              </div>

              {/* Train Fare per Person */}
              <div className="budget-input-item">
                <label className="budget-label" htmlFor="train-fare">
                  Train Fare per Passenger (₹)
                </label>
                <div className="input-with-icon">
                  <IndianRupee size={16} className="field-icon" />
                  <input
                    id="train-fare"
                    type="number"
                    className="form-input icon-input"
                    value={trainFare}
                    onChange={(e) => setTrainFare(e.target.value)}
                    placeholder="e.g. 1450"
                    min="0"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="budget-input-item">
                <label className="budget-label" htmlFor="calc-passengers">
                  Number of Passengers
                </label>
                <input
                  id="calc-passengers"
                  type="number"
                  className="form-input"
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  min="1"
                  max="10"
                />
              </div>

              {/* Local Transit */}
              <div className="budget-input-item">
                <label className="budget-label" htmlFor="local-transit">
                  Local Transit / Cab / Metro (₹)
                </label>
                <div className="input-with-icon">
                  <Car size={16} className="field-icon" />
                  <input
                    id="local-transit"
                    type="number"
                    className="form-input icon-input"
                    value={localTransit}
                    onChange={(e) => setLocalTransit(e.target.value)}
                    placeholder="e.g. 400"
                    min="0"
                  />
                </div>
              </div>

              {/* Food & Refreshments */}
              <div className="budget-input-item">
                <label className="budget-label" htmlFor="food-expenses">
                  Food &amp; Catering (₹)
                </label>
                <div className="input-with-icon">
                  <Utensils size={16} className="field-icon" />
                  <input
                    id="food-expenses"
                    type="number"
                    className="form-input icon-input"
                    value={foodExpenses}
                    onChange={(e) => setFoodExpenses(e.target.value)}
                    placeholder="e.g. 600"
                    min="0"
                  />
                </div>
              </div>

              {/* Miscellaneous */}
              <div className="budget-input-item">
                <label className="budget-label" htmlFor="other-expenses">
                  Other / Porter / Emergency (₹)
                </label>
                <div className="input-with-icon">
                  <Package size={16} className="field-icon" />
                  <input
                    id="other-expenses"
                    type="number"
                    className="form-input icon-input"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(e.target.value)}
                    placeholder="e.g. 300"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          {calculation && (
            <div className="budget-card summary-card">
              <h3 className="card-subhead">
                Financial Evaluation &amp; Reserves
              </h3>

              {/* Top Verdict Alert */}
              <div className={`budget-verdict-box verdict-${calculation.status_color || 'safe'}`}>
                {calculation.fits_budget ? (
                  <CheckCircle2 size={24} className="verdict-icon" />
                ) : (
                  <AlertOctagon size={24} className="verdict-icon" />
                )}
                <div className="verdict-text">
                  <h4 className="verdict-title">
                    {calculation.fits_budget ? 'Journey Within Budget' : 'Budget Exceeded'}
                  </h4>
                  <p className="verdict-desc">{calculation.advisory_message}</p>
                </div>
              </div>

              {/* Big Metrics Row */}
              <div className="budget-stat-tiles">
                <div className="stat-tile">
                  <span className="tile-label">Total Expenditure</span>
                  <span className="tile-value text-navy">
                    ₹{calculation.total_expenditure.toLocaleString()}
                  </span>
                  <span className="tile-sub">across all categories</span>
                </div>

                <div className="stat-tile">
                  <span className="tile-label">Remaining Budget</span>
                  <span className={`tile-value ${calculation.remaining_budget >= 0 ? 'text-green' : 'text-danger'}`}>
                    {calculation.remaining_budget >= 0 ? '+' : ''}₹{calculation.remaining_budget.toLocaleString()}
                  </span>
                  <span className="tile-sub">
                    {calculation.remaining_budget >= 0 ? 'safety buffer' : 'over budget'}
                  </span>
                </div>
              </div>

              {/* Utilization Bar */}
              <div className="utilization-box">
                <div className="utilization-label-row">
                  <span>Budget Utilization</span>
                  <strong>{calculation.utilization_pct}%</strong>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill ${calculation.utilization_pct > 100 ? 'fill-danger' : calculation.utilization_pct > 80 ? 'fill-warning' : 'fill-safe'}`}
                    style={{ width: `${Math.min(100, calculation.utilization_pct)}%` }}
                  />
                </div>
              </div>

              {/* Breakdown Ledger Table */}
              <div className="ledger-breakdown">
                <div className="ledger-row">
                  <span>Railway Tickets ({calculation.passengers} pax)</span>
                  <strong>₹{calculation.total_train_fare.toLocaleString()}</strong>
                </div>
                <div className="ledger-row">
                  <span>Local Transit &amp; Cabs</span>
                  <strong>₹{Number(localTransit || 0).toLocaleString()}</strong>
                </div>
                <div className="ledger-row">
                  <span>Food &amp; Catering</span>
                  <strong>₹{Number(foodExpenses || 0).toLocaleString()}</strong>
                </div>
                <div className="ledger-row">
                  <span>Emergency / Porter / Other</span>
                  <strong>₹{Number(otherExpenses || 0).toLocaleString()}</strong>
                </div>
                <div className="ledger-row total-row">
                  <span>Total Estimated Outflow</span>
                  <strong>₹{calculation.total_expenditure.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

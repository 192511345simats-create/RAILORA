import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchForm from './components/SearchForm';
import RouteResults from './components/RouteResults';
import BudgetPlanner from './components/BudgetPlanner';
import OSLab from './components/OSLab';
import About from './components/About';
import Footer from './components/Footer';
import { fetchStations, searchJourneyRoutes } from './services/api';

// Fallback Indian railway hubs if API is warming up
const DEFAULT_STATIONS = [
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
  { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NER' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR' },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR' },
  { code: 'MAO', name: 'Madgaon Junction', city: 'Goa', state: 'Goa', zone: 'KR' },
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Punjab/Haryana', zone: 'NR' },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [stations, setStations] = useState(DEFAULT_STATIONS);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Load live stations from backend on mount
  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await fetchStations();
        if (res.stations && res.stations.length > 0) {
          setStations(res.stations);
        }
      } catch (err) {
        console.warn('Backend stations offline, using static station dataset fallback:', err);
      }
    };
    loadStations();
  }, []);

  // Navigation router
  const scrollTo = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(`${sectionId}-section`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Perform Route Search
  const handleSearch = async (params) => {
    setSearchLoading(true);
    setSearchQuery(params);

    try {
      const data = await searchJourneyRoutes(params);
      setSearchResults(data.routes || []);
      // Scroll smoothly to results
      setTimeout(() => {
        const resultsElem = document.getElementById('results-section');
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      alert(`Search Error: ${err.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  // Select route to prefill in budget planner
  const handleSelectRouteForBudget = (route) => {
    setSelectedRoute({
      ...route,
      max_budget: searchQuery?.max_budget || 5000,
      passengers: searchQuery?.passengers || 1
    });

    // Scroll down to budget planner
    setTimeout(() => {
      const budgetElem = document.getElementById('budget-section');
      if (budgetElem) {
        budgetElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="railora-app">
      {/* Professional Navbar */}
      <Navbar activeSection={activeSection} onNavigate={scrollTo} />

      {/* Main Content */}
      <main>
        {/* Section 1: Hero */}
        <Hero
          onSearchClick={() => scrollTo('search')}
          onExploreClick={() => scrollTo('os-lab')}
        />

        {/* Section 2: Journey Search Form */}
        <SearchForm
          stations={stations}
          onSearch={handleSearch}
          isLoading={searchLoading}
        />

        {/* Section 3: Route Recommendation Results */}
        <RouteResults
          results={searchResults}
          searchQuery={searchQuery}
          isLoading={searchLoading}
          onSelectRouteForBudget={handleSelectRouteForBudget}
          selectedRouteId={selectedRoute?.id}
        />

        {/* Section 4: Smart Budget Planner */}
        <BudgetPlanner selectedRoute={selectedRoute} />

        {/* Section 5: OS Concepts Lab */}
        <OSLab />

        {/* Section 6: About Section */}
        <About />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollTo} />
    </div>
  );
}

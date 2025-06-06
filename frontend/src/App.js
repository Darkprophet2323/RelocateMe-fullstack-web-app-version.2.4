import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Enhanced Progress Wizard Component with Noir Theme
const ProgressWizard = ({ currentStep, totalSteps, completedSteps }) => {
  const progressPercentage = (completedSteps / totalSteps) * 100;
  
  return (
    <div className="mb-8 bg-black border border-gray-600 shadow-lg p-8 fade-in">
      <h2 className="text-3xl font-bold text-white mb-6 noir-title">PROGRESS TRACKING</h2>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-mono text-gray-300 uppercase tracking-wider">STEP {currentStep} OF {totalSteps}</span>
        <span className="text-sm font-mono text-gray-300 uppercase tracking-wider">{Math.round(progressPercentage)}% COMPLETE</span>
      </div>
      <div className="w-full bg-gray-800 h-2 mb-6 border border-gray-600">
        <div 
          className="bg-white h-full transition-all duration-1000 ease-out relative"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white font-mono">{completedSteps}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">COMPLETED</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white font-mono">{totalSteps - completedSteps}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">REMAINING</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white font-mono">{totalSteps}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">TOTAL</div>
        </div>
      </div>
    </div>
  );
};

// Navigation Component with Noir Theme
const Navigation = ({ user, onLogout, currentPath }) => {
  const navItems = [
    { path: "/dashboard", name: "DASHBOARD", step: 1, description: "MISSION CONTROL" },
    { path: "/timeline", name: "TIMELINE", step: 2, description: "OPERATIONAL SCHEDULE" },
    { path: "/progress", name: "PROGRESS", step: 3, description: "STATUS TRACKING" },
    { path: "/visa", name: "LEGAL", step: 4, description: "DOCUMENTATION" },
    { path: "/employment", name: "WORK", step: 5, description: "CAREER SEARCH" },
    { path: "/housing", name: "HOUSING", step: 6, description: "LOCATION INTEL" },
    { path: "/logistics", name: "LOGISTICS", step: 7, description: "MOVEMENT OPS" },
    { path: "/analytics", name: "ANALYTICS", step: 8, description: "DATA ANALYSIS" },
    { path: "/resources", name: "RESOURCES", step: 9, description: "SUPPORT NETWORK" }
  ];

  return (
    <nav className="bg-black bg-opacity-95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <span className="text-2xl font-bold font-serif text-white tracking-tight group-hover:text-gray-300 transition-colors duration-300">
                RELOCATE
              </span>
              <span className="ml-2 text-sm text-gray-400 font-mono hidden lg:block">
                [ PHOENIX → PEAK DISTRICT ]
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-xs font-mono font-semibold tracking-wider transition-all duration-300 relative group border-b-2 ${
                  currentPath === item.path
                    ? 'text-white border-white bg-gray-900'
                    : 'text-gray-400 hover:text-white border-transparent hover:border-gray-500 hover:bg-gray-900'
                }`}
              >
                <span className="mr-2 text-gray-600">[{item.step}]</span>
                {item.name}
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black border border-gray-600 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 font-mono">
                  {item.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black"></div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm font-mono">USER: {user.toUpperCase()}</span>
            <button
              onClick={onLogout}
              className="bg-red-900 text-white px-4 py-2 border border-red-700 hover:bg-red-800 hover:border-red-600 transition-all duration-300 text-xs font-mono font-semibold tracking-wider"
            >
              [LOGOUT]
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="grid grid-cols-3 gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-center py-2 px-1 text-xs font-mono border ${
                  currentPath === item.path
                    ? 'bg-white text-black border-white'
                    : 'text-gray-400 border-gray-600 hover:text-white hover:border-gray-400'
                }`}
              >
                <div className="font-bold">[{item.step}]</div>
                <div>{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Dashboard with Noir Theme
const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_steps: 34,
    completed_steps: 0,
    in_progress: 0,
    urgent_tasks: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/api/dashboard/overview`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const quickStartSteps = [
    {
      title: "DOCUMENTATION PHASE",
      description: "Gather critical documents: passport, certificates, financial records.",
      action: "ACCESS LEGAL SECTION",
      link: "/visa",
      urgent: true,
      icon: "📋"
    },
    {
      title: "TIMELINE ANALYSIS",
      description: "Review 34-step operational timeline for relocation protocol.",
      action: "VIEW TIMELINE",
      link: "/timeline",
      urgent: false,
      icon: "📅"
    },
    {
      title: "EMPLOYMENT SEARCH",
      description: "Scout 8 verified opportunities in target region.",
      action: "BROWSE POSITIONS",
      link: "/employment",
      urgent: false,
      icon: "💼"
    }
  ];

  const essentialLinks = [
    { name: "UK GOVERNMENT", url: "https://www.gov.uk", description: "Official state portal" },
    { name: "VISA CENTRAL", url: "https://www.gov.uk/browse/visas-immigration", description: "Immigration command" },
    { name: "PEAK DISTRICT HQ", url: "https://www.peakdistrict.gov.uk", description: "Target region intel" },
    { name: "NHS REGISTRATION", url: "https://www.nhs.uk/using-the-nhs/nhs-services/gps/how-to-register-with-a-gp-practice/", description: "Medical system access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-6xl md:text-8xl font-bold font-serif text-white mb-6 typewriter">
            RELOCATION
          </h1>
          <div className="text-2xl md:text-4xl font-mono text-gray-300 mb-8 tracking-widest">
            [ MISSION: PHOENIX → PEAK DISTRICT ]
          </div>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto font-mono leading-relaxed">
            CLASSIFIED OPERATION: International relocation protocol from Phoenix, Arizona to Peak District, UK. 
            Follow systematic approach for mission success.
          </p>
          
          {/* Progress Overview */}
          <ProgressWizard 
            currentStep={stats.completed_steps + 1} 
            totalSteps={stats.total_steps} 
            completedSteps={stats.completed_steps} 
          />
        </div>

        {/* Quick Start Mission Briefing */}
        <div className="mb-12 slide-in-left">
          <h2 className="text-3xl font-bold text-white mb-8 font-serif text-center">MISSION BRIEFING</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStartSteps.map((step, index) => (
              <div key={index} className={`bg-black border-2 p-8 transition-all duration-500 hover:border-white hover:bg-gray-900 group ${step.urgent ? 'border-red-600' : 'border-gray-600'}`}>
                {step.urgent && (
                  <div className="flex items-center mb-4">
                    <span className="bg-red-900 text-red-200 text-xs font-mono font-bold px-3 py-1 border border-red-700 tracking-wider">
                      PRIORITY ALPHA
                    </span>
                  </div>
                )}
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4 font-mono tracking-wide">{step.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{step.description}</p>
                <Link 
                  to={step.link}
                  className="inline-block bg-white text-black px-6 py-3 font-mono font-bold text-sm tracking-wider hover:bg-gray-200 transition-all duration-300 border-2 border-white group-hover:bg-black group-hover:text-white"
                >
                  {step.action} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black border border-gray-600 p-6 text-center hover:border-white transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2 font-mono">{stats.total_steps}</div>
            <div className="text-gray-400 text-sm font-mono tracking-wider">TOTAL OBJECTIVES</div>
          </div>
          <div className="bg-black border border-gray-600 p-6 text-center hover:border-white transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2 font-mono">{stats.completed_steps}</div>
            <div className="text-gray-400 text-sm font-mono tracking-wider">OBJECTIVES COMPLETE</div>
          </div>
          <div className="bg-black border border-gray-600 p-6 text-center hover:border-white transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2 font-mono">{stats.in_progress}</div>
            <div className="text-gray-400 text-sm font-mono tracking-wider">IN PROGRESS</div>
          </div>
          <div className="bg-black border border-gray-600 p-6 text-center hover:border-white transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2 font-mono">{stats.urgent_tasks}</div>
            <div className="text-gray-400 text-sm font-mono tracking-wider">CRITICAL TASKS</div>
          </div>
        </div>

        {/* Essential Command Links */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 font-serif text-center">ESSENTIAL COMMAND LINKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {essentialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black border border-gray-600 p-6 hover:border-white hover:bg-gray-900 transition-all duration-300 group block"
              >
                <h3 className="font-bold text-white mb-3 font-mono tracking-wide group-hover:text-gray-200">{link.name}</h3>
                <p className="text-gray-400 text-sm font-mono">{link.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Mission Control Center */}
        <div className="bg-black border border-gray-600 p-8 text-center hover:border-white transition-all duration-300">
          <h2 className="text-3xl font-bold text-white mb-6 font-serif">MISSION CONTROL</h2>
          <p className="text-gray-400 mb-8 font-mono text-lg leading-relaxed">
            Ready to commence relocation protocol. Select operational mode to begin systematic progression 
            toward target destination. All systems operational.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/timeline"
              className="bg-white text-black px-8 py-4 font-mono font-bold tracking-wider hover:bg-gray-200 transition-all duration-300 border-2 border-white"
            >
              [TIMELINE] INITIATE SEQUENCE
            </Link>
            <Link 
              to="/progress"
              className="bg-transparent text-white px-8 py-4 font-mono font-bold tracking-wider border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              [PROGRESS] STATUS CHECK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Timeline Page with Noir Theme
const TimelinePage = () => {
  const [timelineData, setTimelineData] = useState({
    timeline: [],
    categories: {}
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/api/timeline/full`);
        setTimelineData({
          timeline: response.data.timeline || [],
          categories: {}
        });
        
        // Count completed steps
        const completed = (response.data.timeline || []).filter(step => step.is_completed).length;
        setCompletedCount(completed);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        // Use fallback data
        setTimelineData({
          timeline: [
            { id: 1, title: "Initial Research & Decision", description: "Research Peak District areas, cost of living, and lifestyle", category: "Planning", is_completed: false },
            { id: 2, title: "Create Relocation Budget", description: "Calculate moving costs, visa fees, initial living expenses", category: "Planning", is_completed: false },
            { id: 3, title: "Visa Research", description: "Determine visa type needed (work, skilled worker, family, etc.)", category: "Visa & Legal", is_completed: false }
          ],
          categories: {}
        });
      }
    };
    fetchData();
  }, []);

  const updateStepProgress = async (stepId, completed) => {
    try {
      await axios.post(`${API}/api/timeline/update-progress`, {
        step_id: stepId,
        completed: completed
      });
      
      // Refresh timeline data
      const response = await axios.get(`${API}/api/timeline/full`);
      setTimelineData({
        timeline: response.data.timeline || [],
        categories: {}
      });
      
      // Update completed count
      const newCompleted = (response.data.timeline || []).filter(step => step.is_completed).length;
      setCompletedCount(newCompleted);
      
    } catch (error) {
      console.error('Error updating step progress:', error);
    }
  };

  const filteredSteps = timelineData.timeline || [];

  const timelineLinks = [
    { name: "UK GOV TIMELINE", url: "https://www.gov.uk/browse/visas-immigration", description: "Official protocol guidance" },
    { name: "MOVE CALCULATOR", url: "https://www.internationalmovers.com/international-moving-timeline", description: "Logistics timeline tool" },
    { name: "EXPAT PROTOCOLS", url: "https://www.expatfocus.com/expatriate-relocation-checklist", description: "Standard operating procedures" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl font-bold font-serif text-white mb-6">
            OPERATIONAL TIMELINE
          </h1>
          <p className="text-xl text-gray-400 mb-8 font-mono tracking-wide">
            [ 34-STEP RELOCATION PROTOCOL: PHOENIX → PEAK DISTRICT ]
          </p>
          
          <ProgressWizard 
            currentStep={completedCount + 1} 
            totalSteps={filteredSteps.length} 
            completedSteps={completedCount} 
          />
        </div>

        {/* Timeline Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 font-mono text-center tracking-wider">REFERENCE MATERIALS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timelineLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black border border-gray-600 p-6 hover:border-white hover:bg-gray-900 transition-all duration-300"
              >
                <h3 className="font-bold text-white mb-3 font-mono tracking-wide">{link.name}</h3>
                <p className="text-gray-400 text-sm font-mono">{link.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-6">
          {filteredSteps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-black border-2 p-8 transition-all duration-500 hover:bg-gray-900 ${
                step.is_completed ? 'border-white bg-gray-900' : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="mr-6 flex-shrink-0">
                      <div className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-lg font-mono ${
                        step.is_completed ? 'bg-white text-black border-white' : 'bg-black text-white border-gray-600'
                      }`}>
                        {step.is_completed ? '✓' : String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={step.is_completed}
                          onChange={(e) => updateStepProgress(step.id, e.target.checked)}
                          className="mr-4 w-6 h-6 border-2 border-gray-600 bg-black checked:bg-white checked:border-white appearance-none cursor-pointer relative"
                          style={{
                            backgroundImage: step.is_completed ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")" : 'none'
                          }}
                        />
                        <h3 className={`text-2xl font-bold font-mono tracking-wide transition-all duration-300 ${
                          step.is_completed ? 'text-white line-through' : 'text-white group-hover:text-gray-300'
                        }`}>
                          {step.title}
                        </h3>
                      </label>
                      <div className="flex items-center mt-3 space-x-4">
                        <span className="px-3 py-1 text-sm border border-gray-600 text-gray-300 font-mono tracking-wider uppercase">
                          {step.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed font-mono">{step.description}</p>
                </div>
                
                {step.is_completed && (
                  <div className="ml-6 text-white text-3xl">
                    ✅
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSteps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg font-mono">LOADING OPERATIONAL DATA...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Progress Page with Interactive Checklist and Noir Theme
const ProgressPage = () => {
  const [progressItems, setProgressItems] = useState([]);
  const [editingNotes, setEditingNotes] = useState(null);
  const [tempNote, setTempNote] = useState('');

  useEffect(() => {
    fetchProgressItems();
  }, []);

  const fetchProgressItems = async () => {
    try {
      const response = await axios.get(`${API}/api/progress/items`);
      setProgressItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching progress items:', error);
      // Use fallback data
      setProgressItems([
        {
          id: '1',
          title: 'Gather Birth Certificate',
          description: 'Obtain certified copy of birth certificate for visa application',
          status: 'completed',
          category: 'Documentation',
          subtasks: [
            { task: 'Request birth certificate online', completed: true },
            { task: 'Pay processing fee', completed: true },
            { task: 'Receive by mail', completed: true }
          ],
          notes: 'Received certified copy from state office. Cost $25.'
        },
        {
          id: '2',
          title: 'Complete Visa Application Form',
          description: 'Fill out UK Skilled Worker visa application online',
          status: 'in_progress',
          category: 'Visa Application',
          subtasks: [
            { task: 'Create UK government account', completed: true },
            { task: 'Fill application form', completed: false },
            { task: 'Upload documents', completed: false }
          ],
          notes: 'Application 70% complete.'
        }
      ]);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      await axios.put(`${API}/api/progress/items/${itemId}`, {
        status: newStatus
      });
      fetchProgressItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const toggleSubtask = async (itemId, subtaskIndex) => {
    try {
      await axios.post(`${API}/api/progress/items/${itemId}/subtasks/${subtaskIndex}/toggle`);
      fetchProgressItems();
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const saveNotes = async (itemId, notes) => {
    try {
      await axios.put(`${API}/api/progress/items/${itemId}`, {
        notes: notes
      });
      setEditingNotes(null);
      setTempNote('');
      fetchProgressItems();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const startEditingNotes = (item) => {
    setEditingNotes(item.id);
    setTempNote(item.notes || '');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'border-white text-white bg-gray-900';
      case 'in_progress': return 'border-yellow-600 text-yellow-400 bg-yellow-900';
      case 'blocked': return 'border-red-600 text-red-400 bg-red-900';
      default: return 'border-gray-600 text-gray-300 bg-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'blocked': return '🚫';
      default: return '⏳';
    }
  };

  const completedItems = progressItems.filter(item => item.status === 'completed').length;
  const totalItems = progressItems.length;

  const progressLinks = [
    { name: "TRELLO COMMAND", url: "https://trello.com", description: "Task management system" },
    { name: "MOVING INTEL", url: "https://www.moving.com/tips/moving-checklist/", description: "Operational guidelines" },
    { name: "MOBILE APPS", url: "https://www.apartmenttherapy.com/best-moving-apps-36683126", description: "Field support tools" },
    { name: "EXPAT NETWORK", url: "https://www.internations.org", description: "Agent network access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl font-bold font-serif text-white mb-6">
            STATUS TRACKING
          </h1>
          <p className="text-xl text-gray-400 mb-8 font-mono tracking-wide">
            [ INTERACTIVE MISSION PROGRESS MONITOR ]
          </p>
          
          <ProgressWizard 
            currentStep={completedItems + 1} 
            totalSteps={totalItems} 
            completedSteps={completedItems} 
          />
        </div>

        {/* Progress Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 font-mono text-center tracking-wider">SUPPORT SYSTEMS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {progressLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black border border-gray-600 p-4 hover:border-white hover:bg-gray-900 transition-all duration-300"
              >
                <h3 className="font-bold text-white mb-2 font-mono tracking-wide">{link.name}</h3>
                <p className="text-gray-400 text-sm font-mono">{link.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Progress Items */}
        <div className="space-y-6">
          {progressItems.map((item, index) => (
            <div key={item.id} className="bg-black border border-gray-600 p-8 transition-all duration-300 hover:border-white hover:bg-gray-900">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 border-2 flex items-center justify-center text-2xl font-bold font-mono ${
                    item.status === 'completed' ? 'bg-white text-black border-white' : 
                    item.status === 'in_progress' ? 'bg-yellow-900 border-yellow-600 text-yellow-400' :
                    item.status === 'blocked' ? 'bg-red-900 border-red-600 text-red-400' : 'bg-gray-800 border-gray-600 text-gray-300'
                  }`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-mono tracking-wide">{item.title}</h2>
                    <span className={`inline-block px-4 py-2 text-sm font-mono font-bold tracking-wider uppercase border ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={item.status}
                    onChange={(e) => updateItemStatus(item.id, e.target.value)}
                    className="border-2 border-gray-600 bg-black text-white px-4 py-2 font-mono focus:border-white focus:outline-none transition-all duration-300"
                  >
                    <option value="not_started">NOT STARTED</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="completed">COMPLETED</option>
                    <option value="blocked">BLOCKED</option>
                  </select>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed font-mono">{item.description}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-mono text-gray-400 tracking-wider uppercase">SUBTASK PROGRESS</span>
                  <span className="text-sm text-gray-400 font-mono">
                    {item.subtasks.filter(st => st.completed).length}/{item.subtasks.length}
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 border border-gray-600">
                  <div 
                    className="bg-white h-full transition-all duration-500 relative"
                    style={{ 
                      width: `${(item.subtasks.filter(st => st.completed).length / item.subtasks.length) * 100}%` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Interactive Subtasks */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-white font-mono tracking-wider">TASK CHECKLIST:</h3>
                {item.subtasks.map((subtask, subIndex) => (
                  <label key={subIndex} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(item.id, subIndex)}
                      className="mr-4 w-6 h-6 border-2 border-gray-600 bg-black checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-200"
                      style={{
                        backgroundImage: subtask.completed ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")" : 'none'
                      }}
                    />
                    <span className={`font-mono transition-all duration-200 group-hover:text-white ${
                      subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'
                    }`}>
                      {subtask.task}
                    </span>
                    {subtask.completed && (
                      <span className="ml-3 text-white">✅</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Notes Section */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="font-semibold text-white mb-4 font-mono tracking-wider">OPERATIONAL NOTES:</h3>
                {editingNotes === item.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      className="w-full p-4 border-2 border-gray-600 bg-black text-white font-mono focus:border-white focus:outline-none transition-all duration-300"
                      rows="4"
                      placeholder="Enter operational notes..."
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={() => saveNotes(item.id, tempNote)}
                        className="bg-white text-black px-6 py-3 border-2 border-white hover:bg-gray-200 transition-all duration-300 font-mono font-bold tracking-wider"
                      >
                        [SAVE]
                      </button>
                      <button
                        onClick={() => {
                          setEditingNotes(null);
                          setTempNote('');
                        }}
                        className="bg-transparent text-white px-6 py-3 border-2 border-gray-600 hover:border-white transition-all duration-300 font-mono font-bold tracking-wider"
                      >
                        [CANCEL]
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-900 border border-gray-700 p-4">
                      <p className="text-gray-300 font-mono leading-relaxed">
                        {item.notes || 'No operational notes recorded. Click "EDIT NOTES" to add intelligence data.'}
                      </p>
                    </div>
                    <button
                      onClick={() => startEditingNotes(item)}
                      className="text-white hover:text-gray-300 font-mono font-bold tracking-wider"
                    >
                      [EDIT NOTES]
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {progressItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">NO ACTIVE MISSIONS</h2>
            <p className="text-gray-400 font-mono">Initialize timeline sequence to generate progress items.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Visa & Legal Page with Interactive Document Checklist and Noir Theme
const VisaPage = () => {
  const [visaRequirements, setVisaRequirements] = useState({ visa_types: [] });
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [documentChecklist, setDocumentChecklist] = useState({});

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await axios.get(`${API}/api/visa/requirements`);
        setVisaRequirements(response.data);
        if (response.data.visa_types.length > 0) {
          setSelectedVisa(response.data.visa_types[0]);
        }
      } catch (error) {
        console.error('Error fetching visa data:', error);
        // Use fallback data
        setVisaRequirements({
          visa_types: [
            {
              id: '1',
              visa_type: 'Skilled Worker Visa',
              fee: '£719 - £1,423',
              processing_time: '3-8 weeks',
              requirements: ['Job offer from UK employer', 'Certificate of sponsorship', 'English language proficiency'],
              application_process: ['Secure job offer', 'Receive certificate', 'Apply online', 'Attend biometric appointment'],
              required_documents: {
                'identity': ['Valid passport', 'Birth certificate', 'Marriage certificate'],
                'financial': ['Bank statements', 'Salary evidence', 'Tax returns'],
                'employment': ['Job offer letter', 'Certificate of sponsorship', 'Qualifications']
              }
            }
          ]
        });
        setSelectedVisa({
          id: '1',
          visa_type: 'Skilled Worker Visa',
          fee: '£719 - £1,423',
          processing_time: '3-8 weeks',
          requirements: ['Job offer from UK employer', 'Certificate of sponsorship', 'English language proficiency'],
          application_process: ['Secure job offer', 'Receive certificate', 'Apply online', 'Attend biometric appointment'],
          required_documents: {
            'identity': ['Valid passport', 'Birth certificate', 'Marriage certificate'],
            'financial': ['Bank statements', 'Salary evidence', 'Tax returns'],
            'employment': ['Job offer letter', 'Certificate of sponsorship', 'Qualifications']
          }
        });
      }
    };
    fetchVisaData();
  }, []);

  const toggleDocument = (category, docIndex) => {
    const key = `${category}_${docIndex}`;
    setDocumentChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getDocumentProgress = () => {
    const checkedDocs = Object.values(documentChecklist).filter(Boolean).length;
    const totalDocs = Object.keys(documentChecklist).length;
    return { checked: checkedDocs, total: totalDocs };
  };

  if (!selectedVisa) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-xl text-white font-mono">LOADING CLASSIFIED DATA...</div>
    </div>;
  }

  const progress = getDocumentProgress();
  const progressPercentage = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0;

  const visaLinks = [
    { name: "UK GOV PORTAL", url: "https://www.gov.uk/browse/visas-immigration", description: "Official state immigration command" },
    { name: "LEGAL COUNSEL", url: "https://www.lawsociety.org.uk", description: "Qualified immigration attorneys" },
    { name: "DOCUMENT SERVICES", url: "https://www.gov.uk/get-document-legalised", description: "Authorization and apostille" },
    { name: "APPLICATION CENTER", url: "https://www.vfsglobal.co.uk", description: "Biometric processing facilities" },
    { name: "LANGUAGE TESTING", url: "https://www.ielts.org", description: "English proficiency certification" },
    { name: "MEDICAL EXAM", url: "https://www.gov.uk/tb-test-visa", description: "Health screening requirements" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl font-bold font-serif text-white mb-6">
            LEGAL DOCUMENTATION
          </h1>
          <p className="text-xl text-gray-400 mb-8 font-mono tracking-wide">
            [ VISA REQUIREMENTS & CLASSIFICATION PROTOCOLS ]
          </p>
          
          {/* Document Progress */}
          <div className="bg-black border border-gray-600 p-8 mb-8 hover:border-white transition-all duration-300">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono tracking-wider">DOCUMENT STATUS</h2>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-mono text-gray-400 tracking-wider uppercase">DOCUMENTS VERIFIED</span>
              <span className="text-sm font-mono text-gray-400 tracking-wider">{progress.checked} OF {progress.total}</span>
            </div>
            <div className="w-full bg-gray-800 h-3 mb-6 border border-gray-600">
              <div 
                className="bg-white h-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-300 font-mono">
              {progress.checked === progress.total && progress.total > 0 
                ? "✅ ALL DOCUMENTS VERIFIED - READY FOR SUBMISSION" 
                : `CONTINUE VERIFICATION: ${progress.total - progress.checked} DOCUMENTS PENDING`
              }
            </p>
          </div>
        </div>

        {/* Visa Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 font-mono text-center tracking-wider">SUPPORT NETWORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visaLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black border border-gray-600 p-4 hover:border-white hover:bg-gray-900 transition-all duration-300"
              >
                <h3 className="font-bold text-white mb-2 font-mono tracking-wide">{link.name}</h3>
                <p className="text-gray-400 text-sm font-mono">{link.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Selected Visa Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Visa Information */}
          <div className="bg-black border border-gray-600 p-8 hover:border-white transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono tracking-wider">
              {selectedVisa.visa_type.toUpperCase()} SPECS
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-900 border border-gray-700">
                <span className="font-mono text-gray-300">APPLICATION FEE:</span>
                <span className="text-xl font-bold text-white font-mono">{selectedVisa.fee}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-900 border border-gray-700">
                <span className="font-mono text-gray-300">PROCESSING TIME:</span>
                <span className="text-xl font-bold text-white font-mono">{selectedVisa.processing_time}</span>
              </div>
              <div className="p-4 bg-gray-900 border border-gray-700">
                <h3 className="font-semibold mb-3 text-white font-mono tracking-wider">REQUIREMENTS:</h3>
                <ul className="space-y-2">
                  {selectedVisa.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start font-mono">
                      <span className="text-white mr-3">▸</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-black border border-gray-600 p-8 hover:border-white transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono tracking-wider">
              OPERATION SEQUENCE
            </h2>
            <div className="space-y-6">
              {selectedVisa.application_process.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-white text-black border-2 border-white flex items-center justify-center font-bold text-sm mr-4 font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 font-mono">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Document Checklist */}
        <div className="bg-black border border-gray-600 p-8 hover:border-white transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-8 font-mono tracking-wider">
            DOCUMENT VERIFICATION CHECKLIST
          </h2>
          <p className="text-gray-300 mb-8 font-mono leading-relaxed">
            Verify each document as collected. This system tracks progress and ensures compliance with requirements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(selectedVisa.required_documents).map(([category, documents], categoryIndex) => {
              const colors = [
                'border-l-white bg-gray-900',
                'border-l-gray-400 bg-gray-900',
                'border-l-gray-500 bg-gray-900'
              ];
              
              const categoryDocs = documents.filter(doc => doc.trim() !== '');
              const checkedInCategory = categoryDocs.filter((_, docIndex) => 
                documentChecklist[`${category}_${docIndex}`]
              ).length;
              
              return (
                <div key={category} className={`border-l-4 border border-gray-600 p-6 transition-all duration-300 hover:border-white ${colors[categoryIndex % colors.length]}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white capitalize font-mono tracking-wider">
                      {category.replace('_', ' ')}
                    </h3>
                    <span className="bg-white text-black px-3 py-1 text-sm font-mono font-bold tracking-wider">
                      {checkedInCategory}/{categoryDocs.length}
                    </span>
                  </div>
                  
                  <ul className="space-y-4">
                    {categoryDocs.map((doc, docIndex) => {
                      const isChecked = documentChecklist[`${category}_${docIndex}`];
                      return (
                        <li key={docIndex} className="flex items-start">
                          <label className="flex items-start cursor-pointer group w-full">
                            <input
                              type="checkbox"
                              checked={isChecked || false}
                              onChange={() => toggleDocument(category, docIndex)}
                              className="mr-4 mt-1 w-5 h-5 border-2 border-gray-600 bg-black checked:bg-white checked:border-white appearance-none cursor-pointer relative transition-all duration-200"
                              style={{
                                backgroundImage: isChecked ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")" : 'none'
                              }}
                            />
                            <span className={`text-sm transition-all duration-200 group-hover:text-white font-mono ${
                              isChecked ? 'line-through text-gray-500' : 'text-gray-300'
                            }`}>
                              {doc}
                            </span>
                            {isChecked && (
                              <span className="ml-3 text-white">✅</span>
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="bg-black border border-gray-600 p-8 hover:border-white transition-all duration-300">
            <h2 className="text-3xl font-bold text-white mb-6 font-serif">OPERATIONAL LINKS</h2>
            <p className="text-gray-300 mb-8 font-mono leading-relaxed">
              Access official channels and support networks for visa processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.gov.uk/browse/visas-immigration"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-8 py-4 font-mono font-bold tracking-wider hover:bg-gray-200 transition-all duration-300 border-2 border-white"
              >
                [UK.GOV] OFFICIAL PORTAL
              </a>
              <a 
                href="https://www.vfsglobal.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent text-white px-8 py-4 font-mono font-bold tracking-wider border-2 border-white hover:bg-white hover:text-black transition-all duration-300"
              >
                [BIOMETRIC] APPOINTMENT
              </a>
              <Link 
                to="/timeline"
                className="bg-gray-900 text-white px-8 py-4 font-mono font-bold tracking-wider border-2 border-gray-600 hover:border-white transition-all duration-300"
              >
                [TIMELINE] VIEW SCHEDULE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
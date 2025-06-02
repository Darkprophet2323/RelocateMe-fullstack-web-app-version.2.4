import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Enhanced Progress Wizard Component
const ProgressWizard = ({ currentStep, totalSteps, completedSteps }) => {
  const progressPercentage = (completedSteps / totalSteps) * 100;
  
  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Your Relocation Progress</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-blue-700">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-medium text-blue-700">{Math.round(progressPercentage)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{completedSteps}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-yellow-600">{totalSteps - completedSteps}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{totalSteps}</div>
          <div className="text-sm text-gray-600">Total Steps</div>
        </div>
      </div>
    </div>
  );
};

// Navigation Component with Wizard Step Indicators
const Navigation = ({ user, onLogout, currentPath }) => {
  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: "🏠", step: 1, description: "Overview & Getting Started" },
    { path: "/timeline", name: "Timeline", icon: "📅", step: 2, description: "Complete Step-by-Step Guide" },
    { path: "/progress", name: "Progress", icon: "📊", step: 3, description: "Track Your Tasks" },
    { path: "/visa", name: "Visa & Legal", icon: "📋", step: 4, description: "Documentation & Legal" },
    { path: "/employment", name: "Jobs", icon: "💼", step: 5, description: "Find Employment" },
    { path: "/housing", name: "Housing", icon: "🏘️", step: 6, description: "Find Your New Home" },
    { path: "/logistics", name: "Logistics", icon: "📦", step: 7, description: "Plan Your Move" },
    { path: "/analytics", name: "Analytics", icon: "📈", step: 8, description: "Review Progress" },
    { path: "/resources", name: "Resources", icon: "🔗", step: 9, description: "Additional Resources" }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🏔️ Relocate Me
              </span>
              <span className="ml-2 text-sm text-gray-500 hidden lg:block">Phoenix → Peak District</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 relative group ${
                  currentPath === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="font-medium">{item.step}.</span> {item.name}
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Step {item.step}: {item.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-sm">Welcome, {user}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation with Step Numbers */}
        <div className="md:hidden pb-3">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-center py-2 px-1 rounded text-xs ${
                  currentPath === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                <div className="font-medium">{item.step}. {item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Dashboard with Wizard Introduction
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
        const response = await axios.get(`${API}/dashboard/overview`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const quickStartSteps = [
    {
      title: "📋 Get Your Documents Ready",
      description: "Start by gathering essential documents like passport, birth certificate, and financial records.",
      action: "Go to Visa & Legal",
      link: "/visa",
      urgent: true
    },
    {
      title: "📅 Create Your Timeline",
      description: "Review our comprehensive 34-step relocation timeline tailored for your move.",
      action: "View Timeline",
      link: "/timeline",
      urgent: false
    },
    {
      title: "💼 Start Job Hunting",
      description: "Browse 8 real job opportunities in the Peak District area.",
      action: "Browse Jobs",
      link: "/employment",
      urgent: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Your Relocation Journey! 🌟
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Your comprehensive guide from Phoenix, Arizona to the beautiful Peak District, UK. 
            Follow our step-by-step wizard to make your international move smooth and organized.
          </p>
          
          {/* Progress Overview */}
          <ProgressWizard 
            currentStep={stats.completed_steps + 1} 
            totalSteps={stats.total_steps} 
            completedSteps={stats.completed_steps} 
          />
        </div>

        {/* Quick Start Guide */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🚀 Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStartSteps.map((step, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 ${step.urgent ? 'ring-2 ring-red-200' : ''}`}>
                {step.urgent && (
                  <div className="flex items-center mb-3">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      🚨 Urgent
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <Link 
                  to={step.link}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                >
                  {step.action} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total_steps}</div>
            <div className="text-gray-600">Total Steps</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed_steps}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.in_progress}</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.urgent_tasks}</div>
            <div className="text-gray-600">Urgent Tasks</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Ready to Start?</h2>
          <p className="text-gray-600 mb-6">
            Begin your relocation journey with our comprehensive step-by-step guide. Each step is designed to help you progress smoothly towards your move to the Peak District.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/timeline"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
            >
              📅 Start with Timeline
            </Link>
            <Link 
              to="/progress"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
            >
              📊 Track Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Timeline Page with Wizard Steps
const TimelinePage = () => {
  const [timelineData, setTimelineData] = useState({
    full: { steps: [] },
    categories: {}
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fullResponse, categoryResponse] = await Promise.all([
          axios.get(`${API}/timeline/full`),
          axios.get(`${API}/timeline/by-category`)
        ]);
        setTimelineData({
          full: fullResponse.data,
          categories: categoryResponse.data
        });
        
        // Count completed steps
        const completed = fullResponse.data.steps.filter(step => step.is_completed).length;
        setCompletedCount(completed);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
      }
    };
    fetchData();
  }, []);

  const updateStepProgress = async (stepId, completed) => {
    try {
      await axios.post(`${API}/timeline/update-progress`, {
        step_id: stepId,
        completed: completed
      });
      
      // Refresh timeline data
      const [fullResponse, categoryResponse] = await Promise.all([
        axios.get(`${API}/timeline/full`),
        axios.get(`${API}/timeline/by-category`)
      ]);
      setTimelineData({
        full: fullResponse.data,
        categories: categoryResponse.data
      });
      
      // Update completed count
      const newCompleted = fullResponse.data.steps.filter(step => step.is_completed).length;
      setCompletedCount(newCompleted);
      
    } catch (error) {
      console.error('Error updating step progress:', error);
    }
  };

  const categories = Object.keys(timelineData.categories);
  const filteredSteps = activeCategory === 'all' 
    ? timelineData.full.steps 
    : timelineData.categories[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📅 Your Relocation Timeline
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Follow this comprehensive 34-step guide for your move from Phoenix to Peak District
          </p>
          
          <ProgressWizard 
            currentStep={completedCount + 1} 
            totalSteps={timelineData.full.steps.length} 
            completedSteps={completedCount} 
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-100'
              }`}
            >
              🌟 All Steps ({timelineData.full.steps.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 capitalize ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-100'
                }`}
              >
                {category.replace('_', ' ')} ({(timelineData.categories[category] || []).length})
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-6">
          {filteredSteps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl ${
                step.is_completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        step.is_completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {step.is_completed ? '✓' : index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={step.is_completed}
                          onChange={(e) => updateStepProgress(step.id, e.target.checked)}
                          className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <h3 className={`text-xl font-bold transition-all duration-200 ${
                          step.is_completed ? 'text-green-700 line-through' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h3>
                      </label>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
                          {step.category}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                          step.priority === 'high' ? 'bg-red-100 text-red-800' :
                          step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {step.priority} priority
                        </span>
                        {step.due_date && (
                          <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">
                            📅 Due: {new Date(step.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                  
                  {step.required_documents && step.required_documents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">📋 Required Documents:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {step.required_documents.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {step.estimated_cost && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="mr-4">💰 Estimated Cost: {step.estimated_cost}</span>
                      <span>⏱️ Duration: {step.estimated_duration}</span>
                    </div>
                  )}
                </div>
                
                {step.is_completed && (
                  <div className="ml-4 text-green-500 text-2xl">
                    ✅
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSteps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No steps found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Progress Page with Interactive Checklist
const ProgressPage = () => {
  const [progressItems, setProgressItems] = useState([]);
  const [editingNotes, setEditingNotes] = useState(null);
  const [tempNote, setTempNote] = useState('');

  useEffect(() => {
    fetchProgressItems();
  }, []);

  const fetchProgressItems = async () => {
    try {
      const response = await axios.get(`${API}/progress/items`);
      setProgressItems(response.data.items);
    } catch (error) {
      console.error('Error fetching progress items:', error);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      await axios.put(`${API}/progress/items/${itemId}`, {
        status: newStatus
      });
      fetchProgressItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const toggleSubtask = async (itemId, subtaskIndex) => {
    try {
      await axios.post(`${API}/progress/items/${itemId}/subtasks/${subtaskIndex}/toggle`);
      fetchProgressItems();
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const saveNotes = async (itemId, notes) => {
    try {
      await axios.put(`${API}/progress/items/${itemId}`, {
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📊 Track Your Progress
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Interactive checklist to track your relocation tasks and milestones
          </p>
          
          <ProgressWizard 
            currentStep={completedItems + 1} 
            totalSteps={totalItems} 
            completedSteps={completedItems} 
          />
        </div>

        {/* Progress Items */}
        <div className="space-y-6">
          {progressItems.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                    item.status === 'completed' ? 'bg-green-500' : 
                    item.status === 'in_progress' ? 'bg-yellow-500' :
                    item.status === 'blocked' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={item.status}
                    onChange={(e) => updateItemStatus(item.id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{item.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Subtasks Progress</span>
                  <span className="text-sm text-gray-500">
                    {item.subtasks.filter(st => st.completed).length}/{item.subtasks.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(item.subtasks.filter(st => st.completed).length / item.subtasks.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Interactive Subtasks */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900">📋 Task Checklist:</h3>
                {item.subtasks.map((subtask, index) => (
                  <label key={index} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(item.id, index)}
                      className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                    />
                    <span className={`text-sm transition-all duration-200 group-hover:text-blue-600 ${
                      subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}>
                      {subtask.task}
                    </span>
                    {subtask.completed && (
                      <span className="ml-2 text-green-500">✅</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Notes Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Notes:</h3>
                {editingNotes === item.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Add your notes here..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveNotes(item.id, tempNote)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 text-sm font-medium"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingNotes(null);
                          setTempNote('');
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 text-sm font-medium"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {item.notes || 'No notes added yet. Click "Edit Notes" to add your thoughts and updates.'}
                    </p>
                    <button
                      onClick={() => startEditingNotes(item)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      ✏️ Edit Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {progressItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Progress Items Yet</h2>
            <p className="text-gray-600">Start by completing steps in your timeline to see progress items here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Visa & Legal Page with Interactive Document Checklist
const VisaPage = () => {
  const [visaRequirements, setVisaRequirements] = useState({ visa_types: [] });
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [documentChecklist, setDocumentChecklist] = useState({});

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await axios.get(`${API}/visa/requirements`);
        setVisaRequirements(response.data);
        if (response.data.visa_types.length > 0) {
          setSelectedVisa(response.data.visa_types[0]);
        }
      } catch (error) {
        console.error('Error fetching visa data:', error);
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
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading visa information...</div>
    </div>;
  }

  const progress = getDocumentProgress();
  const progressPercentage = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📋 Visa & Legal Requirements
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete documentation checklist for your UK visa application
          </p>
          
          {/* Document Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📄 Document Collection Progress</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-700">Documents Ready</span>
              <span className="text-sm font-medium text-blue-700">{progress.checked} of {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              {progress.checked === progress.total && progress.total > 0 
                ? "🎉 Congratulations! All documents are ready for submission." 
                : `Keep going! You have ${progress.total - progress.checked} documents left to collect.`
              }
            </p>
          </div>
        </div>

        {/* Visa Type Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Select Your Visa Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visaRequirements.visa_types.map((visa) => (
              <button
                key={visa.id}
                onClick={() => setSelectedVisa(visa)}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  selectedVisa?.id === visa.id
                    ? 'bg-blue-600 text-white transform scale-105'
                    : 'bg-white text-gray-900 hover:bg-blue-50 hover:scale-102'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{visa.visa_type}</h3>
                <p className="text-sm opacity-90">Fee: {visa.fee}</p>
                <p className="text-sm opacity-90">Processing: {visa.processing_time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Visa Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Visa Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 {selectedVisa.visa_type} Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Application Fee:</span>
                <span className="text-xl font-bold text-blue-600">{selectedVisa.fee}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Processing Time:</span>
                <span className="text-xl font-bold text-green-600">{selectedVisa.processing_time}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Requirements:</h3>
                <ul className="space-y-1">
                  {selectedVisa.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 Application Process
            </h2>
            <div className="space-y-4">
              {selectedVisa.application_process.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Document Checklist */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ✅ Interactive Document Checklist
          </h2>
          <p className="text-gray-600 mb-6">
            Check off each document as you collect it. This will help you track your progress and ensure you have everything needed for your application.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(selectedVisa.required_documents).map(([category, documents], categoryIndex) => {
              const colors = [
                'border-l-blue-500 bg-blue-50',
                'border-l-green-500 bg-green-50',
                'border-l-purple-500 bg-purple-50',
                'border-l-yellow-500 bg-yellow-50',
                'border-l-red-500 bg-red-50',
                'border-l-indigo-500 bg-indigo-50'
              ];
              
              const categoryDocs = documents.filter(doc => doc.trim() !== '');
              const checkedInCategory = categoryDocs.filter((_, docIndex) => 
                documentChecklist[`${category}_${docIndex}`]
              ).length;
              
              return (
                <div key={category} className={`rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl ${colors[categoryIndex % colors.length]}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 capitalize">
                      {category.replace('_', ' ')}
                    </h3>
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                      {checkedInCategory}/{categoryDocs.length}
                    </span>
                  </div>
                  
                  <ul className="space-y-3">
                    {categoryDocs.map((doc, docIndex) => {
                      const isChecked = documentChecklist[`${category}_${docIndex}`];
                      return (
                        <li key={docIndex} className="flex items-start">
                          <label className="flex items-start cursor-pointer group w-full">
                            <input
                              type="checkbox"
                              checked={isChecked || false}
                              onChange={() => toggleDocument(category, docIndex)}
                              className="mr-3 mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                            />
                            <span className={`text-sm transition-all duration-200 group-hover:text-blue-600 ${
                              isChecked ? 'line-through text-gray-500' : 'text-gray-700'
                            }`}>
                              {doc}
                            </span>
                            {isChecked && (
                              <span className="ml-2 text-green-500">✅</span>
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Next Steps</h2>
            <p className="text-gray-600 mb-6">
              Ready to move forward with your visa application? Check out these helpful resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
                🌐 Visit UK.gov Official Site
              </button>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium">
                📱 Book Biometric Appointment
              </button>
              <Link 
                to="/timeline"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
              >
                📅 View Full Timeline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employment Page with Job Filtering
const EmploymentPage = () => {
  const [jobsData, setJobsData] = useState({ jobs: [], categories: [], job_types: [] });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    job_type: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API}/jobs/listings`);
        setJobsData(response.data);
        setFilteredJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobsData.jobs;

    if (filters.category !== 'all') {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.job_type !== 'all') {
      filtered = filtered.filter(job => job.job_type === filters.job_type);
    }

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [filters, jobsData]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            💼 Peak District Job Opportunities
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover {jobsData.jobs.length} real job opportunities in your new home region
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Filter Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Job title, company, location..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {jobsData.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={filters.job_type}
                onChange={(e) => updateFilter('job_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {jobsData.job_types.map(type => (
                  <option key={type} value={type}>{type.replace('-', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: 'all', job_type: 'all', search: '' })}
                className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition duration-300 font-medium"
              >
                🔄 Reset Filters
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600">
              Showing {filteredJobs.length} of {jobsData.jobs.length} jobs
            </span>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-102">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-lg text-blue-600 font-semibold">{job.company}</p>
                  <p className="text-gray-600">📍 {job.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{job.salary}</div>
                  <div className="text-sm text-gray-500">{job.job_type.replace('-', ' ')}</div>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {job.category}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {job.job_type.replace('-', ' ')}
                </span>
                {job.remote_work && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    🏠 Remote Available
                  </span>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  {job.requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {req}
                    </li>
                  ))}
                  {job.requirements.length > 3 && (
                    <li className="text-gray-500 italic">
                      +{job.requirements.length - 3} more requirements
                    </li>
                  )}
                </ul>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Posted: {new Date(job.posted_date).toLocaleDateString()}
                  </div>
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Found</h2>
            <p className="text-gray-600">Try adjusting your search criteria or browse all available positions.</p>
            <button
              onClick={() => setFilters({ category: 'all', job_type: 'all', search: '' })}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
            >
              🔄 Show All Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Housing Page
const HousingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-8">
          🏘️ Housing Guide: Phoenix vs Peak District
        </h1>
        <div className="text-center text-gray-600 mb-8">
          Comprehensive comparison to help you find your perfect new home
        </div>
      </div>
    </div>
  );
};

// Resources Page
const ResourcesPage = () => {
  const [resources, setResources] = useState({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${API}/resources/all`);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-8">
          🔗 Helpful Resources
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(resources).map(([category, items], index) => (
            <div key={category} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                {category.replace('_', ' & ')}
              </h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition duration-300"
                  >
                    <h3 className="font-semibold text-blue-600">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Logistics Page
const LogisticsPage = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(`${API}/logistics/providers`);
        setProviders(response.data.providers);
      } catch (error) {
        console.error('Error fetching logistics providers:', error);
      }
    };
    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-8">
          📦 Moving & Logistics
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(provider => (
            <div key={provider.id} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{provider.company_name}</h2>
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < provider.rating ? "★" : "☆"}>
                      {i < provider.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({provider.rating}/5)</span>
              </div>
              <p className="text-gray-600 mb-4">{provider.description}</p>
              <div className="space-y-2">
                <p><strong>Services:</strong> {provider.service_types.join(', ')}</p>
                <p><strong>Est. Cost:</strong> {provider.estimated_cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analytics Page
const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-8">
          📈 Progress Analytics
        </h1>
        <div className="text-center text-gray-600">
          Detailed analytics and insights about your relocation progress
        </div>
      </div>
    </div>
  );
};

// Authentication Components
const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(credentials.username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🏔️ Relocate Me
          </h1>
          <p className="text-gray-600">Phoenix → Peak District</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login to Your Journey
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");

  const handleLogin = (username) => {
    setUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser("");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <AuthenticatedApp user={user} onLogout={handleLogout} />;
};

const AuthenticatedApp = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <>
      <Navigation user={user} onLogout={onLogout} currentPath={location.pathname} />
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/visa" element={<VisaPage />} />
        <Route path="/employment" element={<EmploymentPage />} />
        <Route path="/housing" element={<HousingPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;

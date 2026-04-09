/**
 * WorkerDashboard Component
 * UPDATED: Created specifically for workers to manage assigned complaints
 * UPDATED: Shows only complaints assigned to the logged-in worker
 * UPDATED: Includes filters, statistics, and quick actions
 * UPDATED: Optimized for worker workflow
 * 
 * @description Dashboard for workers to view and manage their assigned complaints
 * @version 1.0.0 (New component for complaint management)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Wrench,
  Calendar,
  Star,
  UserCheck
} from 'lucide-react';
import { getAssignedComplaints, getWorkerDashboardStats } from '../apicalls/workerapi';
import SubComplaintCard from '../components/SubComplaintCard';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.user);
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    page: 1,
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch dashboard statistics
  const { 
    data: statsData, 
    isLoading: statsLoading, 
    isError: statsError 
  } = useQuery({
    queryKey: ['worker-dashboard-stats', user?.user_id],
    queryFn: () => getWorkerDashboardStats(),
    enabled: !!user?.user_id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch assigned complaints
  const { 
    data: complaintsData, 
    isLoading: complaintsLoading, 
    isError: complaintsError,
    refetch
  } = useQuery({
    queryKey: ['assigned-complaints', user?.user_id, filters],
    queryFn: () => getAssignedComplaints(filters),
    enabled: !!user?.user_id,
    staleTime: 2 * 60 * 1000,
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search through complaints client-side
    refetch();
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(['assigned-complaints', user?.user_id]);
    queryClient.invalidateQueries(['worker-dashboard-stats', user?.user_id]);
    toast.info("Refreshing dashboard...");
  };

  const getStatusCount = (status) => {
    if (!complaintsData?.complaints) return 0;
    return complaintsData.complaints.filter(c => c.status === status).length;
  };

  // Statistics cards data
  const statsCards = [
    {
      title: 'Total Assigned',
      value: statsData?.statistics?.total_assigned || 0,
      icon: ClipboardList,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'In Progress',
      value: statsData?.statistics?.in_progress || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Resolved',
      value: statsData?.statistics?.resolved || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Escalated',
      value: statsData?.statistics?.escalated || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      label: 'Resolution Rate',
      value: statsData?.statistics?.total_assigned > 0 
        ? Math.round((statsData.statistics.resolved / statsData.statistics.total_assigned) * 100) 
        : 0,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Avg. Response Time',
      value: 'N/A',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Efficiency Score',
      value: statsData?.statistics?.total_assigned > 0 
        ? Math.round(((statsData.statistics.resolved + statsData.statistics.closed) / statsData.statistics.total_assigned) * 100) 
        : 0,
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  if (statsLoading || complaintsLoading) {
    return <LoadingPage status="load" message="Loading your dashboard..." />;
  }

  if (statsError || complaintsError) {
    return <ErrorPage type="error" message="Failed to load dashboard data. Please refresh." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome back, {user?.name?.split(' ')[0] || 'Worker'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your assigned complaints today.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                onClick={() => navigate('/worker/complaints')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ClipboardList className="h-4 w-4" />
                View All Complaints
              </button>
            </div>
          </div>
          
          {/* Department Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
            <Wrench className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Department: {user?.department || 'Not Assigned'}
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>
                    {typeof metric.value === 'number' ? `${metric.value}%` : metric.value}
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color} opacity-50`} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
              <svg className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {showFilters && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Categories</option>
                  <option value="Network">Network</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="PC Maintenance">PC Maintenance</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electricity">Electricity</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ status: '', priority: '', category: '', page: 1, limit: 10 });
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints by title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Assigned Complaints</h2>
            <p className="text-sm text-gray-500">
              Showing {complaintsData?.complaints?.length || 0} of {complaintsData?.pagination?.total || 0} complaints
            </p>
          </div>

          {complaintsData?.complaints?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Complaints Assigned</h3>
              <p className="text-gray-500">
                You don't have any complaints assigned to you at the moment.
              </p>
            </div>
          ) : (
            <>
              {complaintsData?.complaints.map((complaint) => (
                <SubComplaintCard
                  key={complaint.complaint_id}
                  complaint={complaint}
                  onRefresh={handleRefresh}
                />
              ))}

              {/* Pagination */}
              {complaintsData?.pagination && complaintsData.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {filters.page} of {complaintsData.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={filters.page === complaintsData.pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <UserCheck className="h-8 w-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Worker Tips</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Update complaint status as you make progress</li>
                <li>• Add clear remarks for students to understand the resolution</li>
                <li>• Escalate complaints that need higher authority intervention</li>
                <li>• Resolve complaints within the expected timeframe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
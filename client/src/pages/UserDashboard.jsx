/**
 * UserDashboard Component
 * UPDATED: Shows all complaints registered by the user
 * UPDATED: Each complaint has a button to view details
 * UPDATED: Includes add complaint button with popup form
 * UPDATED: Profile card removed from dashboard - only accessible via profile icon
 * UPDATED: Uses useLogoutUser hook for proper logout functionality
 *
 * @description Dashboard for users to view and manage their complaints
 * @version 3.4.0 (Integrated useLogoutUser hook)
 */

import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  PlusCircle,
  X,
  AlertTriangle,
  User,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';

import {
  getMyComplaints,
  getDashboardStats,
  createComplaint,
} from '../apicalls/userapi';
import UserProfileCard from '../components/UserProfileCard';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import useLogoutUser from '../utils/useLogoutUser';

Chart.register(...registerables);

const UserDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.user);
  const logout = useLogoutUser(); // Use the logout hook
  const [showProfile, setShowProfile] = useState(false);
  const [showAddComplaint, setShowAddComplaint] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    date: '',
  });

  // Fetch user's complaints
  const {
    data: complaintsData,
    isLoading: complaintsLoading,
    isError: complaintsError,
  } = useQuery({
    queryKey: ['my-complaints', user?.user_id, filters],
    queryFn: () => getMyComplaints({ ...filters, page: 1, limit: 100 }),
    enabled: !!user?.user_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 5 * 60 * 1000,
  });

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['user-dashboard-stats', user?.user_id],
    queryFn: () => getDashboardStats(),
    enabled: !!user?.user_id,
    staleTime: 5 * 60 * 1000,
  });

  // Create complaint mutation
  const createComplaintMutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-complaints']);
      queryClient.invalidateQueries(['user-dashboard-stats']);
      setShowAddComplaint(false);
      toast.success('Complaint submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit complaint');
    },
  });

  const complaintList = complaintsData?.complaints || [];

  // Calculate statistics from complaints
  const totalComplaints = complaintList.length;
  const pendingCount = complaintList.filter((c) => c.status === 'Submitted').length;
  const inProgressCount = complaintList.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaintList.filter((c) => c.status === 'Resolved').length;
  const escalatedCount = complaintList.filter((c) => c.status === 'Escalated').length;
  const closedCount = complaintList.filter((c) => c.status === 'Closed').length;

  const stats = statsData?.statistics || {
    total_complaints: totalComplaints,
    pending: pendingCount,
    in_progress: inProgressCount,
    resolved: resolvedCount,
    escalated: escalatedCount,
    closed: closedCount,
  };

  const statusChartData = {
    labels: ['Submitted', 'In Progress', 'Resolved', 'Escalated', 'Closed'],
    datasets: [
      {
        data: [pendingCount, inProgressCount, resolvedCount, escalatedCount, closedCount],
        backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#6B7280'],
        hoverOffset: 4,
      },
    ],
  };

  const monthlyCounts = Array(12).fill(0);
  complaintList.forEach((complaint) => {
    const date = new Date(complaint.created_at);
    const month = date.getMonth();
    if (!isNaN(month)) monthlyCounts[month]++;
  });

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Complaints Filed',
        data: monthlyCounts,
        backgroundColor: '#8B5CF6',
        borderRadius: 4,
      },
    ],
  };

  const resolutionRate =
    stats.total_complaints > 0
      ? Math.round((stats.resolved / stats.total_complaints) * 100)
      : 0;

  const getStatusBadgeColor = (status) => {
    const colors = {
      Submitted: 'bg-yellow-100 text-yellow-800',
      Assigned: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      Resolved: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      Escalated: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get random gradient color based on user name
  const getAvatarGradient = () => {
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-blue-500 to-cyan-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-teal-500 to-green-600',
    ];
    const index = (user?.name?.length || 0) % gradients.length;
    return gradients[index];
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout(); // This will handle token removal, state reset, toast, and navigation to '/'
  };

  if (complaintsLoading || statsLoading) {
    return <LoadingPage status="load" message="Loading your dashboard..." />;
  }

  if (complaintsError) {
    return <ErrorPage type="error" message="Failed to load dashboard data" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 pt-20">
      {/* Profile Modal - only shown when clicking on profile from dropdown */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <UserProfileCard setShowProfile={setShowProfile} />
          </div>
        </div>
      )}

      {showAddComplaint && (
        <AddComplaintModal
          setShowAddComplaint={setShowAddComplaint}
          onSubmit={createComplaintMutation}
          isLoading={createComplaintMutation.isPending}
        />
      )}

      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          setSelectedComplaint={setSelectedComplaint}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header with Profile Icon */}
        <div className="mb-6 flex justify-between items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">My Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base truncate">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {/* Add Complaint Button */}
            <button
              onClick={() => setShowAddComplaint(true)}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Add Complaint</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Profile Icon / Avatar Button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className={`
                  flex items-center justify-center h-10 w-10 rounded-full 
                  bg-gradient-to-br ${getAvatarGradient()} 
                  text-white font-semibold shadow-md 
                  hover:shadow-lg transition-all duration-200
                  group-hover:scale-105
                `}>
                  <span className="text-sm">{getUserInitials()}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`
                          flex items-center justify-center h-12 w-12 rounded-full 
                          bg-gradient-to-br ${getAvatarGradient()} 
                          text-white font-semibold
                        `}>
                          <span className="text-base">{getUserInitials()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          <p className="text-xs text-purple-600 mt-0.5 capitalize">{user?.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowProfile(true);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add settings navigation if needed
                          toast.info('Settings coming soon');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add help navigation if needed
                          toast.info('Help section coming soon');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <HelpCircle className="h-4 w-4 text-gray-500" />
                        <span>Help & Support</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content - No Profile Card on left */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
            <StatCard
              label="Total"
              value={stats.total_complaints}
              color="text-gray-800"
              Icon={ClipboardList}
              iconColor="text-purple-500"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              color="text-yellow-600"
              Icon={Clock}
              iconColor="text-yellow-500"
            />
            <StatCard
              label="In Progress"
              value={stats.in_progress}
              color="text-blue-600"
              Icon={AlertCircle}
              iconColor="text-blue-500"
            />
            <StatCard
              label="Resolved"
              value={stats.resolved}
              color="text-green-600"
              Icon={CheckCircle}
              iconColor="text-green-500"
            />
            <StatCard
              label="Escalated"
              value={stats.escalated}
              color="text-red-600"
              Icon={AlertTriangle}
              iconColor="text-red-500"
            />
          </div>

          {/* Resolution Rate Card */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-purple-100 text-sm">Your Resolution Rate</p>
                <p className="text-3xl font-bold">{resolutionRate}%</p>
                <p className="text-purple-100 text-sm mt-1">
                  {stats.resolved} out of {stats.total_complaints} complaints resolved
                </p>
              </div>
              <TrendingUp className="h-12 w-12 opacity-50 shrink-0" />
            </div>
            <div className="w-full bg-purple-800/40 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>

          {/* Charts side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
              <div className="h-64">
                <Bar
                  data={activityData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, ticks: { precision: 0 } },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Distribution
              </h3>
              <div className="h-64">
                <Doughnut
                  data={statusChartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, padding: 10, font: { size: 11 } },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Escalated">Escalated</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Network">Network</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Carpentry">Carpentry</option>
                <option value="PC Maintenance">PC Maintenance</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electricity">Electricity</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                onClick={() =>
                  setFilters({ status: '', category: '', priority: '', date: '' })
                }
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Complaints List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-semibold text-gray-800">My Complaints</h3>
              <span className="text-sm text-gray-500">
                Total: {complaintList.length} complaints
              </span>
            </div>

            {complaintList.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No complaints found</p>
                <button
                  onClick={() => setShowAddComplaint(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Your First Complaint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {complaintList.map((complaint) => (
                  <ComplaintCard
                    key={complaint.complaint_id}
                    complaint={complaint}
                    onViewDetails={() => setSelectedComplaint(complaint)}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable stat card
const StatCard = ({ label, value, color, Icon, iconColor }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition min-w-0">
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <h3 className="text-gray-500 text-xs md:text-sm font-medium truncate">{label}</h3>
        <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <Icon className={`h-7 w-7 md:h-8 md:w-8 ${iconColor} opacity-70 shrink-0`} />
    </div>
  </div>
);

// Complaint Card Component
const ComplaintCard = ({ complaint, onViewDetails, getStatusBadgeColor, getPriorityColor }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h4 className="font-semibold text-gray-800 break-words">{complaint.title}</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>
            <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority?.toUpperCase()} Priority
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            <span>ID: #{complaint.complaint_id}</span>
            <span>Category: {complaint.category}</span>
            <span>Created: {new Date(complaint.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 shrink-0 w-full sm:w-auto"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

// Add Complaint Modal Component
const AddComplaintModal = ({ setShowAddComplaint, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }
    onSubmit.mutate(formData);
  };

  const categories = [
    'Network',
    'Cleaning',
    'Carpentry',
    'PC Maintenance',
    'Plumbing',
    'Electricity',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Add New Complaint</h2>
          <button
            onClick={() => setShowAddComplaint(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief title of your complaint"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="5"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Detailed description of your complaint"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddComplaint(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Complaint Details Modal Component
const ComplaintDetailsModal = ({ complaint, setSelectedComplaint }) => {
  const getStatusDetails = (status) => {
    const details = {
      Submitted: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
      Assigned: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
      'In Progress': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
      Resolved: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
      Closed: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
      Escalated: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    };
    return details[status] || details['Submitted'];
  };

  const statusStyle = getStatusDetails(complaint.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Complaint Details</h2>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className={`p-4 rounded-lg ${statusStyle.bg} ${statusStyle.border} border`}>
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold break-words">{complaint.title}</h3>
                <p className="text-sm text-gray-600 mt-1">ID: #{complaint.complaint_id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.text} bg-white/60 shrink-0`}
              >
                {complaint.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Category</label>
              <p className="font-medium">{complaint.category}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Priority</label>
              <p
                className={`font-medium capitalize ${
                  complaint.priority === 'high'
                    ? 'text-red-600'
                    : complaint.priority === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {complaint.priority}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Created At</label>
              <p className="font-medium">{new Date(complaint.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Last Updated</label>
              <p className="font-medium">
                {complaint.updated_at
                  ? new Date(complaint.updated_at).toLocaleString()
                  : '—'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Description</label>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap break-words">
              {complaint.description}
            </p>
          </div>

          {complaint.assigned_to && (
            <div>
              <label className="text-xs text-gray-500">Assigned To</label>
              <p className="font-medium">Worker ID: {complaint.assigned_to}</p>
            </div>
          )}

          {complaint.remark && (
            <div className={`p-3 rounded-lg ${statusStyle.bg} border ${statusStyle.border}`}>
              <label className="text-xs text-gray-500">Remark</label>
              <p className="mt-1 text-gray-700">{complaint.remark}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
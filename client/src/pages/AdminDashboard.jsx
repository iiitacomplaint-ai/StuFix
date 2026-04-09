/**
 * AdminDashboard Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Removed police-specific stats
 * UPDATED: Added complaint management statistics
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Integrated with new admin API
 * UPDATED: Added worker and complaint management cards
 * 
 * @description Admin dashboard for managing complaints, workers, and system analytics
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  UserPlus,
  Eye,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';
import { getAllComplaints, getWorkers } from '../apicalls/adminapi';
import UserProfileCard from '../components/UserProfileCard';

Chart.register(...registerables);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    submitted: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    escalated: 0
  });
  const [workerCount, setWorkerCount] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch complaints
      const complaintsResult = await getAllComplaints({ page: 1, limit: 100 });
      
      if (complaintsResult.success && complaintsResult.complaints) {
        const complaints = complaintsResult.complaints;
        
        // Calculate statistics
        const stats = {
          total: complaints.length,
          submitted: complaints.filter(c => c.status === 'Submitted').length,
          assigned: complaints.filter(c => c.status === 'Assigned').length,
          in_progress: complaints.filter(c => c.status === 'In Progress').length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
          closed: complaints.filter(c => c.status === 'Closed').length,
          escalated: complaints.filter(c => c.status === 'Escalated').length
        };
        setComplaintStats(stats);

        // Calculate monthly statistics
        const monthMap = {};
        complaints.forEach(complaint => {
          const date = new Date(complaint.created_at);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
        });
        
        const monthlyData = Object.entries(monthMap).map(([month, total]) => ({
          month,
          total
        })).sort((a, b) => a.month.localeCompare(b.month));
        
        setMonthlyStats(monthlyData);
      }

      // Fetch workers count
      const workersResult = await getWorkers({});
      if (workersResult.success) {
        setWorkerCount(workersResult.count || workersResult.workers?.length || 0);
      }

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Chart data for status distribution
  const statusChartData = {
    labels: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Escalated'],
    datasets: [{
      data: [
        complaintStats.submitted,
        complaintStats.assigned,
        complaintStats.in_progress,
        complaintStats.resolved,
        complaintStats.closed,
        complaintStats.escalated
      ],
      backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#6B7280', '#EF4444'],
      hoverOffset: 4
    }]
  };

  // Chart data for monthly activity
  const getMonthlyChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCounts = Array(12).fill(0);
    
    monthlyStats.forEach(entry => {
      if (entry?.month) {
        const [year, month] = entry.month.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12) {
          monthlyCounts[monthIndex] = Number(entry.total) || 0;
        }
      }
    });
    
    return {
      labels: months,
      datasets: [{
        label: 'Complaints Submitted',
        data: monthlyCounts,
        backgroundColor: '#8B5CF6',
        borderRadius: 4
      }]
    };
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Complaints',
      value: complaintStats.total,
      icon: ClipboardList,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Workers',
      value: workerCount,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'In Progress',
      value: complaintStats.in_progress,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Resolved',
      value: complaintStats.resolved + complaintStats.closed,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  const resolutionRate = complaintStats.total > 0 
    ? Math.round(((complaintStats.resolved + complaintStats.closed) / complaintStats.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Profile Card */}
          <UserProfileCard setShowProfile={() => {}} />

          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
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

            {/* Resolution Rate Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-100 text-sm">Overall Resolution Rate</p>
                  <p className="text-3xl font-bold">{resolutionRate}%</p>
                  <p className="text-purple-100 text-sm mt-1">
                    {complaintStats.resolved + complaintStats.closed} out of {complaintStats.total} complaints resolved
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 opacity-50" />
              </div>
              <div className="w-full bg-purple-500 rounded-full h-2 mt-3">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resolutionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Monthly Activity Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Monthly Complaint Activity
              </h3>
              <div className="h-64">
                <Bar
                  data={getMonthlyChartData()}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                      }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            </div>

            {/* Two Column Layout for Charts and Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Distribution Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Status Distribution</h3>
                <div className="h-64">
                  <Doughnut
                    data={statusChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/admin/workers')}
                    className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-700">Manage Workers</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/complaints')}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">View All Complaints</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/analytics')}
                    className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-700">View Analytics</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/settings')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-700">System Settings</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ChevronRight Icon component
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default AdminDashboard;
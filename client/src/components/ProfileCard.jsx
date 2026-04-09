/**
 * ProfileCard Component
 * UPDATED: Converted from verification profile to simple user profile view
 * UPDATED: Removed Aadhaar verification and document upload
 * UPDATED: Simplified for complaint system users (students/staff)
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Removed verification status logic
 * UPDATED: Added complaint statistics for the user
 * 
 * @description Profile card component for viewing user profile and complaint statistics
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  Building2
} from 'lucide-react';
import { getMyComplaints } from '../apicalls/userapi';

const ProfileCard = ({ onClose }) => {
  const user = useSelector((state) => state.user.user);
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    submitted: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    escalated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintStats();
  }, []);

  const fetchComplaintStats = async () => {
    try {
      const result = await getMyComplaints({ page: 1, limit: 100 });
      if (result.success && result.complaints) {
        const complaints = result.complaints;
        setComplaintStats({
          total: complaints.length,
          submitted: complaints.filter(c => c.status === 'Submitted').length,
          assigned: complaints.filter(c => c.status === 'Assigned').length,
          inProgress: complaints.filter(c => c.status === 'In Progress').length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
          closed: complaints.filter(c => c.status === 'Closed').length,
          escalated: complaints.filter(c => c.status === 'Escalated').length
        });
      }
    } catch (error) {
      console.error("Error fetching complaint stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            {/* Profile Avatar */}
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-bold text-white">
                {getInitials(user?.name)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
              <p className="text-purple-100 flex items-center gap-1 mt-1">
                <User className="h-4 w-4" />
                {user?.role === 'user' ? 'Student' : user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">{user?.phone_number || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-800">{formatDate(user?.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">User ID</p>
                  <p className="font-medium text-gray-800">#{user?.user_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Statistics */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-600" />
              Complaint Statistics
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading statistics...</p>
              </div>
            ) : (
              <>
                {/* Total Complaints */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">{complaintStats.total}</p>
                    <p className="text-xs text-gray-500">Total Complaints</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-yellow-600">{complaintStats.submitted}</p>
                    <p className="text-xs text-gray-500">Submitted</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{complaintStats.assigned + complaintStats.inProgress}</p>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">{complaintStats.resolved + complaintStats.closed}</p>
                    <p className="text-xs text-gray-500">Resolved/Closed</p>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Status Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Submitted</span>
                      <span className="font-medium">{complaintStats.submitted}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(complaintStats.submitted / complaintStats.total) * 100 || 0}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Assigned / In Progress</span>
                      <span className="font-medium">{complaintStats.assigned + complaintStats.inProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${((complaintStats.assigned + complaintStats.inProgress) / complaintStats.total) * 100 || 0}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Resolved / Closed</span>
                      <span className="font-medium">{complaintStats.resolved + complaintStats.closed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${((complaintStats.resolved + complaintStats.closed) / complaintStats.total) * 100 || 0}%` }}></div>
                    </div>
                    
                    {complaintStats.escalated > 0 && (
                      <>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-600">Escalated</span>
                          <span className="font-medium text-red-600">{complaintStats.escalated}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(complaintStats.escalated / complaintStats.total) * 100 || 0}%` }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                window.location.href = '/user/complaints';
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
            >
              View All Complaints
            </button>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/user/new-complaint';
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
            >
              Submit New Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
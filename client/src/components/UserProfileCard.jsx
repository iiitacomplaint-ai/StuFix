/**
 * UserProfileCard Component
 * UPDATED: Converted from citizen/police/admin profile to unified user profile
 * UPDATED: Removed police and admin specific details
 * UPDATED: Simplified for complaint system users (students/staff)
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Removed verification status logic
 * UPDATED: Added complaint statistics
 * 
 * @description Profile card component for users to view their profile and complaint statistics
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getMyComplaints } from "../apicalls/userapi";
import { Mail, Phone, Calendar, MapPin, ClipboardList, CheckCircle, Clock, AlertCircle, X } from "lucide-react";

const UserProfileCard = ({ setShowProfile }) => {
  const user = useSelector((state) => state.user.user);
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    submitted: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
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
          closed: complaints.filter(c => c.status === 'Closed').length
        });
      }
    } catch (error) {
      console.error("Error fetching complaint stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full lg:w-1/3 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        
        {/* Profile Header with Gradient Background */}
        <div className="relative bg-gradient-to-br from-purple-700 to-indigo-600 p-8 text-center text-white overflow-hidden">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff33 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Profile Avatar */}
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-indigo-500 overflow-hidden relative z-10 shadow-lg ring-4 ring-purple-300/50 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {getInitials(user?.name)}
            </span>
          </div>
          
          {/* Name and Role */}
          <h2 className="text-3xl font-extrabold mt-5 relative z-10 drop-shadow-md">
            {user?.name || "User"}
          </h2>
          <p className="text-purple-200 text-lg font-medium relative z-10 mt-1 capitalize">
            {user?.role === 'user' ? 'Student' : user?.role || 'User'}
          </p>
        </div>

        {/* Profile Details Section */}
        <div className="p-8 space-y-6">
          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </h3>
              <a
                href={`mailto:${user?.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-md mt-1 block truncate"
              >
                {user?.email || "N/A"}
              </a>
            </div>

            {/* Phone */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone
              </h3>
              <a
                href={`tel:${user?.phone_number}`}
                className="text-gray-800 text-md mt-1 block hover:text-green-700 transition-colors duration-200"
              >
                {user?.phone_number || "N/A"}
              </a>
            </div>
          </div>

          {/* Member Since */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member Since
            </h3>
            <p className="text-gray-800 text-md mt-1">
              {formatDate(user?.created_at)}
            </p>
          </div>

          {/* Complaint Statistics */}
          <div className="bg-purple-50 bg-opacity-70 rounded-lg p-5 border border-purple-200 shadow-sm">
            <h3 className="text-md font-bold text-purple-800 mb-3 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-600" />
              Complaint Statistics
            </h3>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">Loading stats...</p>
              </div>
            ) : (
              <>
                {/* Total Complaints */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">{complaintStats.total}</p>
                    <p className="text-xs text-gray-500">Total Complaints</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">{complaintStats.resolved + complaintStats.closed}</p>
                    <p className="text-xs text-gray-500">Resolved/Closed</p>
                  </div>
                </div>

                {/* Status Breakdown */}
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
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowProfile(false)}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-lg font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
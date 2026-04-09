/**
 * WorkerCard Component
 * UPDATED: Converted from police personnel card to worker card for complaint system
 * UPDATED: Changed fields to match worker schema (department, phone_number)
 * UPDATED: Removed police-specific fields (badge_number, rank, station, etc.)
 * UPDATED: Added worker statistics (assigned complaints, resolved, pending)
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Added delete worker functionality
 * 
 * @description Card component displaying worker information for admin management
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import { useState, useEffect } from "react";
import { Mail, Phone, User, Calendar, Briefcase, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react";
import { deleteWorker } from "../apicalls/adminapi";
import ConfirmationModal from "./ConfirmationModal";
import { toast } from "react-toastify";

const WorkerCard = ({ worker, setWorkersList, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workerStats, setWorkerStats] = useState({
    totalAssigned: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0
  });

  const {
    user_id,
    name,
    email,
    phone_number,
    department,
    created_at,
  } = worker;

  // Calculate years of service
  const calculateYearsOfService = (joinDate) => {
    const today = new Date();
    const join = new Date(joinDate);
    let years = today.getFullYear() - join.getFullYear();
    const monthDiff = today.getMonth() - join.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < join.getDate())) {
      years--;
    }
    return years;
  };

  const yearsOfService = calculateYearsOfService(created_at);
  const joinDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Department color mapping
  const departmentColors = {
    'Network': 'bg-blue-100 text-blue-800 border-blue-200',
    'Cleaning': 'bg-green-100 text-green-800 border-green-200',
    'Carpentry': 'bg-orange-100 text-orange-800 border-orange-200',
    'PC Maintenance': 'bg-purple-100 text-purple-800 border-purple-200',
    'Plumbing': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Electricity': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const departmentColor = departmentColors[department] || 'bg-gray-100 text-gray-800 border-gray-200';

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteWorker(user_id);
      if (result.success) {
        toast.success(`Worker ${name} deleted successfully`);
        setWorkersList((prevList) => prevList.filter(worker => worker.user_id !== user_id));
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.message || "Failed to delete worker");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Error deleting worker");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Get status icon and color
  const getStatusInfo = () => {
    if (workerStats.pending > 5) {
      return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", text: "Overloaded" };
    } else if (workerStats.pending > 2) {
      return { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", text: "Moderate Load" };
    } else {
      return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", text: "Available" };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full max-w-5xl mx-auto p-6 border border-slate-200/50 group overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-2xl"></div>

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 group-hover:text-purple-700 transition-colors duration-300">
                {name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-600" />
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${departmentColor}`}>
                  {department}
                </span>
              </p>
            </div>
          </div>

          <div className={`${statusInfo.bg} ${statusInfo.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm flex-shrink-0`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.text}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Briefcase className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-slate-800">{workerStats.totalAssigned}</p>
            <p className="text-xs text-slate-500">Assigned</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-slate-800">{workerStats.resolved}</p>
            <p className="text-xs text-slate-500">Resolved</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-lg font-bold text-slate-800">{workerStats.inProgress}</p>
            <p className="text-xs text-slate-500">In Progress</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-800">{yearsOfService}</p>
            <p className="text-xs text-slate-500">Years Service</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-500" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-slate-700 font-medium truncate">{email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-slate-700 font-medium">{phone_number}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Employment Details
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Joined:</span> {joinDate}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Worker ID:</span> #{user_id}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Department:</span> {department}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Deleting...' : 'Delete Worker'}
          </button>
        </div>

        {/* Decorative Bubbles */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-xl"></div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Worker"
        message={`Are you sure you want to delete worker "${name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={loading}
      />
    </>
  );
};

export default WorkerCard;
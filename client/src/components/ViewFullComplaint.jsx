/**
 * ViewFullComplaint Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Removed crime-specific fields (crime_type, location, etc.)
 * UPDATED: Added complaint-specific fields (category, priority, assigned worker)
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Added status history timeline
 * UPDATED: Added worker remarks display
 * 
 * @description Modal component to view full complaint details with status history
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState, useEffect } from 'react';
import { getComplaintHistory } from '../apicalls/userapi';
import { 
  X, 
  User, 
  Calendar, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  UserCheck,
  MessageSquare,
  Image,
  FileText,
  ChevronRight
} from 'lucide-react';

const ViewFullComplaint = ({ complaint, setViewFull, onRefresh }) => {
  const [statusHistory, setStatusHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchStatusHistory();
  }, [complaint.complaint_id]);

  const fetchStatusHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await getComplaintHistory(complaint.complaint_id);
      if (result.success) {
        setStatusHistory(result.history);
      }
    } catch (error) {
      console.error("Error fetching status history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Handle missing complaint data
  if (!complaint) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-500 text-center">
            <AlertCircle className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-medium">Error</h3>
            <p className="mt-1 text-sm">Complaint data is missing or unavailable.</p>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setViewFull(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Status configuration
  const statusConfig = {
    'Submitted': {
      displayText: 'Submitted',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      color: 'text-yellow-600'
    },
    'Assigned': {
      displayText: 'Assigned',
      badge: 'bg-blue-100 text-blue-800',
      icon: UserCheck,
      color: 'text-blue-600'
    },
    'In Progress': {
      displayText: 'In Progress',
      badge: 'bg-orange-100 text-orange-800',
      icon: Clock,
      color: 'text-orange-600'
    },
    'Resolved': {
      displayText: 'Resolved',
      badge: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    'Closed': {
      displayText: 'Closed',
      badge: 'bg-gray-100 text-gray-800',
      icon: CheckCircle,
      color: 'text-gray-600'
    },
    'Escalated': {
      displayText: 'Escalated',
      badge: 'bg-red-100 text-red-800',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  };

  const status = statusConfig[complaint.status] || {
    displayText: complaint.status || 'Unknown',
    badge: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
    color: 'text-gray-600'
  };

  // Priority configuration
  const priorityConfig = {
    'high': { label: 'High', color: 'text-red-600', bg: 'bg-red-100' },
    'medium': { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'low': { label: 'Low', color: 'text-green-600', bg: 'bg-green-100' }
  };

  const priority = priorityConfig[complaint.priority] || priorityConfig['medium'];

  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setViewFull(false)}
          className="sticky top-4 right-4 float-right z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="clear-both"></div>

        {/* Complaint Content */}
        <div className="p-6 pt-0">
          {/* Header Section */}
          <div className="border-b pb-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{complaint.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.badge}`}>
                    <StatusIcon className="h-4 w-4" />
                    {status.displayText}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.bg} ${priority.color}`}>
                    {priority.label} Priority
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                    {complaint.category}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 flex flex-col items-start md:items-end">
                <span className="font-medium">Complaint ID: #{complaint.complaint_id}</span>
                <span>Filed: {new Date(complaint.created_at).toLocaleString()}</span>
                {complaint.updated_at && (
                  <span>Last updated: {new Date(complaint.updated_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Description
                </h3>
                <p className="text-gray-800 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {complaint.description || 'No description provided'}
                </p>
              </div>

              {/* Complainant Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Complainant Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {complaint.user_name || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {complaint.user_email || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {complaint.user_phone || 'N/A'}</p>
                </div>
              </div>

              {/* Worker Information (if assigned) */}
              {complaint.assigned_to && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-purple-600" />
                    Assigned Worker
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p><span className="font-medium">Name:</span> {complaint.worker_name || `Worker #${complaint.assigned_to}`}</p>
                    <p><span className="font-medium">Department:</span> {complaint.worker_department || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Worker Remarks */}
              {complaint.remark && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Worker Remarks
                  </h3>
                  <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r p-4">
                    <p className="text-purple-800 whitespace-pre-line">{complaint.remark}</p>
                  </div>
                </div>
              )}

              {/* Media Attachments */}
              {complaint.media_urls && complaint.media_urls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Image className="h-5 w-5 text-purple-600" />
                    Attachments ({complaint.media_urls.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complaint.media_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                      >
                        {url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <img
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cGF0aCBkPSJNMjEgMTVsLTUtNUw2IDIxbDEwLTEwIj48L3BhdGg+PC9zdmc+';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 h-32 bg-gray-50 group-hover:bg-gray-100">
                            <FileText className="h-8 w-8 text-gray-400" />
                            <span className="text-xs mt-2 text-gray-500 text-center truncate w-full px-1">
                              File {index + 1}
                            </span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status History Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Status History
                </h3>
                {loadingHistory ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : statusHistory.length > 0 ? (
                  <div className="space-y-3">
                    {statusHistory.map((history, index) => {
                      const historyStatus = statusConfig[history.new_status] || statusConfig['Submitted'];
                      const HistoryIcon = historyStatus.icon;
                      return (
                        <div key={history.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`p-1 rounded-full ${historyStatus.badge}`}>
                              <HistoryIcon className="h-4 w-4" />
                            </div>
                            {index < statusHistory.length - 1 && (
                              <div className="w-px h-8 bg-gray-300 mt-1"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <span className="font-medium text-gray-800">
                                {history.old_status || 'Created'} → {history.new_status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(history.changed_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              By: {history.changed_by_name || 'System'} ({history.changed_by_role || 'system'})
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg text-center">
                    No status history available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFullComplaint;
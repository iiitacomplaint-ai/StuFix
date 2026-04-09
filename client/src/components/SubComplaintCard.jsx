/**
 * SubComplaintCard Component
 * UPDATED: Converted from police complaint card to worker complaint card
 * UPDATED: Removed crime/police-specific fields (crime_type, case_file_url)
 * UPDATED: Changed status update for worker permissions
 * UPDATED: Added remark functionality for workers
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Simplified for worker complaint management
 * 
 * @description Complaint card component for workers to view and manage assigned complaints
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateComplaintStatus, addRemark } from '../apicalls/workerapi';
import ViewFullComplaint from './ViewFullComplaint';

// --- Status Update Modal for Workers ---
const StatusUpdateModal = ({ complaint, onClose, queryClient, parentQueryKey }) => {
    const [status, setStatus] = useState(complaint.status);
    const [remark, setRemark] = useState('');

    // Get available next statuses based on current status
    const getAvailableStatuses = () => {
        const statusFlow = {
            'Assigned': ['In Progress'],
            'In Progress': ['Resolved'],
            'Escalated': ['In Progress']
        };
        return statusFlow[complaint.status] || [];
    };

    const availableStatuses = getAvailableStatuses();

    const mutation = useMutation({
        mutationFn: updateComplaintStatus,
        onSuccess: () => {
            toast.success("Complaint status updated successfully!");
            queryClient.invalidateQueries({ queryKey: parentQueryKey });
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || "Failed to update status.");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!remark.trim()) {
            toast.error("Please add a remark before updating status");
            return;
        }
        mutation.mutate({ complaint_id: complaint.complaint_id, new_status: status });
    };

    if (availableStatuses.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Cannot Update Status</h3>
                    <p className="text-gray-600 mb-4">
                        This complaint cannot be updated from "{complaint.status}" status.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Update Complaint Status</h3>
                        <p className="text-sm text-gray-500 mb-6">Complaint ID: #{complaint.complaint_id}</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                    {complaint.status}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {availableStatuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">Remarks (Required)</label>
                                <textarea
                                    id="remark"
                                    rows="4"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Provide details about the status update..."
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={mutation.isPending}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
                        >
                            {mutation.isPending ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Add Remark Modal ---
const AddRemarkModal = ({ complaint, onClose, queryClient, parentQueryKey }) => {
    const [remark, setRemark] = useState('');

    const mutation = useMutation({
        mutationFn: addRemark,
        onSuccess: () => {
            toast.success("Remark added successfully!");
            queryClient.invalidateQueries({ queryKey: parentQueryKey });
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || "Failed to add remark.");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!remark.trim()) {
            toast.error("Please enter a remark");
            return;
        }
        mutation.mutate({ complaint_id: complaint.complaint_id, remark });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Add Remark</h3>
                        <p className="text-sm text-gray-500 mb-6">Complaint ID: #{complaint.complaint_id}</p>
                        <div>
                            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                            <textarea
                                id="remark"
                                rows="5"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Add your remarks about this complaint..."
                                required
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={mutation.isPending}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
                        >
                            {mutation.isPending ? 'Adding...' : 'Add Remark'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Complaint Card Component ---
const SubComplaintCard = ({ complaint, onRefresh }) => {
    const [viewFull, setViewFull] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    
    const queryClient = useQueryClient();
    const user = useSelector(state => state.user.user);
    const parentQueryKey = ['assigned-complaints', user?.user_id];

    // Status configuration for display
    const statusConfig = {
        'Submitted': { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', icon: '📝', badge: 'bg-gray-100 text-gray-800' },
        'Assigned': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: '👤', badge: 'bg-blue-100 text-blue-800' },
        'In Progress': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', icon: '🛠️', badge: 'bg-yellow-100 text-yellow-800' },
        'Resolved': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', icon: '✅', badge: 'bg-green-100 text-green-800' },
        'Closed': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', icon: '🔒', badge: 'bg-purple-100 text-purple-800' },
        'Escalated': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: '⚠️', badge: 'bg-red-100 text-red-800' }
    };

    const status = statusConfig[complaint.status] || {
        bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', icon: 'ℹ️', badge: 'bg-gray-100 text-gray-800'
    };

    // Priority configuration
    const priorityConfig = {
        'high': { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
        'medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
        'low': { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' }
    };

    const priority = priorityConfig[complaint.priority] || priorityConfig['medium'];

    // Check if worker can update status
    const canUpdateStatus = () => {
        const updatableStatuses = ['Assigned', 'In Progress', 'Escalated'];
        return updatableStatuses.includes(complaint.status);
    };

    // Check if worker can add remark
    const canAddRemark = () => {
        return complaint.assigned_to === user?.user_id;
    };

    return (
        <div className={`border rounded-lg overflow-hidden mb-6 ${status.border} ${status.bg} transition-all hover:shadow-lg`}>
            {viewFull && <ViewFullComplaint complaint={complaint} setViewFull={setViewFull} onRefresh={onRefresh} />}
            {showStatusModal && (
                <StatusUpdateModal
                    complaint={complaint}
                    onClose={() => setShowStatusModal(false)}
                    queryClient={queryClient}
                    parentQueryKey={parentQueryKey}
                />
            )}
            {showRemarkModal && (
                <AddRemarkModal
                    complaint={complaint}
                    onClose={() => setShowRemarkModal(false)}
                    queryClient={queryClient}
                    parentQueryKey={parentQueryKey}
                />
            )}

            <div className="p-5">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}>
                                {priority.icon} {complaint.priority.toUpperCase()}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                {complaint.category}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                    </div>
                    <div className="flex flex-col items-start text-left sm:text-right sm:items-end gap-1 min-w-[140px]">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${status.badge}`}>
                            <span>{status.icon}</span>
                            {complaint.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                            <p><strong>Student:</strong> {complaint.user_name || `ID: ${complaint.user_id}`}</p>
                        </div>
                    </div>
                </div>

                {/* Assignment Info */}
                {complaint.assigned_to && (
                    <div className="mt-4 bg-gray-100 border border-gray-200 rounded-md p-3 text-sm">
                        <p className="text-gray-800">
                            Assigned to you on <span className="font-semibold text-gray-900">
                                {new Date(complaint.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </p>
                    </div>
                )}

                {/* Worker Remark Section */}
                {complaint.remark && (
                    <div className="mt-4 bg-purple-50 border-l-4 border-purple-400 rounded-r p-3">
                        <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-purple-800">Your Remark</h4>
                                <p className="text-sm text-purple-700 mt-1">{complaint.remark}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Complaint ID: #{complaint.complaint_id}</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setViewFull(true)}
                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium rounded-md shadow-sm transition-colors"
                        >
                            View Details
                        </button>
                        
                        {canAddRemark && (
                            <button
                                onClick={() => setShowRemarkModal(true)}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                            >
                                Add Remark
                            </button>
                        )}
                        
                        {canUpdateStatus && (
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                            >
                                Update Status
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubComplaintCard;
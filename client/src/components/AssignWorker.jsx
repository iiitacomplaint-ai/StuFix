/**
 * AssignWorker Component
 * UPDATED: Converted from police officer assignment to worker assignment for complaint system
 * UPDATED: Changed API calls from police to worker
 * UPDATED: Filters workers by department matching complaint category
 * UPDATED: Removed police-specific fields (badge_number, rank, etc.)
 * UPDATED: Added worker statistics (assigned, resolved, pending)
 * UPDATED: Changed color scheme to purple/indigo theme
 * 
 * @description Component for admin to assign/reassign workers to complaints based on department
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getWorkers, assignComplaint, reassignComplaint } from '../apicalls/adminapi';
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import { UserCheck, X, ChevronDown, User, Briefcase, CheckCircle, Clock } from 'lucide-react';

const AssignWorker = ({ complaint, setAssignOff, onRefresh }) => {
    const queryClient = useQueryClient();
    const [selectedWorkerId, setSelectedWorkerId] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(true);
    const dropdownRef = useRef(null);
    const user = useSelector(state => state.user.user);

    // Fetch all workers
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['workers'],
        queryFn: () => getWorkers({}),
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || "Error fetching workers");
        },
        cacheTime: 5 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        retry: 2,
    });

    // Filter workers by department matching complaint category
    const filteredWorkers = useMemo(() => {
        const allWorkers = data?.workers || [];
        if (!complaint?.category) return allWorkers;
        
        // Only show workers from the same department as complaint category
        return allWorkers.filter(worker => worker.department === complaint.category);
    }, [data, complaint?.category]);

    const selectedWorker = useMemo(() => {
        return filteredWorkers.find(worker => worker.user_id === parseInt(selectedWorkerId));
    }, [selectedWorkerId, filteredWorkers]);

    // Check if complaint already has an assigned worker
    const isReassign = !!complaint?.assigned_to;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectWorker = (workerId) => {
        setSelectedWorkerId(workerId);
        setDropdownOpen(false);
    };

    const assignMutation = useMutation({
        mutationFn: ({ complaint_id, worker_id }) => {
            if (isReassign) {
                return reassignComplaint(complaint_id, worker_id);
            }
            return assignComplaint(complaint_id, worker_id);
        },
        onSuccess: (data) => {
            toast.success(data.message || `Worker ${isReassign ? 'reassigned' : 'assigned'} successfully`);
            queryClient.invalidateQueries(['complaints']);
            queryClient.invalidateQueries(['workers']);
            if (onRefresh) onRefresh();
            setAssignOff(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || `Error ${isReassign ? 'reassigning' : 'assigning'} worker`);
        }
    });

    const handleAssign = () => {
        if (!selectedWorkerId) {
            toast.error("Please select a worker first");
            return;
        }
        assignMutation.mutate({ 
            complaint_id: complaint?.complaint_id, 
            worker_id: selectedWorkerId 
        });
    };

    // Calculate worker efficiency
    const getEfficiency = (worker) => {
        const total = worker.complaintCounts?.total || 1;
        const resolved = worker.complaintCounts?.resolved || 0;
        const closed = worker.complaintCounts?.closed || 0;
        return Math.round(((resolved + closed) / total) * 100);
    };

    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 80) return 'text-green-600';
        if (efficiency >= 60) return 'text-blue-600';
        if (efficiency >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getEfficiencyBarColor = (efficiency) => {
        if (efficiency >= 80) return 'bg-green-600';
        if (efficiency >= 60) return 'bg-blue-600';
        if (efficiency >= 40) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    const getPendingCount = (worker) => {
        const total = worker.complaintCounts?.total || 0;
        const resolved = worker.complaintCounts?.resolved || 0;
        const closed = worker.complaintCounts?.closed || 0;
        return total - resolved - closed;
    };

    if (isPending || assignMutation.isPending) {
        return <LoadingPage status="load" message={`${isReassign ? 'Reassigning' : 'Assigning'} worker, please wait...`} />;
    }

    if (isError) {
        return <ErrorPage type="error" message={error?.message || "Error loading workers"} />;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isReassign ? 'Reassign Worker' : 'Assign Worker'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Complaint #{complaint?.complaint_id || 'N/A'} - {complaint?.category}
                        </p>
                    </div>
                    <button 
                        onClick={() => setAssignOff(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Department Info */}
                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-700">
                        <strong>Department Required:</strong> {complaint?.category}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                        Only workers from this department can be assigned
                    </p>
                </div>

                {/* Worker Dropdown */}
                <div className="relative mb-6" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Worker
                    </label>
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {selectedWorker ? (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-800">{selectedWorker.name}</span>
                                <span className="text-xs text-gray-500">({selectedWorker.department})</span>
                            </div>
                        ) : (
                            <span className="text-gray-500">Select a worker</span>
                        )}
                        <ChevronDown className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
                            {filteredWorkers.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No workers available in {complaint?.category} department
                                </div>
                            ) : (
                                filteredWorkers.map((worker) => {
                                    const efficiency = getEfficiency(worker);
                                    const pendingCount = getPendingCount(worker);
                                    return (
                                        <div
                                            key={worker.user_id}
                                            onClick={() => handleSelectWorker(worker.user_id)}
                                            className="cursor-pointer p-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{worker.name}</p>
                                                            <p className="text-xs text-gray-500">{worker.department}</p>
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-500">
                                                            {worker.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs mt-2">
                                                        <span className="text-gray-500">
                                                            <Clock className="inline h-3 w-3 mr-1" />
                                                            {pendingCount} pending
                                                        </span>
                                                        <span className={getEfficiencyColor(efficiency)}>
                                                            <CheckCircle className="inline h-3 w-3 mr-1" />
                                                            {efficiency}% resolved
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                        <div 
                                                            className={`${getEfficiencyBarColor(efficiency)} h-1.5 rounded-full transition-all duration-300`}
                                                            style={{ width: `${efficiency}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Worker Details */}
                {selectedWorker && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-purple-700" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{selectedWorker.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                                        {selectedWorker.department}
                                    </span>
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                        {selectedWorker.phone_number}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Worker Statistics */}
                        <div className="mt-4 pt-3 border-t border-purple-200">
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                <div>
                                    <p className="text-gray-600">Assigned</p>
                                    <p className="font-bold text-gray-800">{selectedWorker.complaintCounts?.total || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Resolved</p>
                                    <p className="font-bold text-green-600">{selectedWorker.complaintCounts?.resolved || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Pending</p>
                                    <p className={`font-bold ${getPendingCount(selectedWorker) > 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {getPendingCount(selectedWorker)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-gray-600">Resolution Rate</span>
                                    <span className={getEfficiencyColor(getEfficiency(selectedWorker))}>
                                        {getEfficiency(selectedWorker)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`${getEfficiencyBarColor(getEfficiency(selectedWorker))} h-2 rounded-full transition-all duration-300`}
                                        style={{ width: `${getEfficiency(selectedWorker)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Warning for reassign */}
                {isReassign && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Note:</strong> This complaint is currently assigned to another worker. 
                            Reassigning will change the assigned worker.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setAssignOff(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedWorkerId || assignMutation.isPending}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {assignMutation.isPending ? (
                            'Assigning...'
                        ) : (
                            <>
                                <UserCheck className="h-4 w-4" />
                                {isReassign ? 'Reassign Worker' : 'Assign Worker'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignWorker;
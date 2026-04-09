/**
 * CreateComplaint Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed crime_type to category with valid complaint categories
 * UPDATED: Removed location fields (not needed for college complaints)
 * UPDATED: Removed datetime field (complaints use created_at timestamp)
 * UPDATED: Changed API from submitComplaint to createComplaint
 * UPDATED: Updated import from citizenapi to userapi
 * UPDATED: Simplified form structure for college complaints
 * UPDATED: Added priority field (low, medium, high)
 * UPDATED: Updated validation for new fields
 * 
 * @description Component for users to create new complaints
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadToCloudinary } from '../utils/cloudinary';
import { toast } from 'react-toastify';
import { createComplaint } from '../apicalls/userapi'; // Changed from submitComplaint
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';

const CreateComplaint = ({ onClose, onRefresh }) => {
  const user = useSelector(state => state.user.user); 
  const queryClient = useQueryClient();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated categories for college complaint system
  const complaintCategories = [
    'Network',
    'Cleaning',
    'Carpentry',
    'PC Maintenance',
    'Plumbing',
    'Electricity'
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'red' }
  ];

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'medium',
    media_urls: []
  });

  // ✅ Mutation for complaint submission
  const complaintMutation = useMutation({
    mutationFn: (payload) => createComplaint(payload), // Changed from submitComplaint
    onSuccess: (newComplaint) => {
      toast.success('Complaint submitted successfully!');

      // ✅ Update cache directly for ['complaints', user?.user_id]
      queryClient.setQueryData(['complaints', user?.user_id], old => {
        if (!old) return [newComplaint.complaint];
        return [newComplaint.complaint, ...old];
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['complaints', user?.user_id]);
      queryClient.invalidateQueries(['dashboard-stats', user?.user_id]);
      
      if (onRefresh) onRefresh();
      onClose(); // close modal
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message || 'Submission failed');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);

    if (files.length + newFiles.length > 5) {
      toast.info('You can upload a maximum of 5 files');
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setUploadingStatus((prev) => [...prev, ...newFiles.map(() => 'Uploading...')]);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const index = files.length + i;

      const res = await uploadToCloudinary(file);

      if (res.success) {
        setUploadedFiles((prev) => [
          ...prev,
          { url: res.url, public_id: res.public_id, type: res.resource_type },
        ]);
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'Uploaded';
          return updated;
        });
      } else {
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'Failed';
          return updated;
        });
      }
    }
  };

  if (complaintMutation.isPending) {
    return <LoadingPage status="load" message="Submitting complaint, please wait..." />;
  }

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadingStatus((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    
    // Validate required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.priority) newErrors.priority = 'Please select priority';

    if (!complaintCategories.includes(formData.category)) {
      newErrors.category = 'Invalid category selected';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      media_urls: uploadedFiles.map((f) => f.url),
    };

    console.log('Submitting complaint:', payload);
    complaintMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Overlay with smooth transition */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container with animation */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        {/* Modal Content */}
        <div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white rounded-full p-1 shadow-sm z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Submit New Complaint</h2>
            <p className="text-purple-100 text-sm mt-1">Please provide details about your issue</p>
          </div>

          {/* Form content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white`}
                  >
                    <option value="">Select Category</option>
                    {complaintCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {priorityLevels.map(level => (
                      <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={level.value}
                          checked={formData.priority === level.value}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className={`text-sm font-medium text-${level.color}-600`}>
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.priority && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.priority}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200`}
                    placeholder="e.g., WiFi not working in Library"
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200`}
                    placeholder="Please provide detailed information about your complaint..."
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Evidence/Media (Max 5 files)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">Drag and drop files here</p>
                      <p className="text-xs text-gray-500 mt-1">or click to browse (Images, PDF, DOC)</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>

                  {/* File previews with status */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-md ${uploadingStatus[index] === 'Uploaded' ? 'bg-green-100 text-green-600' :
                              uploadingStatus[index] === 'Failed' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                              <p className={`text-xs ${uploadingStatus[index] === 'Uploaded' ? 'text-green-600' :
                                uploadingStatus[index] === 'Failed' ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                {uploadingStatus[index]}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition duration-150"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-700">
                  <strong>ℹ️ Note:</strong> Your complaint will be reviewed and assigned to the appropriate department. 
                  You will receive updates via email and can track the status in your dashboard.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Complaint...
                    </span>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ArrowUp, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowRight,
  Eye,
  Edit,
  Trash,
  Plus,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Create an axios instance with retry configuration
const axiosInstance = axios.create({
  timeout: 10000,
});

// Add a retry interceptor
axiosInstance.interceptors.response.use(undefined, async (err) => {
  const { config, response } = err;
  
  // Only retry on 429 status code (too many requests) or network errors
  if ((response && response.status === 429) || !response) {
    // Set max retry count
    const maxRetries = 3;
    config.retryCount = config.retryCount || 0;
    
    if (config.retryCount < maxRetries) {
      // Increase retry count
      config.retryCount += 1;
      
      // Exponential backoff: wait longer for each retry
      const delay = Math.pow(2, config.retryCount) * 1000;
      console.log(`Retrying request (${config.retryCount}/${maxRetries}) after ${delay}ms...`);
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return axiosInstance(config);
    }
  }
  
  // If we've reached max retries or it's not a 429 error, reject the promise
  return Promise.reject(err);
});

// Add a request interceptor to add a delay between requests
axiosInstance.interceptors.request.use(async (config) => {
  // Track time between requests to avoid overwhelming the API
  const now = Date.now();
  const lastRequestTime = window.lastAxiosRequestTime || 0;
  const minRequestInterval = 300; // minimum ms between requests
  
  if (now - lastRequestTime < minRequestInterval) {
    // Wait until the minimum interval has passed
    const delayMs = minRequestInterval - (now - lastRequestTime);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  // Update the last request time
  window.lastAxiosRequestTime = Date.now();
  
  return config;
});

// Add a request throttling mechanism
const pendingRequests = {};

const throttledAxios = {
  get: (url, config = {}) => {
    const key = `${url}${JSON.stringify(config.params || {})}`;
    
    // If there's already a pending request with the same parameters, return that promise
    if (pendingRequests[key]) {
      return pendingRequests[key];
    }
    
    // Otherwise, make a new request
    const request = axiosInstance.get(url, config)
      .finally(() => {
        // Remove from pending requests when done
        delete pendingRequests[key];
      });
    
    pendingRequests[key] = request;
    return request;
  },
  post: (url, data, config = {}) => {
    return axiosInstance.post(url, data, config);
  },
  put: (url, data, config = {}) => {
    return axiosInstance.put(url, data, config);
  },
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  }
};

const PartnersPage = () => {
  const router = useRouter();
  
  // States for data and UI
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPartners, setTotalPartners] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // States for modal popups
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  
  // State for dropdown menu
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // States for form data
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website_url: '',
    location: ''
  });
  
  // States for file upload
  const [logoFile, setLogoFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // States for form errors and success
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Function to toggle dropdown menu
  const toggleMenu = (id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  // Add click outside listener to close dropdown
  const menuRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Add debouncing for search
  const searchTimeoutRef = useRef(null);
  
  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to trigger search after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1); // Reset to first page when searching
    }, 500); // 500ms debounce
  };

  // Fetch partners from API with dependency on relevant state changes
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = {
          page,
          limit,
          sort_by: sortBy,
          sort_order: sortOrder
        };
        
        // Add optional filters if they exist
        if (searchTerm) params.search = searchTerm;
        
        // Make API request with throttled axios
        const response = await throttledAxios.get('http://localhost:3002/api/partners', { params });
        
        if (response.data) {
          // Parse the response data based on structure
          let partnersData = [];
          if (Array.isArray(response.data)) {
            partnersData = response.data;
            setTotalPartners(response.data.length);
            setTotalPages(Math.ceil(response.data.length / limit));
          } else if (response.data.partners && Array.isArray(response.data.partners)) {
            partnersData = response.data.partners;
            
            // Extract pagination info if available
            const pagination = response.data.pagination || {};
            setTotalPartners(pagination.total || partnersData.length);
            setTotalPages(pagination.pages || Math.ceil(partnersData.length / limit));
          }
          
          setPartners(partnersData);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartners();
  }, [page, limit, searchTerm, sortBy, sortOrder]);

  // Handle pagination
  const goToPage = (newPage) => {
    setPage(newPage);
  };

  // Calculate sequential row number based on pagination
  const getRowNumber = (index) => {
    return ((page - 1) * limit) + index + 1;
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      website_url: '',
      location: ''
    });
    setLogoFile(null);
    setUploadMethod('url');
    setFormError('');
    setFormSuccess('');
  };

  // Open add partner modal
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Open edit partner modal
  const openEditModal = (partner) => {
    setCurrentPartner(partner);
    setFormData({
      name: partner.name || '',
      logo: partner.logo || '',
      website_url: partner.website_url || '',
      location: partner.location || ''
    });
    setOpenMenuId(null);
    setShowEditModal(true);
  };

  // Open delete partner modal
  const openDeleteModal = (partner) => {
    setCurrentPartner(partner);
    setOpenMenuId(null);
    setShowDeleteModal(true);
  };

  // Open view partner modal
  const openViewModal = (partner) => {
    setCurrentPartner(partner);
    setOpenMenuId(null);
    setShowViewModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowViewModal(false);
    setCurrentPartner(null);
    resetForm();
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle logo file change
  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // Handle upload method change
  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    if (method === 'url') {
      setLogoFile(null);
    } else {
      setFormData({
        ...formData,
        logo: ''
      });
    }
  };

  // Simulate file upload
  const simulateUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        
        // Convert file to data URL to simulate upload
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      }, 1500);
    });
  };

  // Handle add partner submission
  const handleAddPartner = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      // Validate form
      if (!formData.name) {
        setFormError('Partner name is required');
        return;
      }
      
      let logoUrl = formData.logo;
      
      // If upload method is file and there's a file, process it
      if (uploadMethod === 'upload' && logoFile) {
        logoUrl = await simulateUpload(logoFile);
      }
      
      // Prepare data for API
      const partnerData = {
        ...formData,
        logo: logoUrl
      };
      
      // Make API request
      await throttledAxios.post('http://localhost:3002/api/partners', partnerData);
      
      // Show success message
      setFormSuccess('Partner added successfully');
      
      // Reset form and close modal after a delay
      setTimeout(() => {
        closeAllModals();
        
        // Refresh partners list
        setPage(1);
      }, 1500);
    } catch (error) {
      console.error('Error adding partner:', error);
      setFormError(error.response?.data?.message || 'Failed to add partner. Please try again.');
    }
  };

  // Handle edit partner submission
  const handleEditPartner = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      // Validate form
      if (!formData.name) {
        setFormError('Partner name is required');
        return;
      }
      
      let logoUrl = formData.logo;
      
      // If upload method is file and there's a file, process it
      if (uploadMethod === 'upload' && logoFile) {
        logoUrl = await simulateUpload(logoFile);
      }
      
      // Prepare data for API
      const partnerData = {
        ...formData,
        logo: logoUrl
      };
      
      // Make API request
      await throttledAxios.put(`http://localhost:3002/api/partners/${currentPartner.id}`, partnerData);
      
      // Show success message
      setFormSuccess('Partner updated successfully');
      
      // Reset form and close modal after a delay
      setTimeout(() => {
        closeAllModals();
        
        // Refresh partners list
        setPage(1);
      }, 1500);
    } catch (error) {
      console.error('Error updating partner:', error);
      setFormError(error.response?.data?.message || 'Failed to update partner. Please try again.');
    }
  };

  // Handle delete partner
  const handleDeletePartner = async () => {
    try {
      // Make API request
      await throttledAxios.delete(`http://localhost:3002/api/partners/${currentPartner.id}`);
      
      // Close modal
      closeAllModals();
      
      // Refresh partners list
      setPage(1);
    } catch (error) {
      console.error('Error deleting partner:', error);
      setFormError(error.response?.data?.message || 'Failed to delete partner. Please try again.');
    }
  };

  // Render logo preview
  const renderLogoPreview = (logoUrl) => {
    if (!logoUrl) return null;
    
    return (
      <div className="mt-2 p-2 border rounded-md">
        <img 
          src={logoUrl} 
          alt="Logo Preview" 
          className="h-16 object-contain" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/64/64';
          }}
        />
      </div>
    );
  };

  // Truncate text for display
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Partners</h1>
          <p className="text-gray-500 text-sm">Partners List</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowUp className="w-4 h-4 mr-2" />
            Import Partners
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800"
          >
            Add Partner
            <Plus className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">List of Partners</h2>
          <div className="flex">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <form onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" 
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>
            </div>
            <button 
              className="ml-2 p-2.5 bg-green-700 text-white rounded-lg"
              onClick={() => {
                // Open a filter modal or expand filter options
              }}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Partners table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading partners...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No partners found</p>
              <button 
                onClick={openAddModal}
                className="mt-4 px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800"
              >
                Add your first partner
              </button>
            </div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.map((partner, index) => (
                  <tr key={partner.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getRowNumber(index)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full border overflow-hidden bg-gray-100 flex items-center justify-center">
                        {partner.logo ? (
                          <img 
                            src={partner.logo} 
                            alt={partner.name} 
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/api/placeholder/40/40';
                            }}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">{partner.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.website_url ? (
                        <a 
                          href={partner.website_url.startsWith('http') ? partner.website_url : `https://${partner.website_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-700 hover:underline flex items-center"
                        >
                          {truncateText(partner.website_url.replace(/^https?:\/\//, ''), 25)}
                          <LinkIcon className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.location || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleMenu(partner.id)}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {openMenuId === partner.id && (
                        <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            onClick={() => openViewModal(partner)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </button>
                          <button
                            onClick={() => openEditModal(partner)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(partner)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {partners.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {partners.length > 0 ? ((page - 1) * limit) + 1 : 0} to {Math.min(page * limit, totalPartners)} out of {totalPartners} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                className="p-2 text-gray-500 rounded hover:bg-gray-100"
                onClick={() => goToPage(1)}
                disabled={page === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-500 rounded hover:bg-gray-100"
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Display page numbers */}
              {[...Array(Math.min(totalPages, 3))].map((_, index) => {
                const pageNumber = page <= 2 ? index + 1 : page - 1 + index;
                if (pageNumber <= totalPages) {
                  return (
                    <button 
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`p-2 w-8 h-8 rounded-md ${
                        pageNumber === page
                          ? 'bg-green-700 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      } flex items-center justify-center`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button 
                className="p-2 text-gray-500 rounded hover:bg-gray-100"
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-500 rounded hover:bg-gray-100"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium">Add New Partner</h3>
              <button onClick={closeAllModals} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPartner} className="p-6">
              {/* Form Error */}
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
              
              {/* Form Success */}
              {formSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}
              
              {/* Partner Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter partner name"
                  required
                />
              </div>
              
              {/* Logo Upload Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Logo
                </label>
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleUploadMethodChange('upload')}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                      uploadMethod === 'upload' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Upload
                  </button>
                </div>
                
                {/* URL Input */}
                {uploadMethod === 'url' && (
                  <div>
                    <input
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter logo URL"
                    />
                    {formData.logo && renderLogoPreview(formData.logo)}
                  </div>
                )}
                
                {/* File Upload */}
                {uploadMethod === 'upload' && (
                  <div>
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
                      <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {logoFile ? logoFile.name : 'Click to upload logo image'}
                        </p>
                        <input
                          id="logo-upload"
                          type="file"
                          onChange={handleLogoFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-700 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Uploading: {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {logoFile && !isUploading && renderLogoPreview(URL.createObjectURL(logoFile))}
                  </div>
                )}
              </div>
              
              {/* Website URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="City, Country"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-md flex items-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Add Partner'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {showEditModal && currentPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium">Edit Partner</h3>
              <button onClick={closeAllModals} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditPartner} className="p-6">
              {/* Form Error */}
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
              
              {/* Form Success */}
              {formSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}
              
              {/* Partner Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter partner name"
                  required
                />
              </div>
              
              {/* Logo Upload Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Logo
                </label>
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleUploadMethodChange('url')}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                      uploadMethod === 'url' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUploadMethodChange('upload')}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                      uploadMethod === 'upload' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Upload
                  </button>
                </div>
                
                {/* URL Input */}
                {uploadMethod === 'url' && (
                  <div>
                    <input
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter logo URL"
                    />
                    {formData.logo && renderLogoPreview(formData.logo)}
                  </div>
                )}
                
                {/* File Upload */}
                {uploadMethod === 'upload' && (
                  <div>
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
                      <label htmlFor="logo-upload-edit" className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {logoFile ? logoFile.name : 'Click to upload logo image'}
                        </p>
                        <input
                          id="logo-upload-edit"
                          type="file"
                          onChange={handleLogoFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-700 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Uploading: {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {logoFile && !isUploading && renderLogoPreview(URL.createObjectURL(logoFile))}
                    {!logoFile && formData.logo && renderLogoPreview(formData.logo)}
                  </div>
                )}
              </div>
              
              {/* Website URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="City, Country"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-md flex items-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Update Partner'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Partner Modal */}
      {showDeleteModal && currentPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Partner</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-medium">{currentPartner.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeletePartner}
                  className="px-4 py-2 bg-red text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Partner Modal */}
      {showViewModal && currentPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium">Partner Details</h3>
              <button onClick={closeAllModals} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {currentPartner.logo ? (
                    <img 
                      src={currentPartner.logo} 
                      alt={currentPartner.name} 
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">{currentPartner.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Partner Name</h4>
                  <p className="mt-1">{currentPartner.name}</p>
                </div>
                
                {currentPartner.website_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Website</h4>
                    <p className="mt-1">
                      <a 
                        href={currentPartner.website_url.startsWith('http') ? currentPartner.website_url : `https://${currentPartner.website_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-700 hover:underline flex items-center"
                      >
                        {currentPartner.website_url}
                        <LinkIcon className="w-3 h-3 ml-1" />
                      </a>
                    </p>
                  </div>
                )}
                
                {currentPartner.location && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1">{currentPartner.location}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    closeAllModals();
                    openEditModal(currentPartner);
                  }}
                  className="px-4 py-2 bg-green-700 text-white rounded-md flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;
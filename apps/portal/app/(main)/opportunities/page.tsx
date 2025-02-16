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
  RefreshCw,
  Calendar
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
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  }
};

const OpportunitiesPage = () => {
  const router = useRouter();
  // State for the active tab
  const [activeTab, setActiveTab] = useState('all');
  
  // States for data and UI
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});
  
  // States for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // States for tab counts
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    draft: 0,
    published: 0,
    archived: 0,
    closed: 0
  });

  // Add state to track if tab counts are loaded
  const [tabCountsLoaded, setTabCountsLoaded] = useState(false);

  // State for dropdown menu
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Function to toggle dropdown menu
  const toggleMenu = (id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  // Function to handle action click
  const handleAction = async (action, opportunityId) => {
    setOpenMenuId(null); // Close the menu
    
    switch(action) {
      case 'view':
        // Navigate to opportunity details page
        router.push(`/opportunities/${opportunityId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
          try {
            await throttledAxios.delete(`http://localhost:3002/api/opportunities/${opportunityId}`);
            // Refresh the opportunities list after deletion
            const updatedPage = opportunities.length === 1 && page > 1 ? page - 1 : page;
            setPage(updatedPage);
          } catch (error) {
            console.error('Error deleting opportunity:', error);
            alert('Failed to delete opportunity. Please try again.');
          }
        }
        break;
      case 'update':
        // Navigate to update page
        router.push(`/opportunities/edit-opportunity/${opportunityId}`);
        break;
      case 'status':
        // Open status change modal/form
        console.log(`Change status for opportunity ${opportunityId}`);
        break;
      default:
        break;
    }
  };

  // Handle pagination
  const goToPage = (newPage) => {
    setPage(newPage);
  };

  // Calculate sequential row number based on pagination
  const getRowNumber = (index) => {
    return ((page - 1) * limit) + index + 1;
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

  // Set default categories
  useEffect(() => {
    // Use default categories
    setCategories({
      1: 'Internship',
      2: 'Grant',
      3: 'Fellowship',
      4: 'Scholarship',
      5: 'Training Program'
    });
  }, []);

  // Fetch tab counts
  const fetchTabCounts = async () => {
    try {
      // Fetch all opportunities with limit=0 just to get count
      const response = await throttledAxios.get('http://localhost:3002/api/opportunities', { 
        params: { limit: 0 } 
      });
      
      // Get the total count from the response
      const allCount = parseInt(response.data.pagination?.total) || 0;
      
      // Count opportunities by status from the example data
      let draftCount = 0;
      let publishedCount = 0;
      let archivedCount = 0;
      let closedCount = 0;
      
      if (response.data.opportunities && Array.isArray(response.data.opportunities)) {
        response.data.opportunities.forEach(opportunity => {
          if (opportunity.status === 'draft') draftCount++;
          else if (opportunity.status === 'published') publishedCount++;
          else if (opportunity.status === 'archived') archivedCount++;
          else if (opportunity.status === 'closed') closedCount++;
        });
      }
      
      setTabCounts({
        all: allCount,
        draft: draftCount,
        published: publishedCount,
        archived: archivedCount,
        closed: closedCount
      });
      
      setTabCountsLoaded(true);
    } catch (error) {
      console.error('Error fetching tab counts:', error);
      // Use default values in case of error
      setTabCounts({
        all: 0,
        draft: 0,
        published: 0,
        archived: 0,
        closed: 0
      });
      setTabCountsLoaded(true);
    }
  };

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
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setPage(1); // Reset to first page when searching
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  // Get category name from category_id
  const getCategoryName = (categoryId) => {
    return categories[categoryId] || 'Other';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch opportunities from API with dependency on relevant state changes
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        
        // Add a delay between requests to avoid rate limiting
        const lastRequestTime = window.lastOpportunityFetchTime || 0;
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        
        // If last request was less than 500ms ago, delay this one
        if (timeSinceLastRequest < 500) {
          await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLastRequest));
        }
        
        // Build query params
        const params = {
          page,
          limit,
          sort_by: sortBy,
          sort_order: sortOrder
        };
        
        // Add optional filters if they exist
        if (searchTerm) params.search = searchTerm;
        
        // Add status filter if not showing all
        if (activeTab !== 'all') {
          params.status = activeTab;
        }
        
        console.log('Fetching opportunities with params:', params);
        
        // Store the time of this request
        window.lastOpportunityFetchTime = Date.now();
        
        // Make API request with throttled axios
        const response = await throttledAxios.get('http://localhost:3002/api/opportunities', { params });
        
        console.log('API response:', response.data);
        
        if (response.data) {
          setOpportunities(response.data.opportunities || []);
          
          // Extract pagination info
          const pagination = response.data.pagination || {};
          setTotalOpportunities(parseInt(pagination.total) || 0);
          setTotalPages(pagination.pages || 1);
          
          // If we're not already tracking tab counts, also use this response to update counts
          if (!tabCountsLoaded && response.data.opportunities) {
            fetchTabCounts();
          }
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunities();
  }, [page, limit, searchTerm, sortBy, sortOrder, activeTab, tabCountsLoaded]);

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• Draft</span>;
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">• Published</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">• Archived</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">• Closed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• {status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-gray-500 text-sm">Opportunities List</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowUp className="w-4 h-4 mr-2" />
            Import Opportunities
          </button>
          <Link href="/opportunities/add-opportunities" className="flex items-center px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800">
            Add Opportunity
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white'>
        <div className="flex border-b border-gray-200 mb-6 bg-white">
          <button
            onClick={() => handleTabChange('all')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'all'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
            <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.all}</span>
          </button>
          <button
            onClick={() => handleTabChange('draft')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'draft'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Draft
            <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.draft}</span>
          </button>
          <button
            onClick={() => handleTabChange('published')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'published'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Published
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.published}</span>
          </button>
          <button
            onClick={() => handleTabChange('archived')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'archived'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Archived
            <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.archived}</span>
          </button>
          <button
            onClick={() => handleTabChange('closed')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'closed'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Closed
            <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.closed}</span>
          </button>
        </div>

        {/* Opportunity list title */}
        <h2 className="text-lg font-bold mb-4">List of {activeTab === 'all' ? '' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Opportunities</h2>

        {/* Search and filter */}
        <div className="flex justify-end mb-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full pl-10 p-2.5" 
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <button 
            className="ml-2 p-2.5 bg-green-700 text-white rounded"
            onClick={() => {
              // Open a filter modal or expand filter options
            }}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Opportunities table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
          {loading ? (
            <div className="text-center py-4">Loading opportunities...</div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-4">No opportunities found</div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {opportunities.map((opportunity, index) => (
                  <tr key={opportunity.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getRowNumber(index)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opportunity.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {opportunity.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(opportunity.category_id)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {opportunity.location || 'N/A'}
                      {opportunity.location_type && <span className="text-xs ml-1 text-gray-500">({opportunity.location_type})</span>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(opportunity.application_deadline)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(opportunity.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleMenu(opportunity.id)}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {openMenuId === opportunity.id && (
                        <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            onClick={() => handleAction('view', opportunity.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </button>
                          <button
                            onClick={() => handleAction('update', opportunity.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </button>
                          <button
                            onClick={() => handleAction('status', opportunity.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Change status
                          </button>
                          <button
                            onClick={() => handleAction('delete', opportunity.id)}
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
        <div className="flex items-center justify-between py-3">
          <div className="text-sm text-gray-500">
            Showing {opportunities.length > 0 ? ((page - 1) * limit) + 1 : 0} to {Math.min(page * limit, totalOpportunities)} out of {totalOpportunities} entries
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
      </div>
    </div>
  );
};

export default OpportunitiesPage;
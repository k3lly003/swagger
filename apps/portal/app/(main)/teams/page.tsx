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
  Briefcase,
  UserPlus
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
    const maxRetries = 3;
    config.retryCount = config.retryCount || 0;
    
    if (config.retryCount < maxRetries) {
      config.retryCount += 1;
      const delay = Math.pow(2, config.retryCount) * 1000;
      console.log(`Retrying request (${config.retryCount}/${maxRetries}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return axiosInstance(config);
    }
  }
  
  return Promise.reject(err);
});

// Add request throttling
const pendingRequests = {};

const throttledAxios = {
  get: (url, config = {}) => {
    const key = `${url}${JSON.stringify(config.params || {})}`;
    
    if (pendingRequests[key]) {
      return pendingRequests[key];
    }
    
    const request = axiosInstance.get(url, config)
      .finally(() => {
        delete pendingRequests[key];
      });
    
    pendingRequests[key] = request;
    return request;
  },
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  }
};

const TeamsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  
  // States for data and UI
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamTypes, setTeamTypes] = useState({});
  
  // States for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // State to store team type counts
  const [tabCounts, setTabCounts] = useState({
    all: 0
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
  const handleAction = async (action, teamId) => {
    setOpenMenuId(null); // Close the menu
    
    switch(action) {
      case 'view':
        router.push(`/teams/${teamId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this team member?')) {
          try {
            await throttledAxios.delete(`http://localhost:3002/api/teams/${teamId}`);
            const updatedPage = teams.length === 1 && page > 1 ? page - 1 : page;
            setPage(updatedPage);
          } catch (error) {
            console.error('Error deleting team:', error);
            alert('Failed to delete team member. Please try again.');
          }
        }
        break;
      case 'update':
        router.push(`/teams/edit-team/${teamId}`);
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

  // Set default team types
  useEffect(() => {
    setTeamTypes({
      1: 'Leadership',
      2: 'Technical',
      3: 'Support'
    });
  }, []);

  // Handle search input change with debounce
  const searchTimeoutRef = useRef(null);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1); // Reset to first page when searching
    }, 500); // 500ms debounce
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setPage(1);
  };

  // Get team type ID from tab name
  const getTeamTypeIdFromTab = (tab) => {
    const tabToTypeMap = {
      'leadership': 1,
      'technical': 2,
      'support': 3
    };
    return tabToTypeMap[tab] || null;
  };
  
  // Fetch tab counts
  const fetchTabCounts = async () => {
    try {
      // Fetch all teams with limit=0 just to get count
      const response = await throttledAxios.get('http://localhost:3002/api/teams', { 
        params: { limit: 0 } 
      });
      
      // Get the total count from the response
      const allCount = parseInt(response.data.pagination?.total) || 0;
      
      // Prepare counts object
      const countsByType = {
        all: allCount
      };
      
      if (response.data.teams && Array.isArray(response.data.teams)) {
        // Group teams by team_type.name
        response.data.teams.forEach(team => {
          if (team.team_type && team.team_type.name) {
            const typeName = team.team_type.name.toLowerCase();
            countsByType[typeName] = (countsByType[typeName] || 0) + 1;
          }
        });
      }
      
      setTabCounts(countsByType);
      setTabCountsLoaded(true);
    } catch (error) {
      console.error('Error fetching tab counts:', error);
      // Use default values in case of error
      setTabCounts({
        all: 0
      });
      setTabCountsLoaded(true);
    }
  };

  // Fetch teams from API with dependency on relevant state changes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        
        // Add a delay between requests to avoid rate limiting
        const lastRequestTime = window.lastTeamFetchTime || 0;
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        
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
        
        // Map UI tab to API type filter
        if (activeTab !== 'all') {
          params.team_type_id = getTeamTypeIdFromTab(activeTab);
        }
        
        console.log('Fetching teams with params:', params);
        
        // Store the time of this request
        window.lastTeamFetchTime = Date.now();
        
        // Make API request with throttled axios
        const response = await throttledAxios.get('http://localhost:3002/api/teams', { params });
        
        console.log('API response:', response.data);
        
        if (response.data) {
          setTeams(response.data.teams || []);
          
          // Extract pagination info
          const pagination = response.data.pagination || {};
          setTotalTeams(parseInt(pagination.total) || 0);
          setTotalPages(pagination.pages || 1);
          
          // If we're not already tracking tab counts, also use this response to update counts
          if (!tabCountsLoaded && response.data.teams) {
            fetchTabCounts();
          }
        }
        
        // If we're not already tracking tab counts, use this response to update counts
        if (!tabCountsLoaded) {
          fetchTabCounts();
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, [page, limit, searchTerm, sortBy, sortOrder, activeTab, tabCountsLoaded]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get team type name from team object
  const getTeamTypeName = (team) => {
    return team.team_type?.name || 'Unknown';
  };

  // Get background and text color based on team type
  const getTeamTypeStyle = (team) => {
    if (!team.team_type) return 'bg-gray-100 text-gray-800';
    
    const typeName = team.team_type.name?.toLowerCase() || '';
    
    if (typeName.includes('leadership')) {
      return 'bg-blue-100 text-blue-800';
    } else if (typeName.includes('technical')) {
      return 'bg-green-100 text-green-800';
    } else if (typeName.includes('support')) {
      return 'bg-purple-100 text-purple-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  // Generate tabs based on team types found in the data
  const renderTabs = () => {
    const tabs = [
      { id: 'all', label: 'All' }
    ];
    
    // Add tabs for each team type found in tabCounts
    Object.keys(tabCounts).forEach(key => {
      if (key !== 'all') {
        tabs.push({
          id: key.toLowerCase(),
          label: key.charAt(0).toUpperCase() + key.slice(1)
        });
      }
    });
    
    return tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`py-3 px-4 text-sm font-medium relative ${
          activeTab === tab.id
            ? 'border-b-2 border-green-700 text-green-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab.label}
        <span className={`ml-2 ${
          tab.id === 'all' ? 'bg-gray-200 text-gray-800' :
          tab.id.includes('leadership') ? 'bg-blue-100 text-blue-800' :
          tab.id.includes('technical') ? 'bg-green-100 text-green-800' :
          tab.id.includes('support') ? 'bg-purple-100 text-purple-800' :
          'bg-gray-200 text-gray-800'
        } px-2 py-0.5 rounded text-xs font-medium`}>
          {tabCounts[tab.id] || 0}
        </span>
      </button>
    ));
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-gray-500 text-sm">Team Management</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowUp className="w-4 h-4 mr-2" />
            Import Team
          </button>
          <Link href="/teams/add-team" className="flex items-center px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white'>
        <div className="flex border-b border-gray-200 mb-6 bg-white">
          {renderTabs()}
        </div>

        {/* Team list title */}
        <h2 className="text-lg font-bold mb-4">
          {activeTab === 'all' ? 'All Team Members' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Team`}
        </h2>

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
                placeholder="Search team members"
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

        {/* Teams list view */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            <p className="mt-2 text-gray-600">Loading team members...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No team members found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new team member.</p>
            <div className="mt-6">
              <Link href="/teams/add-team" 
                className="inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800">
                <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                Add Team Member
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teams.map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={team.photo_url || "/api/placeholder/100/100"} 
                          alt={team.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{team.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTeamTypeStyle(team)}`}>
                        {getTeamTypeName(team)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(team.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => toggleMenu(team.id)}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        
                        {openMenuId === team.id && (
                          <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <button
                              onClick={() => handleAction('view', team.id)}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View details
                            </button>
                            <button
                              onClick={() => handleAction('update', team.id)}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleAction('delete', team.id)}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {teams.length > 0 && (
          <div className="flex items-center justify-between py-3">
            <div className="text-sm text-gray-500">
              Showing {teams.length > 0 ? ((page - 1) * limit) + 1 : 0} to {Math.min(page * limit, totalTeams)} out of {totalTeams} team members
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
    </div>
  );
};

export default TeamsPage;
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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define interfaces for our data structures
interface Project {
  id: number;
  name: string;
  category_id: number;
  members?: Array<{
    role: string;
    user_id: number;
  }>;
  created_by: number;
  location?: string;
  created_at: string;
  status: string;
}

interface Category {
  id: number;
  name: string;
}

interface Categories {
  [key: number | string]: string;
}

interface Users {
  [key: number]: string;
}

interface TabCounts {
  all: number;
  active: number;
  completed: number;
  planned: number;
}

interface ProjectParams {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: string;
  search?: string;
  status?: string;
}

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    lastAxiosRequestTime: number;
    lastProjectFetchTime: number;
  }
}

// Create an axios instance with retry configuration
const axiosInstance = axios.create({
  // Set a timeout to avoid hanging requests
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
const pendingRequests: { [key: string]: Promise<any> } = {};

const throttledAxios = {
  get: (url: string, config: { params?: any } = {}) => {
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
  delete: (url: string, config: any = {}) => {
    return axiosInstance.delete(url, config);
  }
};

const ProjectsPage = () => {
  const router = useRouter();
  // State for the active tab
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // States for data and UI
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Categories>({});
  const [users, setUsers] = useState<Users>({});
  
  // States for pagination and filtering
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  
  // States for tab counts
  const [tabCounts, setTabCounts] = useState<TabCounts>({
    all: 0,
    'active': 0, // Maps to 'in-progress' in UI
    'completed': 0,
    'planned': 0  // Maps to 'pending' in UI
  });

  // Add state to track if tab counts are loaded
  const [tabCountsLoaded, setTabCountsLoaded] = useState<boolean>(false);
  // Add state to track if categories are loaded
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  // State for dropdown menu
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
  // Function to toggle dropdown menu
  const toggleMenu = (id: number) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  // Function to handle action click
  const handleAction = async (action: string, projectId: number) => {
    setOpenMenuId(null); // Close the menu
    
    switch(action) {
      case 'view':
        // Navigate to project details page
        router.push(`/projects/${projectId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this project?')) {
          try {
            await throttledAxios.delete(`http://localhost:3002/api/projects/${projectId}`);
            // Refresh the projects list after deletion
            const updatedPage = projects.length === 1 && page > 1 ? page - 1 : page;
            setPage(updatedPage);
          } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
          }
        }
        break;
      case 'update':
        // Navigate to update page
        router.push(`/projects/edit-project/${projectId}`);
        break;
      case 'status':
        // Open status change modal/form
        console.log(`Change status for project ${projectId}`);
        break;
      default:
        break;
    }
  };

  // Handle pagination
  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  // Calculate sequential row number based on pagination
  const getRowNumber = (index: number) => {
    return ((page - 1) * limit) + index + 1;
  };

  // Map API status to UI status
  const mapStatusToUI = (apiStatus: string) => {
    switch(apiStatus) {
      case 'active': return 'in-progress';
      case 'planned': return 'pending';
      case 'completed': return 'completed';
      default: return apiStatus;
    }
  };
  
  // Map UI status to API status
  const mapUIToAPIStatus = (uiStatus: string) => {
    switch(uiStatus) {
      case 'in-progress': return 'active';
      case 'pending': return 'planned';
      case 'completed': return 'completed';
      case 'all': return '';
      default: return uiStatus;
    }
  };

  // Add click outside listener to close dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Update the categories state with fetched data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API...');
        const response = await throttledAxios.get('http://localhost:3002/api/categories');
        console.log('Categories API response:', response.data);
        
        // Handle different response formats
        if (response.data) {
          let categoriesData = response.data;
          
          // If response is an object with categories property, use that
          if (!Array.isArray(response.data) && response.data.categories && Array.isArray(response.data.categories)) {
            categoriesData = response.data.categories;
          }
          
          // If response is an empty object, provide default categories as fallback
          if (Object.keys(response.data).length === 0) {
            console.log('Empty categories response, using default categories');
            categoriesData = [
              { id: 1, name: "Food System" },
              { id: 2, name: "Climate Adaptation" },
              { id: 3, name: "Data & Evidence" }
            ];
          }
          
          // Transform the categories array into an object with id as key and name as value
          const categoriesObj: Categories = {};
          
          if (Array.isArray(categoriesData)) {
            categoriesData.forEach((category: Category) => {
              if (category && category.id && category.name) {
                // Store with both string and number keys to be safe
                categoriesObj[category.id] = category.name;
                categoriesObj[category.id.toString()] = category.name;
              }
            });
            console.log('Processed categories:', categoriesObj);
            setCategories(categoriesObj);
          } else {
            console.error('Unable to process categories data:', categoriesData);
            // Use default categories
            setCategories({
              1: "Food System",
              2: "Climate Adaptation", 
              3: "Data & Evidence"
            });
          }
        } else {
          console.error('Invalid or missing categories response');
          // Use default categories
          setCategories({
            1: "Food System",
            2: "Climate Adaptation", 
            3: "Data & Evidence"
          });
        }
        setCategoriesLoaded(true);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use default categories in case of error
        setCategories({
          1: "Food System",
          2: "Climate Adaptation", 
          3: "Data & Evidence"
        });
        setCategoriesLoaded(true);
      }
    };

    fetchCategories();
    
    // Set users (in a real app, you would fetch users from API as well)
    setUsers({
      1: 'Mukamana Fransine',
      2: 'John Doe',
      3: 'Jane Smith',
      4: 'Mukamana Fransine'
    });
  }, []);

  // Fetch tab counts using pagination total from a single request
  const fetchTabCounts = async () => {
    try {
      // Fetch all projects with limit=0 just to get count
      const response = await throttledAxios.get('http://localhost:3002/api/projects', { 
        params: { limit: 0 } 
      });
      
      // Get the total count from the response
      const allCount = parseInt(response.data.pagination?.total) || 0;
      
      // Count projects by status from the example data
      // This assumes we have a complete list of projects when limit=0
      let activeCount = 0;
      let completedCount = 0;
      let plannedCount = 0;
      
      if (response.data.projects && Array.isArray(response.data.projects)) {
        response.data.projects.forEach((project: Project) => {
          if (project.status === 'active') activeCount++;
          else if (project.status === 'completed') completedCount++;
          else if (project.status === 'planned') plannedCount++;
        });
      }
      
      setTabCounts({
        all: allCount,
        active: activeCount,
        completed: completedCount,
        planned: plannedCount
      });
      
      setTabCountsLoaded(true);
    } catch (error) {
      console.error('Error fetching tab counts:', error);
      // Use default values in case of error
      setTabCounts({
        all: 0,
        active: 0,
        completed: 0,
        planned: 0
      });
      setTabCountsLoaded(true);
    }
  };

  // Add debouncing for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setPage(1); // Reset to first page when searching
  };

  // Fetch projects from API with dependency on relevant state changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Add a delay between requests to avoid rate limiting
        const lastRequestTime = window.lastProjectFetchTime || 0;
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        
        // If last request was less than 500ms ago, delay this one
        if (timeSinceLastRequest < 500) {
          await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLastRequest));
        }
        
        // Build query params
        const params: ProjectParams = {
          page,
          limit,
          sort_by: sortBy,
          sort_order: sortOrder
        };
        
        // Add optional filters if they exist
        if (searchTerm) params.search = searchTerm;
        
        // Map UI status to API status
        const apiStatus = mapUIToAPIStatus(activeTab);
        if (apiStatus) params.status = apiStatus;
        
        console.log('Fetching projects with params:', params);
        
        // Store the time of this request
        window.lastProjectFetchTime = Date.now();
        
        // Make API request with throttled axios
        const response = await throttledAxios.get('http://localhost:3002/api/projects', { params });
        
        console.log('API response projects:', response.data.projects);
        
        if (response.data) {
          // Log a sample project to see its structure
          if (response.data.projects && response.data.projects.length > 0) {
            console.log('Sample project structure:', response.data.projects[0]);
            
            // Look for category_id in the projects
            response.data.projects.forEach((project: Project) => {
              console.log(`Project ${project.id} has category_id: ${project.category_id}`);
            });
          }
          
          setProjects(response.data.projects || []);
          
          // Extract pagination info
          const pagination = response.data.pagination || {};
          setTotalProjects(parseInt(pagination.total) || 0);
          setTotalPages(pagination.pages || 1);
          
          // If we're not already tracking tab counts, also use this response to update counts
          if (!tabCountsLoaded && response.data.projects) {
            fetchTabCounts();
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [page, limit, searchTerm, sortBy, sortOrder, activeTab, tabCountsLoaded]);

  // Extract team lead from project members
  const getTeamLead = (project: Project) => {
    if (!project.members || project.members.length === 0) {
      // If no members, use created_by as fallback for lead
      return users[project.created_by] || 'Mukamana Fransine';
    }
    
    const lead = project.members.find(member => member.role === 'lead');
    if (lead) {
      // Return user name from our users map if available
      return users[lead.user_id] || 'Mukamana Fransine';
    } else {
      // Fallback to created_by
      return users[project.created_by] || 'Mukamana Fransine';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get category name from category_id
  const getCategoryName = (categoryId: number | string) => {
    if (!categoryId) return '';
    
    // Try both the raw ID and the string version
    return categories[categoryId] || categories[categoryId.toString()] || '';
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500 text-sm">Projects List</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowUp className="w-4 h-4 mr-2" />
            Import Projects
          </button>
          <Link href="/projects/add-project" className="flex items-center px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800">
            Add Project
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/*  Tabs - */}
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
            onClick={() => handleTabChange('in-progress')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'in-progress'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            In progress
            <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.active}</span>
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'completed'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.completed}</span>
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`py-3 px-4 text-sm font-medium relative ${
              activeTab === 'pending'
                ? 'border-b-2 border-green-700 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending
            <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">{tabCounts.planned}</span>
          </button>
        </div>

        {/* Project list title */}
        <h2 className="text-lg font-bold mb-4">List of {activeTab === 'all' ? '' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Projects</h2>

        {/* Search and filter -  */}
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
            title="Filter projects"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Projects table -  */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
          {loading ? (
            <div className="text-center py-4">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-4">No projects found</div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Lead</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project, index) => (
                  <tr key={project.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getRowNumber(index)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(project.category_id)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index === 8 ? (
                        <span className="border border-purple-500 border-dashed py-0.5 px-1 rounded">
                          {getTeamLead(project)}
                        </span>
                      ) : (
                        getTeamLead(project)
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof project.location === 'string' && project.location.length > 0
                        ? project.location.split(',')[0].trim()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(project.created_at)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {mapStatusToUI(project.status) === 'completed' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          • Completed
                        </span>
                      )}
                      {mapStatusToUI(project.status) === 'pending' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          • Pending
                        </span>
                      )}
                      {mapStatusToUI(project.status) === 'in-progress' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          • In Progress
                        </span>
                      )}
                      {!['completed', 'pending', 'in-progress'].includes(mapStatusToUI(project.status)) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          • {project.status || 'Unknown'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          if (project && typeof project.id === 'number') {
                            toggleMenu(project.id);
                          }
                        }}
                        title="More options"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {openMenuId === project.id && (
                        <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            onClick={() => handleAction('view', project.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </button>
                          <button
                            onClick={() => handleAction('update', project.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </button>
                          <button
                            onClick={() => handleAction('status', project.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Change status
                          </button>
                          <button
                            onClick={() => handleAction('delete', project.id)}
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

        {/* Pagination -  */}
        <div className="flex items-center justify-between py-3">
          <div className="text-sm text-gray-500">
            Showing {projects.length > 0 ? ((page - 1) * limit) + 1 : 0} to {Math.min(page * limit, totalProjects)} out of {totalProjects} entries
          </div>
          <div className="flex items-center space-x-1">
            <button 
              className="p-2 text-gray-500 rounded hover:bg-gray-100"
              onClick={() => goToPage(1)}
              disabled={page === 1}
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-500 rounded hover:bg-gray-100"
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              title="Previous page"
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
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-500 rounded hover:bg-gray-100"
              onClick={() => goToPage(totalPages)}
              disabled={page === totalPages}
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
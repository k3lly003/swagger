"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowRight,
  Eye,
  Edit,
  Trash,
  Clock,
  Tag,
  User
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

// Add a request interceptor to add a delay between requests
axiosInstance.interceptors.request.use(async (config) => {
  const now = Date.now();
  const lastRequestTime = window.lastAxiosRequestTime || 0;
  const minRequestInterval = 300; // minimum ms between requests
  
  if (now - lastRequestTime < minRequestInterval) {
    const delayMs = minRequestInterval - (now - lastRequestTime);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  window.lastAxiosRequestTime = Date.now();
  
  return config;
});

// Add a request throttling mechanism
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

const NewsListPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  
  // States for data and UI
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  
  // States for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalNews, setTotalNews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('publish_date'); // Updated to publish_date
  const [sortOrder, setSortOrder] = useState('desc');
  
  // States for tab counts
  const [tabCounts, setTabCounts] = useState({
    all: 0
  });

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
  const handleAction = async (action, newsId) => {
    setOpenMenuId(null); // Close the menu
    
    switch(action) {
      case 'view':
        router.push(`/news/${newsId}`);
        break;
      case 'edit':
        router.push(`/news/edit/${newsId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this news article?')) {
          try {
            await throttledAxios.delete(`http://localhost:3002/api/news/${newsId}`);
            // Refresh the news list after deletion
            const updatedPage = news.length === 1 && page > 1 ? page - 1 : page;
            setPage(updatedPage);
          } catch (error) {
            console.error('Error deleting news:', error);
            alert('Failed to delete news. Please try again.');
          }
        }
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

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await throttledAxios.get('http://localhost:3002/api/news/tags');
        if (response.data && Array.isArray(response.data.tags)) {
          setTags(response.data.tags);
        } else if (Array.isArray(response.data)) {
          setTags(response.data);
        } else {
          console.error('Unexpected tags response format:', response.data);
          setTags([]);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        setTags([]);
      }
    };
    
    fetchTags();
  }, []);

  // Fetch tab counts based on tags
  const fetchTabCounts = async () => {
    try {
      // Get total count of news articles
      const newsResponse = await throttledAxios.get('http://localhost:3002/api/news', { 
        params: { limit: 0 } 
      });
      
      const allCount = parseInt(newsResponse.data.pagination?.total) || 0;
      
      // Initialize the counts object with the 'all' count
      const counts = { all: allCount };
      
      // Get count per tag
      if (tags && tags.length > 0) {
        // We already have the tags from the earlier fetch, but now we need to count articles per tag
        for (const tag of tags) {
          // For each tag, we could fetch the count from the API or calculate from existing data
          // This depends on your API capabilities
          const tagResponse = await throttledAxios.get('http://localhost:3002/api/news', {
            params: { tag_id: tag.id, limit: 0 }
          });
          
          counts[tag.id] = parseInt(tagResponse.data.pagination?.total) || 0;
        }
      }
      
      setTabCounts(counts);
      setTabCountsLoaded(true);
    } catch (error) {
      console.error('Error fetching tab counts:', error);
      // Initialize with just the 'all' count as 0
      setTabCounts({ all: 0 });
      setTabCountsLoaded(true);
    }
  };

  // Add debouncing for search
  const searchTimeoutRef = useRef(null);
  
  // Handle search input change with debounce
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
    setPage(1); // Reset to first page when searching
  };

  // Fetch news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        const lastRequestTime = window.lastNewsFetchTime || 0;
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        
        if (timeSinceLastRequest < 500) {
          await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLastRequest));
        }
        
        const params = {
          page,
          limit,
          sort_by: sortBy,
          sort_order: sortOrder
        };
        
        if (searchTerm) params.search = searchTerm;
        
        // If a tag is selected (not "all"), filter by tag_id
        if (activeTab !== 'all') {
          params.tag_id = activeTab;
        }
        
        console.log('Fetching news with params:', params);
        
        window.lastNewsFetchTime = Date.now();
        
        const response = await throttledAxios.get('http://localhost:3002/api/news', { params });
        
        console.log('API response:', response.data);
        
        if (response.data) {
          setNews(response.data.news || []);
          
          const pagination = response.data.pagination || {};
          setTotalNews(parseInt(pagination.total) || 0);
          setTotalPages(pagination.pages || 1);
          
          if (!tabCountsLoaded && response.data.news) {
            fetchTabCounts();
          }
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [page, limit, searchTerm, sortBy, sortOrder, activeTab, tabCountsLoaded, tags.length]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Format date as "Mar 15, 2024"
    const date = new Date(dateString);
    const options = { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">• Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">• Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• Archived</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• {status}</span>;
    }
  };
  
  // Find the active tag name for display
  const getActiveTabName = () => {
    if (activeTab === 'all') return '';
    
    const activeTagObj = tags.find(tag => tag.id.toString() === activeTab);
    return activeTagObj ? activeTagObj.name : '';
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">News</h1>
          <p className="text-gray-500 text-sm">News Articles</p>
        </div>
        <div>
          <Link href="/news/add-news" className="flex items-center px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800">
            Add News Article
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white'>
        <div className="flex border-b border-gray-200 mb-6 bg-white overflow-x-auto">
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
          
          {/* Dynamic tabs based on tags */}
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTabChange(tag.id.toString())}
              className={`py-3 px-4 text-sm font-medium relative ${
                activeTab === tag.id.toString()
                  ? 'border-b-2 border-green-700 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tag.name}
              <span className="ml-2 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                {tabCounts[tag.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* News list title */}
        <h2 className="text-lg font-bold mb-4">
          List of {getActiveTabName()} News Articles
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

        {/* News table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
          {loading ? (
            <div className="text-center py-4">Loading news articles...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-4">No news articles found</div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((article, index) => (
                  <tr key={article.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getRowNumber(index)}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {article.tags && article.tags.map(tag => (
                          <span key={tag.id} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                            {tag.name}
                          </span>
                        ))}
                        {(!article.tags || article.tags.length === 0) && (
                          <span className="text-gray-400 text-xs">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.publish_date ? formatDate(article.publish_date) : 'Not published'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleMenu(article.id)}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {openMenuId === article.id && (
                        <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            onClick={() => handleAction('view', article.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </button>
                          <button
                            onClick={() => handleAction('edit', article.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction('delete', article.id)}
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
            Showing {news.length > 0 ? ((page - 1) * limit) + 1 : 0} to {Math.min(page * limit, totalNews)} out of {totalNews} entries
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

export default NewsListPage;
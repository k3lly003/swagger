"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag as TagIcon,
  Eye,
  AlertCircle,
  Edit,
  Share2,
  ImageIcon,
  FileVideo
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define interface for news data
interface MediaItem {
  id: string;
  type: string;
  url: string;
  title?: string;
  cover: boolean;
  size: number;
  order: number;
  duration?: number;
  thumbnailUrl?: string;
}

interface Tag {
  id: number;
  name: string;
}

interface News {
  id: number;
  title: string;
  content: string;
  summary?: string;
  status: string;
  author_id: number;
  category: string;
  key_lessons?: string;
  publish_date?: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  views?: number;
  media: {
    items: MediaItem[];
  };
}

const NewsDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState('article');
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch the news data
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        
        // Fetch news article details
        try {
          const response = await axios.get(`http://localhost:3002/api/news/${params.id}`);
          console.log("API Response:", response.data);
          
          // Check if the response has a nested news object
          if (response.data && response.data.news) {
            setNews(response.data.news);
          } else if (response.data && response.data.id) {
            // Direct news object
            setNews(response.data);
          } else {
            throw new Error("Invalid news data structure");
          }
        } catch (apiError) {
          console.error('Error fetching news from API:', apiError);
          setError('Failed to fetch news details. Please try again later.');
        }

        // Set default authors
        setAuthors({
          1: 'Mukamana Fransine',
          2: 'John Doe',
          3: 'Jane Smith'
        });

      } catch (error) {
        console.error('Error in overall news data fetching:', error);
        setError('Failed to fetch news details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();

    // Add responsive sidebar handling
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [params.id]);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get author name from author_id
  const getAuthorName = (authorId: number | undefined) => {
    if (!authorId) return 'Unknown';
    return authors[authorId] || 'Unknown Author';
  };

  // Get status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
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

  // Get key lessons as array
  const getKeyLessons = (keyLessons: string | undefined) => {
    if (!keyLessons) return [];
    return keyLessons.split(';').map(lesson => lesson.trim()).filter(Boolean);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title || 'News Article',
          text: news?.summary || 'Check out this news article',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Get cover image
  const getCoverImage = () => {
    if (!news || !news.media || !news.media.items || news.media.items.length === 0) {
      return null;
    }
    
    const coverImage = news.media.items.find(item => item.cover && item.type === 'image');
    return coverImage ? coverImage.url : null;
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-full mx-auto container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading news details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-full mx-auto container">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <div className="mt-4">
            <Link href="/news" className="text-red-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="p-4 md:p-6 max-w-full mx-auto container">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>News article not found</span>
          </div>
          <div className="mt-4">
            <Link href="/news" className="text-yellow-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-full mx-auto container overflow-hidden">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="w-full">
          <Link href="/news" className="text-green-700 hover:underline flex items-center mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to News
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold truncate">{news.title}</h1>
            <div className="sm:ml-4">
              {getStatusBadge(news.status)}
            </div>
          </div>
          <p className="text-gray-500 text-sm">News / Article</p>
        </div>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Share"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <Link 
            href={`/news/edit/${news.id}`} 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Edit"
          >
            <Edit className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Mobile Tabs Navigation */}
      <div className="md:hidden mb-4 border-b border-gray-200">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('article')}
            className={`px-3 py-2 whitespace-nowrap ${activeTab === 'article' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600'}`}
          >
            Article
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-3 py-2 whitespace-nowrap ${activeTab === 'info' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600'}`}
          >
            Information
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`px-3 py-2 whitespace-nowrap ${activeTab === 'media' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600'}`}
          >
            Media
          </button>
        </div>
      </div>

      {/* News content with sidebar */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar navigation - only visible on medium screens and above */}
        <div className={`hidden md:block w-full md:w-1/4 bg-white p-4 rounded border border-gray-200 h-fit sticky top-4`}>
          <ul>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('article')}
                className={`w-full text-left flex items-start ${activeTab === 'article' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'article' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Article Content</p>
                  <p className="text-sm text-gray-500">Read the full article</p>
                </div>
              </button>
            </li>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('info')}
                className={`w-full text-left flex items-start ${activeTab === 'info' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'info' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Meta Information</p>
                  <p className="text-sm text-gray-500">Article details and metadata</p>
                </div>
              </button>
            </li>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('media')}
                className={`w-full text-left flex items-start ${activeTab === 'media' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'media' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Media</p>
                  <p className="text-sm text-gray-500">Images and videos</p>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          {/* Article tab */}
          {activeTab === 'article' && (
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 overflow-hidden">
              {/* Cover image */}
              {getCoverImage() && (
                <div className="mb-6">
                  <img 
                    src={getCoverImage() || ''} 
                    alt={news.title}
                    className="w-full h-48 md:h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Article metadata */}
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{getAuthorName(news.author_id)}</span>
                </div>
                {news.publish_date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(news.publish_date)}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated: {formatDate(news.updated_at)}</span>
                </div>
                {news.views !== undefined && (
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{news.views} views</span>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {news.tags && news.tags.length > 0 && (
                <div className="mb-6 overflow-x-auto">
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map(tag => (
                      <div 
                        key={tag.id}
                        className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm flex items-center whitespace-nowrap"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        <span>{tag.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Summary */}
              {news.summary && (
                <div className="mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg italic">
                    <p>{news.summary}</p>
                  </div>
                </div>
              )}
              
              {/* Main content */}
              <div className="prose max-w-none mb-6 overflow-hidden">
                <div className="whitespace-pre-line break-words">
                  {news.content}
                </div>
              </div>
              
              {/* Key lessons */}
              {news.key_lessons && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Key Takeaways</h2>
                  <div className="space-y-2">
                    {getKeyLessons(news.key_lessons).map((lesson, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md border-l-4 border-green-700 break-words">
                        <p>{lesson}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info tab */}
          {activeTab === 'info' && (
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Article Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg overflow-hidden">
                  <div className="text-sm text-gray-500 mb-1">Title</div>
                  <div className="font-medium break-words">{news.title}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="font-medium capitalize">{news.status}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Category</div>
                  <div className="font-medium capitalize">{news.category}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Author</div>
                  <div className="font-medium">{getAuthorName(news.author_id)}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Created At</div>
                  <div className="font-medium">{formatDate(news.created_at)}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                  <div className="font-medium">{formatDate(news.updated_at)}</div>
                </div>
                
                {news.publish_date && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Published Date</div>
                    <div className="font-medium">{formatDate(news.publish_date)}</div>
                  </div>
                )}
                
                {news.views !== undefined && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Views</div>
                    <div className="font-medium">{news.views}</div>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold mb-3">Tags</h3>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                {news.tags && news.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map(tag => (
                      <div 
                        key={tag.id}
                        className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm flex items-center whitespace-nowrap"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        <span>{tag.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No tags assigned</p>
                )}
              </div>
              
              {news.key_lessons && (
                <>
                  <h3 className="text-lg font-bold mb-3">Key Lessons</h3>
                  <div className="p-4 bg-gray-50 rounded-lg mb-6 overflow-hidden">
                    <ul className="list-disc pl-5 space-y-1 break-words">
                      {getKeyLessons(news.key_lessons).map((lesson, index) => (
                        <li key={index}>{lesson}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Media tab */}
          {activeTab === 'media' && (
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Media Files</h2>
              
              {news.media && news.media.items && news.media.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.media.items.map((media) => (
                    <div key={media.id} className="border rounded-lg overflow-hidden">
                      {media.type === 'image' ? (
                        <div className="h-48 bg-gray-100">
                          <img 
                            src={media.url} 
                            alt={media.title || 'Image'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : media.type === 'video' ? (
                        <div className="h-48 bg-gray-100 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {media.thumbnailUrl ? (
                              <img 
                                src={media.thumbnailUrl} 
                                alt={media.title || 'Video thumbnail'} 
                                className="w-full h-full object-cover absolute inset-0"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                                Video Preview
                              </div>
                            )}
                            <div className="z-10 bg-black bg-opacity-50 rounded-full p-3">
                              <FileVideo className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                          <div className="text-gray-400">File Preview</div>
                        </div>
                      )}
                      
                      <div className="p-4 overflow-hidden">
                        <h3 className="font-medium mb-1 truncate">{media.title || 'Untitled'}</h3>
                        <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                          <div>Type: {media.type}</div>
                          <div>Size: {formatFileSize(media.size)}</div>
                          {media.duration && <div>Duration: {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}</div>}
                        </div>
                        
                        {media.cover && (
                          <div className="mt-2">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Cover image</span>
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <a 
                            href={media.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline text-sm"
                          >
                            Open {media.type} in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No media files attached to this news article.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
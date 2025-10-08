"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Tag,
  Clock,
  CheckCircle,
  FileText,
  Image,
  Film,
  AlertCircle
} from 'lucide-react';

// Define TypeScript interfaces for our data structures
interface Media {
  id: string;
  tag: string;
  url: string;
  size: number;
  type: string;
  cover: boolean;
  order: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
}

interface Goal {
  id: string;
  order: number;
  title: string;
  completed: boolean;
  description: string;
}

interface Outcome {
  id: string;
  order: number;
  title: string;
  status: string;
  description: string;
}

interface Member {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
  start_date: string;
  end_date: string | null;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_by: number;
  category_id: number;
  location: string;
  goals: { items: Goal[] };
  outcomes: { items: Outcome[] };
  media: { items: Media[] };
  other_information: string | null;
  created_at: string;
  updated_at: string;
  members: Member[];
}

const ProjectDetailsPage = ({ params }: { params: { id: string } }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [users, setUsers] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState('details');

  // Fetch the project data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch project details from API
        try {
          const response = await axios.get(`http://localhost:3002/api/projects/${params.id}`);
          console.log("API Response:", response.data);
          
          // Check if the response has a nested project object (as shown in the Swagger docs)
          if (response.data && response.data.project) {
            console.log("Setting project from nested project object");
            setProject(response.data.project);
          } else if (response.data && response.data.id) {
            // Direct project object
            console.log("Setting project from direct response");
            setProject(response.data);
          } else {
            throw new Error("Invalid project data structure");
          }
        } catch (apiError) {
          console.error('Error fetching project from API:', apiError);
          // If API fails, show error
          setError('Failed to fetch project details. Please try again later.');
        }

        // Set fallback categories
        setCategories({
          1: 'Food system',
          2: 'Climate adaptation',
          3: 'Data & Evidence'
        });

        // Set fallback users
        setUsers({
          1: 'Mukamana Fransine',
          2: 'John Doe',
          3: 'Jane Smith',
          4: 'Mukamana Fransine'
        });

        // Try to fetch categories from API (optional)
        try {
          const categoriesResponse = await axios.get('http://localhost:3002/api/project-categories');
          if (categoriesResponse.data && categoriesResponse.data.length > 0) {
            const categoriesMap: Record<number, string> = {};
            categoriesResponse.data.forEach((category: { id: number; name: string }) => {
              categoriesMap[category.id] = category.name;
            });
            setCategories(categoriesMap);
          }
        } catch (error) {
          console.log('Using fallback categories');
        }

        // Try to fetch users from API (optional)
        try {
          const usersResponse = await axios.get('http://localhost:3002/api/users');
          if (usersResponse.data && usersResponse.data.length > 0) {
            const usersMap: Record<number, string> = {};
            usersResponse.data.forEach((user: { id: number; first_name: string; last_name: string }) => {
              usersMap[user.id] = `${user.first_name} ${user.last_name}`;
            });
            setUsers(usersMap);
          }
        } catch (error) {
          console.log('Using fallback users');
        }

      } catch (error) {
        console.error('Error in overall project data fetching:', error);
        setError('Failed to fetch project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
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

  // Get category name from category_id
  const getCategoryName = (categoryId: number | undefined) => {
    if (!categoryId) return 'Unknown';
    return categories[categoryId] || 'Unknown Category';
  };

  // Get user name from user_id
  const getUserName = (userId: number | undefined) => {
    if (!userId) return 'Unknown';
    return users[userId] || 'Unknown User';
  };

  // Extract team lead from project members
  const getTeamLead = () => {
    if (!project || !project.members || project.members.length === 0) {
      // If no members, use created_by as fallback for lead
      return getUserName(project?.created_by);
    }
    
    const lead = project.members.find(member => member.role === 'lead');
    if (lead) {
      // Return user name from our users map if available
      return getUserName(lead.user_id);
    } else {
      // Fallback to created_by
      return getUserName(project.created_by);
    }
  };

  // Map status for display
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">• Completed</span>;
      case 'planned':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">• Pending</span>;
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">• In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• {status}</span>;
    }
  };

  // Get file size in readable format
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Render media item
  const renderMediaItem = (media: Media) => {
    return (
      <div key={media.id} className="bg-white p-4 border rounded-lg mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{media.title}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{media.tag}</span>
        </div>
        
        {media.type === 'image' ? (
          <div className="mb-3">
            <img 
              src={media.url} 
              alt={media.title} 
              className="w-full h-48 object-cover rounded"
            />
          </div>
        ) : media.type === 'video' ? (
          <div className="mb-3 relative">
            <div className="relative overflow-hidden rounded">
              <img 
                src={media.thumbnailUrl || '/api/placeholder/400/320'} 
                alt={`Thumbnail for ${media.title}`} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <Film className="text-white w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-3 p-4 border border-dashed rounded flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          {media.description && <p className="mb-1">{media.description}</p>}
          <p>Size: {formatFileSize(media.size)}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <div className="mt-4">
            <Link href="/projects" className="text-red-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Debug output
  console.log("Current project state:", project);
  
  if (!project) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Project not found</span>
          </div>
          <div className="mt-4">
            <Link href="/projects" className="text-yellow-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/projects" className="text-green-700 hover:underline flex items-center mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
          </Link>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="ml-4">
              {getStatusBadge(project.status)}
            </div>
          </div>
          <p className="text-gray-500 text-sm">Projects / View</p>
        </div>
        <Link 
          href={`/projects/edit-project/${project.id}`} 
          className="px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800"
        >
          Edit Project
        </Link>
      </div>

      {/* Project content with sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded border border-gray-200">
          <ul>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('details')}
                className={`w-full text-left flex items-start ${activeTab === 'details' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'details' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Project Details</p>
                  <p className="text-sm text-gray-500">The overview, vision, progress of the project</p>
                </div>
              </button>
            </li>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('team')}
                className={`w-full text-left flex items-start ${activeTab === 'team' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'team' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">The Team</p>
                  <p className="text-sm text-gray-500">Meet the people making it happen</p>
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
                  <p className="font-semibold">File & Uploads</p>
                  <p className="text-sm text-gray-500">Project artifacts and file collection</p>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          {/* Details tab */}
          {activeTab === 'details' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              {/* Project featured image */}
              <div className="mb-8">
                {project.media && project.media.items && project.media.items.length > 0 && (
                  project.media.items.find(item => item.tag === 'feature') ? (
                    <img 
                      src={project.media.items.find(item => item.tag === 'feature')?.url || '/api/placeholder/800/400'} 
                      alt={project.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">No featured image</p>
                    </div>
                  )
                )}
              </div>
                 {/* Description */}
                 <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Project Description</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-line">{project.description || 'No description provided.'}</p>
                </div>
              </div>
              {/* Basic info section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Tag className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Category</span>
                    </div>
                    <p className="font-medium">{getCategoryName(project.category_id)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Location</span>
                    </div>
                    <p className="font-medium">{project.location || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Start Date</span>
                    </div>
                    <p className="font-medium">{formatDate(project.start_date)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">End Date</span>
                    </div>
                    <p className="font-medium">{formatDate(project.end_date)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Team Lead</span>
                    </div>
                    <p className="font-medium">{getTeamLead()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Created</span>
                    </div>
                    <p className="font-medium">{formatDate(project.created_at)}</p>
                  </div>
                </div>
              </div>

           

              {/* Goals */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Project Goals</h2>
                {project.goals && project.goals.items && project.goals.items.length > 0 ? (
                  <div className="space-y-4">
                    {project.goals.items.map((goal) => (
                      <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-700">
                        <div className="flex items-start mb-2">
                          <div className="mr-2 mt-1">
                            <CheckCircle className={`w-4 h-4 ${goal.completed ? 'text-green-600' : 'text-gray-400'}`} />
                          </div>
                          <h3 className="font-medium">{goal.title}</h3>
                        </div>
                        <p className="text-gray-600 ml-6">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    No goals defined for this project.
                  </div>
                )}
              </div>

              {/* Outcomes */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Project Outcomes</h2>
                {project.outcomes && project.outcomes.items && project.outcomes.items.length > 0 ? (
                  <div className="space-y-4">
                    {project.outcomes.items.map((outcome) => (
                      <div key={outcome.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{outcome.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            outcome.status === 'completed' ? 'bg-green-100 text-green-800' :
                            outcome.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600">{outcome.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    No outcomes defined for this project.
                  </div>
                )}
              </div>

              {/* Other Information */}
              {project.other_information && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Other Relevant Information</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-line">{project.other_information}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team tab */}
          {activeTab === 'team' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Project Team</h2>
              
              {project.members && project.members.length > 0 ? (
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-lg flex items-start">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-green-700 font-bold">
                          {getUserName(member.user_id).split(' ').map(name => name[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{getUserName(member.user_id)}</h3>
                        <p className="text-sm text-gray-500 capitalize mb-1">{member.role}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {formatDate(member.start_date)}
                          {member.end_date && ` • Left: ${formatDate(member.end_date)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No team members assigned to this project.
                </div>
              )}
            </div>
          )}

          {/* Media tab */}
          {activeTab === 'media' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Project Media</h2>
              
              {project.media && project.media.items && project.media.items.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-500 mb-2">Feature Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.media.items
                        .filter(item => item.tag === 'feature')
                        .map(renderMediaItem)}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-500 mb-2">Description Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.media.items
                        .filter(item => item.tag === 'description')
                        .map(renderMediaItem)}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Other Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.media.items
                        .filter(item => item.tag === 'others' || !['feature', 'description'].includes(item.tag))
                        .map(renderMediaItem)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No media files uploaded for this project.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
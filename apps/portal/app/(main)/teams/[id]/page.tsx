"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  ArrowLeft,
  Mail,
  Globe,
  Tag,
  Clock,
  User,
  Briefcase,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const TeamDetailsPage = ({ params }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamTypes, setTeamTypes] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch the team data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch team details from API
        try {
          const response = await axios.get(`http://localhost:3002/api/teams/${params.id}`);
          console.log("API Response:", response.data);
          
          // Check if the response has a nested team object
          if (response.data && response.data.team) {
            console.log("Setting team from nested team object");
            setTeam(response.data.team);
          } else if (response.data && response.data.id) {
            // Direct team object
            console.log("Setting team from direct response");
            setTeam(response.data);
          } else {
            throw new Error("Invalid team data structure");
          }
        } catch (apiError) {
          console.error('Error fetching team from API:', apiError);
          setError('Failed to fetch team details. Please try again later.');
        }

        // Set team types
        setTeamTypes({
          1: 'Leadership',
          2: 'Technical',
          3: 'Support'
        });

        // Try to fetch team types from API (optional)
        try {
          const teamTypesResponse = await axios.get('http://localhost:3002/api/team-types');
          if (teamTypesResponse.data && teamTypesResponse.data.length > 0) {
            const typesMap = {};
            teamTypesResponse.data.forEach((type) => {
              typesMap[type.id] = type.name;
            });
            setTeamTypes(typesMap);
          }
        } catch (error) {
          console.log('Using fallback team types');
        }

      } catch (error) {
        console.error('Error in overall team data fetching:', error);
        setError('Failed to fetch team details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [params.id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get team type name from team_type_id
  const getTeamTypeName = (teamTypeId) => {
    if (!teamTypeId) return 'Unknown';
    return teamTypes[teamTypeId] || 'Unknown Type';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team details...</p>
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
            <Link href="/teams" className="text-red-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Team member not found</span>
          </div>
          <div className="mt-4">
            <Link href="/teams" className="text-yellow-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Teams
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
          <Link href="/teams" className="text-green-700 hover:underline flex items-center mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Teams
          </Link>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <div className="ml-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                team.team_type_id === 1 ? 'bg-blue-100 text-blue-800' : 
                team.team_type_id === 2 ? 'bg-green-100 text-green-800' : 
                'bg-purple-100 text-purple-800'
              }`}>
                {getTeamTypeName(team.team_type_id)}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">Teams / View</p>
        </div>
        <Link 
          href={`/teams/edit-team/${team.id}`} 
          className="px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800"
        >
          Edit Team Member
        </Link>
      </div>

      {/* Team content with sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded border border-gray-200">
          <ul>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left flex items-start ${activeTab === 'profile' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'profile' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Profile</p>
                  <p className="text-sm text-gray-500">Personal information and details</p>
                </div>
              </button>
            </li>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('skills')}
                className={`w-full text-left flex items-start ${activeTab === 'skills' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'skills' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Skills & Expertise</p>
                  <p className="text-sm text-gray-500">Areas of expertise and competencies</p>
                </div>
              </button>
            </li>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('bio')}
                className={`w-full text-left flex items-start ${activeTab === 'bio' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'bio' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Biography</p>
                  <p className="text-sm text-gray-500">Professional background and experiences</p>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              {/* Profile image and basic info */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Profile photo */}
                <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img 
                      src={team.photo_url || "/api/placeholder/400/400"} 
                      alt={team.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Basic info */}
                <div className="w-full md:w-2/3">
                  <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <User className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Full Name</span>
                      </div>
                      <p className="font-medium">{team.name}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Briefcase className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Position</span>
                      </div>
                      <p className="font-medium">{team.position || 'Not specified'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Email</span>
                      </div>
                      <p className="font-medium">{team.email || 'Not specified'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Tag className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Team Type</span>
                      </div>
                      <p className="font-medium">{getTeamTypeName(team.team_type_id)}</p>
                    </div>
                    
                    {team.profile_link && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Globe className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-500">Profile Link</span>
                        </div>
                        <a 
                          href={team.profile_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium flex items-center"
                        >
                          View Profile <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Added on</span>
                      </div>
                      <p className="font-medium">{formatDate(team.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills tab */}
          {activeTab === 'skills' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Skills & Expertise</h2>
              
              {team.skills && team.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.skills.map((skill, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-700">
                      <span className="font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No skills have been added for this team member.
                </div>
              )}
            </div>
          )}

          {/* Bio tab */}
          {activeTab === 'bio' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Biography</h2>
              
              {team.bio ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-line">{team.bio}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No biography information available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsPage;
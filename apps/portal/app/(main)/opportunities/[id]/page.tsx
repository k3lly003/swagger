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
  GraduationCap,
  Globe,
  Briefcase,
  Code,
  ListChecks,
  AlertCircle,
  FileText,
  CheckCircle,
  Book,
  Users,
  Laptop
} from 'lucide-react';

const OpportunityDetailsPage = ({ params }) => {
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [activeTab, setActiveTab] = useState('details');
  
  // Types of opportunities for display
  const opportunityTypes = {
    fellowship: 'Fellowship',
    scholarship: 'Scholarship',
    grant: 'Grant',
    internship: 'Internship',
    program: 'Program',
    workshop: 'Workshop',
    competition: 'Competition'
  };

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

  // Fetch the opportunity data
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch opportunity details from API
        try {
          const response = await axios.get(`http://localhost:3002/api/opportunities/${params.id}`);
          console.log("API Response:", response.data);
          
          // Check if the response has a nested opportunity object
          if (response.data && response.data.opportunity) {
            console.log("Setting opportunity from nested opportunity object");
            setOpportunity(response.data.opportunity);
          } else if (response.data && response.data.id) {
            // Direct opportunity object
            console.log("Setting opportunity from direct response");
            setOpportunity(response.data);
          } else {
            throw new Error("Invalid opportunity data structure");
          }
        } catch (apiError) {
          console.error('Error fetching opportunity from API:', apiError);
          // If API fails, show error
          setError('Failed to fetch opportunity details. Please try again later.');
        }

      } catch (error) {
        console.error('Error in overall opportunity data fetching:', error);
        setError('Failed to fetch opportunity details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityData();
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

  // Get category name from category_id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Unknown';
    return categories[categoryId] || 'Unknown Category';
  };

  // Map status for display
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">• Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">• Archived</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">• Closed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">• {status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
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
            <Link href="/opportunities" className="text-red-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Debug output
  console.log("Current opportunity state:", opportunity);
  
  if (!opportunity) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Opportunity not found</span>
          </div>
          <div className="mt-4">
            <Link href="/opportunities" className="text-yellow-700 font-medium hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Opportunities
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
          <Link href="/opportunities" className="text-green-700 hover:underline flex items-center mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Opportunities
          </Link>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{opportunity.title}</h1>
            <div className="ml-4">
              {getStatusBadge(opportunity.status)}
            </div>
          </div>
          <p className="text-gray-500 text-sm">Opportunities / View</p>
        </div>
        <Link 
          href={`/opportunities/edit-opportunity/${opportunity.id}`} 
          className="px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800"
        >
          Edit Opportunity
        </Link>
      </div>

      {/* Opportunity content with sidebar */}
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
                  <p className="font-semibold">Opportunity Details</p>
                  <p className="text-sm text-gray-500">Overview and basic information</p>
                </div>
              </button>
            </li>
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('eligibility')}
                className={`w-full text-left flex items-start ${activeTab === 'eligibility' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'eligibility' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Eligibility Criteria</p>
                  <p className="text-sm text-gray-500">Who can apply for this opportunity</p>
                </div>
              </button>
            </li>
            {opportunity.type === 'fellowship' && opportunity.fellowship_details && (
              <li className="mb-6">
                <button 
                  onClick={() => setActiveTab('program')}
                  className={`w-full text-left flex items-start ${activeTab === 'program' ? 'text-green-700' : 'text-gray-700'}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${activeTab === 'program' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Program Structure</p>
                    <p className="text-sm text-gray-500">Details about the fellowship program</p>
                  </div>
                </button>
              </li>
            )}
            <li className="mb-6">
              <button 
                onClick={() => setActiveTab('application')}
                className={`w-full text-left flex items-start ${activeTab === 'application' ? 'text-green-700' : 'text-gray-700'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'application' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Application Form</p>
                  <p className="text-sm text-gray-500">Custom questions for applicants</p>
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
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Opportunity Description</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-line">{opportunity.description || 'No description provided.'}</p>
                </div>
              </div>

              {/* Basic info section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Tag className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Type</span>
                    </div>
                    <p className="font-medium capitalize">{opportunityTypes[opportunity.type] || opportunity.type}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Tag className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Category</span>
                    </div>
                    <p className="font-medium">{getCategoryName(opportunity.category_id)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Location</span>
                    </div>
                    <p className="font-medium">{opportunity.location || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Laptop className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Location Type</span>
                    </div>
                    <p className="font-medium capitalize">{opportunity.location_type || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Application Deadline</span>
                    </div>
                    <p className="font-medium">{formatDate(opportunity.application_deadline)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">Status</span>
                    </div>
                    <p className="font-medium capitalize">{opportunity.status || 'Draft'}</p>
                  </div>
                </div>
              </div>

              {/* For fellowship-specific details if available */}
              {opportunity.type === 'fellowship' && opportunity.fellowship_details && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Fellowship Overview</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Program Name</p>
                        <p className="font-medium">{opportunity.fellowship_details.program_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Cohort</p>
                        <p className="font-medium">{opportunity.fellowship_details.cohort || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Fellowship Type</p>
                        <p className="font-medium capitalize">{opportunity.fellowship_details.fellowship_type || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Eligibility tab */}
          {activeTab === 'eligibility' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Eligibility Criteria</h2>
              
              {opportunity.eligibility_criteria ? (
                <div className="space-y-6">
                  {/* Education level */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <GraduationCap className="w-5 h-5 text-green-700 mr-2" />
                      <h3 className="font-medium">Minimum Education Required</h3>
                    </div>
                    <p className="ml-7">{opportunity.eligibility_criteria.min_education_level || 'No specific education requirements'}</p>
                  </div>
                  
                  {/* Experience */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Briefcase className="w-5 h-5 text-green-700 mr-2" />
                      <h3 className="font-medium">Experience Required</h3>
                    </div>
                    <p className="ml-7">
                      {opportunity.eligibility_criteria.experience_years ?
                        `${opportunity.eligibility_criteria.experience_years} year${opportunity.eligibility_criteria.experience_years !== 1 ? 's' : ''} of experience required` :
                        'No specific experience requirements'}
                    </p>
                  </div>
                  
                  {/* Eligible countries */}
                  {opportunity.eligibility_criteria.countries && opportunity.eligibility_criteria.countries.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-3">
                        <Globe className="w-5 h-5 text-green-700 mr-2" />
                        <h3 className="font-medium">Eligible Countries</h3>
                      </div>
                      <div className="ml-7">
                        <div className="flex flex-wrap gap-2">
                          {opportunity.eligibility_criteria.countries.map((country, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Skills required */}
                  {opportunity.eligibility_criteria.skills_required && opportunity.eligibility_criteria.skills_required.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-3">
                        <Code className="w-5 h-5 text-green-700 mr-2" />
                        <h3 className="font-medium">Required Skills</h3>
                      </div>
                      <div className="ml-7">
                        <div className="flex flex-wrap gap-2">
                          {opportunity.eligibility_criteria.skills_required.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Other requirements */}
                  {opportunity.eligibility_criteria.other_requirements && opportunity.eligibility_criteria.other_requirements.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-3">
                        <ListChecks className="w-5 h-5 text-green-700 mr-2" />
                        <h3 className="font-medium">Other Requirements</h3>
                      </div>
                      <ul className="ml-7 list-disc pl-5 space-y-1">
                        {opportunity.eligibility_criteria.other_requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No eligibility criteria defined for this opportunity.
                </div>
              )}
            </div>
          )}

          {/* Program Structure tab - for fellowships */}
          {activeTab === 'program' && opportunity.type === 'fellowship' && opportunity.fellowship_details && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Program Structure</h2>
              
              {/* Learning outcomes */}
              {opportunity.fellowship_details.learning_outcomes && opportunity.fellowship_details.learning_outcomes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Learning Outcomes</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <ul className="list-disc pl-5 space-y-2">
                      {opportunity.fellowship_details.learning_outcomes.map((outcome, index) => (
                        <li key={index} className="text-gray-700">{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Program phases */}
              {opportunity.fellowship_details.program_structure && 
               opportunity.fellowship_details.program_structure.phases && 
               opportunity.fellowship_details.program_structure.phases.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Program Phases</h3>
                  <div className="space-y-4">
                    {opportunity.fellowship_details.program_structure.phases.map((phase, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-700">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{phase.name}</h4>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {phase.duration_weeks} week{phase.duration_weeks !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Program activities */}
              {opportunity.fellowship_details.program_structure && 
               opportunity.fellowship_details.program_structure.activities && 
               opportunity.fellowship_details.program_structure.activities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Program Activities</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {opportunity.fellowship_details.program_structure.activities.map((activity, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Application Form tab */}
          {activeTab === 'application' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Application Form</h2>
              
              {opportunity.custom_questions && opportunity.custom_questions.length > 0 ? (
                <div className="space-y-6">
                  <p className="text-gray-700 mb-4">
                    Below are the custom questions that applicants will need to answer when applying for this opportunity.
                  </p>
                  
                  {opportunity.custom_questions.map((question, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start">
                          <span className="bg-green-100 text-green-800 text-xs font-medium rounded px-2 py-1 mr-2">
                            Q{index + 1}
                          </span>
                          <div>
                            <h3 className="font-medium">{question.question}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Field type: <span className="font-semibold capitalize">{question.field_type}</span>
                              {question.is_required && <span className="ml-2 text-red-600">Required</span>}
                              {question.max_length && <span className="ml-2">Max length: {question.max_length} characters</span>}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">Order: {question.order}</span>
                      </div>
                      
                      {/* Show options for multi-select or single-select questions */}
                      {(question.field_type === 'multiselect' || question.field_type === 'select') && question.options && (
                        <div className="mt-3 pl-8">
                          <p className="text-sm font-medium mb-2">Options:</p>
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((option, optIndex) => (
                              <span key={optIndex} className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm">
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No custom questions defined for this opportunity's application form.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailsPage;
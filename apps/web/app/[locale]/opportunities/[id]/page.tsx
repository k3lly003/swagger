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
  Laptop,
  Award,
  Target
} from 'lucide-react';
import { useParams } from 'next/navigation';

const OpportunityDetailsPage = () => {
  const params = useParams();
  interface Opportunity {
    id: string;
    title: string;
    type: keyof typeof opportunityTypes;
    status: string;
    location?: string;
    location_type?: string;
    application_deadline?: string;
    category_id?: number;
    description?: string;
    eligibility_criteria?: {
      min_education_level?: string;
      experience_years?: number;
      countries?: string[];
      skills_required?: string[];
      other_requirements?: string[];
    };
    fellowship_details?: {
      program_name?: string;
      cohort?: string;
      fellowship_type?: string;
      duration?: string;
      start_date?: string;
      learning_outcomes?: string[];
      program_structure?: {
        phases?: { name: string; duration_weeks: number; description: string }[];
        activities?: string[];
      };
    };
    custom_questions?: {
      question: string;
      field_type: string;
      is_required?: boolean;
      max_length?: number;
      options?: string[];
      order: number;
    }[];
  }
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Record<string | number, string>>({});
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
  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get category name from category_id
  const getCategoryName = (categoryId: string | number | undefined) => {
    if (!categoryId) return 'Unknown';
    return categories[categoryId] || 'Unknown Category';
  };

  // Map status for display
  interface StatusBadgeProps {
    status: string;
  }

  const getStatusBadge = (status: string | undefined): JSX.Element | null => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
            <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Published</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Draft</span>
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap">
            <Book className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Archived</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 whitespace-nowrap">
            <Award className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Closed</span>
          </span>
        );
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 truncate max-w-[100px]">• {status}</span>;
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
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section - Reduced height since there's no image */}
      <div className="relative h-[30vh] sm:h-[40vh] md:h-[40vh] w-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-800 flex items-center justify-center">
              {opportunity.type === 'fellowship' && <GraduationCap className="w-10 h-10 text-green-200" />}
              {opportunity.type === 'scholarship' && <Book className="w-10 h-10 text-green-200" />}
              {opportunity.type === 'grant' && <Award className="w-10 h-10 text-green-200" />}
              {opportunity.type === 'internship' && <Briefcase className="w-10 h-10 text-green-200" />}
              {opportunity.type === 'program' && <Users className="w-10 h-10 text-green-200" />}
              {opportunity.type === 'workshop' && <Target className="w-10 h-10 text-green-200" />}
              {opportunity.type === 'competition' && <Award className="w-10 h-10 text-green-200" />}
              {(!opportunity.type || !(opportunity.type in opportunityTypes)) && <FileText className="w-10 h-10 text-green-200" />}
            </div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <Link
                href="/opportunities"
                className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 mb-6 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                  Back to Opportunities
                </span>
              </Link>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight break-words">
                {opportunity.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-white/90 mb-8 overflow-hidden max-w-full">
                <div className="overflow-x-auto">
                  <span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all duration-300 whitespace-nowrap">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Deadline: {formatDate(opportunity.application_deadline)}</span>
                  </span>
                </div>
                {opportunity.location && (
                  <div className="overflow-x-auto">
                    <span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all duration-300 whitespace-nowrap">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{opportunity.location}</span>
                    </span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all duration-300 whitespace-nowrap">
                    <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{opportunityTypes[opportunity.type] || opportunity.type}</span>
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all duration-300">
                    {getStatusBadge(opportunity.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-16 w-full overflow-hidden">
            {/* Description */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="h-0.5 w-12 bg-green-700 flex-shrink-0"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">About the Opportunity</h2>
              </div>
              <div className="break-words bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed w-full whitespace-pre-line">
                  {opportunity.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Eligibility */}
            {opportunity.eligibility_criteria && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-0.5 w-12 bg-green-700 flex-shrink-0"></div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">Eligibility Criteria</h2>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
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
              </div>
            )}

            {/* Fellowship Program Structure */}
            {opportunity.type === 'fellowship' && opportunity.fellowship_details && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-0.5 w-12 bg-green-700 flex-shrink-0"></div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">Program Structure</h2>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-8">
                  {/* Learning outcomes */}
                  {opportunity.fellowship_details.learning_outcomes && opportunity.fellowship_details.learning_outcomes.length > 0 && (
                    <div>
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
                    <div>
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
              </div>
            )}

            {/* Application Form */}
            {opportunity.custom_questions && opportunity.custom_questions.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-0.5 w-12 bg-green-700 flex-shrink-0"></div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">Application Form</h2>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 mb-6">
                    Below are the custom questions that applicants will need to answer when applying for this opportunity.
                  </p>
                  
                  <div className="space-y-6">
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
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Action Button */}
            <div className="sticky top-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <Link 
  href={`${opportunity.id}/apply`} 
  className="w-full block text-center px-4 py-3 bg-green-700 rounded-lg text-sm font-medium text-white hover:bg-green-800 transition-colors"
>
  Apply to Opportunity
</Link>
              </div>

              {/* Basic Information */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-0.5 w-12 bg-green-700 flex-shrink-0"></div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">Opportunity Information</h2>
                </div>
                <div className="space-y-4 w-full overflow-hidden bg-white rounded-lg border border-gray-200 p-6">
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

              {/* For fellowship-specific details */}
              {opportunity.type === 'fellowship' && opportunity.fellowship_details && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="h-0.5 w-12 bg-green-700 flex-shrink-0"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">Fellowship Details</h2>
                  </div>
                  <div className="space-y-4 w-full overflow-hidden bg-white rounded-lg border border-gray-200 p-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Program Name</span>
                      </div>
                      <p className="font-medium">{opportunity.fellowship_details.program_name || 'Not specified'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Users className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Cohort</span>
                      </div>
                      <p className="font-medium">{opportunity.fellowship_details.cohort || 'Not specified'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Book className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">Fellowship Type</span>
                      </div>
                      <p className="font-medium capitalize">{opportunity.fellowship_details.fellowship_type || 'Not specified'}</p>
                    </div>
                    
                    {opportunity.fellowship_details.duration && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-500">Duration</span>
                        </div>
                        <p className="font-medium">{opportunity.fellowship_details.duration || 'Not specified'}</p>
                      </div>
                    )}

                    {opportunity.fellowship_details.start_date && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-500">Start Date</span>
                        </div>
                        <p className="font-medium">{formatDate(opportunity.fellowship_details.start_date)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailsPage;
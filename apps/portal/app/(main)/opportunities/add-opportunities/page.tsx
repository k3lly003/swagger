"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader, Calendar, X, UserPlus, Plus, Trash2 } from 'lucide-react';
import MultipleSelector, { Option } from '@workspace/ui/components/multiple-selector';

// Define opportunity types and their respective schemas
const opportunityTypes = [
  { value: 'fellowship', label: 'Fellowship Program' },
  { value: 'employment', label: 'Employment Position' }
];

// Define status options
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Define location types
const locationTypes = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' }
];

// Define education levels for eligibility
const educationLevels = [
  { value: 'high_school', label: 'High School' },
  { value: 'associates', label: 'Associates Degree' },
  { value: 'bachelors', label: 'Bachelors Degree' },
  { value: 'masters', label: 'Masters Degree' },
  { value: 'phd', label: 'PhD' }
];

// Define fellowship types
const fellowshipTypes = [
  { value: 'research', label: 'Research' },
  { value: 'professional', label: 'Professional Development' },
  { value: 'academic', label: 'Academic' },
  { value: 'community', label: 'Community Service' }
];

// Define employment types
const employmentTypes = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

// Define position levels
const positionLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive Level' }
];

// Field types for custom questions
const fieldTypes = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'file', label: 'File Upload' }
];

// Sample project categories
const categoryOptions = [
  { value: 1, label: 'Technology' },
  { value: 2, label: 'Business' },
  { value: 3, label: 'Research' },
  { value: 4, label: 'Education' },
  { value: 5, label: 'Healthcare' }
];

const CreateOpportunityForm = () => {
  const router = useRouter();
  
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'fellowship', // Default type
    status: 'draft',
    location_type: 'remote',
    location: '',
    application_deadline: '',
    category_id: null,
    eligibility_criteria: {
      countries: [],
      min_education_level: '',
      experience_years: 0,
      skills_required: [],
      other_requirements: []
    },
    custom_questions: [],
    fellowship_details: {
      program_name: '',
      cohort: '',
      fellowship_type: '',
      learning_outcomes: [],
      program_structure: {
        phases: [
          {
            name: '',
            description: '',
            duration_weeks: 0
          }
        ],
        activities: []
      }
    },
    employment_details: {
      position_level: '',
      employment_type: '',
      department: '',
      responsibilities: [],
      qualifications: {
        required: [],
        preferred: []
      }
    }
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Country options for selector (simplified list)
  const countryOptions = [
    { label: 'United States', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Australia', value: 'Australia' },
    { label: 'Germany', value: 'Germany' },
    { label: 'France', value: 'France' },
    { label: 'Japan', value: 'Japan' },
    { label: 'China', value: 'China' },
    { label: 'Brazil', value: 'Brazil' },
    { label: 'India', value: 'India' }
  ];

  // State for selectors
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);
  const [selectedOtherRequirements, setSelectedOtherRequirements] = useState<Option[]>([]);
  const [selectedLearningOutcomes, setSelectedLearningOutcomes] = useState<Option[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Option[]>([]);
  const [selectedResponsibilities, setSelectedResponsibilities] = useState<Option[]>([]);
  const [selectedRequiredQualifications, setSelectedRequiredQualifications] = useState<Option[]>([]);
  const [selectedPreferredQualifications, setSelectedPreferredQualifications] = useState<Option[]>([]);
  
  // Custom question option state (for dropdown type questions)
  const [questionOptions, setQuestionOptions] = useState<{ [key: number]: string }>({});
  const [newQuestionOption, setNewQuestionOption] = useState<{ [key: number]: string }>({});

  // Handler for basic input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData({
        ...formData,
        [parentKey]: {
          ...formData[parentKey as keyof typeof formData],
          [childKey]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handler for eligibility criteria changes
  const handleEligibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for numeric experience_years
    if (name === 'experience_years') {
      setFormData({
        ...formData,
        eligibility_criteria: {
          ...formData.eligibility_criteria,
          [name]: Number(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        eligibility_criteria: {
          ...formData.eligibility_criteria,
          [name]: value
        }
      });
    }
  };

  // Handler for fellowship details changes
  const handleFellowshipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      fellowship_details: {
        ...formData.fellowship_details,
        [name]: value
      }
    });
  };

  // Handler for employment details changes
  const handleEmploymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      employment_details: {
        ...formData.employment_details,
        [name]: value
      }
    });
  };

  // Handler for program structure phase changes
  const handlePhaseChange = (index: number, field: string, value: string | number) => {
    const updatedPhases = [...formData.fellowship_details.program_structure.phases];
    updatedPhases[index] = {
      ...updatedPhases[index],
      [field]: field === 'duration_weeks' ? Number(value) : value
    };
    
    setFormData({
      ...formData,
      fellowship_details: {
        ...formData.fellowship_details,
        program_structure: {
          ...formData.fellowship_details.program_structure,
          phases: updatedPhases
        }
      }
    });
  };

  // Add a new phase to program structure
  const addPhase = () => {
    const newPhase = {
      name: '',
      description: '',
      duration_weeks: 0
    };
    
    setFormData({
      ...formData,
      fellowship_details: {
        ...formData.fellowship_details,
        program_structure: {
          ...formData.fellowship_details.program_structure,
          phases: [...formData.fellowship_details.program_structure.phases, newPhase]
        }
      }
    });
  };

  // Remove a phase from program structure
  const removePhase = (index: number) => {
    const updatedPhases = formData.fellowship_details.program_structure.phases.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      fellowship_details: {
        ...formData.fellowship_details,
        program_structure: {
          ...formData.fellowship_details.program_structure,
          phases: updatedPhases
        }
      }
    });
  };

  // Add a new custom question
  const addCustomQuestion = () => {
    const newQuestion = {
      question: '',
      field_type: 'text',
      is_required: false,
      order: formData.custom_questions.length + 1,
      options: []
    };
    
    setFormData({
      ...formData,
      custom_questions: [...formData.custom_questions, newQuestion]
    });
  };

  // Update a custom question
  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...formData.custom_questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      custom_questions: updatedQuestions
    });
  };

  // Remove a custom question
  const removeCustomQuestion = (index: number) => {
    const updatedQuestions = formData.custom_questions.filter((_, i) => i !== index);
    // Update order for remaining questions
    const reorderedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      order: i + 1
    }));
    
    setFormData({
      ...formData,
      custom_questions: reorderedQuestions
    });
  };

  // Add an option to a question
  const addQuestionOption = (questionIndex: number) => {
    if (!newQuestionOption[questionIndex]?.trim()) return;
    
    const updatedQuestions = [...formData.custom_questions];
    const currentOptions = updatedQuestions[questionIndex].options || [];
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: [...currentOptions, newQuestionOption[questionIndex]]
    };
    
    setFormData({
      ...formData,
      custom_questions: updatedQuestions
    });
    
    // Clear the input for this question
    setNewQuestionOption({
      ...newQuestionOption,
      [questionIndex]: ''
    });
  };

  // Remove an option from a question
  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.custom_questions];
    const currentOptions = [...updatedQuestions[questionIndex].options || []];
    currentOptions.splice(optionIndex, 1);
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: currentOptions
    };
    
    setFormData({
      ...formData,
      custom_questions: updatedQuestions
    });
  };

  // Countries selector change
  const handleCountriesChange = (options: Option[]) => {
    setSelectedCountries(options);
    setFormData({
      ...formData,
      eligibility_criteria: {
        ...formData.eligibility_criteria,
        countries: options.map(option => option.value)
      }
    });
  };

  // Skills selector change
  const handleSkillsChange = (options: Option[]) => {
    setSelectedSkills(options);
    setFormData({
      ...formData,
      eligibility_criteria: {
        ...formData.eligibility_criteria,
        skills_required: options.map(option => option.value)
      }
    });
  };

  // Other requirements selector change
  const handleOtherRequirementsChange = (options: Option[]) => {
    setSelectedOtherRequirements(options);
    setFormData({
      ...formData,
      eligibility_criteria: {
        ...formData.eligibility_criteria,
        other_requirements: options.map(option => option.value)
      }
    });
  };

  // Learning outcomes selector change
  const handleLearningOutcomesChange = (options: Option[]) => {
    setSelectedLearningOutcomes(options);
    setFormData({
      ...formData,
      fellowship_details: {
        ...formData.fellowship_details,
        learning_outcomes: options.map(option => option.value)
      }
    });
  };

  // Activities selector change
  const handleActivitiesChange = (options: Option[]) => {
    setSelectedActivities(options);
    setFormData({
      ...formData,
      fellowship_details: {
        ...formData.fellowship_details,
        program_structure: {
          ...formData.fellowship_details.program_structure,
          activities: options.map(option => option.value)
        }
      }
    });
  };

  // Responsibilities selector change
  const handleResponsibilitiesChange = (options: Option[]) => {
    setSelectedResponsibilities(options);
    setFormData({
      ...formData,
      employment_details: {
        ...formData.employment_details,
        responsibilities: options.map(option => option.value)
      }
    });
  };

  // Required qualifications selector change
  const handleRequiredQualificationsChange = (options: Option[]) => {
    setSelectedRequiredQualifications(options);
    setFormData({
      ...formData,
      employment_details: {
        ...formData.employment_details,
        qualifications: {
          ...formData.employment_details.qualifications,
          required: options.map(option => option.value)
        }
      }
    });
  };

  // Preferred qualifications selector change
  const handlePreferredQualificationsChange = (options: Option[]) => {
    setSelectedPreferredQualifications(options);
    setFormData({
      ...formData,
      employment_details: {
        ...formData.employment_details,
        qualifications: {
          ...formData.employment_details.qualifications,
          preferred: options.map(option => option.value)
        }
      }
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Prepare data for API in the expected format
      let opportunityData: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        location_type: formData.location_type,
        location: formData.location,
        application_deadline: formData.application_deadline,
        category_id: formData.category_id,
        
        // Ensure eligibility criteria is properly structured
        eligibility_criteria: {
          countries: formData.eligibility_criteria.countries || [],
          min_education_level: formData.eligibility_criteria.min_education_level || '',
          experience_years: Number(formData.eligibility_criteria.experience_years) || 0,
          skills_required: formData.eligibility_criteria.skills_required || [],
          other_requirements: formData.eligibility_criteria.other_requirements || []
        },
        
        // Ensure custom questions are properly formatted
        custom_questions: formData.custom_questions.map(q => ({
          question: q.question,
          field_type: q.field_type,
          is_required: Boolean(q.is_required),
          max_length: q.max_length ? Number(q.max_length) : undefined,
          order: Number(q.order),
          options: q.options || []
        }))
      };

      // Add type-specific details
      if (formData.type === 'fellowship') {
        opportunityData.fellowship_details = {
          program_name: formData.fellowship_details.program_name,
          cohort: formData.fellowship_details.cohort,
          fellowship_type: formData.fellowship_details.fellowship_type,
          learning_outcomes: formData.fellowship_details.learning_outcomes || [],
          program_structure: {
            phases: formData.fellowship_details.program_structure.phases.map(phase => ({
              name: phase.name,
              description: phase.description,
              duration_weeks: Number(phase.duration_weeks) || 0
            })),
            activities: formData.fellowship_details.program_structure.activities || []
          }
        };
      } else if (formData.type === 'employment') {
        opportunityData.employment_details = {
          position_level: formData.employment_details.position_level,
          employment_type: formData.employment_details.employment_type,
          department: formData.employment_details.department,
          responsibilities: formData.employment_details.responsibilities || [],
          qualifications: {
            required: formData.employment_details.qualifications?.required || [],
            preferred: formData.employment_details.qualifications?.preferred || []
          }
        };
      }
      
      console.log('Submitting opportunity data:', opportunityData);
      
      // Make the actual API call
      const jsonData = JSON.stringify(opportunityData);
      console.log('Raw JSON being sent:', jsonData);
      
      const response = await fetch('http://localhost:3002/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
        credentials: 'include' // Include this if you're using cookie authentication
      });
      
      const responseText = await response.text();
      console.log('Response from server:', responseText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to create opportunity';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Detailed error:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const result = responseText ? JSON.parse(responseText) : {};
      
      // Success - redirect or show success message
      alert('Opportunity created successfully!');
      router.push('/opportunities');
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create opportunity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Opportunities</h1>
        <p className="text-gray-600">Opportunities/Create Opportunity</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
        {/* Basic Details Section */}
        <div className="mb-8">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Basic Details</h2>
              <p className="text-gray-600 text-sm">General information about the opportunity</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Opportunity Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">
                    Opportunity Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                  >
                    {opportunityTypes.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                    placeholder="Enter the opportunity title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category_id: e.target.value ? Number(e.target.value) : null
                      });
                    }}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Application Deadline */}
                <div>
                  <label htmlFor="application_deadline" className="block text-sm font-medium mb-1">
                    Application Deadline<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="application_deadline"
                      name="application_deadline"
                      required
                      value={formData.application_deadline}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Location Type */}
                <div>
                  <label htmlFor="location_type" className="block text-sm font-medium mb-1">
                    Location Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location_type"
                    name="location_type"
                    required
                    value={formData.location_type}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                  >
                    {locationTypes.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                    placeholder="Enter location (city, country, etc.)"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2.5 border border-gray-300 rounded-md"
                  placeholder="Detailed description of the opportunity..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-200" />

        {/* Eligibility Criteria Section */}
        <div className="mb-8">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Eligibility Criteria</h2>
              <p className="text-gray-600 text-sm">Requirements for applicants</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              {/* Countries */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Eligible Countries
                </label>
                <MultipleSelector
                  value={selectedCountries}
                  onChange={handleCountriesChange}
                  defaultOptions={countryOptions}
                  placeholder="Select eligible countries..."
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600">
                      No countries found.
                    </p>
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Minimum Education Level */}
                <div>
                  <label htmlFor="min_education_level" className="block text-sm font-medium mb-1">
                    Minimum Education Level
                  </label>
                  <select
                    id="min_education_level"
                    name="min_education_level"
                    value={formData.eligibility_criteria.min_education_level}
                    onChange={handleEligibilityChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                  >
                    <option value="">Select education level</option>
                    {educationLevels.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Years */}
                <div>
                  <label htmlFor="experience_years" className="block text-sm font-medium mb-1">
                    Minimum Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience_years"
                    name="experience_years"
                    min="0"
                    value={formData.eligibility_criteria.experience_years}
                    onChange={handleEligibilityChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Skills Required */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Required Skills
                </label>
                <MultipleSelector
                  value={selectedSkills}
                  onChange={handleSkillsChange}
                  creatable
                  placeholder="Add required skills..."
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600">
                      No skills added.
                    </p>
                  }
                />
              </div>

              {/* Other Requirements */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Other Requirements
                </label>
                <MultipleSelector
                  value={selectedOtherRequirements}
                  onChange={handleOtherRequirementsChange}
                  creatable
                  placeholder="Add other requirements..."
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600">
                      No other requirements added.
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-200" />

        {/* Custom Questions Section */}
        <div className="mb-8">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Custom Questions</h2>
              <p className="text-gray-600 text-sm">Additional questions for applicants</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              {formData.custom_questions.map((question, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeCustomQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor={`question-${index}`} className="block text-sm font-medium mb-1">
                      Question Text<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`question-${index}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                      placeholder="Enter your question"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label htmlFor={`field-type-${index}`} className="block text-sm font-medium mb-1">
                        Field Type<span className="text-red-500">*</span>
                      </label>
                      <select
                        id={`field-type-${index}`}
                        value={question.field_type}
                        onChange={(e) => handleQuestionChange(index, 'field_type', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md"
                        required
                      >
                        {fieldTypes.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                                            <div className="flex items-center">
                      <label className="flex items-center text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={question.is_required}
                          onChange={(e) => handleQuestionChange(index, 'is_required', e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        Required Question
                      </label>
                    </div>
                  </div>

                  {/* Options for select, multiselect, checkbox, radio types */}
                  {['select', 'multiselect', 'checkbox', 'radio'].includes(question.field_type) && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <label className="block text-sm font-medium mb-2">
                        Options<span className="text-red-500">*</span>
                      </label>
                      
                      {/* Display existing options */}
                      {(question.options || []).length > 0 && (
                        <div className="mb-3 space-y-2">
                          {(question.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center">
                              <span className="flex-1 text-sm bg-gray-100 p-2 rounded-md">{option}</span>
                              <button
                                type="button"
                                onClick={() => removeQuestionOption(index, optionIndex)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add new option */}
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Add an option"
                          value={newQuestionOption[index] || ''}
                          onChange={(e) => setNewQuestionOption({...newQuestionOption, [index]: e.target.value})}
                          className="flex-1 p-2 border border-gray-300 rounded-l-md"
                        />
                        <button
                          type="button"
                          onClick={() => addQuestionOption(index)}
                          className="bg-green-700 text-white px-3 py-2 rounded-r-md hover:bg-green-800"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Max length for text/textarea */}
                  {['text', 'textarea'].includes(question.field_type) && (
                    <div className="mt-4">
                      <label htmlFor={`max-length-${index}`} className="block text-sm font-medium mb-1">
                        Maximum Length (characters)
                      </label>
                      <input
                        type="number"
                        id={`max-length-${index}`}
                        value={question.max_length || ''}
                        onChange={(e) => handleQuestionChange(index, 'max_length', e.target.value ? Number(e.target.value) : undefined)}
                        min="0"
                        className="w-full p-2.5 border border-gray-300 rounded-md"
                        placeholder="No limit"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Add Question Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addCustomQuestion}
                  className="flex items-center text-green-700 font-medium hover:text-green-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Custom Question
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-200" />

        {/* Type-specific details */}
        {formData.type === 'fellowship' ? (
          <div className="mb-8">
            <div className="flex">
              {/* Left column - section title */}
              <div className="w-1/4 pr-8">
                <h2 className="text-xl font-bold">Fellowship Details</h2>
                <p className="text-gray-600 text-sm">Specific details for this fellowship</p>
              </div>
              
              {/* Right column - form fields */}
              <div className="w-3/4">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Program Name */}
                  <div>
                    <label htmlFor="program_name" className="block text-sm font-medium mb-1">
                      Program Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="program_name"
                      name="program_name"
                      required={formData.type === 'fellowship'}
                      value={formData.fellowship_details.program_name}
                      onChange={handleFellowshipChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                      placeholder="Enter the program name"
                    />
                  </div>

                  {/* Cohort */}
                  <div>
                    <label htmlFor="cohort" className="block text-sm font-medium mb-1">
                      Cohort
                    </label>
                    <input
                      type="text"
                      id="cohort"
                      name="cohort"
                      value={formData.fellowship_details.cohort}
                      onChange={handleFellowshipChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                      placeholder="e.g., Spring 2025"
                    />
                  </div>

                  {/* Fellowship Type */}
                  <div>
                    <label htmlFor="fellowship_type" className="block text-sm font-medium mb-1">
                      Fellowship Type
                    </label>
                    <select
                      id="fellowship_type"
                      name="fellowship_type"
                      value={formData.fellowship_details.fellowship_type}
                      onChange={handleFellowshipChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                    >
                      <option value="">Select fellowship type</option>
                      {fellowshipTypes.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Learning Outcomes
                  </label>
                  <MultipleSelector
                    value={selectedLearningOutcomes}
                    onChange={handleLearningOutcomesChange}
                    creatable
                    placeholder="Add learning outcomes..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600">
                        No learning outcomes added.
                      </p>
                    }
                  />
                </div>

                {/* Program Structure */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Program Structure - Phases
                  </label>
                  
                  {formData.fellowship_details.program_structure.phases.map((phase, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium">Phase {index + 1}</h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removePhase(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <label htmlFor={`phase-name-${index}`} className="block text-xs font-medium mb-1">
                            Phase Name
                          </label>
                          <input
                            type="text"
                            id={`phase-name-${index}`}
                            value={phase.name}
                            onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="e.g., Orientation"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`phase-duration-${index}`} className="block text-xs font-medium mb-1">
                            Duration (weeks)
                          </label>
                          <input
                            type="number"
                            id={`phase-duration-${index}`}
                            value={phase.duration_weeks}
                            onChange={(e) => handlePhaseChange(index, 'duration_weeks', e.target.value)}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor={`phase-desc-${index}`} className="block text-xs font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          id={`phase-desc-${index}`}
                          value={phase.description}
                          onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Describe this phase..."
                        ></textarea>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addPhase}
                    className="mt-2 flex items-center text-green-700 text-sm font-medium hover:text-green-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Phase
                  </button>
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Program Activities
                  </label>
                  <MultipleSelector
                    value={selectedActivities}
                    onChange={handleActivitiesChange}
                    creatable
                    placeholder="Add program activities..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600">
                        No activities added.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex">
              {/* Left column - section title */}
              <div className="w-1/4 pr-8">
                <h2 className="text-xl font-bold">Employment Details</h2>
                <p className="text-gray-600 text-sm">Specific details for this position</p>
              </div>
              
              {/* Right column - form fields */}
              <div className="w-3/4">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Position Level */}
                  <div>
                    <label htmlFor="position_level" className="block text-sm font-medium mb-1">
                      Position Level
                    </label>
                    <select
                      id="position_level"
                      name="position_level"
                      value={formData.employment_details.position_level}
                      onChange={handleEmploymentChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                    >
                      <option value="">Select position level</option>
                      {positionLevels.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label htmlFor="employment_type" className="block text-sm font-medium mb-1">
                      Employment Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="employment_type"
                      name="employment_type"
                      required={formData.type === 'employment'}
                      value={formData.employment_details.employment_type}
                      onChange={handleEmploymentChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                    >
                      <option value="">Select employment type</option>
                      {employmentTypes.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.employment_details.department}
                      onChange={handleEmploymentChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                      placeholder="e.g., Engineering, Marketing, etc."
                    />
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Responsibilities
                  </label>
                  <MultipleSelector
                    value={selectedResponsibilities}
                    onChange={handleResponsibilitiesChange}
                    creatable
                    placeholder="Add responsibilities..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600">
                        No responsibilities added.
                      </p>
                    }
                  />
                </div>

                {/* Required Qualifications */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Required Qualifications
                  </label>
                  <MultipleSelector
                    value={selectedRequiredQualifications}
                    onChange={handleRequiredQualificationsChange}
                    creatable
                    placeholder="Add required qualifications..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600">
                        No required qualifications added.
                      </p>
                    }
                  />
                </div>

                {/* Preferred Qualifications */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Preferred Qualifications
                  </label>
                  <MultipleSelector
                    value={selectedPreferredQualifications}
                    onChange={handlePreferredQualificationsChange}
                    creatable
                    placeholder="Add preferred qualifications..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600">
                        No preferred qualifications added.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/opportunities')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-700 rounded-md text-white hover:bg-green-800 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunityForm;
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  FileUp,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building,
  GraduationCap,
  User,
  Mail,
  Phone,
  Flag,
  MapPin
} from 'lucide-react';

const ApplyToOpportunityPage = ({ params }) => {
  const router = useRouter();
  const opportunityId = params?.id;
  
  // State for opportunity details
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for application form
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    nationality: '',
    country: '',
    education_level: '',
    institution: '',
    field_of_study: '',
    graduation_year: '',
    certifications: [],
    resume_url: '',
    custom_answers: {}
  });
  
  // State for form validation and submission
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Fetch opportunity details
  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!opportunityId) {
        setError('Opportunity ID is required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/opportunities/${opportunityId}`);
        
        if (response.data && response.data.opportunity) {
          setOpportunity(response.data.opportunity);
          
          // Initialize custom answers object based on custom questions
          if (response.data.opportunity.custom_questions && 
              Array.isArray(response.data.opportunity.custom_questions)) {
            const customAnswers = {};
            response.data.opportunity.custom_questions.forEach(question => {
              if (question.id) {
                // Initialize each answer based on field type
                switch (question.field_type) {
                  case 'checkbox':
                  case 'multiselect':
                    customAnswers[question.id] = [];
                    break;
                  case 'select':
                  case 'radio':
                    customAnswers[question.id] = '';
                    break;
                  case 'text':
                  case 'textarea':
                    customAnswers[question.id] = '';
                    break;
                  case 'file':
                    customAnswers[question.id] = null;
                    break;
                  default:
                    customAnswers[question.id] = '';
                }
              }
            });
            
            setFormData(prev => ({
              ...prev,
              custom_answers: customAnswers
            }));
          }
        } else {
          setError('Failed to load opportunity details');
        }
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunity();
  }, [opportunityId]);
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('custom_')) {
      // Handle custom question fields
      const questionId = name.replace('custom_', '');
      
      setFormData(prevData => ({
        ...prevData,
        custom_answers: {
          ...prevData.custom_answers,
          [questionId]: value
        }
      }));
    } else if (type === 'checkbox') {
      // Handle checkbox inputs
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      // Handle standard inputs
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle checkbox or multiselect custom questions
  const handleMultiSelectChange = (questionId, value, isChecked) => {
    setFormData(prevData => {
      const currentValues = [...(prevData.custom_answers[questionId] || [])];
      
      if (isChecked) {
        // Add value if it doesn't exist
        if (!currentValues.includes(value)) {
          currentValues.push(value);
        }
      } else {
        // Remove value
        const index = currentValues.indexOf(value);
        if (index !== -1) {
          currentValues.splice(index, 1);
        }
      }
      
      return {
        ...prevData,
        custom_answers: {
          ...prevData.custom_answers,
          [questionId]: currentValues
        }
      };
    });
  };
  
  // Handle adding/removing certification fields
  const handleAddCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }));
  };
  
  const handleRemoveCertification = (index) => {
    setFormData(prev => {
      const newCertifications = [...prev.certifications];
      newCertifications.splice(index, 1);
      return {
        ...prev,
        certifications: newCertifications
      };
    });
  };
  
  const handleCertificationChange = (index, value) => {
    setFormData(prev => {
      const newCertifications = [...prev.certifications];
      newCertifications[index] = value;
      return {
        ...prev,
        certifications: newCertifications
      };
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate custom questions
    if (opportunity && opportunity.custom_questions) {
      opportunity.custom_questions.forEach(question => {
        if (question.is_required) {
          const answer = formData.custom_answers[question.id];
          const fieldName = `custom_${question.id}`;
          
          if (question.field_type === 'checkbox' || question.field_type === 'multiselect') {
            if (!answer || answer.length === 0) {
              newErrors[fieldName] = 'This field is required';
            }
          } else if (question.field_type === 'file') {
            if (!answer) {
              newErrors[fieldName] = 'Please upload a file';
            }
          } else {
            if (!answer || !answer.toString().trim()) {
              newErrors[fieldName] = 'This field is required';
            }
          }
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Submit application
      const response = await axios.post(`/api/opportunities/${opportunityId}/apply`, formData);
      
      if (response.data) {
        setSubmitSuccess(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError(
        err.response?.data?.message || 
        'Failed to submit application. Please try again later.'
      );
      
      // Scroll to error message
      const errorElement = document.getElementById('submit-error');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Render custom question based on field type
  const renderCustomQuestion = (question) => {
    const { id, question: text, field_type, options, is_required, max_length } = question;
    const fieldName = `custom_${id}`;
    const error = errors[fieldName];
    
    switch (field_type) {
      case 'text':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={fieldName}
              value={formData.custom_answers[id] || ''}
              onChange={handleInputChange}
              maxLength={max_length}
              className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
              required={is_required}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name={fieldName}
              value={formData.custom_answers[id] || ''}
              onChange={handleInputChange}
              maxLength={max_length}
              rows={4}
              className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
              required={is_required}
            ></textarea>
            {max_length && (
              <p className="mt-1 text-xs text-gray-500">
                {(formData.custom_answers[id] || '').length}/{max_length} characters
              </p>
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <select
              name={fieldName}
              value={formData.custom_answers[id] || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
              required={is_required}
            >
              <option value="">Select an option</option>
              {options && options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'multiselect':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2 mt-1">
              {options && options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${fieldName}_${idx}`}
                    checked={(formData.custom_answers[id] || []).includes(option)}
                    onChange={(e) => handleMultiSelectChange(id, option, e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`${fieldName}_${idx}`} className="ml-2 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2 mt-1">
              {options && options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${fieldName}_${idx}`}
                    checked={(formData.custom_answers[id] || []).includes(option)}
                    onChange={(e) => handleMultiSelectChange(id, option, e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`${fieldName}_${idx}`} className="ml-2 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'radio':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2 mt-1">
              {options && options.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    id={`${fieldName}_${idx}`}
                    name={fieldName}
                    value={option}
                    checked={formData.custom_answers[id] === option}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          custom_answers: {
                            ...prev.custom_answers,
                            [id]: option
                          }
                        }));
                      }
                    }}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor={`${fieldName}_${idx}`} className="ml-2 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      case 'file':
        return (
          <div className="mb-4" key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {text} {is_required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={fieldName}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                  error ? 'border-red-500' : 'border-gray-300'
                } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG</p>
                </div>
                <input 
                  id={fieldName}
                  name={fieldName}
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData(prev => ({
                        ...prev,
                        custom_answers: {
                          ...prev.custom_answers,
                          [id]: e.target.files[0]
                        }
                      }));
                    }
                  }}
                />
              </label>
            </div>
            {formData.custom_answers[id] && (
              <p className="mt-1 text-sm text-green-600">
                File selected: {formData.custom_answers[id].name || "Selected file"}
              </p>
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // If application submitted successfully, show success message
  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your application. We will review it and get back to you soon.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href={`/opportunities/${opportunityId}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              View Opportunity
            </Link>
            <Link 
              href="/opportunities"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Browse More Opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading opportunity details...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <Link 
            href="/opportunities" 
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-800"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to opportunities
          </Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <Link 
              href={`/opportunities/${opportunityId}`} 
              className="inline-flex items-center text-green-600 hover:text-green-800 mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to opportunity
            </Link>
            <h1 className="text-2xl font-bold">
              Apply to: {opportunity?.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Complete the form below to submit your application.
            </p>
          </div>
          
          {/* Opportunity info */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Opportunity Details
            </h2>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Type:</span> {opportunity?.type === 'fellowship' ? 'Fellowship' : 'Employment'}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Location:</span> {opportunity?.location_type} {opportunity?.location ? `- ${opportunity.location}` : ''}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Application Deadline:</span> {new Date(opportunity?.application_deadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          {/* Submit error */}
          {submitError && (
            <div id="submit-error" className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{submitError}</p>
              </div>
            </div>
          )}
          
          {/* Application form */}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Personal Information</h2>
            
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-2 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {errors.full_name && <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>}
            </div>
            
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Nationality */}
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Your nationality"
                  />
                </div>
              </div>
              
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country of Residence
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Your country of residence"
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 mt-8 pb-2 border-b">Education & Experience</h2>
            
            {/* Education Level */}
            <div className="mb-4">
              <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 mb-1">
                Highest Education Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="education_level"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
                  <option value="">Select education level</option>
                  <option value="high_school">High School</option>
                  <option value="associate_degree">Associate Degree</option>
                  <option value="bachelors_degree">Bachelor's Degree</option>
                  <option value="masters_degree">Master's Degree</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="professional_certification">Professional Certification</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Institution */}
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Name of your institution"
                />
              </div>
              
              {/* Field of Study */}
              <div>
                <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  id="field_of_study"
                  name="field_of_study"
                  value={formData.field_of_study}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Your field of study"
                />
              </div>
            </div>
            
            {/* Graduation Year */}
            <div className="mb-6">
              <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="graduation_year"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Year of graduation"
                  min="1950"
                  max="2030"
                />
              </div>
            </div>
            
            {/* Certifications */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Certifications / Professional Qualifications
                </label>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </button>
              </div>
              
              {formData.certifications.length === 0 ? (
                <p className="text-sm text-gray-500 italic mb-2">No certifications added yet</p>
              ) : (
                <div className="space-y-2 mb-2">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertificationChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Certification name"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Resume URL */}
            <div className="mb-6">
              <label htmlFor="resume_url" className="block text-sm font-medium text-gray-700 mb-1">
                Resume URL (Optional)
              </label>
              <input
                type="url"
                id="resume_url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Link to your online resume/CV (e.g., Google Drive, Dropbox)"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can provide a link to your resume if you have it hosted online
              </p>
            </div>
            
            {/* Custom Questions */}
            {opportunity && opportunity.custom_questions && opportunity.custom_questions.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-6 mt-8 pb-2 border-b">
                  Additional Questions
                </h2>
                
                {opportunity.custom_questions.map(question => renderCustomQuestion(question))}
              </>
            )}
            
            {/* Submit button */}
            <div className="mt-8 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                  submitting ? 'bg-green-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Application...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ApplyToOpportunityPage;
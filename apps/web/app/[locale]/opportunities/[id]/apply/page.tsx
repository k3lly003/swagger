'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Upload, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { useRouter } from 'next/navigation';

// Country type and data
type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  format: string;
  regex: RegExp;
};

const countries: Country[] = [
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    dialCode: '+250',
    format: '+250 7XX XXX XXX',
    regex: /^\+250\s?7[0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    dialCode: '+254',
    format: '+254 7XX XXX XXX',
    regex: /^\+254\s?[71][0-9]{8}$/
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    dialCode: '+256',
    format: '+256 7XX XXX XXX',
    regex: /^\+256\s?7[0-9]{8}$/
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    dialCode: '+255',
    format: '+255 7XX XXX XXX',
    regex: /^\+255\s?[67][0-9]{8}$/
  },
];

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  selectedCountry: Country;
  nationalId: string;
  email: string;
  city: string;
  country: string;
  educationLevel: string;
  educationField: string;
  cv: File | null;
  supportingDocs: File | null;
  careerExperience: string;
  leadershipExample: string;
  motivation: string;
  fiveYearVision: string;
  desiredImpact: string;
  communityRole: string;
  nationalStrategy: string;
  ganzAfricaHelp: string;
  ganzAfricaContribution: string;
  consent: boolean;
};

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  selectedCountry: countries[0] ?? {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    dialCode: '+250',
    format: '### ### ###',
    regex: /^\d{9}$/
  },
  nationalId: '',
  email: '',
  city: '',
  country: '',
  educationLevel: '',
  educationField: '',
  cv: null,
  supportingDocs: null,
  careerExperience: '',
  leadershipExample: '',
  motivation: '',
  fiveYearVision: '',
  desiredImpact: '',
  communityRole: '',
  nationalStrategy: '',
  ganzAfricaHelp: '',
  ganzAfricaContribution: '',
  consent: false,
};

const steps = [
  { title: 'Personal Information', description: 'Basic contact details' },
  { title: 'Experience and Knowledge', description: 'Educational background' },
  { title: 'Work Aspirations', description: 'Career goals' },
  { title: 'Impact to the Community', description: 'Social contribution' },
  { title: 'Programme Relevance', description: 'Final steps' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Add type for step numbers
type StepNumber = 0 | 1 | 2 | 3 | 4;

export default function FellowshipApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // If the user is typing and hasn't added the country code, add it
    if (!value.startsWith('+') && value.length > 0) {
      value = formData.selectedCountry.dialCode + ' ' + value;
    }

    // Remove any non-digit characters except + and space
    value = value.replace(/[^\d+\s]/g, '');

    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleCountrySelect = (country: Country) => {
    setFormData(prev => ({
      ...prev,
      selectedCountry: country,
      phone: prev.phone ? country.dialCode + prev.phone.substring(prev.selectedCountry.dialCode.length) : ''
    }));
    setIsCountryDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cv' | 'supportingDocs') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      toast.success('File uploaded successfully');
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.nationalId || !formData.email || !formData.city || !formData.country) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        if (!formData.selectedCountry.regex.test(formData.phone)) {
          toast.error(`Please enter a valid ${formData.selectedCountry.name} phone number\nFormat: ${formData.selectedCountry.format}`);
          return false;
        }
        break;
      case 1:
        if (!formData.educationLevel || !formData.educationField || !formData.cv || !formData.supportingDocs || !formData.careerExperience) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.motivation || !formData.fiveYearVision) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!formData.desiredImpact || !formData.communityRole || !formData.nationalStrategy) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 4:
        if (!formData.ganzAfricaHelp || !formData.ganzAfricaContribution || !formData.consent) {
          toast.error('Please fill in all required fields and accept the terms');
        return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      toast.success('Application submitted successfully!');
      
      // Redirect to fellowship page after a short delay
      setTimeout(() => {
        window.location.href = '/en/programs/fellowship';
      }, 1500);
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
      setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderProgressBar = () => (
        <div className="mb-8">
      <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center relative group">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index <= currentStep ? 'bg-[#005c3d] text-[#fef597]' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                index + 1
                )}
              </div>
            <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-lg shadow-lg text-sm w-48 text-center">
              <p className="font-semibold">{step.title}</p>
              <p className="text-gray-600 text-xs">{step.description}</p>
            </div>
            <span className="text-xs mt-2 text-center font-medium">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 h-1 bg-[#005c3d] -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              Fellowship <span className="text-[#FDB022]">Application</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-6"
            >
              Take the first step towards becoming a leader in sustainable development. 
              Our fellowship program offers unique opportunities for growth, learning, and impact.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center gap-6 text-white/90"
            >
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-[#FDB022]" />
                <span>6-month program</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FDB022]"></div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-[#FDB022]" />
                <span>Expert mentorship</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FDB022]"></div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-[#FDB022]" />
                <span>Project-based learning</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-xl shadow-xl p-10">
          {renderProgressBar()}
          
          <form onSubmit={handleSubmit} className="relative mt-12">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
                className="relative"
            >
              {currentStep === 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#005c3d] mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                          First Name *
                        </label>
                        <input
                        type="text"
                          id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                        required
                          title="Enter your first name"
                          placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                          Last Name *
                        </label>
                        <input
                        type="text"
                          id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                        required
                          title="Enter your last name"
                          placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email *
                      </label>
                      <input
                      type="email"
                        id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Enter your email address"
                        placeholder="Enter your email address"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                        Phone Number *
                      </label>
                  <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 border-r border-gray-300"
                      >
                          <span className="text-lg mr-1">{formData.selectedCountry.flag}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>
                        <input
                        type="tel"
                          id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                          className="w-full pl-24 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                          required
                          title="Enter your phone number"
                        placeholder={formData.selectedCountry.format}
                      />
                    {isCountryDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                          >
                                <span className="text-lg">{country.flag}</span>
                                <span>{country.name}</span>
                                <span className="text-gray-500 text-sm">{country.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nationalId">
                        National ID *
                      </label>
                      <input
                        type="text"
                        id="nationalId"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                        required
                        title="Enter your national ID number"
                        placeholder="Enter your national ID number"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                          required
                          title="Enter your city"
                          placeholder="Enter your city"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="country">
                          Country *
                        </label>
                        <input
                        type="text"
                          id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                        required
                          title="Enter your country"
                          placeholder="Enter your country"
                      />
                      </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#005c3d] mb-4">Education & Experience</h3>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="educationLevel">
                        Education Level *
                      </label>
                    <select
                        id="educationLevel"
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                      title="Select your education level"
                    >
                        <option value="">Select your education level</option>
                      <option value="high_school">High School</option>
                        <option value="diploma">Diploma</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="educationField">
                        Field of Study *
                      </label>
                      <input
                      type="text"
                        id="educationField"
                      name="educationField"
                      value={formData.educationField}
                      onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                        required
                        title="Enter your field of study"
                        placeholder="Enter your field of study"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="careerExperience">
                        Career Experience *
                      </label>
                      <textarea
                        id="careerExperience"
                        name="careerExperience"
                        value={formData.careerExperience}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Describe your career experience and training"
                        placeholder="Share your professional journey, including relevant work experience and training..."
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cv">
                        CV (PDF) *
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                      type="file"
                          id="cv"
                      name="cv"
                      onChange={(e) => handleFileChange(e, 'cv')}
                      accept=".pdf"
                          className="hidden"
                      required
                      title="Upload your CV in PDF format"
                        />
                        <label
                          htmlFor="cv"
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Choose CV</span>
                        </label>
                        {formData.cv && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            <span>CV uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Max file size: 2MB</p>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="supportingDocs">
                        Supporting Documents (PDF) *
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                      type="file"
                          id="supportingDocs"
                          name="supportingDocs"
                          onChange={(e) => handleFileChange(e, 'supportingDocs')}
                          accept=".pdf"
                          className="hidden"
                          required
                      title="Upload supporting documents in PDF format"
                        />
                        <label
                          htmlFor="supportingDocs"
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Choose Documents</span>
                        </label>
                        {formData.supportingDocs && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            <span>Documents uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Max file size: 2MB</p>
                    </div>
                </div>
              )}

              {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#005c3d] mb-4">Vision & Motivation</h3>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="motivation">
                        Motivation *
                      </label>
                      <textarea
                        id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Explain your motivation for applying"
                        placeholder="What motivates you to apply for this fellowship program?"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fiveYearVision">
                        Five-Year Vision *
                      </label>
                      <textarea
                        id="fiveYearVision"
                      name="fiveYearVision"
                      value={formData.fiveYearVision}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Describe your five-year vision"
                        placeholder="Where do you see yourself in five years? What goals do you want to achieve?"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#005c3d] mb-4">Community Impact</h3>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="desiredImpact">
                        Desired Impact *
                      </label>
                      <textarea
                        id="desiredImpact"
                      name="desiredImpact"
                      value={formData.desiredImpact}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Describe the impact you want to make"
                        placeholder="What impact do you want to make in your community and country?"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="communityRole">
                        Community Role *
                      </label>
                      <textarea
                        id="communityRole"
                      name="communityRole"
                      value={formData.communityRole}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Describe your role in the community"
                        placeholder="How do you currently contribute to your community?"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nationalStrategy">
                        National Strategy *
                      </label>
                      <textarea
                        id="nationalStrategy"
                      name="nationalStrategy"
                      value={formData.nationalStrategy}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Describe the national strategy you want to contribute to"
                        placeholder="Which national strategy, policy or flagship programme do you want to contribute to and why?"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#005c3d] mb-4">Programme Relevance</h3>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ganzAfricaHelp">
                        How can GanzAfrica help you? *
                      </label>
                      <textarea
                        id="ganzAfricaHelp"
                      name="ganzAfricaHelp"
                      value={formData.ganzAfricaHelp}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Explain how GanzAfrica can help you achieve your goals"
                        placeholder="How do you think GanzAfrica will help you achieve your career goals?"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ganzAfricaContribution">
                        How can you contribute to GanzAfrica? *
                      </label>
                      <textarea
                        id="ganzAfricaContribution"
                      name="ganzAfricaContribution"
                      value={formData.ganzAfricaContribution}
                      onChange={handleInputChange}
                      rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#005c3d] focus:border-[#005c3d]"
                      required
                        title="Describe your potential contributions to GanzAfrica"
                        placeholder="What unique skills, perspectives, or contributions can you offer to GanzAfrica?"
                    />
                  </div>
                    <div className="flex items-start space-x-2 mt-8">
                    <input
                      type="checkbox"
                        id="consent"
                      name="consent"
                      checked={formData.consent}
                        onChange={handleInputChange}
                        className="mt-1"
                      required
                        title="Consent to data processing"
                    />
                      <label htmlFor="consent" className="text-sm text-gray-700">
                      I consent to the processing of my personal data in accordance with the privacy policy and terms and conditions *
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={prevStep}
                className={`flex items-center px-8 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-[#005c3d] text-[#fef597] hover:bg-[#009758] hover:shadow-lg transform hover:-translate-y-1'
                }`}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-8 py-3 text-sm font-medium rounded-full bg-[#005c3d] text-[#fef597] hover:bg-[#009758] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⚬</span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              ) : (
                <button
                type="button"
                onClick={nextStep}
                  className="flex items-center px-8 py-3 text-sm font-medium rounded-full bg-[#005c3d] text-[#fef597] hover:bg-[#009758] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
            )}
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
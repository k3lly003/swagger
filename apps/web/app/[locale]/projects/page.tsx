// @ts-nocheck

"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  ArrowRight,
  MapPin,
  User,
  ChevronRight,
  ChevronLeft,
  X,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { DecoratedHeading } from "@/components/layout/headertext";
import { default as HeaderBelt } from "@/components/layout/headerBelt";
import Header from "@/components/layout/header";

// Register ScrollTrigger plugin for animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Create an axios instance
const axiosInstance = axios.create({
  timeout: 10000,
});

// Project Card Component with hover effects
const ProjectCard: React.FC<{
  project: any;
  getFeatureImage: (project: any) => string;
  getCategoryName: (categoryId: string | number) => string;
}> = ({ project, getFeatureImage, getCategoryName }) => {
  // Truncate description to about 30 words
  interface TruncateDescriptionProps {
    text: string | undefined;
  }

  const truncateDescription = (text: TruncateDescriptionProps['text']): string => {
    if (!text) return "A sustainable project working with local communities to improve agriculture systems.";
    const words = text.split(' ');
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(' ') + '...';
  };
   
  // Format date for display
  interface FormatDateProps {
    dateString: string | null | undefined;
  }

  const formatDate = (dateString: FormatDateProps['dateString']): string => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`projects/${project.id}`} className="block group">
      <div className="relative bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-lg overflow-hidden cursor-pointer h-full transform hover:-translate-y-2">
        <div className="relative w-full overflow-hidden">
          {/* Main content container */}
          <div className="relative">
            {/* Status badge in top left - using actual project status */}
            <div className="absolute top-3 left-3 z-10 bg-white py-1 px-2 rounded-full text-xs font-medium shadow-md transform transition-transform duration-300 group-hover:scale-110">
              {project.status || 'Active'}
            </div>
            
            {/* Yellow circle with arrow icon in top right */}
            <div className="absolute top-3 right-3 z-10">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center transition-all duration-500 shadow-lg transform group-hover:rotate-90">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Image section with overlay - adjusted aspect ratio */}
            <div className="relative aspect-[5/3] w-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={getFeatureImage(project)}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Gradient overlay that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Project title and description at the bottom */}
              <div className="absolute bottom-3 left-3 right-3 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-lg font-bold">{project.name}</h3>
                <p className="text-white/90 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                  {truncateDescription(project.description)}
                </p>
              </div>
            </div>
          </div>
        </div>
       <div className="px-4 py-3 flex justify-between items-center bg-white">
          <div className="flex items-center text-green-700 group-hover:text-green-600 transition-colors">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="font-medium text-sm">{project.location || 'Rwanda'}</span>
          </div>
          
          <div className="flex items-center text-green-700 group-hover:text-green-600 transition-colors">
            <User className="w-4 h-4 mr-1" />
            <span className="font-medium text-sm">{formatDate(project.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Category Button Component
interface CategoryButtonProps {
  name: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ name, icon, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-lg w-full transition-all duration-300 ${
        isActive 
          ? 'bg-green-700 text-white shadow-md' 
          : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isActive ? 'bg-white' : 'bg-green-100'
        } text-green-700`}>
          {icon}
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <span className={`text-sm ${isActive ? 'bg-white text-green-700' : 'bg-gray-200 text-gray-700'} px-2 py-0.5 rounded-full`}>
        {count}
      </span>
    </button>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full border ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-green-700 border-green-600 hover:bg-green-50'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`w-10 h-10 rounded-full ${
            currentPage === index + 1 
              ? 'bg-green-700 text-white' 
              : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {index + 1}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full border ${currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-green-700 border-green-600 hover:bg-green-50'}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Location parsing and mapping utilities
interface LocationInfo {
  country: string;
  location: string;
}

function parseLocation(locationString: string | undefined): LocationInfo {
  if (!locationString) return { country: 'rwanda', location: 'Rwanda' };
  
  const locationLower = locationString.toLowerCase();
  
  // Detect country - more flexible approach
  let country: string = 'other'; // Default for unknown countries
  
  // Known country mappings
  const countryMappings: Record<string, string> = {
    'rwanda': 'rwanda',
    'burkina': 'burkina',
    'burkina faso': 'burkina',
    // Add more countries as needed
  };
  
  // Try to identify country from the location string
  Object.entries(countryMappings).forEach(([keyword, countryCode]) => {
    if (locationLower.includes(keyword)) {
      country = countryCode;
    }
  });
  
  // Extract specific location if present
  let location: string = locationString;
  if (locationString && locationString.includes(',')) {
    // Take first part before comma as specific location
    // @ts-ignore
    location = locationString.split(',')[0].trim();
  }
  
  return { country, location };
}

function getMapCoordinates(locationInfo: LocationInfo) {

  const { country, location } = locationInfo;
  
  // Known specific locations - can be expanded with more locations
  const knownLocations = {
    "kigali": { 
      lat: -1.9441, 
      lng: 30.0619,
      mapPosition: { x: 380, y: 300 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63817.18087378733!2d30.019363028729005!3d-1.944098787600761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42968f6b901%3A0xfba4f422b2a13a89!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1712031042989!5m2!1sen!2sus"
    }
  };
  
  // Country defaults (used when specific location not found)
  const countryDefaults = {
    "rwanda": {
      lat: -1.9441, 
      lng: 30.0619,
      mapPosition: { x: 380, y: 300 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63817.18087378733!2d30.019363028729005!3d-1.944098787600761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42968f6b901%3A0xfba4f422b2a13a89!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1712031042989!5m2!1sen!2sus"
    },
    "burkina": {
      lat: 12.3714, 
      lng: -1.5197,
      mapPosition: { x: 320, y: 230 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125171.40082591335!2d-1.6126624448655638!3d12.36712576629056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2e9c23908451f%3A0x1f1d8074e9c2d0ab!2sOuagadougou%2C%20Burkina%20Faso!5e0!3m2!1sen!2sus!4v1712031172461!5m2!1sen!2sus"
    },
    "other": {
      lat: 0, 
      lng: 20,
      mapPosition: { x: 350, y: 250 },
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31397.814232798383!2d20.053565!3d0.084886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1779fe8521916c39%3A0x2caec1cf01ad37f!2sAfrica!5e0!3m2!1sen!2sus!4v1681732186562!5m2!1sen!2sus"
    }
  };
  
  // Try to find exact match for the location
  const locationKey = location.toLowerCase().trim() as keyof typeof knownLocations;
  if (locationKey in knownLocations) {
    return {
      mapCoordinates: { 
        lat: knownLocations[locationKey].lat, 
        lng: knownLocations[locationKey].lng 
      },
      mapPosition: knownLocations[locationKey].mapPosition,
      mapUrl: knownLocations[locationKey].mapUrl
    };
  }
  
  // Fall back to country defaults
  if (countryDefaults[country as keyof typeof countryDefaults]) {
    return {
      mapCoordinates: { 
        lat: countryDefaults[country].lat, 
        lng: countryDefaults[country].lng 
      },
      mapPosition: countryDefaults[country].mapPosition,
      mapUrl: countryDefaults[country].mapUrl
    };
  }
  
  // Ultimate fallback to other (default for unknown countries)
  return {
    mapCoordinates: { lat: 0, lng: 20 },
    mapPosition: { x: 350, y: 250 },
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31397.814232798383!2d20.053565!3d0.084886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1779fe8521916c39%3A0x2caec1cf01ad37f!2sAfrica!5e0!3m2!1sen!2sus!4v1681732186562!5m2!1sen!2sus"
  };
}

interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
  category_id: string | number;
  media?: {
    items?: { tag: string; url: string }[];
  };
  contact_person?: string;
}

interface LocationInfo {
  country: string;
  location: string;
}

interface MapCoordinates {
  lat: number;
  lng: number;
}

interface MapPosition {
  x: number;
  y: number;
}

interface MapLocation {
  id: number;
  title: string;
  description: string;
  image: string;
  country: string;
  location: string;
  address: string;
  mapCoordinates: MapCoordinates;
  mapPosition: MapPosition;
  mapUrl: string;
  contactPerson: string;
  url: string;
}

function generateMapLocations(projects: Project[]): MapLocation[] {
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return [];
  }
  
  console.log("Generating map locations for projects:", projects.length);
  
  // @ts-ignore
  return projects.map((project, index) => {
    console.log(`Processing project ${index + 1}:`, project.id, project.name, project.location);
    
    // Make sure we have some location data - use defaults if needed
    const locationString = project.location || `Project ${project.id} Location`;
    
    // Parse the location string
    const locationInfo: LocationInfo = parseLocation(locationString);
    console.log(`  Parsed location:`, locationInfo);
    
    // Calculate a unique position based on project ID to avoid overlaps
    const defaultPosition: MapPosition = {
      x: 100 + (index % 5) * 100,  // Distribute horizontally
      y: 100 + Math.floor(index / 5) * 80  // Distribute vertically
    };
    
    // Simple default map coordinates based on country
    const defaultCoordinates: Record<string, MapCoordinates> = {
      'rwanda': { lat: -1.9441, lng: 30.0619 },
      'burkina': { lat: 12.3714, lng: -1.5197 },
      'other': { lat: 0, lng: 20 }, // Africa center
      'unknown': { lat: 0, lng: 0 } // Fallback
    };
    
    // Default map URLs
    const defaultMapUrls: Record<string, string> = {
      'rwanda': "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63817.18087378733!2d30.019363028729005!3d-1.944098787600761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42968f6b901%3A0xfba4f422b2a13a89!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1712031042989!5m2!1sen!2sus",
      'burkina': "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125171.40082591335!2d-1.6126624448655638!3d12.36712576629056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2e9c23908451f%3A0x1f1d8074e9c2d0ab!2sOuagadougou%2C%20Burkina%20Faso!5e0!3m2!1sen!2sus!4v1712031172461!5m2!1sen!2sus",
      'other': "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31397.814232798383!2d20.053565!3d0.084886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1779fe8521916c39%3A0x2caec1cf01ad37f!2sAfrica!5e0!3m2!1sen!2sus!4v1681732186562!5m2!1sen!2sus",
      'unknown': "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31397.814232798383!2d20.053565!3d0.084886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1779fe8521916c39%3A0x2caec1cf01ad37f!2sAfrica!5e0!3m2!1sen!2sus!4v1681732186562!5m2!1sen!2sus"
    };
    
    // Use defaults when needed
    const country = locationInfo.country;
    const coordinates = defaultCoordinates[country] || defaultCoordinates.unknown;
    const mapUrl = defaultMapUrls[country] || defaultMapUrls.unknown;
    
    return {
      id: project.id,
      title: project.name || 'Untitled Project',
      description: project.description || 'No description available',
      image: project.media?.items?.find(item => item.tag === 'feature')?.url || '/images/news/maize.avif',
      country: country,
      location: locationInfo.location,
      address: locationString,
      mapCoordinates: coordinates,
      mapPosition: defaultPosition,
      mapUrl: mapUrl,
      contactPerson: project.contact_person || 'Project Contact',
      url: `/projects/${project.id}`
    };
  });
}

const ProjectsPage = () => {
  const router = useRouter();
  
  // States for data
  interface Project {
    id: number;
    name: string;
    description: string;
    location: string;
    status: string;
    created_at: string;
    category_id: string | number;
    media?: {
      items?: { tag: string; url: string }[];
    };
    contact_person?: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Record<string, string>>({});
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // For category counts
  const [categoryCounts, setCategoryCounts] = useState({});
  const [totalProjects, setTotalProjects] = useState(0);
  
  // Map related states
  const [selectedCountry, setSelectedCountry] = useState('rwanda');
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  interface ProjectLocation {
    id: number;
    country: string;
    location: string;
    mapCoordinates: { lat: number; lng: number };
    mapPosition: { x: number; y: number };
    mapUrl: string;
    image: string;
    title: string;
    description: string;
    address: string;
    contactPerson: string;
    url: string;
  }

  const [projectLocations, setProjectLocations] = useState<ProjectLocation[]>([]);
  const mapRef = useRef(null);
  const mapIframeRef = useRef(null);
  
  // Animation and UI states
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const projectsGridRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  
  // Stats for map section
  const stats = [
    { label: "Fellows", count: 20 },
    { label: "Projects", count: "20+" },
    { label: "Communities", count: 15 },
    { label: "Countries", count: 2 },
  ];

  // Get unique countries from projects for the dropdown
  const getUniqueCountries = () => {
    // Start with default countries
    const defaultCountries = [
      { name: 'Rwanda', value: 'rwanda' },
      { name: 'Burkina Faso', value: 'burkina' }
    ];
    
    // Add any other countries from projects
    if (projectLocations && projectLocations.length > 0) {
      const countrySet = new Set(defaultCountries.map(c => c.value));
      
      projectLocations.forEach(location => {
        if (location.country && !countrySet.has(location.country)) {
          countrySet.add(location.country);
          defaultCountries.push({
            name: location.country.charAt(0).toUpperCase() + location.country.slice(1), // Capitalize
            value: location.country
          });
        }
      });
    }
    
    return defaultCountries;
  };
  
  const countries = getUniqueCountries();
  
  // Update map dimensions on resize and component mount
  useEffect(() => {
    const updateMapDimensions = () => {
      if (mapRef.current) {
        setMapDimensions({
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight,
        });
      }
    };

    updateMapDimensions();
    window.addEventListener("resize", updateMapDimensions);

    return () => {
      window.removeEventListener("resize", updateMapDimensions);
    };
  }, []);
  
  // Update the categories state with fetched data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:3002/api/categories');
        
        // Handle different response formats
        if (response.data) {
          let categoriesData = response.data;
          
          if (!Array.isArray(response.data) && response.data.categories && Array.isArray(response.data.categories)) {
            categoriesData = response.data.categories;
          }
          
          // Transform categories array into an object
          const categoriesObj: Record<string, string> = {};
          
          if (Array.isArray(categoriesData)) {
            categoriesData.forEach(category => {
              if (category && category.id && category.name) {
                const categoryId = category.id.toString();
                categoriesObj[categoryId] = category.name;
              }
            });
            setCategories(categoriesObj);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects from API and update map locations
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params: { search?: string; status?: string; category_id?: string } = {};
        
        // Add search term if exists
        if (searchTerm) params.search = searchTerm;
        
        // Add status filter if not 'all'
        if (activeStatus !== 'all') {
          params.status = activeStatus;
        }
        
        // Add category filter if not 'all'
        if (activeCategory !== 'all' && activeCategory !== 'All Projects') {
          // Find category id for the selected category name
          const categoryId = Object.keys(categories).find(
            key => categories[key] === activeCategory
          );
          if (categoryId) {
            params.category_id = categoryId;
          }
        }
        
        // Attempt to fetch from API
        try {
          console.log('Fetching projects from API...');
          const response = await axiosInstance.get('http://localhost:3002/api/projects', { params });
          
          if (response.data) {
            const projectsList = response.data.projects || [];
            console.log(`Fetched ${projectsList.length} projects from API`);
            setAllProjects(projectsList);
            
            // Generate map locations from projects
            const locations = generateMapLocations(projectsList);
            console.log(`Generated ${locations.length} map locations`);
            setProjectLocations(locations);
            
            // Count projects by category
            const counts: { [key: string]: number } = { all: 0 };
            
            interface CategoryCounts {
              [key: string]: number;
            }

            interface Project {
              category_id?: string | number;
            }

            projectsList.forEach((project: Project) => {
              counts.all = (counts.all || 0) + 1;

              // Count by category
              const catId = project.category_id;
              if (catId) {
                const catName = categories[catId as keyof typeof categories];
                if (catName) {
                  counts[catName] = (counts[catName] || 0) + 1;
                }
              }
            });
            
            setCategoryCounts(counts);
            setTotalProjects(counts.all || 0);
            
            // Calculate total pages
            setTotalPages(Math.ceil(projectsList.length / projectsPerPage));
          }
        } catch (error) {
          console.error('API Error:', error);
        }
      } catch (error) {
        console.error('Error in fetch process:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [searchTerm, activeStatus, activeCategory, categories]);

  // Handle pagination
  useEffect(() => {
    // Apply pagination to filter the projects
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject);
    setProjects(currentProjects);
  }, [allProjects, currentPage, projectsPerPage]);

  // Don't filter by country for the map - show all projects
  // Instead, just set initial visibility based on selected country 
  const filteredLocations = projectLocations;
  
  // Get projects for the selected country (for initial view)
  const selectedCountryProjects = projectLocations.filter(
    (location) => location.country === selectedCountry
  );

  // Get current project for map
  const currentProject = selectedProject 
    ? projectLocations.find(p => p.id === selectedProject) 
    : null;
    
  // Animation effects
  useEffect(() => {
    // Set page as loaded after a short delay
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
    
    // Only run animations after page is fully loaded and projects are loaded
    if (!isPageLoaded || loading) return;

    // Project cards stagger animation
    if (projectsGridRef.current) {
      gsap.from(".project-card", {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
    
    // Banner animation
    if (bannerRef.current) {
      gsap.from(bannerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }
    
    return () => clearTimeout(timer);
  }, [isPageLoaded, loading]);

  // Get feature image from project media
  interface MediaItem {
    tag: string;
    url: string;
  }

  interface ProjectMedia {
    items?: MediaItem[];
  }

  interface ProjectWithMedia {
    id: number;
    media?: ProjectMedia;
  }

  const getFeatureImage = (project: ProjectWithMedia): string => {
    if (project.media && project.media.items && project.media.items.length > 0) {
      const featureImage = project.media.items.find((item: MediaItem) => item.tag === 'feature');
      if (featureImage) {
        return featureImage.url;
      }
    }
    // Return placeholder images in a pattern based on project ID
    const imageIndex = (project.id % 3) + 1;
    return `/images/news/team-members-${imageIndex}.jpg`;
  };
  
  // Get category name from category_id
  interface GetCategoryNameProps {
    categoryId: string | number | undefined;
  }

  const getCategoryName = (categoryId: GetCategoryNameProps['categoryId']): string => {
    if (!categoryId) return '';
    return categories[categoryId] || categories[categoryId.toString()] || '';
  };

  // Event handlers for map
  interface CountryChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}

  const handleCountryChange = (e: CountryChangeEvent): void => {
    setSelectedCountry(e.target.value);
    setSelectedProject(null);
    setExpandedCard(null);
  };

  interface HandleProjectClickProps {
    projectId: number;
  }

  const handleProjectClick = (projectId: HandleProjectClickProps['projectId']): void => {
    if (selectedProject === projectId) {
      setExpandedCard(expandedCard === projectId ? null : projectId);
    } else {
      setSelectedProject(projectId);
      setExpandedCard(null);
    }
  };

  const handleExpandClick = (projectId, e) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === projectId ? null : projectId);
  };

  // Make sure project positions are always visible within the map dimensions
  const getMarkerPosition = (position) => {
    if (!position || !mapDimensions.width || !mapDimensions.height) {
      // Default positions distributed across the map if position data is missing
      const defaultX = Math.random() * 0.8 * (mapDimensions.width || 600) + 0.1 * (mapDimensions.width || 600);
      const defaultY = Math.random() * 0.8 * (mapDimensions.height || 400) + 0.1 * (mapDimensions.height || 400);
      return { x: defaultX, y: defaultY };
    }
    
    // Scale position from reference dimensions (600x400) to actual map dimensions
    const x = (position.x / 600) * mapDimensions.width;
    const y = (position.y / 400) * mapDimensions.height;
    
    // Ensure positions are within map boundaries
    return { 
      x: Math.min(Math.max(x, 50), mapDimensions.width - 50),
      y: Math.min(Math.max(y, 50), mapDimensions.height - 50)
    };
  };
  
  // Handle search input change
  interface SearchChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
  interface StatusChangeEvent extends React.ChangeEvent<HTMLInputElement> {}


  const handleSearchChange = (e: SearchChangeEvent): void => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle status filter change
  const handleStatusChange = (e: StatusChangeEvent) => {
    setActiveStatus(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  // Handle category selection
  interface HandleCategoryClickProps {
    category: string;
  }

  const handleCategoryClick = (category: HandleCategoryClickProps['category']): void => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page on new category
  };
  
  // Handle page change
  interface HandlePageChangeProps {
    pageNumber: number;
  }

  const handlePageChange = (pageNumber: HandlePageChangeProps['pageNumber']): void => {
    setCurrentPage(pageNumber);
    
    // Scroll to top of grid when changing pages
    if (projectsGridRef.current) {
      projectsGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get icon for category
  const getCategoryIcon = (categoryName, index) => {
    // Different icons for different categories
    switch(categoryName?.toLowerCase()) {
      case 'food system':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9A9 9 0 0012 4c2.25 0 4.31.83 5.89 2.2zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
        );
      case 'climate adaptation':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        );
      case 'data & evidence':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
          </svg>
        );
      case 'co-creation':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        );
      default:
        return <ArrowRight className="w-5 h-5" />;
    }
  };

  // Add fade-in classes for page loading animation
  const pageClass = isPageLoaded ? "opacity-100 transition-opacity duration-500" : "opacity-0";
  
  // @ts-ignore
  return (
    <div className={`${pageClass}`}>
      {/* Main Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/news/maize.avif"
            alt="Agricultural fields"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-10"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-20">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl mb-2 leading-tight">
            <span>Turning</span> <span className="text-yellow-400 font-bold">Ideas</span> <span>Into</span> <br />
            <span>Action</span>
          </h1>
          <h2 className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider mt-6">
            PROJECTS
          </h2>
        </div>
      </section>
      
      {/* Banner Section */}
      <div ref={bannerRef} className="w-full overflow-hidden">
        <div className="flex justify-center">
          <HeaderBelt />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      {/* Loading Animation */}
      {loading && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!loading && (
        <>
        <div className="text-center mb-8">
          <DecoratedHeading firstText="Our" secondText="Projects" />
        </div>

          
          {/* Search and Filter - aligned with projects content area */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-2/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects by name, location, or category..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="w-full md:w-1/3 flex items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 appearance-none bg-white"
                  value={activeStatus}
                  onChange={handleStatusChange}
                >
                  <option value="all">Filter by status: All</option>
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="on_hold">On Hold</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4 space-y-3">
              <div className="category-button">
                <CategoryButton
                  name="All Projects"
                  icon={<ArrowRight className="w-5 h-5" />}
                  count={totalProjects}
                  isActive={activeCategory === 'all'}
                  onClick={() => handleCategoryClick('all')}
                />
              </div>
              
              {/* Category buttons */}
              {Object.entries(categories).reduce<{ id: number; name: string; count: number }[]>((unique, [id, name]) => {
                // Skip if this category name is already in our list
                if (!unique.some(item => item.name === name)) {
                  unique.push({
                    id: parseInt(id),
                    name,
                    count: categoryCounts[name] || 0
                  });
                }
                return unique;
              }, []).map((category, index) => (
                // Only display each category once
                category && (
                  <div key={category.id} className="category-button">
                    <CategoryButton
                      name={category.name}
                      icon={getCategoryIcon(category.name, index)}
                      count={category.count}
                      isActive={activeCategory === category.name}
                      onClick={() => handleCategoryClick(category.name)}
                    />
                  </div>
                )
              ))}
            </div>
            
            {/* Projects Grid */}
            <div className="lg:w-3/4">
              {projects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No projects found matching your criteria</p>
                </div>
              ) : (
                <>
                  <div ref={projectsGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {projects.map((project) => (
                      <div key={project.id} className="project-card">
                        <ProjectCard 
                          project={project} 
                          getFeatureImage={getFeatureImage}
                          getCategoryName={getCategoryName}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
      </div>
      
      {/* Map Section */}
      <section className="w-full bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Styled header section */}
          <div className="text-center">
            <div className="flex justify-center mb-10">
              <DecoratedHeading firstText="Where We" secondText="Work" />
            </div>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-center">
              GanzAfrica operates in two countries, equipping young
              professionals with the skills and opportunities to drive
              meaningful change in Africa's agri-food systems.
            </p>

            {/* Country selector and highlights button */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="relative inline-block w-56">
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="appearance-none bg-white border border-green-700 rounded-md py-2 pl-3 pr-10 w-full text-gray-700 focus:outline-none"
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Highlights of our work
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl mx-auto mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-green-700">
                    {stat.count}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map section with project locations */}
          <div className="py-2 bg-white">
            <div
              className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-300 relative"
              ref={mapRef}
            >
              {/* Google Maps iframe with marker */}
              <iframe
                ref={mapIframeRef}
                src={currentProject ? 
                    `${currentProject.mapUrl}&markers=color:red%7Clabel:G%7C${currentProject.mapCoordinates.lat},${currentProject.mapCoordinates.lng}` : 
                    selectedCountryProjects.length > 0 ?
                      selectedCountryProjects[0]?.mapUrl ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31397.814232798383!2d20.053565!3d0.084886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1779fe8521916c39%3A0x2caec1cf01ad37f!2sAfrica!5e0!3m2!1sen!2sus!4v1681732186562!5m2!1sen!2sus" :
                      // Fallback maps for each country with no markers if no projects
                      selectedCountry === 'burkina' ?
                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125171.40082591335!2d-1.6126624448655638!3d12.36712576629056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2e9c23908451f%3A0x1f1d8074e9c2d0ab!2sOuagadougou%2C%20Burkina%20Faso!5e0!3m2!1sen!2sus!4v1712031172461!5m2!1sen!2sus" :
                        selectedCountry === 'rwanda' ?
                          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63817.18087378733!2d30.019363028729005!3d-1.944098787600761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42968f6b901%3A0xfba4f422b2a13a89!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1712031042989!5m2!1sen!2sus" :
                          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31397.814232798383!2d20.053565!3d0.084886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1779fe8521916c39%3A0x2caec1cf01ad37f!2sAfrica!5e0!3m2!1sen!2sus!4v1681732186562!5m2!1sen!2sus"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GanzAfrica Location"
              ></iframe>

              {/* Project markers with in-map cards */}
              {filteredLocations.map((location) => {
                const position = getMarkerPosition(location.mapPosition);
                const isSelected = selectedProject === location.id;
                const isExpanded = expandedCard === location.id;

                return (
                  <div
                    key={location.id}
                    className="absolute z-10"
                    style={{
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                    }}
                  >
                    {/* Project marker */}
                    <div
                      className="relative cursor-pointer"
                      onClick={() => handleProjectClick(location.id)}
                    >
                      {/* Marker with profile image */}
                      <div
                        className={`rounded-full overflow-hidden transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${isSelected ? "scale-110" : ""}`}
                        style={{
                          width: "50px",
                          height: "50px",
                          border: `3px solid ${isSelected ? "#F59E0B" : "#047857"}`,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        <img
                          src={location.image}
                          alt={location.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Location label */}
                      {isSelected && (
                        <div
                          className="absolute whitespace-nowrap text-center mt-1 text-xs font-medium bg-white px-2 py-1 rounded-md shadow-sm -translate-x-1/2"
                          style={{ top: "100%", left: "50%" }}
                        >
                          {location.location}
                        </div>
                      )}
                    </div>

                    {/* Project card */}
                    {isSelected && (
                      <div
                        className={`absolute bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-20 ${isExpanded ? "w-64" : "w-52"}`}
                        style={{
                          top: "-105px",
                          left: "-110px",
                          transform: isExpanded ? "scale(1.1)" : "scale(1)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Card content */}
                        <div className="relative">
                          {/* Project image */}
                          <div
                            className={`relative ${isExpanded ? "h-32" : "h-24"}`}
                          >
                            <img
                              src={location.image}
                              alt={location.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 text-xs font-semibold rounded">
                              {location.location}
                            </div>

                            {/* Expand/collapse button */}
                            <button
                              className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                              onClick={(e) => handleExpandClick(location.id, e)}
                            >
                              {isExpanded ? (
                                <X className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Info className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>

                          {/* Project info */}
                          <div className="p-3">
                            <h3 className="font-bold text-green-700 text-sm mb-1 line-clamp-1">
                              {location.title}
                            </h3>

                            {isExpanded ? (
                              <>
                                <p className="text-xs text-gray-600 mb-2">
                                  {location.description}
                                </p>
                                <div className="flex items-start mb-2">
                                  <MapPin className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  <p className="text-xs text-gray-600 ml-1">
                                    {location.address}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-600 mb-3">
                                  Contact: {location.contactPerson}
                                </div>
                                <Link 
                                  href={location.url}
                                  className="text-xs text-yellow-600 hover:text-yellow-800 font-medium inline-flex items-center"
                                >
                                  Learn more
                                  <ChevronRight className="ml-1 w-3 h-3" />
                                </Link>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {location.description}
                                </p>
                                <Link 
                                  href={location.url} 
                                  className="text-xs text-yellow-600 hover:text-yellow-800 font-medium"
                                >
                                  View details
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Click on a project marker to view details. The map will zoom to
              the selected location.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;

"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Upload, Image, FileVideo, Check, AlertCircle, Loader, UserPlus, Calendar, ChevronDown, Play, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

// Import shadcn/ui components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Check as CheckIcon } from "lucide-react";

const AddProjectPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [mediaSourceType, setMediaSourceType] = useState('file');
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned',
    start_date: '',
    end_date: '',
    category_id: '',
    location: '',
    goals: {
      items: []
    },
    outcomes: {
      items: []
    },
    media: {
      items: []
    },
    members: []
  });

  // Temporary state
  const [newGoal, setNewGoal] = useState({ title: '', description: '', completed: false });
  const [newOutcome, setNewOutcome] = useState({ title: '', description: '', status: 'pending' });
  const [newMember, setNewMember] = useState({ user_id: '', role: '' });
  const [newMedia, setNewMedia] = useState({ 
    file: null,
    type: 'image',
    title: '',
    tag: 'feature',
    cover: false,
    url: ''
  });

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any video preview URL
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      
      // Revoke all media blob URLs
      formData.media.items.forEach(media => {
        if (media.url && media.url.startsWith('blob:')) {
          URL.revokeObjectURL(media.url);
        }
      });
    };
  }, [formData.media.items, videoPreviewUrl]);

  // Fetch categories, users, teams and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:3002/api/categories');
        // Check the structure of the response and extract categories array
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
          setCategories(categoriesResponse.data.categories);
        } else if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          console.error('Unexpected categories response format:', categoriesResponse.data);
          setCategories([]);
        }
        
        // Fetch roles
        try {
          const rolesResponse = await axios.get('http://localhost:3002/api/roles');
          // Extract roles data based on response structure
          if (rolesResponse.data && Array.isArray(rolesResponse.data.roles)) {
            setRoles(rolesResponse.data.roles);
          } else if (Array.isArray(rolesResponse.data)) {
            setRoles(rolesResponse.data);
          }
        } catch (error) {
          console.error('Error fetching roles:', error);
          setRoles([]);
        }
        
        // Fetch teams
        try {
          const teamsResponse = await axios.get('http://localhost:3002/api/teams');
          console.log('Teams response:', teamsResponse.data); // Debug log
          
          // Check the structure of the response and extract teams array
          let allTeamMembers = [];
          if (teamsResponse.data && Array.isArray(teamsResponse.data.teams)) {
            allTeamMembers = teamsResponse.data.teams;
            setTeams(teamsResponse.data.teams);
          } else if (Array.isArray(teamsResponse.data)) {
            allTeamMembers = teamsResponse.data;
            setTeams(teamsResponse.data);
          } else {
            console.error('Unexpected teams response format:', teamsResponse.data);
            setTeams([]);
          }
          
          // Filter team members with team_type of "team" or "fellow" (case-insensitive)
          const filtered = allTeamMembers.filter(member => {
            if (!member.team_type) return false;
            
            const teamType = member.team_type.toLowerCase();
            return teamType === "team" || teamType === "fellow";
          });
          
          console.log('Filtered team members:', filtered); // Debug log
          
          if (filtered.length === 0) {
            // If no filtered results, include all team members as fallback
            console.log('No filtered team members found, using all members as fallback');
            setFilteredTeamMembers(allTeamMembers);
            setUsers(allTeamMembers);
          } else {
            setFilteredTeamMembers(filtered);
            setUsers(filtered);
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
          setTeams([]);
          setFilteredTeamMembers([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
        setCategories([]);
      }
    };
    
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle goal input
  const handleGoalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle outcome input
  const handleOutcomeChange = (e) => {
    const { name, value } = e.target;
    setNewOutcome(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle member input
  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle media input
  const handleMediaChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMedia(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle selecting a team member
  const handleTeamMemberSelect = (userId) => {
    // Check if user is already a member
    const alreadyMember = formData.members.some(
      member => member.user_id === userId
    );
    
    if (!alreadyMember && newMember.role) {
      const memberToAdd = {
        user_id: userId,
        role: newMember.role
      };
      
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, memberToAdd]
      }));
    }
    
    setPopoverOpen(false);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      
      // If previous file was a video, revoke its URL
      if (newMedia.file && newMedia.type === 'video' && newMedia.previewUrl) {
        URL.revokeObjectURL(newMedia.previewUrl);
      }
      
      // Create a preview for videos
      let previewUrl = null;
      if (fileType === 'video') {
        previewUrl = URL.createObjectURL(file);
      }
      
      setNewMedia(prev => ({
        ...prev,
        file,
        type: fileType,
        previewUrl: previewUrl,
        url: '' // Clear URL when file is selected
      }));
      
      // Switch to file mode
      setMediaSourceType('file');
    }
  };

  // Handle media source type change
  const handleMediaSourceChange = (type) => {
    setMediaSourceType(type);
    
    // Reset media state based on new source type
    if (type === 'url') {
      if (newMedia.file && newMedia.previewUrl) {
        URL.revokeObjectURL(newMedia.previewUrl);
      }
      
      setNewMedia(prev => ({
        ...prev,
        file: null,
        previewUrl: null,
        url: '',
      }));
    } else {
      setNewMedia(prev => ({
        ...prev,
        url: '',
      }));
    }
  };

  // Validate URL and determine type
  const validateUrl = (url) => {
    try {
      // Simple check if string is not empty
      if (!url || url.trim() === '') {
        return { valid: false, type: null, message: 'URL cannot be empty' };
      }
      
      // More permissive URL validation to allow a wider range of URLs
      // This pattern only checks for basic URL structure and allows more TLDs
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+(\/[a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=]*)?$/;
      if (!urlPattern.test(url)) {
        // Fall back to a very basic check - just make sure it has some domain structure
        const veryBasicPattern = /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        if (!veryBasicPattern.test(url)) {
          return { valid: false, type: null, message: 'Invalid URL format' };
        }
      }
      
      // Check if URL ends with common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv'];
      
      const lowerUrl = url.toLowerCase();
      
      // Determine type based on extension
      let type = null;
      if (imageExtensions.some(ext => lowerUrl.endsWith(ext))) {
        type = 'image';
      } else if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) {
        type = 'video';
      } else {
        // For URLs without clear extensions, try to guess based on common patterns
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || 
            lowerUrl.includes('vimeo.com') || lowerUrl.includes('dailymotion.com')) {
          type = 'video';
        } else {
          // Default to image if we can't determine
          type = 'image';
        }
      }
      
      return { valid: true, type, message: 'URL valid' };
    } catch (error) {
      console.error('Error validating URL:', error);
      // Return valid true with default type to prevent crashes
      return { valid: true, type: 'image', message: 'URL format uncertain, treating as image' };
    }
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    try {
      const url = e.target.value;
      
      // Always update the URL in the state
      setNewMedia(prev => ({ ...prev, url }));
      
      // Only validate if there's actually a URL entered
      if (url && url.trim() !== '') {
        const validation = validateUrl(url);
        if (validation.valid) {
          setNewMedia(prev => ({ 
            ...prev, 
            url,
            type: validation.type || 'image'
          }));
        }
      }
    } catch (error) {
      console.error('Error handling URL change:', error);
      // Don't throw error, just update the URL in state
      setNewMedia(prev => ({ ...prev, url: e.target.value }));
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload file to server (modified to use local URLs)
  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      // Create a local URL for the file
      const localUrl = URL.createObjectURL(file);
      
      // Clear the interval and finish
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
      }, 1500);
      
      return localUrl; // This URL will work in the browser session
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      return null;
    }
  };

  // Generate a video thumbnail (as a placeholder)
  const generateVideoThumbnail = async (videoFile) => {
    return new Promise((resolve) => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.playsInline = true;
      videoElement.muted = true;
      
      // Create a URL for the video file
      const videoURL = URL.createObjectURL(videoFile);
      videoElement.src = videoURL;
      
      // Once the video metadata is loaded, capture the thumbnail
      videoElement.onloadedmetadata = () => {
        // Set current time to the first frame
        videoElement.currentTime = 1; // 1 second in to avoid black frames
      };
      
      // When the current time updates (after seeking)
      videoElement.onseeked = () => {
        // Create a canvas and draw the video frame
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a data URL (thumbnail)
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        // Clean up
        URL.revokeObjectURL(videoURL);
        
        // Return the thumbnail
        resolve(thumbnailUrl);
      };
      
      // Handle errors
      videoElement.onerror = () => {
        URL.revokeObjectURL(videoURL);
        console.error('Error generating video thumbnail');
        resolve(null);
      };
    });
  };

  // Add goal to goals list
  const addGoal = () => {
    if (!newGoal.title || !newGoal.description) return;
    
    const goalId = `goal-${Date.now()}`;
    const goalToAdd = {
      id: goalId,
      title: newGoal.title,
      description: newGoal.description,
      completed: newGoal.completed,
      order: formData.goals.items.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      goals: {
        items: [...prev.goals.items, goalToAdd]
      }
    }));
    
    // Reset new goal form
    setNewGoal({ title: '', description: '', completed: false });
  };

  // Add outcome to outcomes list
  const addOutcome = () => {
    if (!newOutcome.title || !newOutcome.description) return;
    
    const outcomeId = `outcome-${Date.now()}`;
    const outcomeToAdd = {
      id: outcomeId,
      title: newOutcome.title,
      description: newOutcome.description,
      status: newOutcome.status,
      order: formData.outcomes.items.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      outcomes: {
        items: [...prev.outcomes.items, outcomeToAdd]
      }
    }));
    
    // Reset new outcome form
    setNewOutcome({ title: '', description: '', status: 'pending' });
  };

  // Add media to media list
  const addMedia = async () => {
    try {
      // Validate based on media source type
      if (mediaSourceType === 'file' && !newMedia.file) {
        setError('Please select a file');
        return;
      }
      
      if (mediaSourceType === 'url' && !newMedia.url) {
        setError('Please enter a URL');
        return;
      }
      
      if (!newMedia.title) {
        setError('Please enter a title for the media');
        return;
      }
      
      setError('');
      let fileUrl = '';
      let thumbnailUrl = null;
      let mediaSize = 0;
      
      if (mediaSourceType === 'file') {
        // Get local URL for the file
        fileUrl = await uploadFile(newMedia.file);
        mediaSize = newMedia.file.size;
        
        if (!fileUrl) {
          setError('Failed to create file URL. Please try again.');
          return;
        }
        
        // For videos, try to generate a thumbnail
        if (newMedia.type === 'video') {
          try {
            thumbnailUrl = await generateVideoThumbnail(newMedia.file);
          } catch (error) {
            console.error('Error generating thumbnail:', error);
            // If thumbnail generation fails, use the video itself as thumbnail
            thumbnailUrl = fileUrl;
          }
        }
      } else {
        // For URL-based media, use the URL directly
        // Validate URL
        const urlValidation = validateUrl(newMedia.url);
        if (!urlValidation.valid) {
          setError('Invalid URL. Please check and try again.');
          return;
        }
        
        fileUrl = newMedia.url;
        mediaSize = 0; // We don't know the size for URL-based media
        
        // For URL-based videos, we can't generate a thumbnail here
        // Could use a placeholder or service like OpenGraph for this
        if (newMedia.type === 'video') {
          thumbnailUrl = null;
        }
      }
      
      const mediaId = `media-${Date.now()}`;
      
      const mediaToAdd = {
        id: mediaId,
        type: newMedia.type,
        url: fileUrl,
        title: newMedia.title,
        description: '',
        tag: newMedia.tag,
        cover: newMedia.cover,
        order: formData.media.items.length + 1,
        size: mediaSize,
        isExternalUrl: mediaSourceType === 'url',
        // For videos, add duration and thumbnail
        ...(newMedia.type === 'video' && {
          duration: 0, // We could calculate actual duration with more complex code
          thumbnailUrl: thumbnailUrl
        })
      };
      
      setFormData(prev => ({
        ...prev,
        media: {
          items: [...prev.media.items, mediaToAdd]
        }
      }));
      
      // Clear any preview URL from new media
      if (newMedia.previewUrl) {
        URL.revokeObjectURL(newMedia.previewUrl);
      }
      
      // Reset new media form
      setNewMedia({ 
        file: null,
        type: 'image',
        title: '',
        tag: 'feature',
        cover: false,
        previewUrl: null,
        url: ''
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding media:', error);
      setError('Failed to add media. Please try again.');
    }
  };

  // Open video in a larger modal/preview
  const openVideoPreview = (url) => {
    setVideoPreviewUrl(url);
  };

  // Close video preview
  const closeVideoPreview = () => {
    setVideoPreviewUrl('');
  };

  // Select media for editing
  const selectMedia = (mediaId) => {
    if (selectedMedia && selectedMedia.id === mediaId) {
      setSelectedMedia(null);
    } else {
      const media = formData.media.items.find(item => item.id === mediaId);
      setSelectedMedia(media);
    }
  };

  // Update media tag
  const updateMediaTag = (mediaId, tag) => {
    setFormData(prev => ({
      ...prev,
      media: {
        items: prev.media.items.map(item => 
          item.id === mediaId ? { ...item, tag } : item
        )
      }
    }));
    
    // Update selectedMedia if it's the one being updated
    if (selectedMedia && selectedMedia.id === mediaId) {
      setSelectedMedia(prev => ({ ...prev, tag }));
    }
  };

  // Toggle media as cover
  const toggleMediaCover = (mediaId) => {
    setFormData(prev => ({
      ...prev,
      media: {
        items: prev.media.items.map(item => 
          item.id === mediaId 
            ? { ...item, cover: true } 
            : { ...item, cover: false } // Ensure only one cover image
        )
      }
    }));
    
    // Update selectedMedia if it's the one being updated
    if (selectedMedia && selectedMedia.id === mediaId) {
      setSelectedMedia(prev => ({ ...prev, cover: true }));
    }
  };

  // Add member to members list
  const addMember = () => {
    if (!newMember.user_id || !newMember.role) return;
    
    const memberToAdd = {
      user_id: parseInt(newMember.user_id),
      role: newMember.role
    };
    
    // Check if user is already a member
    const alreadyMember = formData.members.some(
      member => member.user_id === memberToAdd.user_id
    );
    
    if (alreadyMember) {
      alert('This user is already a project member');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, memberToAdd]
    }));
    
    // Reset new member form
    setNewMember({ user_id: '', role: 'member' });
  };

  // Remove goal from list
  const removeGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: {
        items: prev.goals.items.filter(goal => goal.id !== goalId)
      }
    }));
  };

  // Remove outcome from list
  const removeOutcome = (outcomeId) => {
    setFormData(prev => ({
      ...prev,
      outcomes: {
        items: prev.outcomes.items.filter(outcome => outcome.id !== outcomeId)
      }
    }));
  };

  // Remove media from list
  const removeMedia = (mediaId) => {
    // Revoke the object URL to prevent memory leaks
    const mediaToRemove = formData.media.items.find(media => media.id === mediaId);
    if (mediaToRemove) {
      if (mediaToRemove.url && mediaToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(mediaToRemove.url);
      }
      if (mediaToRemove.thumbnailUrl && mediaToRemove.thumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaToRemove.thumbnailUrl);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      media: {
        items: prev.media.items.filter(media => media.id !== mediaId)
      }
    }));
    
    if (selectedMedia && selectedMedia.id === mediaId) {
      setSelectedMedia(null);
    }
  };

  // Remove member from list
  const removeMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(member => member.user_id !== userId)
    }));
  };

  // Media preview component
  const MediaPreview = ({ media }) => {
    if (media.type === 'image') {
      return (
        <div className="h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img 
            src={media.url} 
            alt={media.title}
            className="object-cover w-full h-full" 
            onError={(e) => {
              // Replace with placeholder on error
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
      );
    } else if (media.type === 'video') {
      return (
        <div 
          className="h-20 bg-gray-100 flex items-center justify-center relative cursor-pointer"
          onClick={() => openVideoPreview(media.url)}
        >
          {/* Video thumbnail or first frame */}
          {media.thumbnailUrl ? (
            <img 
              src={media.thumbnailUrl} 
              alt={media.title}
              className="object-cover w-full h-full" 
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <FileVideo className="w-8 h-8 text-gray-500" />
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-20 bg-gray-100 flex items-center justify-center">
          <FileVideo className="w-10 h-10 text-purple-500" />
        </div>
      );
    }
  };

  // Video preview modal
  const VideoPreviewModal = () => {
    if (!videoPreviewUrl) return null;
    
    // Check if URL is external (not blob)
    const isExternalUrl = !videoPreviewUrl.startsWith('blob:');
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative w-full max-w-4xl mx-auto p-4">
          <button
            onClick={closeVideoPreview}
            className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="bg-black rounded-lg overflow-hidden">
            {isExternalUrl ? (
              // For external URLs, create an iframe for YouTube/Vimeo or show the video directly
              videoPreviewUrl.includes('youtube.com') || videoPreviewUrl.includes('youtu.be') ? (
                <iframe 
                  src={videoPreviewUrl.replace('watch?v=', 'embed/')} 
                  className="w-full h-[80vh]"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  src={videoPreviewUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-auto max-h-[80vh]"
                />
              )
            ) : (
              // For blob URLs, show the video directly
              <video 
                src={videoPreviewUrl} 
                controls 
                autoPlay 
                className="w-full h-auto max-h-[80vh]"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get team member name
  const getTeamMemberName = (userId) => {
    const user = filteredTeamMembers.find(member => member.id === userId);
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return `Team Member ${userId}`;
  };

  // Get role name by ID
  const getRoleNameById = (roleId) => {
    const role = roles.find((r) => r.id?.toString() === roleId?.toString());
    return role ? role.name : roleId?.toString();
  };

  // Format file size display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate form data
    if (!formData.name || !formData.category_id || !formData.start_date) {
      setError('Please fill in all required fields (Project Name, Category, Start Date)');
      setLoading(false);
      return;
    }
    
    try {
      // Convert blob URLs to base64 for storing in the database
      const mediaWithBase64 = await Promise.all(
        formData.media.items.map(async (media) => {
          const result = { ...media };
          
          // Only convert local blob URLs, not external URLs
          if (media.url && media.url.startsWith('blob:') && !media.isExternalUrl) {
            try {
              const response = await fetch(media.url);
              const blob = await response.blob();
              const reader = new FileReader();
              
              const base64Url = await new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              
              result.url = base64Url;
            } catch (error) {
              console.error('Error converting blob URL to base64:', error);
            }
          }
          
          // Convert thumbnail URL if it exists and is a blob
          if (media.thumbnailUrl && media.thumbnailUrl.startsWith('blob:')) {
            try {
              const response = await fetch(media.thumbnailUrl);
              const blob = await response.blob();
              const reader = new FileReader();
              
              const base64Thumbnail = await new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              
              result.thumbnailUrl = base64Thumbnail;
            } catch (error) {
              console.error('Error converting thumbnail URL to base64:', error);
            }
          }
          
          return result;
        })
      );
      
      // Prepare data for API with converted media URLs
      const projectData = {
        ...formData,
        category_id: parseInt(formData.category_id),
        media: {
          items: mediaWithBase64
        }
      };
      
      const response = await axios.post('http://localhost:3002/api/projects', projectData);
      console.log('Project created:', response.data);
      setSuccess(true);
      
      // Revoke all object URLs to prevent memory leaks
      formData.media.items.forEach(media => {
        if (media.url && media.url.startsWith('blob:')) {
          URL.revokeObjectURL(media.url);
        }
        if (media.thumbnailUrl && media.thumbnailUrl.startsWith('blob:')) {
          URL.revokeObjectURL(media.thumbnailUrl);
        }
      });
      
      // Navigate back to projects list after a brief delay
      setTimeout(() => {
        router.push('/projects');
      }, 2000);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Video preview modal */}
      {videoPreviewUrl && <VideoPreviewModal />}
      
      {/* Header with back button */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link href="/projects" className="mr-4 p-2 bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Add New Project</h1>
        </div>
        <p className="text-gray-600">Projects/Create Project</p>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">Project created successfully! Redirecting...</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Project form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
        {/* Basic project information */}
        <div className="mb-8 p-6">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Project Details</h2>
              <p className="text-gray-600 text-sm">What is the project all about?</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Project name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                    placeholder="Enter the project name"
                    required
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      {Array.isArray(categories) && categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* Start date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                      required
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* End date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md appearance-none"
                      >
                      <option value="planned">Planned</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md"
                    placeholder="Enter project location"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Overview<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2.5 border border-gray-300 rounded-md"
                  placeholder="Details go here..."
                  required
                />
              </div>
            </div>
          </div>
        </div>
        {/* Horizontal line divider */}
        <hr className="border-t border-gray-200" />

        {/* Project goals & outcomes */}
        <div className="mb-8 p-6">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Goals & Outcomes</h2>
              <p className="text-gray-600 text-sm">What are you trying to achieve?</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project goals */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project goals/objective<span className="text-red-500">*</span>
                  </label>
                  
                  {/* Goals list */}
                  <div className="space-y-3 mb-4">
                    {formData.goals.items.map(goal => (
                      <div key={goal.id} className="p-3 bg-gray-50 rounded-md relative">
                        <button
                          type="button"
                          onClick={() => removeGoal(goal.id)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                        <div className="mt-1 text-xs">
                          <span className={`px-2 py-1 rounded-full ${goal.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {goal.completed ? 'Completed' : 'Not completed'}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {formData.goals.items.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No goals added yet.</p>
                    )}
                  </div>
                  
                  {/* Add goal form */}
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">Add New Goal</h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          name="title"
                          value={newGoal.title}
                          onChange={handleGoalChange}
                          placeholder="Goal title"
                          className="w-full p-2.5 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <textarea
                          name="description"
                          value={newGoal.description}
                          onChange={handleGoalChange}
                          placeholder="Goal description"
                          rows={2}
                          className="w-full p-2.5 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="completed"
                          id="goalCompleted"
                          checked={newGoal.completed}
                          onChange={handleGoalChange}
                          className="mr-2"
                        />
                        <label htmlFor="goalCompleted" className="text-sm">
                          Completed
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={addGoal}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Goal
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Project outcomes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected outcomes<span className="text-red-500">*</span>
                  </label>
                  
                  {/* Outcomes list */}
                  <div className="space-y-3 mb-4">
                    {formData.outcomes.items.map(outcome => (
                      <div key={outcome.id} className="p-3 bg-gray-50 rounded-md relative">
                        <button
                          type="button"
                          onClick={() => removeOutcome(outcome.id)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <h4 className="font-medium">{outcome.title}</h4>
                        <p className="text-sm text-gray-600">{outcome.description}</p>
                        <div className="mt-1 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            outcome.status === 'achieved' ? 'bg-green-100 text-green-800' :
                            outcome.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {formData.outcomes.items.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No outcomes added yet.</p>
                    )}
                  </div>
                  
                  {/* Add outcome form */}
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">Add New Outcome</h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          name="title"
                          value={newOutcome.title}
                          onChange={handleOutcomeChange}
                          placeholder="Outcome title"
                          className="w-full p-2.5 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <textarea
                          name="description"
                          value={newOutcome.description}
                          onChange={handleOutcomeChange}
                          placeholder="Outcome description"
                          rows={2}
                          className="w-full p-2.5 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Status</label>
                        <div className="relative">
                          <select
                            name="status"
                            value={newOutcome.status}
                            onChange={handleOutcomeChange}
                            className="w-full p-2.5 border border-gray-300 rounded-md appearance-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="achieved">Achieved</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addOutcome}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Outcome
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Horizontal line divider */}
        <hr className="border-t border-gray-200" />

        {/* Team members */}
        <div className="mb-8 p-6">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Team</h2>
              <p className="text-gray-600 text-sm">Who will be working on this project?</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              <div className="mb-4 flex justify-between items-center">
                <label className="block text-sm font-medium">
                  Team Members<span className="text-red-500">*</span>
                </label>
                <a 
                  href="/teams/add-team"
                  className="text-sm flex items-center text-green-700 hover:text-green-800"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add New Team M
                </a>
              </div>
              
              {/* Members list */}
              {formData.members.length === 0 ? (
                <p className="text-gray-500 text-sm italic mb-4">No team members added yet.</p>
              ) : (
                <div className="bg-gray-50 rounded-md mb-4">
                  <div className="divide-y divide-gray-200">
                    {formData.members.map(member => (
                      <div key={member.user_id} className="grid grid-cols-12 p-3 items-center text-sm hover:bg-green-50">
                        <div className="col-span-6">{getTeamMemberName(member.user_id)}</div>
                        <div className="col-span-5 text-gray-600">{getRoleNameById(member.role)}</div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeMember(member.user_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add member form with MultiSelect */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">Team Member</label>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full p-2.5 border border-gray-300 rounded-md text-left flex items-center justify-between bg-white"
                      >
                        <span className="text-sm">
                          {newMember.user_id 
                            ? getTeamMemberName(newMember.user_id)
                            : "Select a team member"}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search team members..." />
                        <CommandEmpty>No team members found.</CommandEmpty>
                        <CommandGroup heading="All Members">
  {filteredTeamMembers.map(member => (
    <CommandItem
      key={teams.id}
      value={teams.name} 
      onSelect={() => {
        setNewMember(prev => ({ ...prev, user_id: member.id }));
        setPopoverOpen(false);
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div>
          {teams.name}
        </div>
      </div>
    </CommandItem>
  ))}
</CommandGroup>

                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                  <select
                    name="role"
                    value={newMember.role}
                    onChange={handleMemberChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md appearance-none"
                  >
                    <option value="">Select a role</option>
                    {Array.isArray(roles) && roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                    <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal line divider */}
        <hr className="border-t border-gray-200" />

        {/* Files & Media Section */}
        <div className="mb-8 p-6">
          <div className="flex">
            {/* Left column - section title */}
            <div className="w-1/4 pr-8">
              <h2 className="text-xl font-bold">Files & Media</h2>
              <p className="text-gray-600 text-sm">Please attach any relevant files or URLs</p>
            </div>
            
            {/* Right column - form fields */}
            <div className="w-3/4">
              {/* Media source toggle */}
              <div className="flex mb-4 border border-gray-200 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleMediaSourceChange('file')}
                  className={`flex-1 py-2 px-4 text-center text-sm ${
                    mediaSourceType === 'file' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <Upload className="w-4 h-4 inline-block mr-1" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => handleMediaSourceChange('url')}
                  className={`flex-1 py-2 px-4 text-center text-sm ${
                    mediaSourceType === 'url' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 inline-block mr-1" />
                  External URL
                </button>
              </div>
              
              {/* File upload area */}
              {mediaSourceType === 'file' && (
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center mb-6">
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-700 font-medium mb-1">Drag and drop files here</p>
                      <p className="text-gray-500 text-sm mb-3">or click to browse</p>
                      <p className="text-xs text-gray-400">Supports images (JPG, PNG, GIF) and videos (MP4, WebM)</p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*"
                  />
                </div>
              )}
              
              {/* URL input area */}
              {mediaSourceType === 'url' && (
                <div className="border border-gray-300 p-6 rounded-md mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      External Media URL<span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <input
                          type="url"
                          name="url"
                          value={newMedia.url}
                          onChange={handleUrlChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-2.5 border border-gray-300 rounded-md pl-10"
                        />
                        <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Enter URLs for images (JPG, PNG, GIF) or videos (MP4, YouTube, Vimeo links)
                    </p>
                  </div>
                  
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mediaTypeImage"
                        name="type"
                        value="image"
                        checked={newMedia.type === 'image'}
                        onChange={() => setNewMedia(prev => ({ ...prev, type: 'image' }))}
                        className="mr-2"
                      />
                      <label htmlFor="mediaTypeImage" className="flex items-center">
                        <Image className="w-4 h-4 mr-1" /> Image
                      </label>
                    </div>
                    <div className="flex items-center">
                    <input
                        type="radio"
                        id="mediaTypeVideo"
                        name="type"
                        value="video"
                        checked={newMedia.type === 'video'}
                        onChange={() => setNewMedia(prev => ({ ...prev, type: 'video' }))}
                        className="mr-2"
                      />
                      <label htmlFor="mediaTypeVideo" className="flex items-center">
                        <FileVideo className="w-4 h-4 mr-1" /> Video
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* File/URL preview */}
              {(mediaSourceType === 'file' && newMedia.file) || (mediaSourceType === 'url' && newMedia.url) ? (
                <div className="p-4 bg-gray-50 rounded-md mb-6">
                  <div className="flex items-center mb-3">
                    {newMedia.type === 'image' ? (
                      <Image className="w-6 h-6 mr-2 text-blue-500" />
                    ) : (
                      <FileVideo className="w-6 h-6 mr-2 text-purple-500" />
                    )}
                    <span className="text-sm font-medium">
                      {mediaSourceType === 'file' 
                        ? newMedia.file.name 
                        : newMedia.url.length > 50 
                          ? newMedia.url.substring(0, 47) + '...' 
                          : newMedia.url
                      }
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Type: {newMedia.type.charAt(0).toUpperCase() + newMedia.type.slice(1)}
                    {mediaSourceType === 'file' && ` | Size: ${formatFileSize(newMedia.file.size)}`}
                    {mediaSourceType === 'url' && ` | External URL`}
                  </div>
                  
                  {/* Video preview for local videos */}
                  {mediaSourceType === 'file' && newMedia.type === 'video' && newMedia.previewUrl && (
                    <div className="mb-4 border rounded overflow-hidden">
                      <video 
                        src={newMedia.previewUrl} 
                        controls 
                        className="w-full h-auto max-h-40" 
                      />
                    </div>
                  )}
                  
                  {/* Image preview for local images */}
                  {mediaSourceType === 'file' && newMedia.type === 'image' && newMedia.file && (
                    <div className="mb-4 border rounded overflow-hidden">
                      <img 
                        src={URL.createObjectURL(newMedia.file)} 
                        alt="Preview" 
                        className="w-full h-auto max-h-40 object-contain" 
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Clean up object URL after loading
                      />
                    </div>
                  )}
                  
                  {/* URL preview placeholders */}
                  {mediaSourceType === 'url' && newMedia.url && (
                    <div className="mb-4 border rounded overflow-hidden bg-gray-100 p-2 flex items-center justify-center">
                      {newMedia.type === 'image' ? (
                        <div className="text-center p-4">
                          <Image className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Image will be loaded from URL</p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <FileVideo className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Video will be loaded from URL</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        Uploading: {uploadProgress}%
                      </div>
                    </div>
                  )}
                  
                  {/* Media details form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="title"
                        value={newMedia.title}
                        onChange={handleMediaChange}
                        placeholder="Media title"
                        className="w-full p-2.5 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Tag</label>
                      <div className="relative">
                        <select
                          name="tag"
                          value={newMedia.tag}
                          onChange={handleMediaChange}
                          className="w-full p-2.5 border border-gray-300 rounded-md appearance-none"
                        >
                          <option value="feature">Feature</option>
                          <option value="description">Description</option>
                          <option value="others">Others</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="cover"
                        id="mediaCover"
                        checked={newMedia.cover}
                        onChange={handleMediaChange}
                        className="mr-2"
                        disabled={newMedia.type === 'video'} // Only images can be cover
                      />
                      <label htmlFor="mediaCover" className={`text-sm ${newMedia.type === 'video' ? 'text-gray-400' : ''}`}>
                        Use as cover image
                        {newMedia.type === 'video' && " (only available for images)"}
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addMedia}
                        disabled={isUploading}
                        className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md text-sm flex items-center"
                      >
                        {isUploading ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" /> 
                            {mediaSourceType === 'url' ? 'Add External Media' : 'Add Media'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Display media list */}
              <h3 className="text-lg font-semibold mb-4">Project Media</h3>
              
              {formData.media.items.length === 0 ? (
                <p className="text-gray-500 text-sm italic mb-4">No media added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {formData.media.items.map(media => (
                    <div 
                      key={media.id} 
                      className={`border rounded-md overflow-hidden ${selectedMedia && selectedMedia.id === media.id ? 'ring-2 ring-green-500' : ''}`}
                    >
                      {/* Media preview */}
                      <div 
                        className="cursor-pointer"
                        onClick={() => media.type === 'video' ? openVideoPreview(media.url) : selectMedia(media.id)}
                      >
                        <MediaPreview media={media} />
                      </div>
                      
                      {/* Media info */}
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm truncate">{media.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeMedia(media.id)}
                            className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {media.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{media.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-1 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {media.type}
                          </span>
                          {media.isExternalUrl ? (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                              External URL
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {formatFileSize(media.size)}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full ${
                            media.tag === 'feature' ? 'bg-blue-100 text-blue-800' :
                            media.tag === 'description' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {media.tag}
                          </span>
                          {media.cover && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Cover
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Tag selection - show when media is selected */}
                      {selectedMedia && selectedMedia.id === media.id && media.type !== 'video' && (
                        <div className="p-3 border-t">
                          <div className="mb-2">
                            <label className="text-xs font-semibold mb-1 block">Change Display Tag:</label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => updateMediaTag(media.id, 'feature')}
                                className={`px-2 py-1 text-xs rounded-full ${media.tag === 'feature' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
                              >
                                Feature
                              </button>
                              <button
                                type="button"
                                onClick={() => updateMediaTag(media.id, 'description')}
                                className={`px-2 py-1 text-xs rounded-full ${media.tag === 'description' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}
                              >
                                Description
                              </button>
                              <button
                                type="button"
                                onClick={() => updateMediaTag(media.id, 'others')}
                                className={`px-2 py-1 text-xs rounded-full ${media.tag === 'others' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
                              >
                                Others
                              </button>
                            </div>
                          </div>
                          
                          {!media.cover && media.type === 'image' && (
                            <button
                              type="button"
                              onClick={() => toggleMediaCover(media.id)}
                              className="text-xs bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded-md flex items-center"
                            >
                              <Check className="w-3 h-3 mr-1" /> Set as Cover Image
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/projects')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-700 rounded-md text-white hover:bg-green-800 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectPage;
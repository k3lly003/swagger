"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Twitter, Linkedin, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { Input } from '@workspace/ui';
import { toast } from 'sonner';

interface SocialMedia {
  twitter: string;
  linkedin: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface UserData {
  name: string;
  role: string;
  title: string;
  telephone: string;
  email: string;
  reportingManager: string;
  biography: string;
  nationalId: string;
  gender: string;
  taxId: string;
  socialSecurity: string;
  address: string;
  startDate: string;
  socialMedia: SocialMedia;
  emergencyContact: EmergencyContact;
  bankDetails: BankDetails;
}

interface UserProfileProps {
  user: UserData;
}

const defaultUser: UserData = {
  name: "John Doe",
  role: "Software Engineer",
  title: "Senior Developer",
  telephone: "+1234567890",
  email: "john.doe@example.com",
  reportingManager: "Jane Smith",
  biography: "Experienced software engineer with a passion for building great products.",
  nationalId: "ABC123456",
  gender: "Male",
  taxId: "TAX123456",
  socialSecurity: "SSN123456",
  address: "123 Main St, City, Country",
  startDate: "2023-01-01",
  socialMedia: {
    twitter: "https://twitter.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  },
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+0987654321",
    email: "jane.doe@example.com"
  },
  bankDetails: {
    bankName: "Example Bank",
    accountName: "John Doe",
    accountNumber: "1234567890"
  }
};

interface InfoItemProps {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: (value: string) => void;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, isEditing, onEdit }) => {
  const [editValue, setEditValue] = useState(value);

  return (
    <div className="mb-6">
      <h4 className="text-sm text-gray-500 mb-1">{label}</h4>
      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onEdit(editValue)}
          className="text-sm"
        />
      ) : (
        <p className="text-sm font-medium text-gray-900">{value}</p>
      )}
    </div>
  );
};

export function UserProfile({ user: initialUser = defaultUser }: UserProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScrollable = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowScrollButton(container.scrollHeight > container.clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtTop = container.scrollTop === 0;
      setIsScrolledDown(!isAtTop);
    }
  };

  const scrollToPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (isScrolledDown) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  const handleEdit = (field: string, value: string) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialEdit = (platform: keyof SocialMedia, value: string) => {
    setUser(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleEmergencyContactEdit = (field: keyof EmergencyContact, value: string) => {
    setUser(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handleBankDetailsEdit = (field: keyof BankDetails, value: string) => {
    setUser(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // In a real app, this is where we'd save to backend
      toast.success('Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 animate-fade-in relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-gray-500">Manage users/View user</p>
        </div>
        <Button 
          onClick={toggleEdit}
          className="bg-green-700 hover:bg-green-800 transition-colors"
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card - Static Left Column */}
        <Card className="p-6 shadow-sm animate-fade-in relative h-fit" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center relative group">
              {user.name ? (
                <div className="bg-purple-700 text-white w-full h-full flex items-center justify-center text-3xl font-semibold">
                  {user.name
                    .split(' ')
                    .map(part => part[0])
                    .join('')
                    .toUpperCase()}
                </div>
              ) : (
                <img 
                  alt="Profile" 
                  src="/placeholder.svg" 
                  className="w-full h-full object-cover"
                />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm">
                    Change Photo
                  </Button>
                </div>
              )}
            </div>
            {isEditing ? (
              <Input
                value={user.name}
                onChange={(e) => handleEdit('name', e.target.value)}
                className="text-xl font-bold text-center mb-2"
              />
            ) : (
              <h2 className="text-xl font-bold">{user.name}</h2>
            )}
            <div className="flex items-center mt-1">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              {isEditing ? (
                <Input
                  value={user.role}
                  onChange={(e) => handleEdit('role', e.target.value)}
                  className="text-sm w-40"
                />
              ) : (
                <span className="text-sm text-gray-500">{user.role}</span>
              )}
            </div>
          </div>

          <InfoItem 
            label="Title" 
            value={user.title} 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('title', value)}
          />
          <InfoItem 
            label="Telephone" 
            value={user.telephone} 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('telephone', value)}
          />
          <InfoItem 
            label="Email" 
            value={user.email} 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('email', value)}
          />
          <InfoItem 
            label="Reporting Manager" 
            value={user.reportingManager} 
            isEditing={isEditing}
            onEdit={(value) => handleEdit('reportingManager', value)}
          />
          
          {/* Social Media Links */}
          <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              {isEditing ? (
                <Input
                  value={user.socialMedia.twitter}
                  onChange={(e) => handleSocialEdit('twitter', e.target.value)}
                  className="text-sm w-40"
                />
              ) : (
                <a 
                  href={user.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              {isEditing ? (
                <Input
                  value={user.socialMedia.linkedin}
                  onChange={(e) => handleSocialEdit('linkedin', e.target.value)}
                  className="text-sm w-40"
                />
              ) : (
                <a 
                  href={user.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Right Column - Scrollable with Hidden Scrollbar */}
        <div className="col-span-2 relative">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {/* Biography Card */}
            <Card className="p-6 shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold mb-4">Biography</h3>
              {isEditing ? (
                <textarea
                  value={user.biography}
                  onChange={(e) => handleEdit('biography', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm text-gray-600 min-h-[100px]"
                  aria-label="Biography"
                  title="Biography"
                />
              ) : (
                <p className="text-sm text-gray-600">{user.biography}</p>
              )}
            </Card>

            {/* Other Relevant Details */}
            <Card className="p-6 shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold mb-6">Other Relevant Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoItem 
                  label="National ID/Passport Number" 
                  value={user.nationalId} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEdit('nationalId', value)}
                />
                <InfoItem 
                  label="Gender" 
                  value={user.gender} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEdit('gender', value)}
                />
                <InfoItem 
                  label="Tax Identification Number" 
                  value={user.taxId} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEdit('taxId', value)}
                />
                <InfoItem 
                  label="Social Security Number" 
                  value={user.socialSecurity} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEdit('socialSecurity', value)}
                />
                <InfoItem 
                  label="Residential Address" 
                  value={user.address} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEdit('address', value)}
                />
                <InfoItem 
                  label="Start Date" 
                  value={user.startDate} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEdit('startDate', value)}
                />
              </div>
            </Card>

            {/* Emergency Contact Information */}
            <Card className="p-6 shadow-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-bold mb-6">Emergency Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoItem 
                  label="Contact Name" 
                  value={user.emergencyContact.name} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEmergencyContactEdit('name', value)}
                />
                <InfoItem 
                  label="Relationship to Employee" 
                  value={user.emergencyContact.relationship} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEmergencyContactEdit('relationship', value)}
                />
                <InfoItem 
                  label="Contact Number" 
                  value={user.emergencyContact.phone} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEmergencyContactEdit('phone', value)}
                />
                <InfoItem 
                  label="Email Address" 
                  value={user.emergencyContact.email} 
                  isEditing={isEditing}
                  onEdit={(value) => handleEmergencyContactEdit('email', value)}
                />
              </div>
            </Card>

            {/* Bank Details */}
            <Card className="p-6 shadow-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg font-bold mb-6">Bank Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoItem 
                  label="Bank Name" 
                  value={user.bankDetails.bankName} 
                  isEditing={isEditing}
                  onEdit={(value) => handleBankDetailsEdit('bankName', value)}
                />
                <InfoItem 
                  label="Account Holder's Name" 
                  value={user.bankDetails.accountName} 
                  isEditing={isEditing}
                  onEdit={(value) => handleBankDetailsEdit('accountName', value)}
                />
                <InfoItem 
                  label="Account Number" 
                  value={user.bankDetails.accountNumber} 
                  isEditing={isEditing}
                  onEdit={(value) => handleBankDetailsEdit('accountNumber', value)}
                />
              </div>
            </Card>
          </div>

          {/* Scroll Button */}
          {showScrollButton && (
            <button
              onClick={scrollToPosition}
              className="fixed bottom-8 right-8 p-3 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 transition-colors animate-bounce"
              title={isScrolledDown ? "Scroll to top" : "Scroll to bottom"}
            >
              {isScrolledDown ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <UserProfile user={defaultUser} />
      </div>
    </>
  );
}

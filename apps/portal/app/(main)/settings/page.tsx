"use client";

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Lock, 
  Globe, 
  Moon,
  Sun, 
  Smartphone,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Switch } from '@workspace/ui/components/switch';
import { Card } from '@workspace/ui/components/card';
import { toast } from 'sonner';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const sections: SettingsSection[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Configure how you want to receive notifications'
  },
  {
    id: 'security',
    title: 'Security',
    icon: Lock,
    description: 'Manage your account security settings'
  },
  {
    id: 'language',
    title: 'Language & Region',
    icon: Globe,
    description: 'Set your language and regional preferences'
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Moon,
    description: 'Customize the look and feel of your dashboard'
  }
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('notifications');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Apply theme changes to document and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsUpdates: true,
    projectUpdates: true,
    securityAlerts: true
  });

  // Security settings
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Language settings
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [selectedDateFormat, setSelectedDateFormat] = useState('MM/DD/YYYY');

  // Appearance settings
  const [density, setDensity] = useState('comfortable');

  const handleNotificationChange = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notificationSettings]
    }));
    toast.success(`${key} notifications ${notificationSettings[key as keyof typeof notificationSettings] ? 'disabled' : 'enabled'}`);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    toast.success('Language preference updated');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <Switch 
                checked={notificationSettings.emailNotifications}
                onCheckedChange={() => handleNotificationChange('emailNotifications')}
                aria-label="Toggle email notifications"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                </div>
              </div>
              <Switch 
                checked={notificationSettings.pushNotifications}
                onCheckedChange={() => handleNotificationChange('pushNotifications')}
                aria-label="Toggle push notifications"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium">News Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about news and announcements</p>
                </div>
              </div>
              <Switch 
                checked={notificationSettings.newsUpdates}
                onCheckedChange={() => handleNotificationChange('newsUpdates')}
                aria-label="Toggle news updates"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium">Security Alerts</h3>
                  <p className="text-sm text-gray-500">Receive alerts about security-related activities</p>
                </div>
              </div>
              <Switch 
                checked={notificationSettings.securityAlerts}
                onCheckedChange={() => handleNotificationChange('securityAlerts')}
                aria-label="Toggle security alerts"
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Current Password</label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm New Password</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-700 hover:bg-green-800"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium mb-4">Two-Factor Authentication</h3>
              <Button variant="outline" className="w-full">
                Set up two-factor authentication
              </Button>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">Language</label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium mb-2">Time Zone</label>
              <select
                id="timezone"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="UTC">UTC</option>
                <option value="CAT">Central Africa Time</option>
                <option value="EAT">East Africa Time</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium mb-2">Date Format</label>
              <select
                id="dateFormat"
                value={selectedDateFormat}
                onChange={(e) => setSelectedDateFormat(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Theme</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 border rounded-lg flex items-center space-x-3 ${
                    theme === 'light' ? 'border-green-500 bg-green-50' : ''
                  }`}
                  aria-pressed={String(theme === 'light')}
                >
                  <Sun className="w-5 h-5" />
                  <span>Light</span>
                  {theme === 'light' && (
                    <Check className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 border rounded-lg flex items-center space-x-3 ${
                    theme === 'dark' ? 'border-green-500 bg-green-50' : ''
                  }`}
                  aria-pressed={String(theme === 'dark')}
                >
                  <Moon className="w-5 h-5" />
                  <span>Dark</span>
                  {theme === 'dark' && (
                    <Check className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="density" className="block text-sm font-medium mb-2">Interface Density</label>
              <select
                id="density"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Card className="p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-green-50 text-green-700'
                      : 'hover:bg-gray-50'
                  }`}
                  aria-pressed={activeSection === section.id}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-500">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
}

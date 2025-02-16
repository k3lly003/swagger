'use client';

import { useState } from 'react';
import { Search, Bell, Check, X, Filter, ChevronDown } from 'lucide-react';
import { Card } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

// Mock notifications data with different types and priorities
const mockNotifications = [
  {
    id: 1,
    title: 'New Project Assignment',
    message: 'You have been assigned to the Climate Adaptation Project',
    time: '2 hours ago',
    isRead: false,
    type: 'project',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Task Deadline Approaching',
    message: 'The deadline for "Submit Project Report" is tomorrow',
    time: '5 hours ago',
    isRead: false,
    type: 'task',
    priority: 'high'
  },
  {
    id: 3,
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    time: '1 day ago',
    isRead: true,
    type: 'system',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'New Comment on Project',
    message: 'John Smith commented on Climate Adaptation Project',
    time: '2 days ago',
    isRead: true,
    type: 'project',
    priority: 'low'
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications based on active tab and search query
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notification.isRead) ||
      (activeTab === 'read' && notification.isRead);
    
    const matchesSearch = searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'unread':
        return notifications.filter(n => !n.isRead).length;
      case 'read':
        return notifications.filter(n => n.isRead).length;
      default:
        return notifications.length;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your notifications</p>
        </div>
        <Button 
          onClick={markAllAsRead}
          variant="outline"
          className="text-gray-600 dark:text-gray-300"
        >
          <Check className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'all'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              All ({getTabCount('all')})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'unread'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Unread ({getTabCount('unread')})
            </button>
            <button
              onClick={() => setActiveTab('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'read'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Read ({getTabCount('read')})
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" className="gap-2" title="Filter notifications">
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">You're all caught up! Check back later for new notifications.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`p-4 transition-colors ${
                !notification.isRead ? 'bg-green-50/50 dark:bg-green-900/10' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium dark:text-white">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full dark:bg-green-900/50 dark:text-green-400">
                        New
                      </span>
                    )}
                    {notification.priority === 'high' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full dark:bg-red-900/50 dark:text-red-400">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{notification.message}</p>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">{notification.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/50"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                    title="Delete notification"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

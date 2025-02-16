"use client";

import {
  Users,
  FolderGit2,
  Briefcase,
  FileText,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  // Stats data
  const stats = [
    {
      title: "All Users",
      value: "123",
      change: "+6.5",
      period: "since last week",
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      color: "emerald",
    },
    {
      title: "Total Projects",
      value: "123",
      change: "0",
      period: "since last week",
      icon: <FolderGit2 className="w-5 h-5 text-amber-600" />,
      color: "amber",
    },
    {
      title: "Total Opportunities",
      value: "123",
      change: "+0.5",
      period: "since last week",
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      color: "blue",
    },
    {
      title: "All News",
      value: "123",
      period: "since last week",
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      color: "amber",
    },
  ];

  // Recent activities data
  const recentActivities = [
    {
      user: {
        name: "Emmanuel N.",
        avatar: "/avatars/emmanuel.jpg",
      },
      action:
        "submitted a new comprehensive agricultural development project proposal for",
      time: "2 hours ago",
    },
    {
      user: {
        name: "Fatima K.",
        avatar: "/avatars/fatima.jpg",
      },
      action:
        "updated key milestone achievements for the Clean Water Access Program in rural communities",
      time: "2 hours ago",
    },
    {
      user: {
        name: "John M.",
        avatar: "/avatars/john.jpg",
      },
      action:
        "requested additional technical staff and budget allocation for the expanding solar initiative",
      time: "9 hours ago",
    },
    {
      user: {
        name: "Amina B.",
        avatar: "/avatars/amina.jpg",
      },
      action:
        "requested additional technical staff and budget allocation for the expanding solar initiative",
      time: "5 hours ago",
    },
  ];

  // Active projects data
  const activeProjects = [
    {
      name: "Project Tracking System",
      description: "Improving crop yields in drought regions",
      icon: "/project-icons/tracking.png",
    },
    {
      name: "Clean Water Access Program",
      description: "Building wells in rural communities",
      icon: "/project-icons/water.png",
    },
    {
      name: "Project Tracking System",
      description: "Improving crop yields in drought regions",
      icon: "/project-icons/tracking.png",
    },
  ];

  return (
    <div className="p-8 bg-gray-50">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Angel! 👋</h1>
        <p className="text-gray-600">
          Welcome back, Angel. Here's what's happening with your website today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-gray-600">
                {stat.title}
              </span>
              {stat.icon}
            </div>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              {stat.change && (
                <span className={`ml-2 text-sm text-${stat.color}-600`}>
                  {stat.change}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{stat.period}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">
              Project Statistics (Last 6 Months)
            </h3>
            <button className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-3 py-1 rounded">
              2020-2024 <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Project Statistics Chart
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">User Engagement (Last Month)</h3>
            <button className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-3 py-1 rounded">
              2024 <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            User Engagement Chart
          </div>
        </div>
      </div>

      {/* Recent Activities and Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {activity.user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    {activity.action}
                  </p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Active Projects</h3>
            <a href="#" className="text-sm text-emerald-600 hover:underline">
              View all Projects
            </a>
          </div>
          <div className="space-y-4">
            {activeProjects.map((project, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">P</span>
                </div>
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

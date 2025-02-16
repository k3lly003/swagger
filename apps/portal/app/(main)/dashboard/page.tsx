"use client";

import { useState, useEffect } from 'react';
import { Users, FolderGit2, Briefcase, FileText, ChevronDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  CardContent
} from '@workspace/ui/components/card';
import { 
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  Line,
  LineChart,
  ResponsiveContainer
} from 'recharts';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { useAuth } from '@/components/auth/auth-provider';

export default function DashboardPage() {
  // Get auth context to access the current user
  const { user } = useAuth();
  
  // Get the full name of the logged-in user
  const userName = user?.name || "User";

  // State for storing API data
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [totalNews, setTotalNews] = useState(0);
  const [projectStatsData, setProjectStatsData] = useState([]);
  const [userEngagementData, setUserEngagementData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);

  // Fetch data from APIs
  useEffect(() => {
    // Fetch total users
    fetch('http://localhost:3002/api/users')
      .then(response => response.json())
      .then(data => {
        // Check if data is an array or has a users property that's an array
        const usersArray = Array.isArray(data) ? data : (data.users || []);
        setTotalUsers(usersArray.length || 0);
        console.log('Users data:', usersArray);
      })
      .catch(error => console.error('Error fetching users:', error));

    // Fetch total projects
    fetch('http://localhost:3002/api/projects')
      .then(response => response.json())
      .then(data => {
        // Check if data is an array or has a projects property that's an array
        const projectsArray = Array.isArray(data) ? data : (data.projects || []);
        setTotalProjects(projectsArray.length || 0);
        console.log('Projects data:', projectsArray);
        
        // Extract active projects for the sidebar
        const active = projectsArray
          .filter(project => project.status === 'active' || project.status === 'in-progress')
          .slice(0, 3)
          .map(project => ({
            name: project.name,
            description: project.description,
            icon: project.icon || '/project-icons/tracking.png'
          }));
        
        setActiveProjects(active);
        
        // Process project data for chart - modified to track completed and pending projects by month
        const projectsByMonth = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Initialize months with zero counts
        months.forEach(month => {
          projectsByMonth[month] = { month, completed: 0, pending: 0 };
        });
        
        // Count projects by month and status
        projectsArray.forEach(project => {
          const createdDate = new Date(project.createdAt || new Date());
          const month = months[createdDate.getMonth()];
          
          if (project.status === 'completed') {
            projectsByMonth[month].completed += 1;
          } else if (project.status === 'planned' || project.status === 'pending') {
            projectsByMonth[month].pending += 1;
          }
        });
        
        // Convert to array for chart and take last 6 months
        const chartData = Object.values(projectsByMonth).slice(-6);
        setProjectStatsData(chartData);
      })
      .catch(error => console.error('Error fetching projects:', error));

    // Fetch total opportunities
    fetch('http://localhost:3002/api/opportunities')
      .then(response => response.json())
      .then(data => {
        // Check if data is an array or has an opportunities property that's an array
        const opportunitiesArray = Array.isArray(data) ? data : (data.opportunities || []);
        setTotalOpportunities(opportunitiesArray.length || 0);
        console.log('Opportunities data:', opportunitiesArray);
      })
      .catch(error => console.error('Error fetching opportunities:', error));

    // Fetch total news
    fetch('http://localhost:3002/api/news')
      .then(response => response.json())
      .then(data => {
        // Check if data is an array or has a news property that's an array
        const newsArray = Array.isArray(data) ? data : (data.news || []);
        setTotalNews(newsArray.length || 0);
        console.log('News data:', newsArray);
      })
      .catch(error => console.error('Error fetching news:', error));
      
    // For user engagement data, we'll simulate weekly data based on user activity
    // In a real app, you would have an API endpoint for this
    fetch('http://localhost:3002/api/users')
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array
        const userData = Array.isArray(data) ? data : (data.users || []);
        
        // Simulate weekly user activity based on user creation/login dates
        const weeklyData = [
          { week: "Week 1", activity: 0 },
          { week: "Week 2", activity: 0 },
          { week: "Week 3", activity: 0 },
          { week: "Week 4", activity: 0 },
        ];
        
        // Calculate activity based on user creation dates
        userData.forEach(user => {
          if (user.createdAt || user.lastLoginAt) {
            const date = new Date(user.createdAt || user.lastLoginAt);
            const currentDate = new Date();
            const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 7) weeklyData[0].activity += 1;
            else if (daysDiff <= 14) weeklyData[1].activity += 1;
            else if (daysDiff <= 21) weeklyData[2].activity += 1;
            else if (daysDiff <= 28) weeklyData[3].activity += 1;
          }
        });
        
        setUserEngagementData(weeklyData);
      })
      .catch(error => console.error('Error processing user engagement data:', error));
      
    // Fetch recent activities
    // In a real app, you would have an API endpoint for activity logs
    // For now, we'll use the projects data to simulate activities
    fetch('http://localhost:3002/api/projects')
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array
        const projectData = Array.isArray(data) ? data : (data.projects || []);
        
        // Create a copy of the array for sorting to avoid mutations
        const sortedProjects = [...projectData];
        
        // Check if sortedProjects is non-empty before sorting
        if (sortedProjects.length > 0) {
          // Sort by date (newest first)
          sortedProjects.sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0);
            const dateB = new Date(b.updatedAt || b.createdAt || 0);
            return dateB - dateA;
          });
        }
        
        // Get most recent projects and create activity entries
        const activities = sortedProjects
          .slice(0, 4)
          .map(project => {
            const isUpdated = project.updatedAt && project.updatedAt !== project.createdAt;
            const timeAgo = getTimeAgo(new Date(project.updatedAt || project.createdAt || new Date()));
            
            return {
              user: {
                name: project.createdBy?.name || 'User',
                avatar: project.createdBy?.avatar || '/avatars/default.jpg'
              },
              action: isUpdated 
                ? `updated key milestone achievements for the ${project.name}`
                : `submitted a new ${project.name} project proposal for review`,
              time: timeAgo
            };
          });
          
        setRecentActivities(activities);
      })
      .catch(error => console.error('Error processing activities data:', error));
  }, []);

  // Helper function to calculate time ago
  function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs === 1) return '1 hour ago';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }

  // Chart config for project statistics - updated to show completed and pending
  const projectChartConfig = {
    completed: {
      label: "Completed",
      color: "#009758", // green for completed
    },
    pending: {
      label: "Pending",
      color: "#FF9500", // orange for pending
    },
  } satisfies ChartConfig;

  // Chart config for user engagement
  const engagementChartConfig = {
    activity: {
      label: "Application track",
      color: "#2F88E1", // blue
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold mb-2 dark:text-white">Welcome Back, {userName}! 👋</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Here's an overview of your dashboard activities and statistics today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="relative shadow-sm overflow-hidden dark:bg-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-green"></div>
          <div className="absolute top-3 md:top-4 right-3 md:right-4">
            <div className="rounded-full p-1.5 md:p-2 bg-lighter-green-50 dark:bg-green-900">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary-green" />
            </div>
          </div>
          <CardHeader className="pb-0 pt-4 px-4">
            <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">All Users</CardDescription>
            <CardTitle className="text-xl md:text-2xl font-semibold mt-1 md:mt-2 dark:text-white">{totalUsers}</CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center pt-0 pb-4 px-4">
            <div className="flex items-center">
              <span className="text-xs md:text-sm text-primary-green font-medium">↑ 6.5</span>
              <span className="text-xs md:text-sm text-black dark:text-white ml-1">since last week</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="relative shadow-sm overflow-hidden dark:bg-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-orange"></div>
          <div className="absolute top-3 md:top-4 right-3 md:right-4">
            <div className="rounded-full p-1.5 md:p-2 bg-light-orange dark:bg-orange-900">
              <FolderGit2 className="w-4 h-4 md:w-5 md:h-5 text-primary-orange" />
            </div>
          </div>
          <CardHeader className="pb-0 pt-4 px-4">
            <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Projects</CardDescription>
            <CardTitle className="text-xl md:text-2xl font-semibold mt-1 md:mt-2 dark:text-white">{totalProjects}</CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center pt-0 pb-4 px-4">
            <div className="flex items-center">
              <span className="text-xs md:text-sm text-red-500 font-medium">↓ 0</span>
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-1">since last week</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="relative shadow-sm overflow-hidden dark:bg-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue"></div>
          <div className="absolute top-3 md:top-4 right-3 md:right-4">
            <div className="rounded-full p-1.5 md:p-2 bg-blue-lighter dark:bg-blue-900">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-blue" />
            </div>
          </div>
          <CardHeader className="pb-0 pt-4 px-4">
            <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Opportunities</CardDescription>
            <CardTitle className="text-xl md:text-2xl font-semibold mt-1 md:mt-2 dark:text-white">{totalOpportunities}</CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center pt-0 pb-4 px-4">
            <div className="flex items-center">
              <span className="text-xs md:text-sm text-blue font-medium">↑ 6.5</span>
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-1">since last week</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="relative shadow-sm overflow-hidden dark:bg-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-grid"></div>
          <div className="absolute top-3 md:top-4 right-3 md:right-4">
            <div className="rounded-full p-1.5 md:p-2 bg-yellow-lighter dark:bg-yellow-900">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-orange-grid" />
            </div>
          </div>
          <CardHeader className="pb-0 pt-4 px-4">
            <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">All News</CardDescription>
            <CardTitle className="text-xl md:text-2xl font-semibold mt-1 md:mt-2 dark:text-white">{totalNews}</CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center pt-0 pb-4 px-4">
            <div className="flex items-center">
              <span className="text-xs md:text-sm text-secondary-green font-medium">↑ 6.5</span>
              <span className="text-xs md:text-sm text-black dark:text-white ml-1">since last week</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Project Statistics - UPDATED TO LINE CHART */}
        <Card className="shadow-sm dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-base md:text-lg font-semibold dark:text-white">Project Status Comparison</CardTitle>
            <button className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
              2020-2024 <ChevronDown className="w-3 h-3 md:w-4 md:h-4 ml-1" />
            </button>
          </CardHeader>
          <CardContent className="px-2 md:px-4">
            <ChartContainer config={projectChartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart 
                  accessibilityLayer 
                  data={projectStatsData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    domain={[0, 10]}
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Number of Projects', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 }, dx: -10 }}
                  />
                  <ChartTooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Line 
                    type="monotone"
                    dataKey="completed" 
                    stroke="var(--color-completed)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-completed)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="pending" 
                    stroke="var(--color-pending)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-pending)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-center items-center pt-0 pb-4 px-4">
            <div className="flex flex-wrap justify-center items-center space-x-4 md:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-sm bg-[#009758]"></div>
                <span className="text-xs md:text-sm dark:text-gray-300">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-sm bg-[#FF9500]"></div>
                <span className="text-xs md:text-sm dark:text-gray-300">Pending</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* User Engagement */}
        <Card className="shadow-sm dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-base md:text-lg font-semibold dark:text-white">User Engagement</CardTitle>
            <button className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
              2024 <ChevronDown className="w-3 h-3 md:w-4 md:h-4 ml-1" />
            </button>
          </CardHeader>
          <CardContent className="px-2 md:px-4">
            <ChartContainer config={engagementChartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  accessibilityLayer
                  data={userEngagementData}
                  margin={{
                    top: 5,
                    left: 0,
                    right: 10,
                    bottom: 5
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    ticks={[0, 40, 80, 120, 160]}
                    domain={[0, 180]}
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Number of Users', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 }, dx: -10 }}
                  />
                  <ChartTooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="activity"
                    type="monotone"
                    stroke="var(--color-activity)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-activity)",
                      r: 4
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-center items-center pt-0 pb-4 px-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-sm bg-[#2F88E1]"></div>
              <span className="text-xs md:text-sm dark:text-gray-300">Application track</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Recent Activities - 65% width on large screens */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:py-4 flex justify-between items-center">
            <h2 className="text-base md:text-lg font-semibold dark:text-white">Recent Activities</h2>
          </div>
          
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start px-4 py-3 md:py-4">
                <Avatar className="mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`pb-3 md:pb-4 ${index < recentActivities.length - 1 ? "border-b dark:border-gray-700 w-full" : "w-full"}`}>
                  <p className="text-sm md:text-base dark:text-gray-300 line-clamp-2">
                    <span className="font-medium dark:text-white">{activity.user.name}</span>{' '}
                    {activity.action}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 md:py-8 text-center">
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No recent activities to display</p>
            </div>
          )}
        </div>

        {/* Active Projects - 35% width on large screens */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:py-4 flex justify-between items-center">
            <h2 className="text-base md:text-lg font-semibold dark:text-white">Active Projects</h2>
            <a href="/projects" className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View all</a>
          </div>
          
          {activeProjects.length > 0 ? (
            activeProjects.map((project, index) => (
              <div key={index} className="flex items-start px-4 py-3 md:py-4">
                <Avatar className="mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" alt={project.name} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className={`pb-3 md:pb-4 ${index < activeProjects.length - 1 ? "border-b dark:border-gray-700 w-full" : "w-full"}`}>
                  <h4 className="text-sm md:text-base font-medium dark:text-white line-clamp-1">{project.name}</h4>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 md:py-8 text-center">
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No active projects to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
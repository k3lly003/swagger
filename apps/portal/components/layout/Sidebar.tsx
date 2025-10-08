"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  FolderGit2,
  Briefcase,
  Users2,
  FileText,
  MessageSquareQuote,
  HelpCircle,
  Tag,
  Shield,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserPlus,
  SlidersHorizontal,
  Settings,
  Bell,
  CalendarDays,
  Megaphone,
  UserCog,
  Network,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [assetsOpen, setassetsOpen] = useState(false);
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false);

  const toggleOpportunities = () => {
    if (!isCollapsed) {
      setOpportunitiesOpen(!opportunitiesOpen);
    }
  };

  const toggleTeams = () => {
    if (!isCollapsed) {
      setTeamsOpen(!teamsOpen);
    }
  };

  const toggleAssets = () => {
    if (!isCollapsed) {
      setassetsOpen(!assetsOpen);
    }
  };

  useEffect(() => {
    // Auto-open dropdowns based on active route
    if (
      pathname === "/projects" ||
      pathname.startsWith("/projects/") ||
      pathname === "/categories" ||
      pathname.startsWith("/categories/")
    ) {
      setProjectsOpen(true);
    }
    if (
      pathname === "/users" ||
      pathname.startsWith("/users/") ||
      pathname === "/roles" ||
      pathname.startsWith("/roles/")
    ) {
      setUsersOpen(true);
    }
  }, [pathname]);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#0a3549] text-white/90 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center">
            {/* {!isCollapsed ? (
              <Image
                src="/images/logoLight.png"
                alt="GanzAfrica"
                width={130}
                height={35}
                className="object-contain"
                priority
              />
            ) : (
              <Image
                src="/images/logoLight.png"
                alt="GanzAfrica"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            )} */}
            <h1 className="text-3xl">IMS</h1>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Main Menu */}
          <div>
            {!isCollapsed && (
              <h2 className="px-4 mb-3 text-sm font-medium text-white/60 uppercase tracking-wider">
                Main Menu
              </h2>
            )}
            <nav className="space-y-1">

              {/* Dashoard */}
              <Link
                href="/dashboard"
                className={`flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Dashboard</span>
                )}
              </Link>

              {/* Employees Dropdown */}
              <div>
                <div
                  className={`flex items-center justify-between cursor-pointer ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                    pathname === "/employee" ||
                    pathname.startsWith("/employee/") ||
                    pathname === "/employee" ||
                    pathname.startsWith("/employee/")
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => !isCollapsed && setProjectsOpen(!projectsOpen)}
                >
                  <div className="flex items-center"> 
                    <Users2 className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">Employees</span>
                    )}
                  </div>
                  {!isCollapsed &&
                    (projectsOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </div>

                {/* Projects dropdown items */}
                {!isCollapsed && projectsOpen && (
                  <>
                    <Link
                      href="/roles"
                      className={`flex items-center pl-10 pr-4 py-2 rounded-lg transition-colors ${
                        pathname === "/projects"
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <FolderGit2 className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3 font-medium text-sm">
                        Manage Users
                      </span>
                    </Link>
                    <Link
                      href="/department"
                      className={`flex items-center pl-10 pr-4 py-2 rounded-lg transition-colors ${
                        pathname === "/department" ||
                        pathname.startsWith("/department/")
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Network className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3 font-medium text-sm">
                        Departments
                      </span>
                    </Link>
                  </>
                )}
              </div>

              {/* Tasks Dropdown */}
              <Link
                href="/tasks"
                className={`flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                  pathname === "/tasks" ||
                  pathname.startsWith("/tasks/")
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FolderGit2 className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Tasks</span>
                )}
              </Link>

              {/* Recruitment with dropdown */}
              <div className="relative">
                <button
                  onClick={toggleTeams}
                  className={`flex items-center w-full ${isCollapsed ? "justify-center px-3" : "justify-between px-4"} py-2.5 rounded-lg transition-colors ${
                    pathname === "/recruitment" || pathname.startsWith("/recruitment/")
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <UserPlus className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">Recruitment</span>
                    )}
                  </div>
                  {!isCollapsed &&
                    (teamsOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {/* Recruitment dropdown menu */}
                {!isCollapsed && teamsOpen && (
                  <div className="pl-11 mt-1 space-y-1">
                    <Link
                      href="/manage-recruitment"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        pathname === "/manage-recruitment"
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">Manage Recruitments</span>
                    </Link>
                    <Link
                      href="/hiring"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        pathname === "hiring/"
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">Add Hiring Post</span>
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Assets with dropdown */}
              <div className="relative">
                <button
                  onClick={toggleAssets}
                  className={`flex items-center w-full ${isCollapsed ? "justify-center px-3" : "justify-between px-4"} py-2.5 rounded-lg transition-colors ${
                    pathname === "/assets" || pathname.startsWith("/assets/")
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <SlidersHorizontal className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">Assets</span>
                    )}
                  </div>
                  {!isCollapsed &&
                    (assetsOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {/* Recruitment dropdown menu */}
                {!isCollapsed && assetsOpen && (
                  <div className="pl-11 mt-1 space-y-1">
                    <Link
                      href="/inventory"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        pathname === "/teams/manage"
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">Inventory</span>
                    </Link>
                    <Link
                      href="/documents"
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        pathname === "/documents"
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">Documents(contract etc)</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Link
                href="/settings"
                className={`flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                  pathname === "/settings" ||
                  pathname.startsWith("/settings/")
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Settings</span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className={`flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                  pathname === "/notifications" ||
                  pathname.startsWith("/notifications/")
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Bell className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Notifications</span>
                )}
              </Link>

              {/* Calendar */}
              <Link
                href="/calendar"
                className={`flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                  pathname === "/calendar" ||
                  pathname.startsWith("/calendar/")
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <CalendarDays className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Calendar</span>
                )}
              </Link>

              {/* Announcements */}
              <Link
                href="/announcements"
                className={`flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"} py-2.5 rounded-lg transition-colors ${
                  pathname === "/announcements" ||
                  pathname.startsWith("/announcements/")
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Megaphone className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Announcements</span>
                )}
              </Link>
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            className={`flex items-center ${isCollapsed ? "justify-center" : ""} w-full px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors`}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

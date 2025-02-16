"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import { Button } from "@workspace/ui/components/button";
import LanguageSwitcher from "@/components/layout/language-switcher";

// Define types for menu items
interface MenuItem {
  title: string;
  href: string;
  description: string;
}

// Define props for ListItem component
interface ListItemProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}

// Define dictionary type
interface DictionaryType {
  navigation?: {
    about?: string;
    our_approach?:string;
    programs?: string;
    projects?: string;
    opportunities?: string;
  };
  about?: {
    who_we_are?: string;
    our_story?: string;
    [key: string]: string | undefined;
  };
  cta?: {
    sign_in?: string;
  };
}

// Define Navigation props
interface NavigationProps {
  locale: string;
  dict: DictionaryType;
  isHomePage?: boolean;
}

// Menu items with descriptions for rich dropdowns
const aboutItems: MenuItem[] = [
  {
    title: "Who We Are",
    href: "/about/who-we-are",
    description:
      "Learn about our mission, vision, and the values that drive us.",
  },
  {
    title: "Our Story",
    href: "/about/our-story",
    description:
      "The journey of how we started and what inspires our work every day.",
  },
  {
    title: "Team",
    href: "/about/team",
    description:
      "Meet the talented individuals behind our mission. Learn about our team members, their expertise, and their contributions to our success.",
  },
];

const ourApproachItems: MenuItem[] = [
  {
    title: "Food Systems",
    href: "/our-approach",
    description: "Developing sustainable food systems for communities across Africa.",
  },
];

const programsItems: MenuItem[] = [
  {
    title: "Fellowship",
    href: "/programs/fellowship",
    description:
      "Our flagship program empowering the next generation of African change-makers.",
  },
  {
    title: "Alumni",
    href: "/programs/alumni",
    description:
      "A network of graduates continuing to make an impact across the continent.",
  },
];

const projectItems: MenuItem[] = [
  {
    title: "Projects",
    href: "/projects",
    description: "Discover our projects and their impact.",
  },
];

const newsItems: MenuItem[] = [
  {
    title: "News",
    href: "/newsroom",
    description:
      "Stay updated with our latest initiatives, successes, and announcements.",
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    description: "Explore current openings and ways to grow with us.",
  },
  {
    title: "Contact Us",
    href: "/contact",
    description:
      "Get in touch with our team for inquiries, partnerships, or support.",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navigation({
  locale,
  dict,
  isHomePage = false,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    React.useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null,
  );
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  const pathname = usePathname();
  const navRef = React.useRef<HTMLDivElement>(null);

  // Add scroll detection for header styling
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dropdown for mobile menu
  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Determine header background class - always use white background for non-home pages
  const getHeaderBgClass = () => {
    if (isHomePage) {
      return cn(
        "fixed top-0 z-50 min-w-full transition-all duration-500",
        isScrolled ? "bg-white shadow-sm backdrop-blur-sm" : "",
      );
    } else {
      // For non-home pages, always use the same style (as if scrolled)
      return "fixed top-0 z-50 min-w-full bg-white shadow-sm backdrop-blur-sm";
    }
  };

  // Get text color for navigation items
  const getNavItemColor = () => {
    if (isHomePage) {
      // For home page
      if (isScrolled) {
        return "text-black";
      }
      return "text-white";
    }

    // For other pages, always black
    return "text-black";
  };

  // Mobile menu content
  const renderMobileMenu = () => {
    return (
      <div className="fixed inset-0 z-40 bg-white pt-20 md:hidden overflow-y-auto">
        <div className="absolute right-4 top-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-black hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
          {/* Mobile About with submenu */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-about")}
            >
              {dict?.navigation?.about || "About"}
              <span
                className={`transform transition-transform ${activeDropdown === "mobile-about" ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {activeDropdown === "mobile-about" && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {aboutItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="p-2 text-md font-medium hover:bg-gray-100 rounded-md text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    prefetch={true}
                  >
                    {dict?.about?.[
                      item.title.toLowerCase().replace(/ /g, "_")
                    ] || item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Our Approach */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-our-approach")}
            >
              {dict?.navigation?.our_approach || "Our Approach"}
              <span
                className={`transform transition-transform ${activeDropdown === "mobile-our-approach" ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {activeDropdown === "mobile-our-approach" && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {ourApproachItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="p-2 text-md font-medium hover:bg-gray-100 rounded-md text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    prefetch={true}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Programs */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-programs")}
            >
              {dict?.navigation?.programs || "Programs"}
              <span
                className={`transform transition-transform ${activeDropdown === "mobile-programs" ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {activeDropdown === "mobile-programs" && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {programsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="p-2 text-md font-medium hover:bg-gray-100 rounded-md text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    prefetch={true}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-projects")}
            >
              {dict?.navigation?.projects || "Projects"}
              <span
                className={`transform transition-transform ${activeDropdown === "mobile-projects" ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {activeDropdown === "mobile-projects" && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {projectItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="p-2 text-md font-medium hover:bg-gray-100 rounded-md text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    prefetch={true}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Opportunities */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-opportunities")}
            >
              {dict?.navigation?.opportunities || "Opportunities"}
              <span
                className={`transform transition-transform ${activeDropdown === "mobile-projects" ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
          </div>

          {/* News & Updates */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-news")}
            >
              News & Updates
              <span
                className={`transform transition-transform ${activeDropdown === "mobile-news" ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {activeDropdown === "mobile-news" && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {newsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="p-2 text-md font-medium hover:bg-gray-100 rounded-md text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    prefetch={true}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    );
  };

  return (
    <header ref={navRef} className={getHeaderBgClass()}>
      <div className="container min-w-full py-0">
        <div className="flex h-20 items-stretch justify-between relative">
          {/* Logo */}
          <div className="min-h-full w-32 md:w-52 flex items-center p-8">
            <Link
              href={`/${locale}`}
              className="relative z-50 flex items-center gap-2"
              prefetch={true}
            >
              <div className="relative h-14 w-24">
                <Image
                  src="/images/logo.png"
                  alt="GanzAfrica"
                  fill
                  sizes="(max-width: 768px) 300px, 200px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation using shadcn NavigationMenu */}
          <div className="hidden md:flex justify-center items-center space-x-1 flex-1 mx-4">
            <NavigationMenu>
              <NavigationMenuList>
                {/* About Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={getNavItemColor()}>
                    {dict?.navigation?.about || "About"}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={`/${locale}/about`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              About Us
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Dedicated to creating a sustainable future for
                              Africa through empowering youth and communities.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {aboutItems.map((item) => (
                        <ListItem
                          key={item.href}
                          href={`/${locale}${item.href}`}
                          title={
                            dict?.about?.[
                              item.title.toLowerCase().replace(/ /g, "_")
                            ] || item.title
                          }
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                {/* Our Approach Dropdown */} 
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={getNavItemColor()}>
                    {dict?.navigation?.our_approach || "Our Approach"}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={`/${locale}/our-approach`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Our Approach to Food Systems
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explore our approach focused on sustainable
                              development, climate resilience, and food security
                              across Africa.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {ourApproachItems.map((item) => (
                        <ListItem
                          key={item.href}
                          href={`/${locale}${item.href}`}
                          title={item.title}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Programs Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={getNavItemColor()}>
                    {dict?.navigation?.programs || "Programs"}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={`/${locale}/programs/fellowship`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Our Programs
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Transformative programs designed to build capacity
                              and develop leadership in sustainable agriculture.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {programsItems.map((item) => (
                        <ListItem
                          key={item.href}
                          href={`/${locale}${item.href}`}
                          title={item.title}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Projects Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={getNavItemColor()}>
                    {dict?.navigation?.projects || "Projects"}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={`/${locale}/projects`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Our Projects
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Discover our innovative projects and their impact
                              on communities across Africa.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {projectItems.map((item) => (
                        <ListItem
                          key={item.href}
                          href={`/${locale}${item.href}`}
                          title={item.title}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
          

                {/* News & Updates Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={getNavItemColor()}>
                    News & Updates
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={`/${locale}/newsroom`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Latest Updates
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Stay informed about our recent activities,
                              projects, and success stories.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {newsItems.map((item) => (
                        <ListItem
                          key={item.href}
                          href={`/${locale}${item.href}`}
                          title={item.title}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side items with inverted top-left corner */}
          <div className="min-h-full p-4 w-56 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="mr-2">
                <LanguageSwitcher />
              </div>
              <Link href={`/${locale}/login`}>
                <Button
                  size="sm"
                  className="bg-primary-green hover:bg-primary-green/90 text-white px-6"
                >
                  {dict?.cta?.sign_in || "Sign In"}
                </Button>
              </Link>
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && renderMobileMenu()}
    </header>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/layout/language-switcher";

// Import shadcn Navigation Menu components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";

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
  locale: string;
  onClick?: () => void;
}

// Define dictionary type
interface DictionaryType {
  navigation?: {
    about?: string;
    our_approach?: string;
    programs?: string;
    projects?: string;
    opportunities?: string;
  };
  about?: {
    who_we_are?: string;
    our_story?: string;
    team?: string;
    [key: string]: string | undefined;
  };
  
  home?: {
    hero?: {
      title?: string;
      subtitle?: string;
      title_after?: {
        line1?: string;
        line2?: string;
        line3?: string;
        line4?: string;
      };
    };
  };
  cta?: {
    sign_in?: string;
    discover_more?: string;
  };
}

// Define HomeHero props
interface HomeHeroProps {
  locale: string;
  dict: DictionaryType;
  backgroundImage?: string;
}

// Navigation menu item component
const ListItem = ({
  className,
  title,
  children,
  href,
  locale,
  onClick,
}: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={`/${locale}${href}`}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          onClick={onClick}
          prefetch={true}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default function HomeHero({
  locale,
  dict,
  backgroundImage = "/images/hero-test.jpg",
}: HomeHeroProps) {
  // Refs with proper types
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef<HTMLDivElement>(null);
  const finalContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // States
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [animationStarted, setAnimationStarted] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation items for shadcn navigation
  const aboutItems: MenuItem[] = [
    {
      title: dict.about?.who_we_are || "Who We Are",
      href: "/about/who-we-are",
      description:
        "Learn about our mission, vision, and the values that drive us.",
    },
    {
      title: dict.about?.our_story || "Our Story",
      href: "/about/our-story",
      description:
        "The journey of how we started and what inspires our work every day.",
    },
    {
      title: dict.about?.team|| "Team",
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

  // Add scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      if (!animationStarted) {
        startTransition();
      }
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener("canplay", handleCanPlay);
    }

    const timeoutId = setTimeout(() => {
      if (!animationStarted) {
        startTransition();
      }
    }, 5000);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      clearTimeout(timeoutId);
    };
  }, [animationStarted]);

  // Function to start the transition
  const startTransition = () => {
    if (animationStarted) return;
    setAnimationStarted(true);

    if (
      !sectionRef.current ||
      !whiteOverlayRef.current ||
      !initialContentRef.current ||
      !finalContentRef.current ||
      !videoContainerRef.current ||
      !navRef.current
    )
      return;

    // Set initial states
    gsap.set(whiteOverlayRef.current, {
      y: "-100%",
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(finalContentRef.current, { opacity: 0 });

    // Initial video state (full screen)
    gsap.set(videoContainerRef.current, {
      clipPath: "none",
      height: "100%",
      bottom: 0,
    });

    // Create animation timeline
    const tl = gsap.timeline();

    // Set nav color to black right before the animation starts
    navRef.current.setAttribute("data-overlay-passed", "true");

    tl.to(initialContentRef.current, {
      opacity: 0,
      duration: 2.5,
    })
      .to(whiteOverlayRef.current, {
        y: "0%",
        duration: 1.2,
        ease: "power2.inOut",
        clipPath: "url(#hero-clip)",
      })
      .to(
        videoContainerRef.current,
        {
          clipPath: "url(#hero-clip-inverted)",
          height: "35%",
          bottom: 0,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "<",
      )
      .to(finalContentRef.current, {
        opacity: 1,
        duration: 0.8,
      });
  };

  // Dropdown handling functions for mobile
  const handleDropdownOpen = (dropdownName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(dropdownName);
  };

  const handleDropdownClose = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleDropdownContentEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Determine header background class based on scroll and animation state
  const getHeaderBgClass = () => {
    return cn(
      "fixed top-0 z-50 min-w-full transition-all duration-500",
      isScrolled && !animationStarted ? "bg-black/30 backdrop-blur-sm" : "",
      isScrolled && animationStarted
        ? "bg-white shadow-sm backdrop-blur-sm"
        : "",
      !isScrolled ? "bg-transparent" : "",
    );
  };

  // Get text color for navigation items
  const getNavItemColor = () => {
    if (
      animationStarted &&
      navRef.current?.getAttribute("data-overlay-passed") === "true"
    ) {
      return "text-black bg-transparent";
    }
    return "text-white bg-transparent";
  };

  // Render the shadcn NavigationMenu for desktop
  const renderDesktopNavigation = () => {
    const textColor = getNavItemColor();

    return (
      <div className="hidden md:flex justify-center items-center space-x-1 flex-1 mx-4">
        <NavigationMenu>
          <NavigationMenuList>
            {/* About */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={textColor}>
                {dict.navigation?.about || "About"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href={`/${locale}/about`}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          About Us
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Dedicated to creating a sustainable future for Africa
                          through empowering youth and communities.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {aboutItems.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.title}
                      href={item.href}
                      locale={locale}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Our Approach Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={textColor}>
                {dict.navigation?.our_approach || "Our Approach"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href={`/${locale}/our-approach`}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                              Our Approach to Food Systems
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explore our programs focused on sustainable
                              development, climate resilience, and food security
                              across Africa.
                            </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {ourApproachItems.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.title}
                      href={item.href}
                      locale={locale}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Programs */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={textColor}>
                {dict.navigation?.programs || "Programs"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href={`/${locale}/programs`}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Our Programs
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Transformative programs designed to build capacity and
                          develop leadership in sustainable agriculture.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {programsItems.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.title}
                      href={item.href}
                      locale={locale}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Projects */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={textColor}>
                {dict.navigation?.projects || "Projects"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
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
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {projectItems.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.title}
                      href={item.href}
                      locale={locale}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* News & Updates */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={textColor}>
                News & Updates
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href={`/${locale}/newsroom`}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Latest Updates
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Stay informed about our recent activities, projects,
                          and success stories.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {newsItems.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.title}
                      href={item.href}
                      locale={locale}
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
    );
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
              {dict.navigation?.about || "About"}
              <ChevronDown
                className={`h-5 w-5 transform transition-transform ${activeDropdown === "mobile-about" ? "rotate-180" : ""}`}
              />
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
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Our approach */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-what-we-do")}
            >
              {dict.navigation?.our_approach || "Our approach"}
              <ChevronDown
                className={`h-5 w-5 transform transition-transform ${activeDropdown === "mobile-what-we-do" ? "rotate-180" : ""}`}
              />
            </button>
            {activeDropdown === "mobile-what-we-do" && (
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
              {dict.navigation?.programs || "Programs"}
              <ChevronDown
                className={`h-5 w-5 transform transition-transform ${activeDropdown === "mobile-programs" ? "rotate-180" : ""}`}
              />
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
              onClick={() => toggleDropdown("mobile-community")}
            >
              {dict.navigation?.projects || "Community Hub"}
              <ChevronDown
                className={`h-5 w-5 transform transition-transform ${activeDropdown === "mobile-community" ? "rotate-180" : ""}`}
              />
            </button>
            {activeDropdown === "mobile-community" && (
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

          {/* News & Updates */}
          <div className="flex flex-col">
            <button
              className="p-2 text-lg font-medium hover:bg-gray-100 rounded-md text-primary-green text-left flex items-center justify-between"
              onClick={() => toggleDropdown("mobile-news")}
            >
              News & Updates
              <ChevronDown
                className={`h-5 w-5 transform transition-transform ${activeDropdown === "mobile-news" ? "rotate-180" : ""}`}
              />
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
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Header */}
      <header
        ref={navRef}
        className={getHeaderBgClass()}
        data-overlay-passed={animationStarted ? "true" : "false"}
      >
        <div className="container min-w-full py-0">
          <div className="flex h-20 items-stretch justify-between relative">
            {/* Logo */}
            <div className="bg-white rounded-tr-none rounded-br-2xl shadow-sm min-h-full w-32 md:w-52 flex items-center p-8">
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

            {/* Desktop Navigation */}
            {renderDesktopNavigation()}

            {/* Right side items with inverted top-left corner */}
            <div className="bg-white rounded-tl-none rounded-bl-2xl min-h-full p-4 w-56 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="mr-2">
                  <LanguageSwitcher />
                </div>
                <Link href={`/${locale}/login`}>
                  <Button
                    size="sm"
                    className="bg-primary-green hover:bg-primary-green/90 text-white px-6"
                  >
                    {dict.cta?.sign_in || "Sign In"}
                  </Button>
                </Link>
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hover:bg-white/20",
                      !animationStarted ||
                        navRef.current?.getAttribute("data-overlay-passed") !==
                          "true"
                        ? "text-white"
                        : "text-black",
                    )}
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

      {/* Video background container */}
      <div
        ref={videoContainerRef}
        className="absolute inset-x-0 z-10 overflow-hidden"
        style={{
          height: "100%",
          bottom: 0,
        }}
      >
        <div className="absolute inset-0 bg-secondary-green/60 z-20"></div>

        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            quality={75}
            className="object-cover"
          />
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          preload="auto"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Initial content */}
      <div
        ref={initialContentRef}
        className="absolute inset-0 flex items-center justify-center z-30"
      >
        <div className="text-center text-white mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            {dict?.home?.hero?.title ||
              "Sustainable Solutions for Africa's Future"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {dict?.home?.hero?.subtitle ||
              "Empowering youth through sustainable land management"}
          </p>
        </div>
      </div>

      {/* SVG definitions */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1 V0.85 C0.83,0.7 0.66,0.65 0.5,0.65 C0.33,0.65 0.16,0.7 0,0.85 L0,0 Z" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* White overlay */}
      <div
        ref={whiteOverlayRef}
        className="absolute inset-0 bg-white z-30"
        style={{
          transform: "translateY(-100%)",
          clipPath: "url(#hero-clip)",
        }}
      ></div>

      {/* Final content */}
      <div
        ref={finalContentRef}
        className="absolute inset-0 z-40 opacity-0 pt-24"
      >
        <div className="container mx-auto px-4 text-center mt-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-primary-green">
              {dict?.home?.hero?.title_after?.line1 || "A PROSPEROUS AND"}{" "}
              <br />
              {dict?.home?.hero?.title_after?.line2 || "SUSTAINABLE"}
            </span>{" "}
            <span className="text-primary-orange">
              {dict?.home?.hero?.title_after?.line3 || "FUTURE FOR"} <br />
              {dict?.home?.hero?.title_after?.line4 || "AFRICA"}
            </span>
          </h1>

          <p className="text-base max-w-3xl mx-auto mb-8 text-gray-800">
            {dict?.home?.hero?.subtitle ||
              "Empowering youth through sustainable land management, agriculture, and environmental initiatives"}
          </p>

          <Link href={`/${locale}/about/who-we-are`} prefetch={true}>
            <Button
              size="lg"
              className="bg-primary-green hover:bg-primary-green/90 text-white font-medium px-6 py-3"
            >
              {dict?.cta?.discover_more || "Discover More"}
            </Button>
          </Link>
        </div>

        {/* Leaves */}
        <div className="absolute -left-1 top-1/3 transform rotate-[31.83deg] -translate-x-1/4 z-50 md:w-[200px] w-[150px] aspect-square">
          <Image
            src="/images/leaf.png"
            alt="Decorative leaf"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="absolute -right-1 top-1/4 rotate-[-60deg] transform translate-x-1/4 z-50 md:w-[200px] w-[150px] aspect-square overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/leaf.png"
              alt="Decorative leaf"
              fill
              className="object-contain rotate-180"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

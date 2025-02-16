"use client";

import { Button } from "@ui/button";
import { AlumniCard } from "@/components/layout/AlumniCard";
import { Badge } from "@ui/badge";
import { 
  PlayCircle, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Calendar,
  Sprout,
  TreePine,
  Cloud,
} from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const scrollContent = scrollElement.children[0];
    if (!scrollContent) return;
    
    const scrollWidth = scrollContent.scrollWidth;
    let scrollPos = 0;

    const animate = () => {
      scrollPos = (scrollPos + 1) % scrollWidth;
      scrollElement.scrollLeft = scrollPos;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <main className="min-h-screen bg-white font-rubik">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/leaf.jpg"
          alt="Background Pattern"
          className="w-full h-full object-cover opacity-[0.08]"
        />
      </div>

      {/* Hero Section - Full width */}
      <section className="relative h-[500px] z-10">
        <div className="absolute inset-0 bg-[#045f3c]/80">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover mix-blend-overlay"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center h-full pt-20">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
            A lifetime of <span className="text-[#F8B712]">Connections</span>, Opportunities and <span className="text-[#F8B712]">Impact</span>
          </h1>
          <h2 className="text-5xl md:text-7xl font-extrabold text-[#F8B712] tracking-wider">
            ALUMNI NETWORK
          </h2>
        </div>
      </section>

      {/* Categories Bar - Full width */}
      <div className="bg-[#F8B712] py-3 relative z-10">
        <div ref={scrollRef} className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex gap-6 whitespace-nowrap animate-scroll">
            {Array(2).fill(["Food Systems", "Data & Evidence", "Co-creation", "Food systems", "Data & Evidence"]).flat().map((item, index) => (
              <span key={index} className="text-lg font-medium">• {item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content with standard page margins */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mission Section */}
        <section className="py-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-full overflow-hidden aspect-square border-8 border-[#F8B712] shadow-xl bg-white">
                <img
                  src="/images/launch event.jpg"
                  alt="Mission"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-8 -left-4 w-52 h-52 rounded-full overflow-hidden border-8 border-[#F8B712] shadow-lg bg-white">
                <img
                  src="/images/Happy fellows.jpg"
                  alt="Mission Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="inline-block border-2 border-[#045f3c] rounded-lg px-5 py-2 mb-6">
                <h2 className="text-2xl font-bold">
                  <span className="text-[#045f3c]">Mission </span>
                  <span className="text-[#F8B712]">Statement</span>
                </h2>
              </div>
              <p className="text-base text-gray-700 mb-6">
                Welcome to the GanzAfrica Alumni Network, a platform dedicated to creating strong bonds among young African professionals. Our goal is to foster trust, collaboration, and a vibrant exchange of ideas to shape sustainable and transformative solutions for Africa.
              </p>
              <p className="italic text-lg text-[#045f3c] font-medium mb-6 border-l-4 border-[#F8B712] pl-4">
                "To cultivate a vibrant alumni community that drives the transformation of African food systems through evidence-based insights, mentorship, and collaboration—empowering current fellows and fostering partnerships that create lasting opportunities for sustainable impact."
              </p>
              <div className="flex gap-8">
                {["Knowledge Sharing", "Mentorship", "Collaboration and Networking"].map((principle, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#F8B712]" />
                    <span className="text-base text-[#045f3c] font-medium">{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-[#F5F5F5]/90 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AlumniCard className="bg-gradient-to-br from-[#045f3c] to-[#034028] text-white p-8 transform hover:scale-105 transition-transform duration-300 rounded-[2rem] rounded-br-none shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#056d45] rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#056d45] rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
                <div className="flex flex-col items-center relative z-10">
                  <div className="bg-white/10 p-4 rounded-full mb-4">
                    <Users className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl mb-4 font-medium">Transitioned Fellows</h3>
                  <p className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">27</p>
                </div>
              </AlumniCard>

              <AlumniCard className="bg-[#FFF8E1] p-8 transform hover:scale-105 transition-transform duration-300 rounded-[2rem] rounded-tl-none rounded-br-none shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8B712] rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F8B712] rounded-full translate-y-12 -translate-x-12 opacity-10"></div>
                <div className="flex flex-col items-center relative z-10">
                  <div className="bg-[#045f3c]/10 p-4 rounded-full mb-4">
                    <Briefcase className="w-12 h-12 text-[#045f3c]" />
                  </div>
                  <h3 className="text-xl mb-4 font-medium text-[#045f3c]">Alumni Projects</h3>
                  <p className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#F8B712] to-[#d49a0f]">12+</p>
                </div>
              </AlumniCard>

              <AlumniCard className="bg-gradient-to-bl from-[#045f3c] to-[#034028] text-white p-8 transform hover:scale-105 transition-transform duration-300 rounded-[2rem] rounded-tl-none shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#056d45] rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#056d45] rounded-full translate-y-14 -translate-x-14 opacity-30"></div>
                <div className="flex flex-col items-center relative z-10">
                  <div className="bg-white/10 p-4 rounded-full mb-4">
                    <Calendar className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl mb-4 font-medium">Events</h3>
                  <p className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">5+</p>
                </div>
              </AlumniCard>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="py-8 relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 right-6 bg-[#F8B712] text-black p-5 rounded-lg shadow-lg transform -rotate-2 z-20">
                <div className="relative">
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#F8B712] rotate-45"></div>
                  <p className="text-xl font-bold relative z-10">Always a GanzAfrica, Always a Changemaker!</p>
                </div>
              </div>
              <img
                src="/images/form.jpg"
                alt="Purpose"
                className="rounded-lg shadow-xl relative z-10"
              />
            </div>
            <div>
              <div className="inline-block border-2 border-[#045f3c] rounded-lg px-6 py-3 mb-8">
                <h2 className="text-3xl font-bold">
                  <span className="text-[#045f3c]">Purpose of the </span>
                  <span className="text-[#F8B712]">Alumni Network</span>
                </h2>
              </div>
              <div className="space-y-8">
                {[
                  {
                    title: "Networking and Professional Development",
                    description: "Enhancing professional connections among analysts, across industries and geographies, to share opportunities and professional advice.",
                    color: "#045f3c"
                  },
                  {
                    title: "Knowledge Sharing",
                    description: "Serve as a platform for sharing diverse experiences, skills and expertise among analysts in their different sectors and workstreams.",
                    color: "#009758"
                  },
                  {
                    title: "Investing Back into the Fellowship Program",
                    description: "Providing a mechanism and pipeline for transitioned young analysts to invest into the training of successive cohorts of fellows.",
                    color: "#7EED42"
                  },
                  {
                    title: "Co-creating and Co-implementing Solutions",
                    description: "Encouraging and facilitating the collaboration, co-creation and co-implementation of solutions to major challenges in data and evidence generation and synthesis for policy impact.",
                    color: "#F8B712"
                  },
                  {
                    title: "Championing Data and Evidence Use",
                    description: "Shaping and ingraining a collective vision and agenda to drive a culture of data and evidence use in policy and decision-making to accelerate inclusive agri-food systems transformation.",
                    color: "#D8D413"
                  }
                ].map((item, index, arr) => (
                  <div key={index} className="relative">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: item.color }} />
                      <div>
                        <h3 className="text-lg font-bold text-[#045f3c] mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-base">{item.description}</p>
                      </div>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 border-l-2 border-dotted border-black opacity-20 h-12"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block border-2 border-[#045f3c] rounded-lg px-6 py-3">
              <h2 className="text-3xl font-bold">
                <span className="text-[#045f3c]">Alumni </span>
                <span className="text-[#F8B712]">Projects</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tag: "Land Governance",
                description: "We support the development of equitable and effective land administration systems that strengthen tenure security while promoting sustainable land use",
                icon: <TreePine className="w-6 h-6" />
              },
              {
                tag: "Sustainable Agriculture",
                description: "Our work promotes agricultural policies that balance productivity goals with environmental stewardship and social inclusion",
                icon: <Sprout className="w-6 h-6" />
              },
              {
                tag: "Climate Adaptation",
                description: "Our expertise supports the creation of climate resilience strategies that help communities adapt to changing environmental conditions",
                icon: <Cloud className="w-6 h-6" />
              }
            ].map((project, index) => (
              <AlumniCard key={index} className="bg-[#045f3c] text-white p-8 rounded-xl transform hover:scale-105 transition-transform group">
                <div className="flex items-center gap-2 mb-4">
                  {project.icon}
                  <Badge className="bg-[#F8B712] text-black text-base px-3 py-1 group-hover:bg-[#F8B712]">{project.tag}</Badge>
                </div>
                <p className="text-base leading-relaxed group-hover:text-white/90">{project.description}</p>
                {index < 2 && (
                  <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 border-l-2 border-dotted border-[#045f3c] opacity-20 h-8"></div>
                )}
              </AlumniCard>
            ))}
          </div>
          <div className="flex justify-end mt-8">
            <Button className="bg-[#045f3c] text-white hover:bg-[#F8B712] hover:text-black transition-colors duration-300 flex items-center gap-2 group">
              See More Projects
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-8 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-block border-2 border-[#045f3c] rounded-lg px-6 py-3">
                <h2 className="text-3xl font-bold">
                  <span className="text-[#045f3c]">Alumni </span>
                  <span className="text-[#F8B712]">Events</span>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "official-launch",
                  date: "April 4, 2025",
                  type: "Events",
                  title: "Official Launch of GA Alumni Network",
                  image: "/images/launch event.jpg"
                },
                {
                  id: "lead-intentionally",
                  date: "July 12, 2025",
                  type: "Workshop",
                  title: "Lead Intentionally: Creating Impact in All Spaces",
                  image: "/images/Sustainable Agriculture Fellows(1).jpg"
                },
                {
                  id: "power-of-networks",
                  date: "May 12, 2025",
                  type: "Webinar",
                  title: "The Power of Networks: Turning Connections",
                  image: "/images/Sustainable Land Use Fellows.jpg"
                }
              ].map((event, index) => (
                <Link 
                  key={index} 
                  href={`/programs/one-event/${event.id}`} 
                  className="block transform hover:scale-105 transition-transform duration-300"
                >
                  <AlumniCard className="overflow-hidden border-2 border-[#045f3c] group cursor-pointer h-full">
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 flex items-center gap-3">
                        <Badge className="bg-white text-black text-base px-3 py-1 group-hover:bg-[#F8B712] transition-colors duration-300">{event.date}</Badge>
                        <Badge className="bg-[#045f3c] text-white text-base px-3 py-1 group-hover:bg-[#F8B712] group-hover:text-black transition-colors duration-300">{event.type}</Badge>
                      </div>
                      <Button 
                        size="icon" 
                        className="absolute bottom-3 right-3 rounded-full bg-[#F8B712] hover:bg-[#045f3c] hover:text-white w-10 h-10 transition-colors duration-300"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="p-5 group-hover:bg-[#045f3c] transition-colors duration-300">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300 line-clamp-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm group-hover:text-white/80 transition-colors duration-300">
                        Young professionals are at the forefront of accelerating CAADP implementation...
                      </p>
                    </div>
                  </AlumniCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
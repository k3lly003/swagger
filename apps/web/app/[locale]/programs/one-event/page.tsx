"use client";

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Camera,
  Share2,
  Download,
  ChevronLeft,
  MessageCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function EventPage() {
  // Sample event data
  const event = {
    title: "Official Launch of GA Alumni Network",
    date: "April 4, 2024",
    time: "2:00 PM - 5:00 PM EAT",
    location: "Radisson Blu Hotel, Kigali, Rwanda",
    attendees: 150,
    description: "The launch of the GanzAfrica Alumni Network marked a significant milestone in our journey towards transforming African food systems. This momentous occasion brought together fellows, partners, and distinguished guests to celebrate the power of collaboration and shared vision.",
    highlights: [
      "Opening ceremony with traditional Rwandan cultural performance",
      "Keynote address on the future of African food systems",
      "Panel discussion with alumni success stories",
      "Interactive networking session",
      "Official unveiling of the Alumni Network platform",
      "Recognition of outstanding alumni contributions"
    ],
    speakers: [
      {
        name: "Dr. Sarah Mwangi",
        role: "Director of Agricultural Innovation",
        topic: "Transforming African Food Systems Through Data"
      },
      {
        name: "Mr. Jean-Paul Kamali",
        role: "GanzAfrica Alumni President",
        topic: "Building Lasting Networks for Change"
      },
      {
        name: "Ms. Grace Okonjo",
        role: "Senior Food Systems Analyst",
        topic: "Evidence-Based Decision Making in Agriculture"
      }
    ],
    outcomes: [
      "Establishment of 5 regional alumni chapters",
      "Launch of mentorship program connecting 50+ pairs",
      "Creation of alumni-led research initiatives",
      "Formation of cross-country collaboration projects"
    ],
    gallery: [
      "/images/launch event.jpg",
      "/images/Happy fellows.jpg",
      "/images/form.jpg",
      // Add more image paths as needed
    ]
  };

  return (
    <main className="min-h-screen bg-white font-rubik">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <div className="absolute inset-0">
          <img
            src="/images/launch event.jpg"
            alt="Event Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#045f3c]/70 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link href="/programs/alumni" className="inline-flex items-center text-white mb-6 hover:text-[#F8B712] transition-colors">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white">
              <Badge className="bg-[#F8B712] text-black text-lg px-4 py-2">Past Event</Badge>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{event.attendees}+ Attendees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#045f3c] mb-6">About the Event</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">{event.description}</p>
              <div className="flex gap-4">
                <Button className="bg-[#045f3c] text-white hover:bg-[#F8B712] hover:text-black transition-colors flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>
                <Button className="bg-[#045f3c] text-white hover:bg-[#F8B712] hover:text-black transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
              </div>
            </section>

            {/* Event Highlights */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#045f3c] mb-6">Event Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-[#F8B712] mt-2" />
                    <p className="text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Speakers */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#045f3c] mb-6">Featured Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md border-2 border-[#045f3c]">
                    <h3 className="text-xl font-bold text-[#045f3c] mb-2">{speaker.name}</h3>
                    <p className="text-[#F8B712] font-medium mb-2">{speaker.role}</p>
                    <p className="text-gray-600">Topic: {speaker.topic}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Outcomes */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#045f3c] mb-6">Key Outcomes</h2>
              <div className="space-y-4">
                {event.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-[#045f3c]/5 rounded-lg">
                    <div className="w-8 h-8 bg-[#F8B712] rounded-full flex items-center justify-center font-bold text-black">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            <section>
              <h2 className="text-3xl font-bold text-[#045f3c] mb-6">Event Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Event photo ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-[#045f3c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/40">
                        <Camera className="w-5 h-5 text-white" />
                      </Button>
                      <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/40">
                        <Heart className="w-5 h-5 text-white" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Engagement Stats */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-[#045f3c] mb-4">Event Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attendees</span>
                    <span className="font-bold text-[#045f3c]">{event.attendees}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Countries Represented</span>
                    <span className="font-bold text-[#045f3c]">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Alumni Speakers</span>
                    <span className="font-bold text-[#045f3c]">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Partners Present</span>
                    <span className="font-bold text-[#045f3c]">8</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-[#045f3c] mb-4">Event Feedback</h3>
                <div className="space-y-4">
                  <Button className="w-full bg-[#045f3c] text-white hover:bg-[#F8B712] hover:text-black transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Share Your Experience
                  </Button>
                  <div className="text-center text-gray-600">
                    Join the conversation and share your thoughts about the event
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

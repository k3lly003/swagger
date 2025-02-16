"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Circle, Check } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Claude Mugabe",
    role: "Former Smart Water Management Fellow",
    quote: "I have found immense value in my role as a Smart Water fellow at GanzAfrica... a pivotal aspect of my journey has been participating in the MINAGRI team where collaboration with fellows from diverse backgrounds was key. I am confident that the lessons learned at GanzAfrica will contribute significantly",
    image: "/images/fellowship/claude.jpg"
  },
  {
    id: 2,
    name: "Sarah Kimani",
    role: "Agrifood Systems Fellow",
    quote: "The GanzAfrica fellowship transformed my career in agricultural innovation. Working alongside experienced mentors and a community of passionate professionals gave me the skills and network to make a real difference in my community.",
    image: "/images/fellowship/sarah.jpg"
  }
];

const benefits = [
  {
    title: "Tackle Challenges",
    description: "Join a like-minded cohort to address major land, agricultural, and environmental challenges in Africa, making a meaningful impact in your community.",
    image: "/images/fellowship/tackle-challenges.jpg"
  },
  {
    title: "Gain Global Experience",
    description: "Work on transformative projects with world-class industry specialists, be mentored by experts, and participate in the co-creation of innovative solutions in our focus areas.",
    image: "/images/fellowship/global-experience.jpg"
  },
  {
    title: "Develop Your Skills",
    description: "Our fully funded program offers training, apprenticeships, and work experience to enhance your expertise and showcase your talent.",
    image: "/images/fellowship/skills.jpg"
  }
];

const promises = [
  {
    number: "01",
    title: "Professional Development",
    description: "Provide up to 2 years of holistic training with a focus on data & analytics and leadership skills",
    color: "bg-[#045F3C]"
  },
  {
    number: "02",
    title: "A community of like-minded people",
    description: "Welcome fellows into a network of value-driven young Africans committed to leading Africa's transformation",
    color: "bg-yellow-400"
  },
  {
    number: "03",
    title: "Hands-On Experience",
    description: "Deliver work secondments with one of our partners to apply skills learned",
    color: "bg-[#045F3C]"
  }
];

export default function FellowshipPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-[url('/images/fellowship/hero-bg.jpg')] bg-cover bg-center flex items-center">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto relative z-10 px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Empowering <span className="text-yellow-400">Tomorrow's,</span><br />
              Leaders
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold text-yellow-400 mt-4">
              FELLOWSHIP
            </h2>
          </div>
        </div>
      </section>

      {/* Topics Banner */}
      <div className="bg-yellow-400 py-3">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Circle className="w-2 h-2 fill-black" />
              <span className="text-black font-medium text-sm">Food Systems</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Circle className="w-2 h-2 fill-black" />
              <span className="text-black font-medium text-sm">Data & Evidence</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Circle className="w-2 h-2 fill-black" />
              <span className="text-black font-medium text-sm">Co-creation</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Circle className="w-2 h-2 fill-black" />
              <span className="text-black font-medium text-sm">Food systems</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Circle className="w-2 h-2 fill-black" />
              <span className="text-black font-medium text-sm">Data & Evidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/fellowship/hands-seeds.jpg"
                alt="Seeds in hands"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Discover tomorrow's<br />leaders today</h2>
              <p className="text-gray-600 mb-4">
                A one-year program for those in early to mid career with exceptional ability and intellectual curiosity who aspire to become public leaders.
              </p>
              <p className="text-gray-600 mb-6">
                Through our full-time Fellowship, we find people working on plans to make the world better in a big way. Then we help them become impactful leaders by connecting them with the tools, resources, and communities they need to bring their ideas to life.
              </p>
              <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                Meet the Fellows
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/fellowship/team.jpg"
                alt="Fellowship team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center"
                  title="Play video"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">About the Fellowship</h2>
              <p className="text-gray-600 mb-6">
                Our fully-funded program provides training, mentorship, and hands-on work experience in land governance, environmental management, agrifood systems, climate finance and other disciplines across our focus sectors.
              </p>
              <p className="text-gray-600 mb-6">
                With specialized mentors guiding you, you'll gain professional development and collaborate with talented professionals to deliver innovative solutions.
              </p>
              <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                How to Apply
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-2">
            Benefits of <span className="text-[#045F3C]">Joining GanzAfrica</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Begin your journey of impact and growth with GanzAfrica. Discover the benefits of joining our program:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                GanzAfrica's Promise <span className="text-[#045F3C]">to Fellows:</span>
              </h2>
              <p className="text-gray-600">
                GanzAfrica pledges to provide Fellows with transformative opportunities, world-class mentorship, and the resources needed to catalyze positive change across the continent.
              </p>
            </div>
            <div className="space-y-8">
              {promises.map((promise) => (
                <div key={promise.number} className="flex gap-6">
                  <div className={`${promise.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {promise.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{promise.title}</h3>
                    <p className="text-gray-600">{promise.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-2">Checkout Fellows</h2>
          <h3 className="text-3xl font-bold text-[#045F3C] text-center mb-12">
            Say about the Fellowship
          </h3>

          <div className="flex justify-center space-x-4 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={i === 3 ? "/images/fellowship/nla.jpg" : `/images/fellowship/avatar-${i}.jpg`}
                  alt="Fellow"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-lg italic mb-6">
              {testimonials[currentTestimonial].quote}
            </p>
            <h4 className="text-xl font-bold mb-2">
              {testimonials[currentTestimonial].name}
            </h4>
            <p className="text-gray-500 mb-8">
              {testimonials[currentTestimonial].role}
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center"
                title="Previous testimonial"
              >
                <ArrowLeft className="text-white" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-[#045F3C] flex items-center justify-center"
                title="Next testimonial"
              >
                <ArrowRight className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
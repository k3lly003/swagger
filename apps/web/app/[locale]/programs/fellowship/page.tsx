'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Circle, Check } from 'lucide-react';
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Container } from "@/components/container";
import { DecoratedHeading } from "@/components/decorated-heading";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { default as HeaderBelt } from "@/components/layout/headerBelt";
import { useParams } from 'next/navigation';

// Define the type for opportunities
type Opportunity = {
  id: string;
  title: string;
};

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Claude Mugabe",
    role: "Former Smart Water Management Fellow",
    quote: "I have found immense value in my role as a Smart Water fellow at GanzAfrica... a pivotal aspect of my journey has been participating in the MINAGRI team where collaboration with fellows from diverse backgrounds was key. I am confident that the lessons learned at GanzAfrica will contribute significantly",
    image: "/images/ganzafrica-fellows.jpg"
  },
  {
    id: 2,
    name: "Sarah Kimani",
    role: "Agrifood Systems Fellow",
    quote: "The GanzAfrica fellowship transformed my career in agricultural innovation. Working alongside experienced mentors and a community of passionate professionals gave me the skills and network to make a real difference in my community.",
    image: "/images/ganzafrica-fellows.jpg"
  },
  {
    id: 3,
    name: "John Mwangi",
    role: "Climate Change Fellow",
    quote: "Being part of the GanzAfrica fellowship opened doors to incredible opportunities in climate action. The hands-on experience and mentorship I received helped me develop innovative solutions for sustainable agriculture.",
    image: "/images/ganzafrica-fellows.jpg"
  },
  {
    id: 4,
    name: "Grace Mutua",
    role: "Data & Evidence Fellow",
    quote: "The fellowship program at GanzAfrica equipped me with crucial skills in data analysis and evidence-based decision making. The collaborative environment and expert guidance helped me grow both professionally and personally.",
    image: "/images/ganzafrica-fellows.jpg"
  },
  {
    id: 5,
    name: "David Okello",
    role: "Natural Resource Management Fellow",
    quote: "Through the GanzAfrica fellowship, I gained practical experience in sustainable resource management. The program's focus on real-world challenges and innovative solutions has been invaluable for my career development.",
    image: "/images/ganzafrica-fellows.jpg"
  }
];

const benefits = [
  {
    title: "Tackle Challenges",
    description: "Join a like-minded cohort to address major land, agricultural, and environmental challenges in Africa, making a meaningful impact in your community.",
    image: "/images/food-system.jpeg"
  },
  {
    title: "Gain Global Experience",
    description: "Work on transformative projects with world-class industry specialists, be mentored by experts, and participate in the co-creation of innovative solutions in our focus areas.",
    image: "/images/climate-adaptation.jpg"
  },
  {
    title: "Develop Your Skills",
    description: "Our fully funded program offers training, apprenticeships, and work experience to enhance your expertise and showcase your talent.",
    image: "/images/ganzafrica-fellows.jpg"
  }
];

const promises = [
  {
    number: "01",
    title: "Professional Development",
    description: "Provide up to 2 years of holistic training with a focus on data & analytics and leadership skills",
    color: "bg-[#00A15D]"
  },
  {
    number: "02",
    title: "A community of like-minded people",
    description: "Welcome fellows into a network of value-driven young Africans committed to leading Africa's transformation",
    color: "bg-[#FDB022]"
  },
  {
    number: "03",
    title: "Hands-On Experience",
    description: "Deliver work secondments with one of our partners to apply skills learned",
    color: "bg-[#00A15D]"
  }
];

const topics = [
  "Food Systems",
  "Data & Evidence",
  "Co-creation",
  "Food systems",
  "Data & Evidence",
  "Natural Resource Management",
  "Climate Change",
  "Sustainable Agriculture"
];

export default function FellowshipPage() {
  // Use useParams to get the locale from the URL
  const params = useParams<{ locale: string }>();
  const locale = params.locale as string;

  // You might need to implement a proper dictionary loading solution
  // For now we'll use an empty object
  const dict = {};

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);
  const [visibleTopics, setVisibleTopics] = useState<string[]>([]);
  const topicsRef = useRef<HTMLDivElement>(null);
  const [featuredOpportunity, setFeaturedOpportunity] = useState<Opportunity | null>(null);


  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const extendedTopics = [...topics, ...topics];
    setVisibleTopics(extendedTopics);

    const scrollAnimation = setInterval(() => {
      if (topicsRef.current) {
        if (topicsRef.current.scrollLeft >= (topicsRef.current.scrollWidth / 2)) {
          topicsRef.current.scrollLeft = 0;
        } else {
          topicsRef.current.scrollLeft += 1;
        }
      }
    }, 30);

    return () => clearInterval(scrollAnimation);
  }, []);

  useEffect(() => {
    // Auto slide testimonials every 5 seconds
    const slideInterval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);
  return (
      <div className="min-h-screen bg-white font-sans">
        <Header locale={locale} dict={dict} />

        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px]">
          <div className="absolute inset-0">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-4"
              >
                GanzAfrica <span className="text-primary-orange">Fellowship</span>
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-6"
              >
                Join our transformative fellowship program designed to empower the next generation of African leaders in sustainable development.
              </motion.p>
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex items-center justify-center gap-4"
              >
                <Link href={`/${locale}/programs/fellowship/how-to-apply`}>
                  <Button className="bg-primary-orange hover:bg-primary-orange text-white font-semibold px-6 py-4 text-base">
                    How to Apply
                  </Button>
                </Link>
                <Link href={`/${locale}/opportunities/${featuredOpportunity?.id}/apply`}>
                  <Button className="bg-[#045F3C] hover:bg-[#045F3C]/90 text-white font-semibold px-6 py-4 text-base">
                    Apply now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <HeaderBelt />
        </div>

        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="py-16 md:py-20 bg-white"
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="order-2 md:order-1"
              >
                <img
                    src="/images/food-system-1.png"
                    alt="Food System"
                    className="rounded-lg w-full h-[500px] object-cover"
                />
              </motion.div>
              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="order-1 md:order-2"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Discover tomorrow's{" "}
                  <span className="block text-[#045F3C]">leaders today</span>
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  A one-year program for those in early to mid career with exceptional ability and intellectual curiosity who aspire to become public leaders.
                </p>
                <p className="text-gray-600 text-lg mb-8">
                  Through our full-time Fellowship, we find people working on plans to make the world better in a big way. Then we help them become impactful leaders by connecting them with the tools, resources, and communities they need to bring their ideas to life.
                </p>

                <Link href={`/${locale}/about/team`}>
                  <Button className="bg-primary-orange hover:bg-primary-orange text-black font-medium px-8 py-3 text-lg rounded-lg">
                    Meet the Fellows
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="py-16 md:py-20 bg-gray-100 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[#F7F7F7]">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
          </div>

          {/* Left Leaf */}
          <div className="absolute left-0 top-1/4 -translate-x-1/4 opacity-10">
            <img
                src="/images/leaf.png"
                alt="Decorative leaf"
                className="w-64 h-64 transform -rotate-12"
            />
          </div>

          {/* Right Leaf */}
          <div className="absolute right-0 bottom-1/4 translate-x-1/4 opacity-10">
            <img
                src="/images/leaf.png"
                alt="Decorative leaf"
                className="w-64 h-64 transform rotate-12"
            />
          </div>

          <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
            <div className="relative">
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-[60%]"
              >
                <img
                    src="/images/team-group-photo.jpg"
                    alt="Fellowship team"
                    className="w-full h-[500px] object-cover rounded-lg"
                />
                <div className="absolute top-1/2 left-[25%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full bg-[#FDB022] flex items-center justify-center cursor-pointer hover:bg-[#FDB022]/90 transition-colors">
                    <Play fill="white" className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="absolute top-12 right-0 w-[50%] bg-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  About the <span className="text-[#045F3C]">Fellowship</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Our fully-funded program provides training, mentorship, and hands-on work experience in land governance, environmental management, agrifood systems, climate finance and other disciplines across our focus sectors. With specialized mentors guiding you, you'll gain professional development and collaborate with talented professionals. Plus, you'll have the opportunity to work on impactful projects with key global partners.
                </p>

                <Link href={`/${locale}/programs/fellowship/how-to-apply`}>
                  <Button className="bg-[#FDB022] hover:bg-[#FDB022]/90 text-black font-medium px-8 py-3 text-lg rounded-lg">
                    How to Apply
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="py-12 md:py-16 bg-white"
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-2xl mx-auto mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Benefits of <span className="text-[#045F3C]">Joining GanzAfrica</span>
              </h2>
              <p className="text-gray-600 text-base">
                Begin your journey of impact and growth with GanzAfrica. Discover the
                benefits of joining our program:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {benefits.slice(0, 2).map((benefit, index) => (
                    <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                        className="bg-white rounded-[16px] overflow-hidden border border-gray-100"
                    >
                      <div className="p-3">
                        <div className="rounded-xl overflow-hidden relative">
                          <Image
                              src={benefit.image}
                              alt={benefit.title}
                              width={600}
                              height={200}
                              className="w-full h-[200px] object-cover"
                              style={{ objectPosition: "center center" }}
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                      </div>
                    </motion.div>
                ))}
              </div>

              {/* Right Column */}
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="bg-white rounded-[16px] overflow-hidden border border-gray-100 h-full"
              >
                <div className="p-3">
                  <div className="rounded-xl overflow-hidden relative h-[600px]">
                    <Image
                        src="/images/food-system-1.png"
                        alt="Develop Your Skills"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: "center center",
                          objectFit: "cover"
                        }}
                        priority
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Develop Your Skills</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Our fully funded program offers training, apprenticeships, and work experience to enhance your expertise and showcase your talent.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* GanzAfrica's Promise Section */}
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="py-24 md:py-32 bg-[#045F3C] relative overflow-hidden"
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="max-w-xl"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  GanzAfrica's Promise <span className="text-[#00A15D]">to</span>
                  <br />
                  <span className="text-[#FDB022]">Fellows:</span>
                </h2>
                <p className="text-white/90 text-lg">
                  We are committed to providing a transformative experience that equips you with the skills, network, and opportunities to make a lasting impact in your field.
                </p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="space-y-8 relative"
              >
                {/* Dotted Line Connector */}
                <div className="absolute left-6 top-[24px] bottom-[24px] border-l-2 border-dashed border-white/20"></div>

                {promises.map((promise, index) => (
                    <motion.div
                        key={promise.number}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 * index, duration: 0.8 }}
                        className="flex items-start gap-6 relative"
                    >
                      <div className={`${promise.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                        {promise.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{promise.title}</h3>
                        <p className="text-white/80">{promise.description}</p>
                      </div>
                    </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2">Checkout Fellows</h2>
              <h3 className="text-3xl font-bold text-[#045F3C] mb-12">Say about the Fellowship</h3>
            </div>

            <div className="max-w-5xl mx-auto px-12">
              {/* Profile Images Row */}
              <div className="flex justify-center items-center gap-6 mb-12">
                {testimonials.map((testimonial, index) => {
                  const isActive = currentTestimonial === index;
                  const isPrevious = (currentTestimonial === index + 1) || (currentTestimonial === 0 && index === testimonials.length - 1);
                  const isNext = (currentTestimonial === index - 1) || (currentTestimonial === testimonials.length - 1 && index === 0);

                  return (
                      <div
                          key={testimonial.id}
                          className={`transition-all duration-500 transform ${
                              isActive ? 'w-24 h-24 z-20 scale-110' :
                                  isPrevious || isNext ? 'w-16 h-16 z-10 opacity-50 scale-90' :
                                      'w-12 h-12 opacity-30 scale-75'
                          }`}
                      >
                        <div className={`rounded-full overflow-hidden transition-all duration-500 h-full w-full ${
                            isActive ? 'ring-4 ring-yellow-400' : ''
                        }`}>
                          <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={isActive ? 96 : 64}
                              height={isActive ? 96 : 64}
                              className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                  );
                })}
              </div>

              {/* Testimonial Content */}
              <div className="relative">
                <div className="text-center px-4 md:px-16">
                  <div className="min-h-[120px] relative">
                    <p className="text-gray-600 text-lg mb-8 transition-all duration-500 transform">
                      {testimonials[currentTestimonial]?.quote || ''}
                    </p>
                  </div>
                  <div className="transform transition-all duration-500">
                    <h4 className="text-2xl font-bold mb-2 text-[#045F3C]">{testimonials[currentTestimonial]?.name || ''}</h4>
                    <p className="text-gray-600">{testimonials[currentTestimonial]?.role || ''}</p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors -translate-x-full"
                    aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#045F3C] text-white flex items-center justify-center hover:bg-[#034830] transition-colors translate-x-full"
                    aria-label="Next testimonial"
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </Container>
        </section>
      </div>
  );
}
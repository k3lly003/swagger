"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, Plus, Minus } from 'lucide-react';
import apiClient from '@/lib/api-client';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Interface for FAQ data from the API
interface FAQ {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Interface for the API response
interface FAQsResponse {
  faqs: FAQ[];
}

// Skeleton loader component for FAQ items
const FAQSkeletonItem = ({ expanded = false }: { expanded?: boolean }) => (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      {expanded && (
          <div className="mt-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
      )}
    </div>
);

// FAQ Accordion Component
const FAQAccordionItem = ({ question, answer }: { question: string; answer?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <motion.div
          className="border-b border-gray-200 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <button
            className="w-full flex items-center justify-between text-left"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
        >
          <span className="text-gray-800 font-medium">{question}</span>
          <motion.span
              className="flex items-center justify-center w-6 h-6 rounded-full border border-emerald-600"
              initial={false}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
          >
            {isOpen ? (
                <Minus className="w-4 h-4 text-emerald-600" />
            ) : (
                <Plus className="w-4 h-4 text-emerald-600" />
            )}
          </motion.span>
        </button>
        <motion.div
            className="overflow-hidden"
            initial={false}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
              marginTop: isOpen ? 8 : 0
            }}
            transition={{ duration: 0.3 }}
        >
          {answer && (
              <div className="text-gray-600 pr-8">{answer}</div>
          )}
        </motion.div>
      </motion.div>
  );
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs from the API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<FAQsResponse>('/faqs?active_only=true');
        setFaqs(response.data.faqs);
        setError(null);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQs');
        // Set fallback FAQs in case of error
        setFaqs([
          {
            id: 1,
            question: "What does the GanzAfrica fellowship include?",
            answer: "Our fellowship program includes rigorous training in data analysis, systems thinking, and evidence-based decision making. Fellows gain practical experience through placement in partner public institutions while receiving mentorship and professional development opportunities.",
            is_active: true,
            view_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section with Header */}
        <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                      src="/images/food-system.jpeg"
                      alt="FAQ Hero Background"
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                  />
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>

                {/* Header with cut-out sections */}
                <header className="relative z-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center py-4">
                      {/* Logo section with white background cut-out */}
                      <div className="relative bg-white p-4 -ml-4 rounded-br-3xl">
                        <div className="flex items-center">
                          <Leaf className="h-8 w-8 text-emerald-600" />
                          <span className="ml-2 text-xl font-bold text-emerald-600">GanzAfrica</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Hero Content */}
                <div className="relative z-20 flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      Clear <span className="text-yellow-400">Answers</span> to Help You<br />
                      Get Started
                    </motion.h1>
                    <motion.h2
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-yellow-400 tracking-wider mt-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                      FAQs
                    </motion.h2>
                  </div>
                </div>
        </section>

        {/* Yellow Belt Section */}
        <div className="bg-yellow-400 py-4 relative overflow-hidden">
              <div className="flex justify-center items-center">
                <div className="marquee-container overflow-hidden w-full max-w-2xl mx-auto">
                  <div className="marquee-content flex whitespace-nowrap animate-marquee">
                    <div className="flex space-x-8 px-4 mx-4">
                      <span className="text-base font-medium">• Food Systems</span>
                      <span className="text-base font-medium">• Data & Evidence</span>
                      <span className="text-base font-medium">• Co-creation</span>
                      <span className="text-base font-medium">• Data & Evidence</span>
                    </div>
                    <div className="flex space-x-8 px-4 mx-4">
                      <span className="text-base font-medium">• Food Systems</span>
                      <span className="text-base font-medium">• Data & Evidence</span>
                      <span className="text-base font-medium">• Co-creation</span>
                      <span className="text-base font-medium">• Data & Evidence</span>
                    </div>
                  </div>
                </div>
              </div>
        </div>

        {/* FAQ Content */}
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="md:col-span-4">
              {loading ? (
                  // Skeleton for left column
                  <>
                    <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse mb-8"></div>
                  </>
              ) : (
                  <>
                    <h2 className="text-2xl font-bold text-emerald-600 mb-4">General FAQs</h2>
                    <p className="text-gray-600 mb-8">
                      Everything you need to know about GanzAfrica and how it works.
                      Can't find an answer? Chat with our team.
                    </p>
                  </>
              )}
            </div>

            {/* Right Column */}
            <div className="md:col-span-8">
              {/* Loading state */}
              {loading && (
                  <div className="space-y-4">
                    <FAQSkeletonItem />
                    <FAQSkeletonItem expanded={true} />
                    <FAQSkeletonItem />
                    <FAQSkeletonItem />
                    <FAQSkeletonItem />
                  </div>
              )}

              {/* Error state */}
              {error && (
                  <div className="text-red-500 py-4">
                    {error}. Please try refreshing the page.
                  </div>
              )}

              {/* FAQs from API */}
              {!loading && !error && faqs.length === 0 && (
                  <div className="text-gray-600 py-4">
                    No FAQs available at the moment.
                  </div>
              )}

              {/* Display FAQs */}
              {!loading && faqs.map((faq) => (
                  <FAQAccordionItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                  />
              ))}
            </div>
          </div>
        </motion.div>

        <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
      </div>
  );
}
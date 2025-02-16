'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { DecoratedHeading } from '@/components/layout/headertext';
import { cn } from '@/lib/utils';
import apiClient from '@/lib/api-client';

// Interface for the testimonial data from the API
interface Testimonial {
    id: number;
    author_name: string;
    position: string;
    image: string;
    description: string;
    company: string;
    occupation: string;
    date: string;
    rating: number;
    created_at: string;
    updated_at: string;
}

// Interface for the API response
interface TestimonialsResponse {
    testimonials: Testimonial[];
}

// Props for the component
interface TestimonialsSectionProps {
    locale: string;
    dict: any;
}

export default function TestimonialsSection({ locale, dict }: TestimonialsSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch testimonials from the API
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<TestimonialsResponse>('/testimonials');
                setTestimonials(response.data.testimonials);
                setError(null);
            } catch (err) {
                console.error('Error fetching testimonials:', err);
                setError('Failed to load testimonials');
                // Set fallback testimonials in case of error
                setTestimonials([
                    {
                        id: 1,
                        author_name: "Madge Jennings",
                        position: dict?.testimonials?.roles?.fellow || "Fellow",
                        description: dict?.testimonials?.comments?.comment1 || "My experience with GanzAfrica has been transformative. The training and mentorship helped me develop crucial skills in agriculture and land management that I now apply daily in my work.",
                        image: "/images/1.jpg",
                        company: "GA",
                        occupation: "fellow",
                        date: new Date().toISOString(),
                        rating: 5,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, [dict?.testimonials?.roles?.fellow, dict?.testimonials?.comments?.comment1]);

    // Start automatic rotation when testimonials are loaded
    useEffect(() => {
        if (testimonials.length === 0) return;

        const startInterval = () => {
            intervalRef.current = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % testimonials.length);
            }, 5000); // Change every 5 seconds
        };

        startInterval();

        // Clear interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [testimonials.length]);

    // Reset interval when manually changing testimonial
    const handleAvatarClick = (index: number) => {
        setActiveIndex(index);

        // Reset the interval to prevent changing too soon after a click
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % testimonials.length);
        }, 5000);
    };

    // Divide testimonials into left and right side groups
    const getLeftSideTestimonials = () => {
        if (testimonials.length === 0) return [];
        // Use even indices for left side
        return testimonials.filter((_, index) => index % 2 === 0);
    };

    const getRightSideTestimonials = () => {
        if (testimonials.length === 0) return [];
        // Use odd indices for right side
        return testimonials.filter((_, index) => index % 2 !== 0);
    };

    // Show skeleton loading state that resembles the actual content
    if (loading && testimonials.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-secondary-green/5 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        {/* Skeleton for heading */}
                        <div className="flex justify-center">
                            <div className="h-12 w-72 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Skeleton for left avatars */}
                            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
                                <div className="relative w-40 h-96">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div
                                            key={`skeleton-left-${index}`}
                                            className="absolute animate-pulse"
                                            style={{
                                                top: `${index * 18}%`,
                                                left: '50%',
                                            }}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-md"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skeleton for center content */}
                            <div className="flex flex-col items-center justify-center text-center px-4 md:px-20">
                                {/* Skeleton for avatar */}
                                <div className="relative h-56 w-full max-w-xs mb-8">
                                    <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
                                    <div className="h-6 w-48 bg-gray-200 animate-pulse mx-auto mt-4 rounded"></div>
                                    <div className="h-4 w-32 bg-gray-200 animate-pulse mx-auto mt-2 rounded"></div>
                                </div>

                                {/* Skeleton for quote text */}
                                <div className="relative min-h-[180px] md:min-h-[150px] w-full">
                                    <div className="w-10 h-10 bg-gray-100 mb-4 mx-auto rounded"></div>
                                    <div className="h-4 w-full max-w-lg bg-gray-200 animate-pulse mx-auto rounded mb-2"></div>
                                    <div className="h-4 w-full max-w-md bg-gray-200 animate-pulse mx-auto rounded mb-2"></div>
                                    <div className="h-4 w-full max-w-sm bg-gray-200 animate-pulse mx-auto rounded"></div>
                                </div>
                            </div>

                            {/* Skeleton for right avatars */}
                            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
                                <div className="relative w-40 h-96">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div
                                            key={`skeleton-right-${index}`}
                                            className="absolute animate-pulse"
                                            style={{
                                                top: `${index * 18}%`,
                                                right: '50%',
                                            }}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-md"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile skeleton indicators */}
                        <div className="md:hidden flex justify-center mt-8 gap-3">
                            {[1, 2, 3, 4].map((_, index) => (
                                <div key={`skeleton-nav-${index}`} className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-secondary-green/5 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <DecoratedHeading
                        firstText={dict?.testimonials?.heading_first || "Our"}
                        secondText={dict?.testimonials?.heading_second || "Testimonials"}
                        className="mx-auto"
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div className="text-center text-red-500 mb-8">{error}</div>
                )}

                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Avatars on left side - using left side testimonials only */}
                        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
                            <div className="relative w-40 h-96">
                                {getLeftSideTestimonials().map((testimonial, index) => {
                                    // Calculate position for floating effect
                                    const testimonialIndex = testimonials.findIndex(t => t.id === testimonial.id);
                                    const isActive = testimonialIndex === activeIndex;
                                    const angle = (360 / getLeftSideTestimonials().length) * index;
                                    const radius = 20; // pixels from center

                                    return (
                                        <div
                                            key={`left-${testimonial.id}`}
                                            className={cn(
                                                "absolute transition-all duration-500 cursor-pointer",
                                                isActive
                                                    ? "ring-4 ring-primary-green/70 ring-offset-2 scale-110"
                                                    : "opacity-80 hover:opacity-100 hover:scale-105"
                                            )}
                                            style={{
                                                animation: `floating ${8 + index}s linear infinite`,
                                                top: `${index * (100 / Math.max(getLeftSideTestimonials().length, 1))}%`,
                                                left: `${Math.sin(angle * Math.PI / 180) * radius + 50}%`,
                                                borderRadius: "50%", // Ensure ring follows avatar shape
                                                transformOrigin: "center center",
                                                transition: "all 0.3s ease-in-out"
                                            }}
                                            onClick={() => handleAvatarClick(testimonialIndex)}
                                        >
                                            <Avatar className={cn(
                                                "border-2 border-white shadow-md",
                                                isActive ? "w-20 h-20" : "w-16 h-16" // Increased sizes
                                            )}>
                                                <AvatarImage src={testimonial.image} alt={testimonial.author_name} />
                                                <AvatarFallback className="text-lg">{testimonial.author_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Center content - Photo and Quote - with better spacing */}
                        <div className="flex flex-col items-center justify-center text-center px-4 md:px-20">
                            {/* Avatar Images - increased size */}
                            <div className="relative h-56 w-full max-w-xs mb-8 perspective-container">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={`center-${testimonial.id}`}
                                        className={cn(
                                            "absolute top-0 left-0 right-0 mx-auto transition-all duration-700 ease-in-out",
                                            index === activeIndex ? "opacity-100 transform-none" :
                                                index < activeIndex ? "opacity-0 -translate-y-full rotate-x-70" : "opacity-0 translate-y-full rotate-x-negative-70"
                                        )}
                                    >
                                        <Avatar className="w-40 h-40 mx-auto border-4 border-white shadow-lg">
                                            <AvatarImage src={testimonial.image} alt={testimonial.author_name} />
                                            <AvatarFallback className="text-4xl">{testimonial.author_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="mt-4 text-2xl font-bold text-primary-green">{testimonial.author_name}</h3>
                                        <p className="text-md text-gray-600">{testimonial.position} {testimonial.company && `at ${testimonial.company}`}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quote Text - improved with better wrapping and height */}
                            <div className="relative min-h-[180px] md:min-h-[150px] w-full perspective-container">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={`quote-${testimonial.id}`}
                                        className={cn(
                                            "absolute w-full px-4 transition-all duration-700 ease-in-out",
                                            index === activeIndex ? "opacity-100 transform-none" :
                                                index < activeIndex ? "opacity-0 -translate-y-full rotate-x-70" : "opacity-0 translate-y-full rotate-x-negative-70"
                                        )}
                                    >
                                        <div className="relative">
                                            <svg className="w-10 h-10 text-primary-green/20 mb-4 mx-auto" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 8C4.477 8 0 12.477 0 18v14h12V18h-8c0-3.866 3.134-7 7-7h1V8h-2zm20 0c-5.523 0-10 4.477-10 10v14h12V18h-8c0-3.866 3.134-7 7-7h1V8h-2z"></path>
                                            </svg>
                                            <p className="text-gray-700 italic text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                                                {testimonial.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Avatars on right side - using right side testimonials only */}
                        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
                            <div className="relative w-40 h-96">
                                {getRightSideTestimonials().map((testimonial, index) => {
                                    // Different animation timing for right side
                                    const testimonialIndex = testimonials.findIndex(t => t.id === testimonial.id);
                                    const isActive = testimonialIndex === activeIndex;
                                    const angle = (360 / getRightSideTestimonials().length) * index;
                                    const radius = 20; // pixels from center

                                    return (
                                        <div
                                            key={`right-${testimonial.id}`}
                                            className={cn(
                                                "absolute transition-all duration-500 cursor-pointer",
                                                isActive
                                                    ? "ring-4 ring-primary-green/70 ring-offset-2 scale-110"
                                                    : "opacity-80 hover:opacity-100 hover:scale-105"
                                            )}
                                            style={{
                                                animation: `floating ${7 + index}s linear infinite`,
                                                top: `${index * (100 / Math.max(getRightSideTestimonials().length, 1))}%`,
                                                right: `${Math.sin(angle * Math.PI / 180) * radius + 50}%`,
                                                borderRadius: "50%", // Ensure ring follows avatar shape
                                                transformOrigin: "center center",
                                                transition: "all 0.3s ease-in-out"
                                            }}
                                            onClick={() => handleAvatarClick(testimonialIndex)}
                                        >
                                            <Avatar className={cn(
                                                "border-2 border-white shadow-md",
                                                isActive ? "w-20 h-20" : "w-16 h-16" // Increased sizes
                                            )}>
                                                <AvatarImage src={testimonial.image} alt={testimonial.author_name} />
                                                <AvatarFallback className="text-lg">{testimonial.author_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile testimonial navigation - improved with avatar indicators */}
                    <div className="md:hidden flex justify-center mt-8 gap-3">
                        {testimonials.map((testimonial, index) => (
                            <button
                                key={`nav-${index}`}
                                onClick={() => handleAvatarClick(index)}
                                className={cn(
                                    "transition-all rounded-full overflow-hidden border-2",
                                    index === activeIndex
                                        ? "scale-125 border-primary-green"
                                        : "scale-100 border-transparent opacity-70 hover:opacity-90"
                                )}
                                aria-label={`Go to testimonial ${index + 1}`}
                            >
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={testimonial.image} alt={testimonial.author_name} />
                                    <AvatarFallback>{testimonial.author_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes floating {
          0% {
            transform: rotate(0deg) translate(-10px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(-10px) rotate(-360deg);
          }
        }

        .perspective-container {
          perspective: 1000px;
        }

        .rotate-x-70 {
          transform: rotateX(70deg);
        }

        .rotate-x-negative-70 {
          transform: rotateX(-70deg);
        }
      `}</style>
        </section>
    );
}
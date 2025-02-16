'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { ArrowLeft, Edit2, Quote, Star, Calendar, Building, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

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

export default function TestimonialViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await apiClient.get(`/testimonials/${params.id}`);
        setTestimonial(response.data.testimonial);
      } catch (error: any) {
        console.error('Error fetching testimonial:', error);
        toast.error(error.response?.data?.message || 'Failed to load testimonial');
        router.push('/testimonials');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonial();
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderRatingStars = (rating: number) => {
    return (
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
              <Star
                  key={index}
                  className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
          ))}
          <span className="ml-2 text-gray-700">{rating} of 5</span>
        </div>
    );
  };

  if (isLoading) {
    return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                  variant="ghost"
                  disabled
                  className="text-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>

          <Card className="max-w-4xl mx-auto p-8 relative">
            <div className="flex items-start gap-6 mb-8">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-4 flex-grow">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64" />
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>

            <Skeleton className="h-32 w-full mb-8" />

            <div className="border-t pt-6 mt-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </Card>
        </div>
    );
  }

  if (!testimonial) {
    return (
        <div className="p-6 text-center">
          <p>Testimonial not found</p>
          <Button
              variant="link"
              onClick={() => router.push('/testimonials')}
              className="mt-4"
          >
            Return to Testimonials
          </Button>
        </div>
    );
  }

  return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">View Testimonial</h1>
          </div>
          <Button
              onClick={() => router.push(`/testimonials/edit/${testimonial.id}`)}
              className="bg-primary-green hover:bg-green-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Testimonial
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto p-8 relative">
          <div className="absolute top-8 right-8 text-gray-400">
            <Quote size={48} />
          </div>

          <div className="flex items-start gap-6 mb-8">
            <Avatar className="h-24 w-24 ring-4 ring-offset-4 ring-primary-green">
              <AvatarFallback className="bg-primary-green text-white text-xl">
                {testimonial.author_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold mb-2">{testimonial.author_name}</h2>
              <p className="text-lg text-gray-600 mb-4">
                {testimonial.position} at {testimonial.company}
              </p>
              <div className="flex gap-3">
                <Badge variant="secondary" className="text-sm">
                  {testimonial.occupation}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 text-sm">
                  {testimonial.rating} Star{testimonial.rating !== 1 && 's'}
                </Badge>
              </div>
            </div>
          </div>

          <blockquote className="text-xl text-gray-700 mb-8 italic relative pl-6 border-l-4 border-primary-green">
            "{testimonial.description}"
          </blockquote>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <dt className="text-sm font-medium text-gray-500">Rating:</dt>
                <dd className="text-sm text-gray-900">{renderRatingStars(testimonial.rating)}</dd>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <dt className="text-sm font-medium text-gray-500">Date:</dt>
                <dd className="text-sm text-gray-900">{formatDate(testimonial.date)}</dd>
              </div>

              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-green-500" />
                <dt className="text-sm font-medium text-gray-500">Company:</dt>
                <dd className="text-sm text-gray-900">{testimonial.company}</dd>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                <dt className="text-sm font-medium text-gray-500">Occupation:</dt>
                <dd className="text-sm text-gray-900">{testimonial.occupation}</dd>
              </div>
            </dl>

            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
              <p>Created: {formatDate(testimonial.created_at)}</p>
              <p>Last Updated: {formatDate(testimonial.updated_at)}</p>
            </div>
          </div>
        </Card>
      </div>
  );
}
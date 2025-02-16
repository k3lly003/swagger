'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Grid2X2, List, Trash2, Edit2, Eye, Quote, Search, Filter, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@workspace/ui/components/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Skeleton } from '@workspace/ui/components/skeleton';
import apiClient from '@/lib/api-client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

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

export default function TestimonialsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All Testimonials');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All Testimonials',
    'Fellow',
    'CEO',
    'Manager',
    '5 Star',
    '4 Star',
    '3 Star'
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/testimonials');
      setTestimonials(response.data.testimonials || []);
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      toast.error(error.response?.data?.message || 'Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    // Filter by category
    if (activeCategory === 'All Testimonials') {
      // No category filter, apply only search filter
    } else if (activeCategory === '5 Star' || activeCategory === '4 Star' || activeCategory === '3 Star') {
      const rating = parseInt((activeCategory ?? '').split(' ')[0]);
      if (testimonial.rating !== rating) return false;
    } else if (!testimonial.position.toLowerCase().includes(activeCategory.toLowerCase()) &&
        !testimonial.occupation.toLowerCase().includes(activeCategory.toLowerCase())) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      return (
          testimonial.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testimonial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testimonial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testimonial.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  const handleView = (testimonial: Testimonial) => {
    router.push(`/testimonials/${testimonial.id}`);
  };

  const handleEdit = (testimonial: Testimonial) => {
    router.push(`/testimonials/edit/${testimonial.id}`);
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTestimonial) return;

    try {
      await apiClient.delete(`/testimonials/${selectedTestimonial.id}`);

      // Remove the testimonial from the state
      setTestimonials(prev => prev.filter(t => t.id !== selectedTestimonial.id));

      // Close the dialog
      setDeleteDialogOpen(false);
      setSelectedTestimonial(null);

      // Show success message
      toast.success('Testimonial deleted successfully');
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      toast.error(error.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  const getRatingStars = (rating: number) => {
    return `${rating} Star${rating !== 1 ? 's' : ''}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMediaPreview = (imageUrl: string) => {
    if (!imageUrl || imageUrl === 'string') return null;

    return (
        <div className="grid grid-cols-1 gap-2 mt-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
                src={imageUrl}
                alt="Media"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
    );
  };

  const renderGridView = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            // Skeleton loading state
            Array(6).fill(0).map((_, index) => (
                <Card key={index} className="p-6 flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="flex items-center justify-end mt-4 border-t pt-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  </div>
                </Card>
            ))
        ) : (
            filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6 flex flex-col relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-gray-400">
                    <Quote size={24} />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary-green">
                      <AvatarFallback className="bg-primary-green text-white">
                        {testimonial.author_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.author_name}</h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.position} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary">{testimonial.occupation}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {getRatingStars(testimonial.rating)}
                    </Badge>
                  </div>
                  <blockquote className="text-gray-700 mb-4 flex-grow italic relative pl-4 border-l-2 border-primary-green">
                    "{testimonial.description}"
                  </blockquote>
                  {renderMediaPreview(testimonial.image)}
                  <div className="flex items-center justify-end mt-4 border-t pt-4">
                    <div className="flex gap-2">
                      <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          title="View testimonial"
                          onClick={() => handleView(testimonial)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          className="text-primary-green hover:bg-green-50"
                          title="Edit testimonial"
                          onClick={() => handleEdit(testimonial)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          title="Delete testimonial"
                          onClick={() => handleDeleteClick(testimonial)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
            ))
        )}
      </div>
  );

  const renderListView = () => (
      <div className="space-y-4">
        {isLoading ? (
            // Skeleton loading state
            Array(4).fill(0).map((_, index) => (
                <Card key={index} className="p-6 relative">
                  <div className="flex items-start gap-6">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                      </div>
                      <Skeleton className="h-24 w-full mb-4" />
                      <div className="flex items-center justify-end mt-4 border-t pt-4">
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16 rounded" />
                          <Skeleton className="h-8 w-16 rounded" />
                          <Skeleton className="h-8 w-16 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
            ))
        ) : (
            filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6 relative">
                  <div className="absolute top-4 right-4 text-gray-400">
                    <Quote size={24} />
                  </div>
                  <div className="flex items-start gap-6">
                    <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary-green">
                      <AvatarFallback className="bg-primary-green text-white">
                        {testimonial.author_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{testimonial.author_name}</h3>
                          <p className="text-sm text-gray-600">
                            {testimonial.position} at {testimonial.company}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{testimonial.occupation}</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {getRatingStars(testimonial.rating)}
                          </Badge>
                        </div>
                      </div>
                      <blockquote className="text-gray-700 mb-4 italic relative pl-4 border-l-2 border-primary-green">
                        "{testimonial.description}"
                      </blockquote>
                      {renderMediaPreview(testimonial.image)}
                      <div className="flex items-center justify-end mt-4 border-t pt-4">
                        <div className="flex gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              title="View testimonial"
                              onClick={() => handleView(testimonial)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-primary-green hover:bg-green-50"
                              title="Edit testimonial"
                              onClick={() => handleEdit(testimonial)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              title="Delete testimonial"
                              onClick={() => handleDeleteClick(testimonial)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
            ))
        )}
      </div>
  );

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Testimonials</h1>
          </div>
          <div className="flex space-x-3">
            <Link href="/testimonials/add-testimonial" className="flex items-center px-4 py-2 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800">
              Add Testimonial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
              <Button
                  key={category}
                  variant={activeCategory === category ? 'secondary' : 'outline'}
                  onClick={() => setActiveCategory(category)}
                  className="whitespace-nowrap"
              >
                {category}
              </Button>
          ))}
        </div>

        <div className="flex justify-end mb-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full pl-10 p-2.5"
                placeholder="Search testimonials"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="ml-2 p-2.5 bg-green-700 text-white rounded" title="Filter testimonials">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex border rounded-lg">
            <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
                title="Grid view"
            >
              <Grid2X2 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                className="rounded-l-none"
                onClick={() => setViewMode('list')}
                title="List view"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? renderGridView() : renderListView()}

        {!isLoading && filteredTestimonials.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg">
              <p className="text-gray-500">No testimonials found matching your criteria.</p>
            </div>
        )}

        <div className="flex items-center justify-between py-3 mt-6">
          <div className="text-sm text-gray-500">
            Showing {filteredTestimonials.length} out of {testimonials.length} entries
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-500 rounded hover:bg-gray-100" title="First page">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 rounded hover:bg-gray-100" title="Previous page">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 w-8 h-8 rounded-md bg-green-700 text-white flex items-center justify-center">
              1
            </button>
            <button className="p-2 w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 flex items-center justify-center">
              2
            </button>
            <button className="p-2 w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 flex items-center justify-center">
              3
            </button>
            <button className="p-2 text-gray-500 rounded hover:bg-gray-100" title="Next page">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 rounded hover:bg-gray-100" title="Last page">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this testimonial? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}
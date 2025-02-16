'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardHeader, CardContent, CardFooter } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export default function FAQsPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);

  // Fetch FAQs from API
  useEffect(() => {
    fetchFAQs();
  }, [activeOnly]);

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/faqs', {
        params: {
          active_only: activeOnly
        }
      });
      setFaqs(response.data.faqs || []);
    } catch (error: any) {
      console.error('Error fetching FAQs:', error);
      toast.error(error.response?.data?.message || 'Failed to load FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await apiClient.delete(`/faqs/${id}`);
      toast.success('FAQ deleted successfully');
      // Remove the deleted FAQ from the state
      setFaqs(faqs.filter(faq => faq.id !== id));
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      toast.error(error.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/faqs/edit/${id}`);
  };

  const handleToggleActive = async (faq: FAQ) => {
    try {
      const updatedFaq = { ...faq, is_active: !faq.is_active };
      await apiClient.put(`/faqs/${faq.id}`, updatedFaq);
      toast.success(`FAQ ${faq.is_active ? 'deactivated' : 'activated'} successfully`);

      // Update the FAQ in the state
      setFaqs(faqs.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f));
    } catch (error: any) {
      console.error('Error updating FAQ status:', error);
      toast.error(error.response?.data?.message || 'Failed to update FAQ status');
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">FAQs</h1>
            <p className="text-gray-600">Manage frequently asked questions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
                variant="outline"
                className={activeOnly ? "bg-blue-50" : ""}
                onClick={() => setActiveOnly(!activeOnly)}
            >
              {activeOnly ? "Showing Active Only" : "Show All"}
            </Button>
            <Link href="/faqs/add">
              <Button className="bg-primary-green hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State - Skeleton */}
        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Card key={index} className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardHeader>

                    <CardContent className="py-2 flex-grow space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>

                    <CardFooter className="pt-2 border-t flex flex-col items-stretch space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>

                      <Separator className="my-1" />

                      <div className="flex justify-between gap-2">
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-8 w-full rounded" />
                      </div>
                    </CardFooter>
                  </Card>
              ))}
            </div>
        )}

        {/* FAQs Grid Layout */}
        {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFAQs.map((faq) => (
                  <Card
                      key={faq.id}
                      className={`overflow-hidden h-full flex flex-col ${!faq.is_active ? 'opacity-70' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        {!faq.is_active && (
                            <Badge className="bg-gray-100 text-gray-600 text-xs">
                              Inactive
                            </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="py-2 flex-grow">
                      <p className="text-gray-700 text-sm line-clamp-3">{faq.answer}</p>
                      <Button
                          variant="link"
                          className="text-primary-green p-0 h-auto text-sm mt-1"
                          onClick={() => toggleExpand(faq.id)}
                      >
                        {expandedId === faq.id ? 'Show less' : 'Show more'}
                      </Button>

                      {expandedId === faq.id && (
                          <div className="mt-2">
                            <p className="text-gray-700 text-sm">{faq.answer}</p>
                            {faq.view_count !== undefined && (
                                <p className="text-gray-500 text-xs mt-2">Views: {faq.view_count}</p>
                            )}
                          </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-2 border-t flex flex-col items-stretch space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Created: {formatDate(faq.created_at)}</span>
                        <span>Updated: {formatDate(faq.updated_at)}</span>
                      </div>

                      <Separator className="my-1" />

                      <div className="flex justify-between gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(faq.id)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className={`flex-1 ${faq.is_active ? 'text-amber-600' : 'text-green-600'}`}
                            onClick={() => handleToggleActive(faq)}
                        >
                          {faq.is_active ? 'Deactivate' : 'Activate'}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600"
                            onClick={() => handleDelete(faq.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
              ))}

              {filteredFAQs.length === 0 && !isLoading && (
                  <div className="text-center py-8 bg-white rounded-lg col-span-full">
                    <p className="text-gray-500">No FAQs found matching your criteria.</p>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}
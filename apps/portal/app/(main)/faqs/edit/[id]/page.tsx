'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Switch } from '@workspace/ui/components/switch';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Card, CardContent } from '@workspace/ui/components/card';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

export default function EditFAQPage() {
    const router = useRouter();
    const params = useParams();
    const faqId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        is_active: true,
        view_count: 0,
    });

    // Fetch FAQ data
    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                const response = await apiClient.get(`/faqs/${faqId}`);
                const faqData = response.data.faq || response.data; // Assuming single FAQ might be in 'faq' property or direct

                setFormData({
                    question: faqData.question,
                    answer: faqData.answer,
                    is_active: faqData.is_active,
                    view_count: faqData.view_count || 0,
                });
            } catch (error: any) {
                console.error('Error fetching FAQ:', error);
                toast.error(error.response?.data?.message || 'Failed to load FAQ details');
                router.push('/faqs');
            } finally {
                setIsLoading(false);
            }
        };

        if (faqId) {
            fetchFAQ();
        }
    }, [faqId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await apiClient.put(`/faqs/${faqId}`, {
                question: formData.question,
                answer: formData.answer,
                is_active: formData.is_active
            });

            toast.success('FAQ updated successfully');
            router.push('/faqs');
        } catch (error: any) {
            console.error('Error updating FAQ:', error);
            toast.error(error.response?.data?.message || 'Failed to update FAQ. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="mb-4 opacity-50 pointer-events-none"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to FAQs
                    </Button>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <Card className="mt-6">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-48 w-full" />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-10 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to FAQs
                </Button>
                <h1 className="text-2xl font-bold">Edit FAQ</h1>
                <p className="text-gray-500">Update this frequently asked question and its answer</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="question">
                            Question *
                        </label>
                        <Input
                            id="question"
                            placeholder="Enter the question"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="answer">
                            Answer *
                        </label>
                        <Textarea
                            id="answer"
                            placeholder="Enter the detailed answer"
                            className="min-h-[200px]"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">
                            Active
                        </label>
                    </div>

                    {formData.view_count > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium mb-2">Statistics</h3>
                            <p className="text-sm text-gray-700">
                                View Count: {formData.view_count}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary-green hover:bg-green-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update FAQ'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
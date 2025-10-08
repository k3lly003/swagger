'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

// Categories from the main FAQs page
const categories = [
  'General',
  'Food System',
  'Climate Adaptation',
  'Data & Evidence',
  'Co-creation',
];

export default function AddFAQPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    is_active: true, // Default to active
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.question.trim() || !formData.answer.trim() || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Make API call to create new FAQ
      const response = await apiClient.post('/faqs', {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        is_active: formData.is_active
      });

      toast.success('FAQ added successfully');
      router.push('/faqs');
    } catch (error: any) {
      console.error('Error adding FAQ:', error);
      toast.error(error.response?.data?.message || 'Failed to add FAQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Add New FAQ</h1>
          <p className="text-gray-500">Create a new frequently asked question and its answer</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="category">
                Category
              </label>
              <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="question">
                Question
              </label>
              <Input
                  id="question"
                  placeholder="Enter the question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="answer">
                Answer
              </label>
              <Textarea
                  id="answer"
                  placeholder="Enter the detailed answer"
                  className="min-h-[200px]"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              />
            </div>
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
              {isSubmitting ? 'Adding...' : 'Add FAQ'}
            </Button>
          </div>
        </form>
      </div>
  );
}
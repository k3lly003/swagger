'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  category: 'Advisory Board' | 'Our Team' | 'Mentors' | 'Fellows' | 'Alumni';
  imageUrl?: string;
}

export default function EditMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TeamMember>({
    id: '',
    name: '',
    role: '',
    department: '',
    email: '',
    bio: '',
    linkedin: '',
    twitter: '',
    category: 'Our Team',
    imageUrl: ''
  });

  useEffect(() => {
    // In a real application, you would fetch the member data from an API
    // For now, we'll use mock data
    const fetchMember = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app, this would come from an API
        const mockMember: TeamMember = {
          id: params.id,
          name: 'Dr. Jane Smith',
          role: 'Chairperson',
          department: 'Advisory Board',
          email: 'jane.smith@example.com',
          bio: 'Dr. Jane Smith has over 20 years of experience in agricultural development and sustainable farming practices. She has led numerous initiatives across Africa focusing on climate-resilient agriculture.',
          linkedin: 'https://linkedin.com/in/janesmith',
          twitter: 'https://twitter.com/janesmith',
          category: 'Advisory Board',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
        };
        
        setFormData(mockMember);
      } catch (error) {
        console.error('Error fetching member:', error);
        toast.error('Failed to load member data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to update the member
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Team member updated successfully');
      router.push('/teams');
    } catch (error) {
      toast.error('Failed to update team member');
      console.error('Error updating team member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/teams">
            <Button variant="ghost" size="icon" title="Back to teams">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/teams">
          <Button variant="ghost" size="icon" title="Back to teams">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Team Member</h1>
          <p className="text-gray-600">Update member information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Enter role"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">Department</label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn Profile</label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="Enter LinkedIn profile URL"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="twitter" className="text-sm font-medium">Twitter Profile</label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="Enter Twitter profile URL"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Profile Image URL</label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advisory Board">Advisory Board</SelectItem>
                    <SelectItem value="Our Team">Our Team</SelectItem>
                    <SelectItem value="Mentors">Mentors</SelectItem>
                    <SelectItem value="Fellows">Fellows</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">Bio</label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter member's bio"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/teams')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-green hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
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
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Plus, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  color?: string; // For UI display only
}

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-100 text-blue-800' },
  { name: 'Green', value: 'bg-green-100 text-green-800' },
  { name: 'Orange', value: 'bg-orange-100 text-orange-800' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-800' },
  { name: 'Pink', value: 'bg-pink-100 text-pink-800' },
  { name: 'Cyan', value: 'bg-cyan-100 text-cyan-800' },
  { name: 'Emerald', value: 'bg-emerald-100 text-emerald-800' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-800' },
];

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: colorOptions[0].value
  });

  const [editCategory, setEditCategory] = useState({
    name: '',
    description: '',
    color: ''
  });

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/categories');

      // Assign random colors to categories for UI display
      const categoriesWithColors = response.data.categories.map((category: Category) => ({
        ...category,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)].value
      }));

      setCategories(categoriesWithColors);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error(error.response?.data?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('Name is required');
      return;
    }

    try {
      const response = await apiClient.post('/categories', {
        name: newCategory.name,
        description: newCategory.description
      });

      const createdCategory = response.data.category;

      // Add the new category to state with a random color
      setCategories(prev => [
        ...prev,
        {
          ...createdCategory,
          color: newCategory.color
        }
      ]);

      setIsAddDialogOpen(false);
      setNewCategory({
        name: '',
        description: '',
        color: colorOptions[0].value
      });
      toast.success('Category added successfully');
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditCategory({
      name: category.name,
      description: category.description,
      color: category.color || colorOptions[0].value
    });
    setIsEditDialogOpen(true);
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    if (!editCategory.name) {
      toast.error('Name is required');
      return;
    }

    try {
      await apiClient.put(`/categories/${selectedCategory.id}`, {
        name: editCategory.name,
        description: editCategory.description
      });

      // Update the category in the state
      setCategories(prev => prev.map(c =>
          c.id === selectedCategory.id
              ? { ...c, name: editCategory.name, description: editCategory.description, color: editCategory.color }
              : c
      ));

      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      toast.success('Category updated successfully');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await apiClient.delete(`/categories/${selectedCategory.id}`);

      // Remove from state
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));

      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

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
            <h1 className="text-2xl font-bold">Project Categories</h1>
            <p className="text-gray-600">Manage categories for your projects</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-green hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your projects.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                  <Input
                      id="name"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color (for display only)</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                        <div
                            key={color.value}
                            className={`w-8 h-8 rounded-full cursor-pointer ${color.value.split(' ')[0]} border-2 ${
                                newCategory.color === color.value ? 'border-black' : 'border-transparent'
                            }`}
                            onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                            title={color.name}
                        />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                      id="description"
                      placeholder="Enter category description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} className="bg-primary-green hover:bg-green-700">
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                className="pl-10"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200" />
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-60" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}

        {/* Categories Grid */}
        {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                  <Card key={category.id} className="relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${category.color ? category.color.split(' ')[0] : 'bg-emerald-100'}`} />
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                        <Badge className={category.color || 'bg-emerald-100 text-emerald-800'}>Project</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created: {formatDate(category.created_at)}
                  </span>
                        <div className="flex gap-2">
                          <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleEditClick(category)}
                              title="Edit category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(category)}
                              title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}

        {!isLoading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
              {searchQuery ? (
                  <p className="text-gray-500">No categories match your search criteria.</p>
              ) : (
                  <p className="text-gray-500">Start by adding your first project category.</p>
              )}
            </div>
        )}

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update this project category's information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name <span className="text-red-500">*</span></Label>
                <Input
                    id="edit-name"
                    placeholder="Enter category name"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color (for display only)</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                      <div
                          key={color.value}
                          className={`w-8 h-8 rounded-full cursor-pointer ${color.value.split(' ')[0]} border-2 ${
                              editCategory.color === color.value ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => setEditCategory({ ...editCategory, color: color.value })}
                          title={color.name}
                      />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                    id="edit-description"
                    placeholder="Enter category description"
                    value={editCategory.description}
                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory} className="bg-primary-green hover:bg-green-700">
                Update Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this project category? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                  onClick={handleDeleteCategory}
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
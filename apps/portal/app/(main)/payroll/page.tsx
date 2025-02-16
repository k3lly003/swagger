'use client';

import { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Search, Plus, Edit2, Trash2, Shield, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
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
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  usersCount?: number; // We don't get this from API, but we'll keep for UI
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
  });
  const [editRole, setEditRole] = useState({
    name: '',
    description: '',
  });

  // Fetch roles from API
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/roles');
      setRoles(response.data.roles || []);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error(error.response?.data?.message || 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await apiClient.post('/roles', newRole);
      toast.success('Role created successfully');
      setIsCreateDialogOpen(false);
      setNewRole({ name: '', description: '' });
      fetchRoles(); // Refresh the roles list
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast.error(error.response?.data?.message || 'Failed to create role');
    }
  };

  const handleEditClick = async (role: Role) => {
    setSelectedRole(role);
    setEditRole({
      name: role.name,
      description: role.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;

    if (!editRole.name || !editRole.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await apiClient.put(`/roles/${selectedRole.id}`, editRole);
      toast.success('Role updated successfully');
      setIsEditDialogOpen(false);
      fetchRoles(); // Refresh the roles list
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;

    try {
      await apiClient.delete(`/roles/${selectedRole.id}`);
      toast.success('Role deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      fetchRoles(); // Refresh the roles list
    } catch (error: any) {
      console.error('Error deleting role:', error);

      // Check for specific error response
      if (error.response?.status === 409) {
        toast.error('This role cannot be deleted because it is in use');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  const filteredRoles = roles.filter(role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold">Roles</h1>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Add a new role. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Role Name *
                  </label>
                  <Input
                      placeholder="Enter role name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description *
                  </label>
                  <Input
                      placeholder="Enter role description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole} className="bg-primary-green hover:bg-green-700">
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                className="pl-10"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </Card>
              ))}
            </div>
        )}

        {/* Roles Grid */}
        {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                      <Card key={role.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{role.name}</h3>
                            <p className="text-gray-600 text-sm">{role.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-primary-green hover:bg-green-50"
                                title="Edit role"
                                onClick={() => handleEditClick(role)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                title="Delete role"
                                onClick={() => handleDeleteClick(role)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Shield className="h-4 w-4" />
                            <span>Role</span>
                            {role.usersCount !== undefined && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <Users className="h-4 w-4" />
                                  <span>{role.usersCount} users</span>
                                </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {role.name}
                            </Badge>
                          </div>

                          <div className="text-xs text-gray-500">
                            Created on {formatDate(role.created_at)}
                          </div>
                        </div>
                      </Card>
                  ))
              ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No roles found matching your search criteria.</p>
                  </div>
              )}
            </div>
        )}

        {/* Edit Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role details. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Role Name *
                </label>
                <Input
                    placeholder="Enter role name"
                    value={editRole.name}
                    onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description *
                </label>
                <Input
                    placeholder="Enter role description"
                    value={editRole.description}
                    onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole} className="bg-primary-green hover:bg-green-700">
                Update Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Role</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this role? This action cannot be undone.
                {selectedRole?.usersCount && selectedRole.usersCount > 0 && (
                    <p className="mt-2 text-red-600">
                      Warning: This role is currently assigned to {selectedRole.usersCount} users.
                    </p>
                )}
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
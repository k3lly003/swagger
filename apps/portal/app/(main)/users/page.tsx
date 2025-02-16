'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Upload,
  X,
  Check,
  Plus,
  AlertCircle,
  Loader,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download
} from 'lucide-react';

// Import shadcn components
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

// Form validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import API client and utilities
import apiClient from '@/lib/api-client';
import Papa from 'papaparse';

// User schema for form validation
const userSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional().or(z.literal('')),
  name: z.string().min(1, { message: "Name is required" }),
  role_id: z.number(),
  avatar_url: z.string().optional().or(z.literal('')),
  email_verified: z.boolean().default(false),
  sendVerificationEmail: z.boolean().default(true)
});

const UserManagement = () => {

  // State for user data and pagination
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // State for loading and filtering
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [isActive, setIsActive] = useState(null);

  // State for dialogs
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // File input ref for CSV import
  const fileInputRef = useRef(null);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role_id: 1001,
      avatar_url: '',
      email_verified: false,
      sendVerificationEmail: true
    }
  });

  // Load users on component mount and when filters/pagination change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, sortOrder, selectedRoleId, isActive, searchQuery]);

  // Reset form when dialog opens
  useEffect(() => {
    if (showAddUserDialog && !editingUser) {
      form.reset();
    }
  }, [showAddUserDialog]);

  // Set form values when editing a user
  useEffect(() => {
    if (editingUser) {
      form.reset({
        email: editingUser.email,
        password: '', // Don't populate password for security
        name: editingUser.name,
        role_id: editingUser.role_id,
        avatar_url: editingUser.avatar_url || '',
        email_verified: editingUser.email_verified,
        sendVerificationEmail: false
      });
      setShowAddUserDialog(true);
    }
  }, [editingUser]);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let url = `/users?page=${currentPage}&limit=${pagination.limit}&sort_by=${sortBy}&sort_order=${sortOrder}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      if (selectedRoleId !== null) {
        url += `&role_id=${selectedRoleId}`;
      }

      if (isActive !== null) {
        url += `&is_active=${isActive}`;
      }

      const response = await apiClient.get(url);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit for adding/editing a user
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (editingUser) {
        // Editing existing user
        await apiClient.put(`/users/${editingUser.id}`, data);

      } else {
        // Adding new user
        await apiClient.post('/users', data);
      }

      setShowAddUserDialog(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true);
      try {
        await apiClient.delete(`/users/${id}`);
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle file selection for import
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results: { data: any[]; }) => {
          // Basic validation of CSV structure
          if (results.data.length === 0 || !results.data[0].email) {
            return;
          }

          // Map CSV data to match our API format
          const formattedData = results.data
              .filter(item => item.email && item.name) // Filter out incomplete rows
              .map(item => ({
                email: item.email,
                password: item.password || generatePassword(), // Generate if not provided
                name: item.name,
                role_id: parseInt(item.role_id) || 1001, // Default to public
                avatar_url: item.avatar_url || null,
                email_verified: Boolean(item.email_verified),
                sendVerificationEmail: true
              }));

          setImportData(formattedData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    }
  };

  // Generate a random password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Handle import users submission
  const handleImportUsers = async () => {
    if (importData.length === 0) {
      return;
    }

    setIsImporting(true);
    try {
      await apiClient.post('/users/import', importData);
      setShowImportDialog(false);
      setImportData([]);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error importing users:', error);
    } finally {
      setIsImporting(false);
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const csvContent = "email,name,password,role_id,avatar_url,email_verified\nexample@example.com,John Doe,password123,1001,,false";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
  };

  // Get role badge color based on role name
  const getRoleBadgeClass = (roleName) => {
    switch(roleName?.toLowerCase()) {
      case 'admin':
        return "bg-purple-100 text-purple-800";
      case 'public':
        return "bg-gray-100 text-gray-800";
      case 'editor':
        return "bg-green-100 text-green-800";
      case 'member':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold">Manage Users</h1>
              <p className="text-sm text-gray-500">Manage system users and their roles</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowImportDialog(true)}
              >
                <Upload className="h-4 w-4" />
                Import users
              </Button>

              <Button
                  className="flex bg-primary-green items-center gap-2"
                  onClick={() => setShowAddUserDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Add user
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <Card>
            {/* Search and filter */}
            <CardContent className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                      value={selectedRoleId || ""}
                      onValueChange={(value) => setSelectedRoleId(value === "" ? null : parseInt(value))}
                  >
                    <SelectTrigger className="w-32 sm:w-40">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All roles">All roles</SelectItem>
                      <SelectItem value="1001">Public</SelectItem>
                      <SelectItem value="1002">Member</SelectItem>
                      <SelectItem value="1003">Editor</SelectItem>
                      <SelectItem value="1004">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="ghost" size="icon">
                    <Filter className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                            <span className="mt-2 text-sm text-muted-foreground">Loading users...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                  ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <p className="text-muted-foreground">No users found</p>
                        </TableCell>
                      </TableRow>
                  ) : (
                      users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar_url} alt={user.name} />
                                  <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getRoleBadgeClass(user.role_name)}>
                                {user.role_name || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.is_active ? "success" : "secondary"}>
                                {user.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                    Edit user
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-red-600 focus:text-red-600"
                                  >
                                    Delete user
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <CardFooter className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {users.length} out of {pagination.total} users
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(page =>
                          page === 1 ||
                          page === pagination.pages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, i, array) => {
                        // Add ellipsis if there are gaps
                        if (i > 0 && page - array[i - 1] > 1) {
                          return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink
                                      isActive={page === currentPage}
                                      onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </React.Fragment>
                          );
                        }

                        return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                  isActive={page === currentPage}
                                  onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                        );
                      })}

                  <PaginationItem>
                    <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                        disabled={currentPage === pagination.pages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </main>

        {/* Add/Edit User Dialog */}
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editingUser
                    ? 'Update user information'
                    : 'Fill in the details to create a new user'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>{editingUser ? 'New Password (leave empty to keep current)' : 'Password'}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                              value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1001">Public</SelectItem>
                              <SelectItem value="1002">Member</SelectItem>
                              <SelectItem value="1003">Editor</SelectItem>
                              <SelectItem value="1004">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email_verified"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-primary rounded"
                                checked={field.value}
                                onChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="m-0">Email verified</FormLabel>
                        </FormItem>
                    )}
                />

                {!editingUser && (
                    <FormField
                        control={form.control}
                        name="sendVerificationEmail"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-primary rounded"
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="m-0">Send verification email</FormLabel>
                            </FormItem>
                        )}
                    />
                )}

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowAddUserDialog(false);
                    setEditingUser(null);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          {editingUser ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        editingUser ? 'Update User' : 'Create User'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Import Users Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Import Users</DialogTitle>
              <DialogDescription>
                Upload a CSV file with user data to import multiple users at once.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="py-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                        className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download Template
                    </Button>
                  </div>

                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                        type="file"
                        id="csv-upload"
                        accept=".csv"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground pb-2">
                        Supports CSV files up to 10MB
                      </p>
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Choose File
                      </Button>
                    </div>
                  </div>

                  {importData.length > 0 && (
                      <div className="text-sm text-center text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 inline mr-1" />
                        {importData.length} users ready to import
                      </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-[250px] overflow-auto">
                {importData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <p>No data available for preview</p>
                      <p className="text-xs mt-1">Upload a CSV file first</p>
                    </div>
                ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importData.slice(0, 5).map((user, index) => (
                            <TableRow key={index}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {user.role_id === 1001 ? "Public" :
                                    user.role_id === 1002 ? "Member" :
                                        user.role_id === 1003 ? "Editor" :
                                            user.role_id === 1004 ? "Admin" : "Unknown"}
                              </TableCell>
                            </TableRow>
                        ))}
                        {importData.length > 5 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground text-xs">
                                + {importData.length - 5} more users
                              </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>)}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowImportDialog(false);
                setImportData([]);
              }}>
                Cancel
              </Button>
              <Button
                  onClick={handleImportUsers}
                  disabled={isImporting || importData.length === 0}
                  className="bg-primary-green"
              >
                {isImporting ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                ) : (
                    `Import ${importData.length} Users`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default UserManagement;
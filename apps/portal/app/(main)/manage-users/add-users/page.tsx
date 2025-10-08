"use client";
import React, { useState, useEffect } from 'react';
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
  ChevronsRight
} from 'lucide-react';

// Type definitions
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  role: 'Fellow' | 'Alumni' | 'Employee' | 'Admin';
  gender: string;
  nationality: string;
  dateOfBirth: string;
  phone: string;
  status: 'active' | 'inactive';
  avatar?: string;
  emergencyContact: {
    name: string;
    email: string;
    phone: string;
    relation: string;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  role: 'Fellow' | 'Alumni' | 'Employee' | 'Admin';
  gender: string;
  nationality: string;
  dateOfBirth: string;
  phone: string;
  status: 'active' | 'inactive';
  avatar?: string;
  emergencyContact: {
    name: string;
    email: string;
    phone: string;
    relation: string;
  };
}

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
  editUser?: User;
}

// User Dialog Component
const UserDialog: React.FC<UserDialogProps> = ({ isOpen, onClose, onSave, editUser }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    role: 'Fellow',
    gender: '',
    nationality: '',
    dateOfBirth: '',
    phone: '',
    status: 'active',
    avatar: '',
    emergencyContact: {
      name: '',
      email: '',
      phone: '',
      relation: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editUser) {
      setFormData({
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        title: editUser.title,
        role: editUser.role,
        gender: editUser.gender,
        nationality: editUser.nationality,
        dateOfBirth: editUser.dateOfBirth,
        phone: editUser.phone,
        status: editUser.status,
        avatar: editUser.avatar,
        emergencyContact: editUser.emergencyContact
      });
    }
  }, [editUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError('First name, last name and email are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3002/api/users', {
        method: editUser ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      onSave(formData);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        role: 'Fellow',
        gender: '',
        nationality: '',
        dateOfBirth: '',
        phone: '',
        status: 'active',
        avatar: '',
        emergencyContact: {
          name: '',
          email: '',
          phone: '',
          relation: ''
        }
      });
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency_')) {
      const field = name.replace('emergency_', '');
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">{editUser ? 'Edit User' : 'Add New User'}</h2>
          <p className="text-sm text-gray-500">Manage users/Add user</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="Fellow">Fellow</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergency_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergency_name"
                    name="emergency_name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="emergency_relation" className="block text-sm font-medium text-gray-700 mb-1">
                    Relation to user <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergency_relation"
                    name="emergency_relation"
                    value={formData.emergencyContact.relation}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="emergency_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="emergency_email"
                    name="emergency_email"
                    value={formData.emergencyContact.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="emergency_phone"
                    name="emergency_phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 rounded-md text-white hover:bg-green-800 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Tinashe',
      lastName: 'Chigwende',
      email: 'example@ganzafrica.org',
      title: 'Junior Analyst',
      role: 'Fellow',
      status: 'active',
      gender: 'male',
      nationality: 'Zimbabwean',
      dateOfBirth: '1995-01-15',
      phone: '+1234567890',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      emergencyContact: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+0987654321',
        relation: 'Brother'
      }
    }
  ]);
  
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString()
    };
    setUsers([...users, newUser]);
    setShowUserDialog(false);
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Fellow':
        return 'text-green-700 bg-green-50';
      case 'Alumni':
        return 'text-purple-700 bg-purple-50';
      case 'Employee':
        return 'text-orange-700 bg-orange-50';
      case 'Admin':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserDialog
        isOpen={showUserDialog}
        onClose={() => {
          setShowUserDialog(false);
          setEditingUser(undefined);
        }}
        onSave={handleAddUser}
        editUser={editingUser}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Manage users</h1>
            <p className="text-sm text-gray-500">Manage users</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-green-700 bg-white border border-green-700 rounded-md hover:bg-green-50">
              Import users
            </button>
            <button
              onClick={() => setShowUserDialog(true)}
              className="px-4 py-2 text-white bg-green-700 rounded-md hover:bg-green-800"
            >
              Add user
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="bg-white rounded-lg shadow">
          {/* Search and filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500">
                              {user.firstName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing 10 out of 45 entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                <ChevronsLeft className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-1">
                <button className="px-3 py-1 text-white bg-green-700 rounded">1</button>
                <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">2</button>
                <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">3</button>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
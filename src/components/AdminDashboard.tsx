import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Admin, SystemAnalytics, User } from '../types';
import { 
  Users, 
  UserCheck, 
  Pill, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  LogOut,
  Shield,
  Activity,
  Calendar,
  Search,
  Stethoscope
} from 'lucide-react';
import { generatePdf } from '../utils/reportGenerator';
import api from '../api';
import DoctorStatusManagement from './DoctorStatusManagement';

interface SystemUser {
  id: string;
  name: string;
  role: 'doctor' | 'pharmacist' | 'admin' | 'patient';
  email: string;
  password: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  phone?: string; // Added phone for patient registration
  department?: string; // Added for doctors
  designation?: string; // Added for doctors
}

const AdminDashboard: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const admin = userProfile as Admin;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'reports' | 'doctors'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from API
  const [systemStats, setSystemStats] = useState<SystemAnalytics>({
    totalDoctors: 45,
    totalPatients: 1250,
    totalPharmacists: 12,
    totalPrescriptions: 3400,
    antibioticPrescriptions: 850,
    resistanceTrends: [
      { antibiotic: 'Amoxicillin', resistanceRate: 15 },
      { antibiotic: 'Ciprofloxacin', resistanceRate: 22 },
      { antibiotic: 'Erythromycin', resistanceRate: 28 }
    ]
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'prescription', message: 'Dr. Smith prescribed Amoxicillin to John Doe', time: '2 hours ago' },
    { id: 2, type: 'alert', message: 'High antibiotic resistance detected for Ciprofloxacin', time: '4 hours ago' },
    { id: 3, type: 'user', message: 'New pharmacist registered: Jane Wilson', time: '6 hours ago' },
    { id: 4, type: 'prescription', message: 'Prescription dispensed by City Pharmacy', time: '8 hours ago' },
    { id: 5, type: 'user', message: 'Admin account created for David Chen', time: '1 day ago' },
  ]);

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [reportDates, setReportDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      const combinedUsers: SystemUser[] = (data as { users: User[], profiles: any[] }).users
        .filter((u: { role: string }) => u.role !== 'patient')
        .map((u: any) => {
          const profile = (data as { users: User[], profiles: any[] }).profiles.find((p: any) => p.user === u._id);
          return {
            id: u._id,
            name: profile?.name || 'N/A',
            role: u.role,
            email: u.email,
            status: u.status || 'inactive', // Default to inactive if status is not set
            lastLogin: profile?.lastLogin || new Date().toISOString(),
            createdAt: u.createdAt,
            password: '', // Should not be stored or fetched
            department: profile?.department || '',
            designation: profile?.designation || '',
          };
        });
      setSystemUsers(combinedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  React.useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  const filteredUsers = systemUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveUser = async (userToSave: SystemUser) => {
    if (!userToSave.name || !userToSave.email) {
      alert('Name and email are required.');
      return;
    }

    if (!userToSave.password && !editingUser) {
      alert('Password is required for new users.');
      return;
    }

    if (!editingUser && userToSave.password && userToSave.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (editingUser) {
        const response = await api.put(`/users/${userToSave.id}`, {
          name: userToSave.name,
          email: userToSave.email,
          role: userToSave.role,
          status: userToSave.status,
          ...(userToSave.role === 'doctor' && {
            department: userToSave.department,
            designation: userToSave.designation,
          }),
        });

        if (!response.data) {
          throw new Error('No data received from server');
        }

        setSystemUsers(prevUsers => prevUsers.map(u => u.id === userToSave.id ? { ...u, ...userToSave } : u));
        setRecentActivity([
          { id: Date.now(), type: 'user', message: `Updated user: ${userToSave.name}`, time: 'Just now' },
          ...recentActivity
        ]);
      } else {
        // Creating a new user
        if (userToSave.role === 'patient') {
          const response = await api.post('/auth/register-patient', {
            name: userToSave.name,
            email: userToSave.email,
            phone: userToSave.phone,
          });
        } else {
          const response = await api.post('/auth/register', {
            name: userToSave.name,
            email: userToSave.email,
            password: userToSave.password,
            role: userToSave.role,
            status: userToSave.status,
            ...(userToSave.role === 'doctor' && {
              licenseNumber: `TEMP-${Date.now()}`,
              specialty: 'General Practice',
              department: userToSave.department,
              designation: userToSave.designation,
            }),
            ...(userToSave.role === 'pharmacist' && {
              licenseNumber: `TEMP-${Date.now()}`,
              pharmacyName: `${userToSave.name}'s Pharmacy`
            })
          });
        }

        setRecentActivity([
          { id: Date.now(), type: 'user', message: `Created new user: ${userToSave.name}`, time: 'Just now' },
          ...recentActivity
        ]);
        await fetchUsers(); // Refresh users list
      }
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error("Operation failed:", error);
      const errorMessage = error.response?.data?.msg || 
                          error.message || 
                          'Operation failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openUserModal = (user: SystemUser | null = null) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportDates({
      ...reportDates,
      [e.target.name]: e.target.value,
    });
  };

  const generateUserActivityReport = () => {
    const head = [['ID', 'Name', 'Role', 'Email', 'Status', 'Last Login']];
    const body = systemUsers.map(u => [u.id, u.name, u.role, u.email, u.status, new Date(u.lastLogin).toLocaleString()]);
    generatePdf('User Activity Report', head, body, `user_activity_${reportDates.startDate}_${reportDates.endDate}`);
  };

  const generateAntibioticUsageReport = () => {
    const head = [['Antibiotic', 'Prescriptions', 'Resistance Rate (%)']];
    const body = [
      ['Amoxicillin', 450, 15],
      ['Ciprofloxacin', 200, 22],
      ['Erythromycin', 150, 28],
      ['Azithromycin', 50, 12],
    ];
    generatePdf('Antibiotic Usage Report', head, body, `antibiotic_usage_${reportDates.startDate}_${reportDates.endDate}`);
  };

  const generateSystemAuditReport = () => {
    const head = [['Timestamp', 'User', 'Action']];
    const body = [
      ['2025-10-11 10:00', 'Dr. Smith', 'Prescribed Amoxicillin'],
      ['2025-10-11 09:30', 'Admin', 'Updated user Sarah Johnson'],
      ['2025-10-10 14:00', 'Pharmacist Jane', 'Dispensed order ORD003'],
    ];
    generatePdf('System Audit Log', head, body, `system_audit_${reportDates.startDate}_${reportDates.endDate}`);
  };

  const getStatusColor = (status: SystemUser['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <UserCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Doctors</p>
            <p className="text-2xl font-semibold text-gray-900">{systemStats.totalDoctors}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl font-semibold text-gray-900">{systemStats.totalPatients.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Pharmacists</p>
            <p className="text-2xl font-semibold text-gray-900">{systemStats.totalPharmacists}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 bg-red-100 rounded-lg mr-4">
            <Pill className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Antibiotic Prescriptions</p>
            <p className="text-2xl font-semibold text-gray-900">{systemStats.antibioticPrescriptions.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Resistance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center"><Activity className="mr-2" /> Recent System Activity</h3>
          <ul className="space-y-4">
            {recentActivity.slice(0, 5).map(activity => (
              <li key={activity.id} className="flex items-start">
                <div className={`p-2 rounded-full mr-3 mt-1 ${activity.type === 'alert' ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {activity.type === 'alert' ? <AlertTriangle className="h-5 w-5 text-red-600" /> : <FileText className="h-5 w-5 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center"><TrendingUp className="mr-2" /> Antibiotic Resistance Trends</h3>
          <ul className="space-y-3">
            {systemStats.resistanceTrends.map(trend => (
              <li key={trend.antibiotic}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{trend.antibiotic}</span>
                  <span className="text-sm font-medium">{trend.resistanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${trend.resistanceRate}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">User Management</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={() => openUserModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Users className="mr-2 h-4 w-4" /> Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.role === 'doctor' && u.department ? u.department : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.role === 'doctor' && u.designation ? u.designation : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(u.status)}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(u.lastLogin).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => openUserModal(u)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">User Roles Distribution</h3>
        <div className="h-80 bg-gray-100 flex items-center justify-center rounded">
          <BarChart3 className="text-gray-400" size={48} />
          <p className="text-gray-500 ml-4">Chart for user roles</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Prescription Trends</h3>
        <div className="h-80 bg-gray-100 flex items-center justify-center rounded">
          <TrendingUp className="text-gray-400" size={48} />
          <p className="text-gray-500 ml-4">Chart for prescription trends</p>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Generate Reports</h3>
      <div className="mb-6 p-4 border rounded-lg">
        <h4 className="font-semibold mb-2">Select Date Range</h4>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={reportDates.startDate}
              onChange={handleDateChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={reportDates.endDate}
              onChange={handleDateChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={generateUserActivityReport} className="bg-blue-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-600 flex items-center justify-center transition-colors">
          <FileText className="mr-2" /> User Activity Report
        </button>
        <button onClick={generateAntibioticUsageReport} className="bg-green-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-600 flex items-center justify-center transition-colors">
          <Pill className="mr-2" /> Antibiotic Usage Report
        </button>
        <button onClick={generateSystemAuditReport} className="bg-purple-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-600 flex items-center justify-center transition-colors">
          <Shield className="mr-2" /> System Audit Log
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'doctors': return <DoctorStatusManagement />;
      case 'analytics': return renderAnalytics();
      case 'reports': return renderReports();
      default: return <p>Select a tab</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-10">
        <div className="p-6">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full">
              <Shield className="h-8 w-8 text-gray-700" />
            </div>
            <div className="ml-4 overflow-hidden">
              <p className="font-semibold text-lg truncate">{admin?.name || 'Admin'}</p>
              <p className="text-sm text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <a href="#" onClick={() => setActiveTab('overview')} className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${activeTab === 'overview' && 'bg-gray-900'}`}>
            <BarChart3 className="h-5 w-5 mr-3" />
            Overview
          </a>
          <a href="#" onClick={() => setActiveTab('users')} className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${activeTab === 'users' && 'bg-gray-900'}`}>
            <Users className="h-5 w-5 mr-3" />
            User Management
          </a>
          <a href="#" onClick={() => setActiveTab('doctors')} className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${activeTab === 'doctors' && 'bg-gray-900'}`}>
            <Stethoscope className="h-5 w-5 mr-3" />
            Doctor Status
          </a>
          <a href="#" onClick={() => setActiveTab('analytics')} className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${activeTab === 'analytics' && 'bg-gray-900'}`}>
            <TrendingUp className="h-5 w-5 mr-3" />
            Analytics
          </a>
          <a href="#" onClick={() => setActiveTab('reports')} className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${activeTab === 'reports' && 'bg-gray-900'}`}>
            <FileText className="h-5 w-5 mr-3" />
            Reports
          </a>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="ml-64 p-8">
        <h2 className="text-3xl font-bold mb-6 capitalize">{activeTab.replace('-', ' ')}</h2>
        {renderContent()}
      </main>

      {/* User Modal */}
      {showUserModal && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

interface UserFormProps {
  user: SystemUser | null;
  onSave: (user: SystemUser) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<Partial<SystemUser>>(
    user || {
      name: '',
      email: '',
      role: 'doctor',
      status: 'active',
      password: '',
      department: '',
      designation: '',
    }
  );

  const departments = [
    'Cardiology', 'Radiology', 'Pathology', 'General Medicine', 'Pediatrics',
    'Orthopedics', 'Neurology', 'Dermatology', 'Ophthalmology', 'ENT (Ear, Nose & Throat)',
    'Gastroenterology', 'Nephrology', 'Pulmonology', 'Endocrinology', 'Oncology',
    'Gynecology & Obstetrics', 'Urology', 'Psychiatry', 'Anesthesiology', 'Emergency Medicine',
    'Surgery', 'Intensive Care Unit (ICU)', 'Physical Therapy', 'Hematology', 'Rheumatology',
    'Infectious Diseases', 'Clinical Laboratory', 'Nuclear Medicine', 'Plastic Surgery', 'Dental', 'Other'
  ];

  const designations = [
    'Intern',
    'Junior Resident',
    'Senior Resident',
    'Registrar',
    'Assistant Professor',
    'Associate Professor',
    'Professor',
    'Consultant',
    'Visiting Doctor',
    'Unit Head',
    'Medical Superintendent',
    'Chief Medical Officer',
    'Medical Director',
    'Clinical Fellow',
    'Research Fellow',
    'Honorary Consultant',
    'Specialist',
    'Senior Specialist',
    'Chief Specialist',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !formState.password) {
      alert('Password is required for new users.');
      return;
    }
    setIsLoading(true);
    try {
      await onSave({ ...user, ...formState } as SystemUser);
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold mb-6">{user ? 'Edit' : 'Add'} User</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="name" value={formState.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input name="email" type="email" value={formState.email} onChange={handleChange} placeholder="Email Address" className="w-full p-2 border rounded" required />
            </div>
            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input name="password" type="password" value={formState.password} onChange={handleChange} placeholder="Password (min 6 characters)" className="w-full p-2 border rounded" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select name="role" value={formState.role} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {/* Department and Designation fields for doctors */}
            {formState.role === 'doctor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select name="department" value={formState.department || ''} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation/Position</label>
                  <select name="designation" value={formState.designation || ''} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select Designation</option>
                    {designations.map((desig) => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Select the doctor's position in the medical college/hospital</p>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select name="status" value={formState.status} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;

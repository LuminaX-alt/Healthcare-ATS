import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X
} from 'lucide-react';
import api from '../api';
import { Doctor } from '../types';

const DoctorStatusManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'busy'>('all');
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    experience: '',
    consultationFee: '',
    rating: '',
    availability: { days: [] as string[], hours: '' }
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorStatus = async (doctorId: string, status: 'online' | 'offline' | 'busy') => {
    try {
      console.log('Updating doctor status:', { doctorId, status });
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You need to be logged in as an admin to update doctor status. Please login again.');
        window.location.href = '/';
        return;
      }
      
      const response = await api.put(`/doctors/${doctorId}/status`, {
        onlineStatus: status,
        isOnline: status === 'online'
      });
      
      console.log('Status update response:', response.data);
      
      setDoctors(prevDoctors =>
        prevDoctors.map(doc =>
          (doc.id === doctorId || doc._id === doctorId) ? { ...doc, ...response.data } : doc
        )
      );
      
      // Show success message
      alert(`✅ Doctor status updated to ${status.toUpperCase()} successfully!`);
    } catch (error: any) {
      console.error('Error updating doctor status:', error);
      
      // Detailed error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.msg || error.response.data?.message;
        
        if (status === 401) {
          alert('❌ Authentication failed! Please login as an admin.\n\nError: ' + message);
          window.location.href = '/';
        } else if (status === 403) {
          alert('❌ Access denied! This action requires admin privileges.\n\nError: ' + message);
        } else if (status === 404) {
          alert('❌ Doctor not found!\n\nError: ' + message);
        } else {
          alert('❌ Failed to update doctor status!\n\nError: ' + message);
        }
      } else if (error.request) {
        alert('❌ Cannot connect to server! Please ensure:\n\n1. Backend server is running on port 3001\n2. You have a stable internet connection');
      } else {
        alert('❌ An unexpected error occurred: ' + error.message);
      }
    }
  };

  const startEditing = (doctor: Doctor) => {
    setEditingDoctor(doctor.id);
    setEditForm({
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee?.toString() || '',
      rating: doctor.rating?.toString() || '4.5',
      availability: doctor.availability || { days: [], hours: '' }
    });
  };

  const saveProfile = async (doctorId: string) => {
    try {
      const response = await api.put(`/doctors/${doctorId}/profile`, {
        experience: editForm.experience,
        consultationFee: parseFloat(editForm.consultationFee) || 0,
        rating: parseFloat(editForm.rating) || 4.5,
        availability: editForm.availability
      });
      
      setDoctors(prevDoctors =>
        prevDoctors.map(doc =>
          doc.id === doctorId ? { ...doc, ...response.data } : doc
        )
      );
      
      setEditingDoctor(null);
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      alert('Failed to update doctor profile');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-300';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'busy': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'offline': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.onlineStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: doctors.length,
    online: doctors.filter(d => d.onlineStatus === 'online').length,
    offline: doctors.filter(d => d.onlineStatus === 'offline' || !d.onlineStatus).length,
    busy: doctors.filter(d => d.onlineStatus === 'busy').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctor Status Management</h2>
        <button
          onClick={fetchDoctors}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-3xl font-bold text-green-600">{stats.online}</p>
            </div>
            <UserCheck className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Busy</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.busy}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-3xl font-bold text-gray-600">{stats.offline}</p>
            </div>
            <UserX className="h-10 w-10 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'online' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilter('busy')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'busy' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Busy
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'offline' 
                ? 'bg-gray-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => {
          const doctorId = doctor._id || doctor.id;
          return (
          <div key={doctorId} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {editingDoctor === doctorId ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveProfile(doctorId)}
                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingDoctor(null)}
                      className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                      placeholder="e.g., 10 years"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
                    <input
                      type="number"
                      value={editForm.consultationFee}
                      onChange={(e) => setEditForm({...editForm, consultationFee: e.target.value})}
                      placeholder="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({...editForm, rating: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500">{doctor.department}</p>
                  </div>
                  <button
                    onClick={() => startEditing(doctor)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(doctor.onlineStatus)}`}>
                    {getStatusIcon(doctor.onlineStatus)}
                    <span className="text-sm font-medium capitalize">
                      {doctor.onlineStatus || 'offline'}
                    </span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {doctor.experience && (
                    <p>📅 Experience: {doctor.experience}</p>
                  )}
                  {doctor.consultationFee && (
                    <p>💰 Fee: ${doctor.consultationFee}</p>
                  )}
                  {doctor.rating && (
                    <p>⭐ Rating: {doctor.rating}/5</p>
                  )}
                  <p>📋 License: {doctor.licenseNumber}</p>
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateDoctorStatus(doctorId, 'online')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      doctor.onlineStatus === 'online'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => updateDoctorStatus(doctorId, 'busy')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      doctor.onlineStatus === 'busy'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    Busy
                  </button>
                  <button
                    onClick={() => updateDoctorStatus(doctorId, 'offline')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      doctor.onlineStatus === 'offline' || !doctor.onlineStatus
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Offline
                  </button>
                </div>

                {doctor.lastStatusUpdate && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Last updated: {new Date(doctor.lastStatusUpdate).toLocaleString()}
                  </p>
                )}
              </>
            )}
          </div>
        );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No doctors found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default DoctorStatusManagement;

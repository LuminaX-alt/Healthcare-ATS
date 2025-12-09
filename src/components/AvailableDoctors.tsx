import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  RefreshCw,
  Clock,
  DollarSign,
  Star,
  Calendar,
  MessageCircle,
  Video,
  Phone,
  CheckCircle,
  AlertCircle,
  XCircle,
  User
} from 'lucide-react';
import api from '../api';
import { Doctor } from '../types';
import VideoCallModal from './VideoCallModal';
import ChatModal from './ChatModal';

const AvailableDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'busy'>('online');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchDoctors();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDoctors, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, specialtyFilter, statusFilter]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.onlineStatus === statusFilter);
    } else {
      // Show online and busy doctors
      filtered = filtered.filter(doc =>
        doc.onlineStatus === 'online' || doc.onlineStatus === 'busy'
      );
    }

    // Specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(doc =>
        doc.specialty.toLowerCase() === specialtyFilter.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort: online first, then by rating
    filtered.sort((a, b) => {
      if (a.onlineStatus === 'online' && b.onlineStatus !== 'online') return -1;
      if (a.onlineStatus !== 'online' && b.onlineStatus === 'online') return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    setFilteredDoctors(filtered);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Available Now</span>
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Busy</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Offline</span>
          </span>
        );
    }
  };

  const getSpecialties = () => {
    const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
    return specialties.sort();
  };

  const handleContactDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowContactModal(true);
  };

  const handleVideoCall = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowVideoCall(true);
  };

  const handleVoiceCall = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowVoiceCall(true);
  };

  const handleChat = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowChat(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-3 text-gray-600">Loading available doctors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Available Doctors</h2>
          <p className="text-gray-600 mt-1">Find and connect with online doctors</p>
        </div>
        <button
          onClick={fetchDoctors}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Currently Available</p>
            <p className="text-4xl font-bold">
              {doctors.filter(d => d.onlineStatus === 'online').length} Doctors
            </p>
          </div>
          <UserCheck className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, specialty, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('online')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'online'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              <CheckCircle className="h-4 w-4 inline mr-1" />
              Available
            </button>
            <button
              onClick={() => setStatusFilter('busy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'busy'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Busy
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              All Active
            </button>
          </div>

          {/* Specialty Filter */}
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Specialties</option>
            {getSpecialties().map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4 ${doctor.onlineStatus === 'online'
                ? 'border-green-500'
                : doctor.onlineStatus === 'busy'
                  ? 'border-yellow-500'
                  : 'border-gray-300'
              }`}
          >
            {/* Doctor Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${doctor.onlineStatus === 'online' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                  <User className={`h-8 w-8 ${doctor.onlineStatus === 'online' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
              {getStatusBadge(doctor.onlineStatus)}
            </div>

            {/* Doctor Info */}
            <div className="space-y-2 mb-4">
              {doctor.department && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{doctor.department}</span>
                </div>
              )}

              {doctor.experience && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{doctor.experience} experience</span>
                </div>
              )}

              {doctor.consultationFee && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span>${doctor.consultationFee} consultation fee</span>
                </div>
              )}

              {doctor.rating && (
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{doctor.rating}</span>
                  <span className="text-gray-500 ml-1">/5.0</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {doctor.onlineStatus === 'online' ? (
                <>
                  <button
                    onClick={() => handleChat(doctor)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Now
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVideoCall(doctor)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1 text-sm transition-colors"
                    >
                      <Video className="h-4 w-4" />
                      Video Call
                    </button>
                    <button
                      onClick={() => handleVoiceCall(doctor)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1 text-sm transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Voice Call
                    </button>
                  </div>
                </>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Currently Busy
                </button>
              )}
            </div>

            {/* Last Update */}
            {doctor.lastStatusUpdate && (
              <p className="text-xs text-gray-400 mt-3 text-center">
                Updated {new Date(doctor.lastStatusUpdate).toLocaleTimeString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <UserCheck className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Doctors Available</h3>
          <p className="text-gray-500 mb-4">
            {statusFilter === 'online'
              ? 'No doctors are currently online. Try checking back later.'
              : 'No doctors match your search criteria.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSpecialtyFilter('all');
              setStatusFilter('all');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Contact Dr. {selectedDoctor.name}</h3>
                <p className="text-gray-600">{selectedDoctor.specialty}</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-2">Choose your consultation method:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      handleChat(selectedDoctor);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-3"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">Start Chat Consultation</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      handleVideoCall(selectedDoctor);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 flex items-center gap-3"
                  >
                    <Video className="h-5 w-5" />
                    <span className="font-medium">Video Call Consultation</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      handleVoiceCall(selectedDoctor);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center gap-3"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">Voice Call Consultation</span>
                  </button>
                </div>
              </div>

              {selectedDoctor.consultationFee && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedDoctor.consultationFee}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && selectedDoctor && (
        <VideoCallModal
          isOpen={showVideoCall}
          onClose={() => setShowVideoCall(false)}
          doctorName={selectedDoctor.name}
          callType="video"
        />
      )}

      {/* Voice Call Modal */}
      {showVoiceCall && selectedDoctor && (
        <VideoCallModal
          isOpen={showVoiceCall}
          onClose={() => setShowVoiceCall(false)}
          doctorName={selectedDoctor.name}
          callType="audio"
        />
      )}

      {/* Chat Modal */}
      {showChat && selectedDoctor && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          doctorId={selectedDoctor.id}
          doctorName={selectedDoctor.name}
        />
      )}
    </div>
  );
};

export default AvailableDoctors;

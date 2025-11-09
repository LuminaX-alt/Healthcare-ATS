import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DemoNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithoutAuth } = useAuth();

  const handleDemoLogin = async (role: string) => {
    const demoUsers = {
      doctor: {
        id: 'demo-doctor',
        name: 'Dr. John Smith',
        email: 'testdoctor@example.com',
        role: 'doctor' as const,
        licenseNumber: 'DOC123456',
        specialty: 'General Practice',
        phoneNumber: '+1234567890',
      },
      patient: {
        id: 'demo-patient',
        name: 'Jane Doe',
        email: 'testpatient@example.com',
        role: 'patient' as const,
        phoneNumber: '+1234567890',
        medicalHistory: [],
        allergies: [],
        profileComplete: true,
        cart: [],
        timeline: [],
      },
      pharmacist: {
        id: 'demo-pharmacist',
        name: 'Mark Wilson',
        email: 'testpharmacist@example.com',
        role: 'pharmacist' as const,
        licenseNumber: 'PHARM789012',
        pharmacyName: 'HealthCare Pharmacy',
        phoneNumber: '+1234567891',
      },
      admin: {
        id: 'demo-admin',
        name: 'Admin User',
        email: 'testadmin@example.com',
        role: 'admin',
      },
    };

    try {
      const user = demoUsers[role as keyof typeof demoUsers];
      await loginWithoutAuth(user);
      
      switch (role) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        case 'pharmacist':
          navigate('/pharmacist/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
      }
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Healthcare Management System Demo
          </h1>
          <p className="text-lg text-gray-600">
            Select a role to explore the system's features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Doctor Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Portal</h3>
              <p className="text-gray-600 mb-4">
                Manage patients, write prescriptions, and view medical histories
              </p>
              <button
                onClick={() => handleDemoLogin('doctor')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Access Doctor Dashboard
              </button>
            </div>
          </div>

          {/* Patient Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Portal</h3>
              <p className="text-gray-600 mb-4">
                View prescriptions, book appointments, and access medical records
              </p>
              <button
                onClick={() => handleDemoLogin('patient')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Access Patient Dashboard
              </button>
            </div>
          </div>

          {/* Pharmacist Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pharmacy Portal</h3>
              <p className="text-gray-600 mb-4">
                Manage medications, process prescriptions, and track inventory
              </p>
              <button
                onClick={() => handleDemoLogin('pharmacist')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Access Pharmacy Dashboard
              </button>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Portal</h3>
              <p className="text-gray-600 mb-4">
                System management, user administration, and analytics
              </p>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Access Admin Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This is a demo version for presentation purposes. All features are functional but using demo data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoNavigation;

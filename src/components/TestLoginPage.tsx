import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TestLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithoutAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const testAccounts = {
    doctor: {
      id: 'demo-doctor-1',
      name: 'Dr. John Smith',
      email: 'doctor@test.com',
      role: 'doctor',
      licenseNumber: 'DOC123456',
      specialty: 'General Practice',
      phoneNumber: '+1234567890'
    },
    pharmacist: {
      id: 'demo-pharmacist-1',
      name: 'Mark Wilson',
      email: 'pharmacist@test.com',
      role: 'pharmacist',
      licenseNumber: 'PHARM789012',
      pharmacyName: 'HealthCare Pharmacy',
      phoneNumber: '+1234567891'
    },
    admin: {
      id: 'demo-admin-1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      phoneNumber: '+1234567892'
    }
  };

  const handleTestLogin = async (role: 'doctor' | 'pharmacist' | 'admin') => {
    setLoading(true);
    try {
      const user = testAccounts[role];
      await loginWithoutAuth(user);
      
      // Navigate to appropriate dashboard
      switch (role) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'pharmacist':
          navigate('/pharmacist/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
      }
    } catch (error) {
      console.error('Test login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Test Login Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select a role to access the respective dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {/* Doctor Login Button */}
            <div>
              <button
                onClick={() => handleTestLogin('doctor')}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Login as Doctor (Dr. John Smith)
              </button>
              <p className="mt-1 text-xs text-gray-500 text-center">
                Email: doctor@test.com
              </p>
            </div>

            {/* Pharmacist Login Button */}
            <div>
              <button
                onClick={() => handleTestLogin('pharmacist')}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Login as Pharmacist (Mark Wilson)
              </button>
              <p className="mt-1 text-xs text-gray-500 text-center">
                Email: pharmacist@test.com
              </p>
            </div>

            {/* Admin Login Button */}
            <div>
              <button
                onClick={() => handleTestLogin('admin')}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Login as Admin
              </button>
              <p className="mt-1 text-xs text-gray-500 text-center">
                Email: admin@test.com
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              This is a test login page for demonstration purposes.
              <br />
              All features will be fully functional with test data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage;

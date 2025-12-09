 import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Activity, FileText, MessageCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="LuminaX Logo" 
              className="h-20 w-20 mr-4 object-contain rounded-lg" 
            />
            <h1 className="text-4xl font-bold text-gray-800">
              LuminaX-alt
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced Antibiotic Tracking & Healthcare Management System - 
            Comprehensive platform for tracking prescriptions, managing patient care, and ensuring responsible medication usage.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Antibiotic Tracking</h3>
            <p className="text-gray-600">
              Monitor and track antibiotic prescriptions to prevent resistance and ensure proper usage.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-User Platform</h3>
            <p className="text-gray-600">
              Separate dashboards for doctors, patients, pharmacists, and administrators.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Activity className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Get insights into prescription patterns and antibiotic resistance trends.
            </p>
          </div>
        </div>

        {/* Video Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-3">
                See LuminaX-alt in Action
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Watch how our platform streamlines healthcare management and antibiotic tracking
              </p>
              
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                <video 
                  controls 
                  className="w-full h-auto"
                  preload="auto"
                  style={{ maxHeight: '500px' }}
                >
                  <source src={`${process.env.PUBLIC_URL}/demo-video.mp4`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Multi-Portal Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Portal</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/login/doctor"
              className="bg-white rounded-lg shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-primary-600 mb-2">Doctor Portal</h3>
              <p className="text-gray-600">
                Manage patients and prescriptions
              </p>
            </Link>

            <Link
              to="/login/patient"
              className="bg-white rounded-lg shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-primary-600 mb-2">Patient Portal</h3>
              <p className="text-gray-600">
                Access your medical records
              </p>
            </Link>

            <Link
              to="/login/pharmacist"
              className="bg-white rounded-lg shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-primary-600 mb-2">Pharmacy Portal</h3>
              <p className="text-gray-600">
                Process prescriptions
              </p>
            </Link>

            <Link
              to="/login/admin"
              className="bg-white rounded-lg shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-primary-600 mb-2">Admin Portal</h3>
              <p className="text-gray-600">
                System administration
              </p>
            </Link>

            <Link
              to="/login/reports"
              className="bg-white rounded-lg shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-600 mb-2">Reports & Investigation</h3>
              <p className="text-gray-600">
                Medical reports and lab results
              </p>
            </Link>

            <Link
              to="/customer-support"
              className="bg-white rounded-lg shadow-lg p-6 text-center transition duration-300 hover:shadow-xl hover:transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-600 mb-2">Customer Support</h3>
              <p className="text-gray-600">
                24/7 help and assistance
              </p>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">New patient? Register here</p>
            <Link
              to="/register/patient"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-700 transition duration-300"
            >
              Create Patient Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

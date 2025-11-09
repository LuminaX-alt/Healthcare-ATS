import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import PatientLogin from './PatientLogin';

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const getDemoCredentials = () => {
    switch (role) {
      case 'doctor':
        return { email: 'doctor@hospital.com', password: 'doctor123' };
      case 'admin':
        return { email: 'admin@hospital.com', password: 'admin123' };
      case 'pharmacist':
        return { email: 'pharmacist@hospital.com', password: 'pharmacy123' };
      case 'patient':
        return { email: 'patient@demo.com', password: 'patient123' };
      case 'reports':
        return { email: 'reports@hospital.com', password: 'reports123' };
      default:
        return { email: 'doctor@hospital.com', password: 'doctor123' };
    }
  };

  const fillDemoCredentials = () => {
    const demoCredentials = getDemoCredentials();
    setFormData(demoCredentials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(formData.email, formData.password, role || 'doctor');
      if (success) {
        // Navigate to appropriate dashboard
        switch (role) {
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'pharmacist':
            navigate('/pharmacist/dashboard');
            break;
          case 'patient':
            navigate('/patient/dashboard');
            break;
          case 'reports':
            navigate('/reports/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'doctor':
        return {
          title: 'Doctor Login',
          color: 'blue',
          icon: '👨‍⚕️'
        };
      case 'admin':
        return {
          title: 'Administrator Login',
          color: 'red',
          icon: '🔧'
        };
      case 'pharmacist':
        return {
          title: 'Pharmacist Login',
          color: 'purple',
          icon: '💊'
        };
      case 'patient':
        return {
          title: 'Patient Login',
          color: 'green',
          icon: '😊'
        };
      case 'reports':
        return {
          title: 'Reports & Investigation Login',
          color: 'indigo',
          icon: '📋'
        };
      default:
        return {
          title: 'Login',
          color: 'blue',
          icon: '👤'
        };
    }
  };

  const config = getRoleConfig();

  if (role === 'patient') {
    return <PatientLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{config.icon}</div>
            <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your {role} account
              </h2>
              {role === 'patient' && (
                <p className="mt-2 text-center text-sm text-gray-600">
                  Or{' '}
                  <button onClick={() => navigate('/register/patient')} className="font-medium text-indigo-600 hover:text-indigo-500">
                    create a new patient account
                  </button>
                </p>
              )}
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Logging in...' : 'Sign in'}
              </button>

              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Use Demo Credentials
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

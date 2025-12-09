import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Key, Mail, Lock } from 'lucide-react';

const PatientLogin: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginWithOTP, sendOTP, login, isLoading } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await sendOTP(phoneNumber);
      if (success) {
        setOtpSent(true);
        alert('An OTP has been sent to your phone (check console for mock OTP).');
      } else {
        setError('Failed to send OTP. Please check the phone number and try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error(err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login(email, password, 'patient');
      if (success) {
        navigate('/patient/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await loginWithOTP(phoneNumber, otp);
      if (success) {
        navigate('/patient/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Patient Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login using email/password or phone number with OTP
          </p>
        </div>
        
        {/* Login Method Toggle */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setOtpSent(false);
              setError('');
            }}
            className={`px-4 py-2 rounded-md ${
              loginMethod === 'email'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Email/Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('otp');
              setOtpSent(false);
              setError('');
            }}
            className={`px-4 py-2 rounded-md ${
              loginMethod === 'otp'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            OTP Login
          </button>
        </div>

        {/* Demo Credentials Info */}
        {loginMethod === 'email' && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
            <p className="font-semibold text-blue-800 mb-2">Demo Credentials:</p>
            <p className="text-blue-700">Email: patient@hospital.com</p>
            <p className="text-blue-700">Password: patient123</p>
          </div>
        )}

        {/* Email/Password Login Form */}
        {loginMethod === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* OTP Login Form */}
        {loginMethod === 'otp' && !otpSent && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}
        
        {loginMethod === 'otp' && otpSent && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        )}
        <div className="text-sm text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register/patient" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
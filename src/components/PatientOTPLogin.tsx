import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PatientOTPLogin: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { registerPatient } = useAuth();

  const { name, email, phoneNumber } = location.state || {};

  useEffect(() => {
    if (!name || !email || !phoneNumber) {
      // If registration data is not available, redirect to registration page
      navigate('/register/patient');
    } else {
      // In a real app, the OTP would be sent by the backend.
      // For this prototype, we'll generate a mock OTP.
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(generatedOtp);
      alert(`Your OTP is: ${generatedOtp}`);
    }
  }, [name, email, phoneNumber, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp === mockOtp) {
      try {
        // The password is the same as the phone number in this OTP-based flow
        await registerPatient(name, email, phoneNumber, phoneNumber);
        alert('Registration successful! You are now logged in.');
        navigate('/patient/dashboard');
      } catch (err) {
        setError('Failed to complete registration. Please try again.');
        console.error(err);
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your Phone Number
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            An OTP has been sent to {phoneNumber}.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify & Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientOTPLogin;

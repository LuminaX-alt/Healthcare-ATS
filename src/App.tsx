import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import PatientOTPLogin from './components/PatientOTPLogin';
import PatientProfile from './components/PatientProfile';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import PharmacistDashboard from './components/PharmacistDashboard';
import PatientDashboard from './components/PatientDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PatientRegistration from './components/PatientRegistration';
import LogoutTest from './components/LogoutTest';
import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/register/patient" element={<PatientRegistration />} />
            <Route path="/verify-otp" element={<PatientOTPLogin />} />
            <Route path="/logout-test" element={<LogoutTest />} />
            <Route path="/patient/dashboard" element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/pharmacist/dashboard" element={
              <ProtectedRoute role="pharmacist">
                <PharmacistDashboard />
              </ProtectedRoute>
            } />
            <Route path="/reports/dashboard" element={
              <ProtectedRoute role="reports">
                <ReportsDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
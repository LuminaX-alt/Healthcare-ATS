import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated || !user || user.role !== role) {
    return <Navigate to={`/login/${role}`} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

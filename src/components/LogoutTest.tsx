import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle } from 'lucide-react';

const LogoutTest: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Test logout button clicked');
    logout();
  };

  const handleManualLogout = () => {
    console.log('Manual logout initiated');
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Logout Test Page</h1>
        
        {/* Current Auth State */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>User ID:</strong> {user?.id || 'None'}</p>
            <p><strong>User Email:</strong> {user?.email || 'None'}</p>
            <p><strong>User Role:</strong> {user?.role || 'None'}</p>
          </div>
        </div>

        {/* LocalStorage State */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage State</h2>
          <div className="space-y-2 text-sm">
            <p><strong>authToken:</strong> {localStorage.getItem('authToken') ? '✅ Present' : '❌ Empty'}</p>
            <p><strong>user:</strong> {localStorage.getItem('user') ? '✅ Present' : '❌ Empty'}</p>
            <p><strong>userProfile:</strong> {localStorage.getItem('userProfile') ? '✅ Present' : '❌ Empty'}</p>
          </div>
        </div>

        {/* Logout Methods */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Logout Methods</h2>
          
          <div className="space-y-4">
            {/* Method 1: Context Logout */}
            <div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Method 1: Context Logout (Normal)
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Uses the logout function from AuthContext. Should redirect to home page.
              </p>
            </div>

            {/* Method 2: Manual Logout */}
            <div>
              <button
                onClick={handleManualLogout}
                className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Method 2: Manual Logout (Force)
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Directly clears localStorage and redirects. Use if Method 1 fails.
              </p>
            </div>

            {/* Method 3: Navigate Home */}
            <div>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Method 3: Just Go Home
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Navigate to home without logout (data remains).
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
            <li>Open browser DevTools (F12) and check Console tab</li>
            <li>Try Method 1 first (normal logout)</li>
            <li>Check console for logout messages</li>
            <li>If Method 1 fails, try Method 2 (force logout)</li>
            <li>After logout, verify you cannot access dashboards</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LogoutTest;

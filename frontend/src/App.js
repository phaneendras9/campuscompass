import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import UserProfile from './pages/profile/UserProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/dashboard/DashboardPage'; // 
import RentalsPage from './pages/rentals/RentalsPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TransportPage from './pages/transport/TransportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      {/* ✅ Protected Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* ✅ NEW: Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        
      />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
       />
      <Route
       path="/rentals"
       element={
         <ProtectedRoute>
             <RentalsPage />
          </ProtectedRoute>
        }
      />
      <Route
       path="/transport"
       element={
         <ProtectedRoute>
             <TransportPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

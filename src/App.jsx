import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import Drives from './pages/Drives';
import Profile from './pages/Profile';
import CreateDonation from './pages/CreateDonation';
import CreateRequest from './pages/CreateRequest';

// ⭐ ADD THESE IMPORTS
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import Reports from './pages/Reports';
import SystemOverview from './pages/SystemOverview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">

          <Navbar />

          <main>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/drives" element={<Drives />} />

              {/* USER PROTECTED ROUTES */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/create-donation" element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <CreateDonation />
                </ProtectedRoute>
              } />

              <Route path="/create-request" element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <CreateRequest />
                </ProtectedRoute>
              } />

              {/* ⭐ ADMIN ROUTES - REQUIRED */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              } />

              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              } />

              <Route path="/admin/system" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemOverview />
                </ProtectedRoute>
              } />

            </Routes>
          </main>

          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

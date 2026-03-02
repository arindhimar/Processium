import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './features/auth/LoginPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes - add your dashboard here */}
          <Route path="/dashboard" element={<div>Dashboard (create this page)</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
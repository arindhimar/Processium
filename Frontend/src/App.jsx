import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './features/auth/LoginPage';
import TemplateDashboard from './features/templates/TemplateDashboard';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<TemplateDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
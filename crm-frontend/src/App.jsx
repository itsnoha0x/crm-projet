// Application principale - Configuration du routage
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import LoyaltyCards from './pages/LoyaltyCards';
import Points from './pages/Points';
import Benefits from './pages/Benefits';
import CustomerDashboard from './pages/CustomerDashboard';
import { useToast } from './hooks/useToast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function HomeRedirector({ addToast }) {
  const { hasRole, customer } = useAuth();
  
  if (hasRole(['ADMIN', 'STAFF'])) {
    return <Dashboard addToast={addToast} />;
  }
  
  if (hasRole(['USER']) && customer) {
    return <Navigate to={`/dashboard/${customer.id}`} replace />;
  }
  
  // If user is USER but no customer found (shouldn't happen with test data)
  return <Dashboard addToast={addToast} />;
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomeRedirector addToast={addToast} />} />
            <Route path="/customers" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                <Customers addToast={addToast} />
              </ProtectedRoute>
            } />
            <Route path="/loyalty" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                <LoyaltyCards addToast={addToast} />
              </ProtectedRoute>
            } />
            <Route path="/points" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                <Points addToast={addToast} />
              </ProtectedRoute>
            } />
            <Route path="/benefits" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                <Benefits addToast={addToast} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/:customerId" element={<CustomerDashboard addToast={addToast} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </BrowserRouter>
  );
}

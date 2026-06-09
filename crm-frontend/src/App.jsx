// Application principale - Configuration du routage
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard addToast={addToast} />} />
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
            <Route path="*" element={<Dashboard addToast={addToast} />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </BrowserRouter>
  );
}

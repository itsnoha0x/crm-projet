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

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard addToast={addToast} />} />
            <Route path="/customers" element={<Customers addToast={addToast} />} />
            <Route path="/loyalty" element={<LoyaltyCards addToast={addToast} />} />
            <Route path="/points" element={<Points addToast={addToast} />} />
            <Route path="/benefits" element={<Benefits addToast={addToast} />} />
            <Route path="/dashboard/:customerId" element={<CustomerDashboard addToast={addToast} />} />
            <Route path="*" element={<Dashboard addToast={addToast} />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </BrowserRouter>
  );
}

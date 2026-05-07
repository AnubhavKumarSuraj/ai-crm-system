import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import BusinessDemo from './pages/BusinessDemo';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Campaigns from './pages/Campaigns';
import Messages from './pages/Messages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/business/demo-gym" element={<BusinessDemo />} />
        
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* Fallback for existing links */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
        <Route path="/campaigns" element={<Navigate to="/app/campaigns" replace />} />
        <Route path="/messages" element={<Navigate to="/app/messages" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
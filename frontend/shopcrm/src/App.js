import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Campaigns from './pages/Campaigns';
import Messages from './pages/Messages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="campaigns"
            element={<Campaigns />}
          />

          <Route
            path="messages"
            element={<Messages />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
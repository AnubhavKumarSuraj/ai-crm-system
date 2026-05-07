import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ToastContainer from './Toast';
import { useToast } from '../hooks/useToast';
import {
  getCampaigns,
  getCustomers,
  USE_DUMMY_DATA,
} from '../services/api';
import * as api from '../services/api';
import { daysSince } from '../utils/helpers';
import { DUMMY_CAMPAIGNS } from '../utils/dummyData';

export const AppContext = createContext({
  customers: [],
  setCustomers: () => {},
  campaigns: [],
  setCampaigns: () => {},
  logs: [],
  addLog: () => {},
  showToast: () => {},
});

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    console.error("useApp() used outside AppContext");
    return {
      customers: [],
      setCustomers: () => {},
      campaigns: [],
      setCampaigns: () => {},
      logs: [],
      addLog: () => {},
      showToast: () => {},
    };
  }

  return context;
};

const PAGE_TITLES = {
  '/app/dashboard': 'Dashboard',
  '/app/customers': 'Customers',
  '/app/campaigns': 'Campaigns',
  '/app/messages': 'Messages',
};

const normalizeCampaign = (campaign) => ({
  ...campaign,
  created: campaign.created_at || campaign.created,
});

export default function Layout() {
  console.log("Layout rendering");
  const location = useLocation();
  const { toasts, showToast, removeToast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [campaigns, setCampaigns] = useState(
    USE_DUMMY_DATA ? DUMMY_CAMPAIGNS : []
  );
  const [logs, setLogs] = useState([]);
  const [loadingRecover, setLoadingRecover] = useState(false);

  const active = customers.filter((c) => daysSince(c.last_visit) <= 30).length;
  const inactive = customers.length - active;

  const handleRecoverInactive = async () => {
    setLoadingRecover(true);
    try {
      const res = await api.runInactiveRecovery();
      const processed = res.processed ?? 0;
      const message = res.message || `${processed} inactive customers processed`;
      showToast(message, 'success');
      addLog('Recovery Automation', message, 'success');
    } catch (err) {
      showToast('Failed to run recovery automation', 'danger');
    } finally {
      setLoadingRecover(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const customerRes = await getCustomers();
        setCustomers(Array.isArray(customerRes?.data) ? customerRes.data : []);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        showToast('Backend not connected. Using empty data.', 'error');
      }

      if (USE_DUMMY_DATA) {
        setCampaigns(DUMMY_CAMPAIGNS);
        return;
      }

      try {
        const campaignRes = await getCampaigns();
        setCampaigns(
          Array.isArray(campaignRes?.data)
            ? campaignRes.data.map(normalizeCampaign)
            : []
        );
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        showToast('Failed to load campaigns from backend.', 'error');
      }
    };

    loadInitialData();
  }, [showToast]);

  const addLog = (event, details, status = 'success') => {
    setLogs((prev) => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), event, details, status },
      ...prev,
    ]);
  };

  const pageTitle = PAGE_TITLES[location.pathname] || 'ShopCRM';

  return (
    <AppContext.Provider
      value={{
        customers,
        setCustomers,
        campaigns,
        setCampaigns,
        logs,
        addLog,
        showToast,
      }}
    >
      <div className="flex min-h-screen">
        <Navbar />

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
            {/* Left: Title */}
            <div className="flex-1 hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-800 tracking-tight">{pageTitle}</h1>
            </div>
            
            {/* Center: Search */}
            <div className="flex-1 flex justify-center mx-6 max-w-xl w-full">
              <div className="relative w-full group cursor-pointer">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search customers, campaigns..." 
                  className="w-full bg-white border border-gray-200 shadow-sm rounded-xl pl-10 pr-14 py-2.5 text-sm focus:outline-none focus:shadow-md focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/20 hover:shadow hover:border-gray-300 transition-all cursor-text text-gray-700 placeholder:text-gray-400"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">⌘K</span>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <button
                className="hidden lg:flex px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm hover:shadow hover:scale-[1.02] active:scale-95 transition-all duration-200 rounded-md border-0 text-xs font-medium items-center"
                onClick={handleRecoverInactive}
                disabled={loadingRecover || inactive === 0}
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {loadingRecover ? 'Recovering...' : 'Recover'}
              </button>

              <div className="w-px h-5 bg-gray-200 hidden sm:block mx-1"></div>
              
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </button>
              
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-500/20 hover:border-transparent transition-all shadow-sm">
                <span className="text-xs font-bold text-indigo-700">AK</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-7">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer toasts={toasts || []} removeToast={removeToast} />
    </AppContext.Provider>
  );
}

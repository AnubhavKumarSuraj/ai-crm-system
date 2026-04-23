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
import { DUMMY_CAMPAIGNS } from '../utils/dummyData';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/campaigns': 'Campaigns',
  '/messages': 'Messages',
};

const normalizeCampaign = (campaign) => ({
  ...campaign,
  created: campaign.created_at || campaign.created,
});

export default function Layout() {
  const location = useLocation();
  const { toasts, showToast, removeToast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [campaigns, setCampaigns] = useState(
    USE_DUMMY_DATA ? DUMMY_CAMPAIGNS : []
  );
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const customerRes = await getCustomers();
        setCustomers(customerRes.data);
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
        setCampaigns(campaignRes.data.map(normalizeCampaign));
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
          <header className="flex items-center justify-between px-7 h-[52px] bg-surface border-b border-[var(--border)] flex-shrink-0">
            <span className="text-sm font-semibold text-[var(--text)]">
              {pageTitle}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] px-2 py-0.5 rounded"
                style={{
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                API Mode
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-7">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AppContext.Provider>
  );
}

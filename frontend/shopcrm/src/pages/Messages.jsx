import { useEffect, useState } from 'react';
import * as api from '../services/api';
import SourceBadge from '../components/SourceBadge';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await api.getMessages();
      setMessages(res?.data || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusVariant = {
    sent: 'success',
    pending: 'warn',
    failed: 'danger',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages Log</h1>
          <p className="text-sm mt-1 text-gray-500 font-medium">
            {(Array.isArray(messages) ? messages : []).length} total messages processed
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader title="Message Delivery History" className="bg-gray-50/30 px-6 py-4 border-b border-gray-100" />
        
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (!Array.isArray(messages) || messages.length === 0) ? (
          <div className="text-center py-16 text-sm text-gray-500 bg-gray-50/30">
            <div className="flex flex-col items-center justify-center space-y-3">
               <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
               <span>No messages found.</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Type</th>
                  <th className="px-6 py-4 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Customer</th>
                  <th className="px-6 py-4 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Campaign</th>
                  <th className="px-6 py-4 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Message</th>
                  <th className="px-6 py-4 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-center">Status</th>
                  <th className="px-6 py-4 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {(Array.isArray(messages) ? messages : []).map((msg) => (
                  <tr key={msg?.id || Math.random()} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <SourceBadge label={msg?.source_label} />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap">{msg?.customer_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{msg?.campaign_name || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-1 max-w-xs" title={msg?.message}>
                        {msg?.message}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge variant={statusVariant[msg?.status?.toLowerCase()] || 'neutral'}>
                        {msg?.status || 'Unknown'}
                      </Badge>
                      {msg?.status === 'failed' && msg?.error_message && (
                        <div className="text-[10px] text-red-500 mt-1 max-w-[120px] truncate" title={msg.error_message}>
                          {msg.error_message}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(msg?.sent_at || msg?.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

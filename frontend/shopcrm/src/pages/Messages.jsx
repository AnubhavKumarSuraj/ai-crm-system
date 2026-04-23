import { useEffect, useState } from 'react';
import * as api from '../services/api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await api.getMessages();
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const badgeStyle = (status) => {
    if (status === 'sent')
      return {
        background: '#dcfce7',
        color: '#166534',
      };

    if (status === 'pending')
      return {
        background: '#fef3c7',
        color: '#92400e',
      };

    return {
      background: '#e5e7eb',
      color: '#374151',
    };
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Messages</h1>
          <p>{messages.length} total messages</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 20 }}>Loading...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: 20 }}>No messages found.</div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Campaign</th>
                <th>Message</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.customer_name || '-'}</td>
                  <td>{msg.campaign_name || '-'}</td>
                  <td style={{ maxWidth: 320 }}>
                    <div
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msg.message}
                    </div>
                  </td>

                  <td>{msg.channel}</td>

                  <td>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        ...badgeStyle(msg.status),
                      }}
                    >
                      {msg.status}
                    </span>
                  </td>

                  <td>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const CATEGORY_LABELS = {
  missed_delivery: 'Missed Delivery',
  product_complaint: 'Product Complaint',
  refund_request: 'Refund Request',
  other: 'Other',
};

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

const statusColor = {
  open: 'bg-blue-50 text-blue-600',
  in_progress: 'bg-yellow-50 text-yellow-600',
  resolved: 'bg-green-50 text-green-600',
  closed: 'bg-gray-100 text-gray-500',
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyDrafts, setReplyDrafts] = useState({}); // { ticketId: draftText }
  const [savingId, setSavingId] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/tickets');
      setTickets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplyChange = (ticketId, value) => {
    setReplyDrafts({ ...replyDrafts, [ticketId]: value });
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await axiosInstance.put(`/tickets/${ticketId}`, { status });
      toast.success('Status updated');
      fetchTickets();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const submitReply = async (ticketId) => {
    const adminReply = replyDrafts[ticketId];
    if (!adminReply?.trim()) {
      toast.error('Write a reply first');
      return;
    }

    setSavingId(ticketId);
    try {
      await axiosInstance.put(`/tickets/${ticketId}`, {
        adminReply,
        status: 'resolved',
      });
      toast.success('Reply sent');
      setReplyDrafts({ ...replyDrafts, [ticketId]: '' });
      fetchTickets();
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSavingId(null);
    }
  };

  const filteredTickets = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Support Tickets</h1>

      <div className="flex gap-2 mb-4">
        {['all', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-gray-400">No tickets found.</p>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div key={t._id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{t.subject}</p>
                  <p className="text-xs text-gray-400">
                    {t.customer?.name} · {t.customer?.phone} · {CATEGORY_LABELS[t.category]}
                  </p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t._id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full capitalize border-none font-medium ${statusColor[t.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-600 mt-2 mb-3">{t.description}</p>

              {t.adminReply && (
                <div className="bg-blue-50 rounded-lg p-2 text-sm text-blue-700 mb-3">
                  <span className="font-medium">Your reply: </span>
                  {t.adminReply}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  placeholder={t.adminReply ? 'Send an updated reply...' : 'Type a reply...'}
                  value={replyDrafts[t._id] || ''}
                  onChange={(e) => handleReplyChange(t._id, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => submitReply(t._id)}
                  disabled={savingId === t._id}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50"
                >
                  {savingId === t._id ? 'Sending...' : 'Reply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
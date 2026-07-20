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
  open: 'bg-blue-50 border-blue-100 text-blue-600',
  in_progress: 'bg-yellow-50 border-yellow-100 text-yellow-600',
  resolved: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  closed: 'bg-slate-100 border-slate-200 text-slate-500',
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
      if (Array.isArray(res.data)) {
        setTickets(res.data);
      } else {
        console.error('Expected array, got:', res.data);
        setTickets([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch tickets');
      setTickets([]);
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

  // Ensure tickets is treated as an array before filtering
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const filteredTickets = filter === 'all' ? safeTickets : safeTickets.filter((t) => t?.status === filter);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Support Tickets</h1>
        <div className="flex gap-2">
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${
                filter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/80 backdrop-blur text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[28px] p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-600">No tickets found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((t) => (
            <div key={t._id} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-5 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-800 text-base">{t.subject}</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">
                    <span className="text-slate-700">{t.customer?.name}</span> <span className="text-slate-300 mx-1">|</span> {t.customer?.phone} <span className="text-slate-300 mx-1">|</span> {CATEGORY_LABELS[t.category]}
                  </p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t._id, e.target.value)}
                  className={`text-xs px-3 py-1 rounded-full capitalize font-semibold border ${statusColor[t.status]} outline-none cursor-pointer`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50/50 rounded-xl p-4 my-4">
                <p className="text-sm text-slate-700 leading-relaxed">{t.description}</p>
              </div>

              {t.adminReply && (
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-4 shadow-inner">
                  <span className="font-semibold block mb-1">Your reply: </span>
                  {t.adminReply}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  placeholder={t.adminReply ? 'Send an updated reply...' : 'Type a reply...'}
                  value={replyDrafts[t._id] || ''}
                  onChange={(e) => handleReplyChange(t._id, e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={() => submitReply(t._id)}
                  disabled={savingId === t._id}
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2.5 rounded-2xl font-semibold disabled:opacity-50"
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
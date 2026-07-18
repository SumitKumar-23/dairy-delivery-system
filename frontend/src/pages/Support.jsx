import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { value: 'missed_delivery', label: 'Missed Delivery' },
  { value: 'product_complaint', label: 'Product Complaint' },
  { value: 'refund_request', label: 'Refund Request' },
  { value: 'other', label: 'Other' },
];

const statusColor = {
  open: 'bg-blue-50 text-blue-600',
  in_progress: 'bg-yellow-50 text-yellow-600',
  resolved: 'bg-green-50 text-green-600',
  closed: 'bg-gray-100 text-gray-500',
};

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: 'other', subject: '', description: '' });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/tickets/my-tickets');
      setTickets(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/tickets', form);
      toast.success('Ticket raised — we\'ll get back to you soon');
      setForm({ category: 'other', subject: '', description: '' });
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      toast.error('Failed to raise ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Support</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            {showForm ? 'Cancel' : '+ Raise Ticket'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 shadow-sm mb-6 space-y-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Describe the issue"
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-400">No support tickets yet.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t._id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-800 text-sm">{t.subject}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor[t.status]}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2 capitalize">{t.category.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">{t.description}</p>
                {t.adminReply && (
                  <div className="mt-2 bg-blue-50 rounded-lg p-2 text-sm text-blue-700">
                    <span className="font-medium">Support reply: </span>
                    {t.adminReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
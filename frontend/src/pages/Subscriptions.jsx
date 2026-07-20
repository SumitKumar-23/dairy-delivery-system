import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'alternate_days', label: 'Alternate Days' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    productId: '',
    quantity: 1,
    frequency: 'daily',
    deliveryTime: 'Morning',
    street: '',
    city: '',
    state: '',
    pincode: '',
    startDate: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, productsRes] = await Promise.all([
        axiosInstance.get('/subscriptions/my-subscriptions'),
        axiosInstance.get('/products', { params: { limit: 100 } }),
      ]);
      setSubscriptions(subsRes.data);
      setProducts(productsRes.data.products.filter((p) => p.isSubscribable));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axiosInstance.post('/subscriptions', {
        productId: form.productId,
        quantity: Number(form.quantity),
        frequency: form.frequency,
        deliveryTime: form.deliveryTime,
        deliveryAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        startDate: form.startDate,
      });
      toast.success('Subscription created!');
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setCreating(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axiosInstance.put(`/subscriptions/${id}/${action}`);
      toast.success(`Subscription ${action}d`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${action} subscription`);
    }
  };

  const statusColor = {
    active: 'bg-green-50 text-green-600',
    paused: 'bg-yellow-50 text-yellow-600',
    cancelled: 'bg-red-50 text-red-600',
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%)] text-slate-900">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Your Subscriptions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm px-5 py-2.5 rounded-full font-semibold shadow-sm"
          >
            {showForm ? 'Cancel' : '+ New Subscription'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] p-6 shadow-sm mb-8 space-y-4">
            <select
              required
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.unit}) — ₹{p.price}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.deliveryTime}
                onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <input
              placeholder="Street"
              required
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                placeholder="City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="State"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Pincode"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-2xl font-semibold disabled:opacity-50 mt-2"
            >
              {creating ? 'Creating...' : 'Create Subscription'}
            </button>
          </form>
        )}

        {/* Subscription List */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[28px] p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600">No subscriptions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-5 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-base">{sub.product.name}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                      {sub.quantity} × {sub.product.unit} <span className="text-slate-300 mx-1">|</span> {sub.frequency.replace('_', ' ')} <span className="text-slate-300 mx-1">|</span> {sub.deliveryTime}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 border border-current/20 rounded-full capitalize font-semibold ${statusColor[sub.status]}`}>
                    {sub.status}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleAction(sub._id, 'pause')}
                      className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg font-medium"
                    >
                      Pause
                    </button>
                  )}
                  {sub.status === 'paused' && (
                    <button
                      onClick={() => handleAction(sub._id, 'resume')}
                      className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg font-medium"
                    >
                      Resume
                    </button>
                  )}
                  {sub.status !== 'cancelled' && (
                    <button
                      onClick={() => handleAction(sub._id, 'cancel')}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
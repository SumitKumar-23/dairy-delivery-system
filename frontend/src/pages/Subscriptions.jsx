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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Your Subscriptions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            {showForm ? 'Cancel' : '+ New Subscription'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl p-5 shadow-sm mb-6 space-y-3">
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
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Subscription'}
            </button>
          </form>
        )}

        {/* Subscription List */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-gray-400">No subscriptions yet.</p>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{sub.product.name}</p>
                    <p className="text-xs text-gray-400">
                      {sub.quantity} × {sub.product.unit} · {sub.frequency.replace('_', ' ')} · {sub.deliveryTime}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor[sub.status]}`}>
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
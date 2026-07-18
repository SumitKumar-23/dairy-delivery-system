import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningJob, setRunningJob] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const runSubscriptionJob = async () => {
    setRunningJob(true);
    try {
      await axiosInstance.post('/admin/run-subscription-job');
      toast.success('Subscription job executed — check server logs');
      fetchStats();
    } catch (error) {
      toast.error('Job failed');
    } finally {
      setRunningJob(false);
    }
  };

  const cards = stats
    ? [
        { label: 'Total Customers', value: stats.totalCustomers, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Vendors', value: stats.totalVendors, color: 'bg-purple-50 text-purple-600' },
        { label: 'Delivery Agents', value: stats.totalAgents, color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Total Orders', value: stats.totalOrders, color: 'bg-green-50 text-green-600' },
        { label: 'Active Subscriptions', value: stats.activeSubscriptions, color: 'bg-pink-50 text-pink-600' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: 'bg-indigo-50 text-indigo-600' },
      ]
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold text-gray-800">Overview</h1>
        <button
          onClick={runSubscriptionJob}
          disabled={runningJob}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {runningJob ? 'Running...' : 'Run Subscription Job'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color.split(' ')[1]}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
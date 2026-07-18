import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Phone } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const STATUS_FLOW = ['assigned', 'out_for_delivery', 'delivered'];

const AgentDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/deliveries/my-deliveries');
      // Only show active (not yet delivered/missed) ones on this page
      setDeliveries(res.data.filter((d) => !['delivered', 'missed'].includes(d.status)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/deliveries/${id}/status`, { status });
      toast.success('Status updated');
      fetchDeliveries();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const markMissed = async (id) => {
    if (!confirm('Mark this delivery as missed?')) return;
    try {
      await axiosInstance.put(`/deliveries/${id}/status`, { status: 'missed', notes: 'Customer unavailable' });
      toast.success('Marked as missed');
      fetchDeliveries();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const statusColor = {
    assigned: 'bg-purple-50 text-purple-600',
    out_for_delivery: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Today's Deliveries</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : deliveries.length === 0 ? (
        <p className="text-gray-400">No pending deliveries right now.</p>
      ) : (
        <div className="space-y-3">
          {deliveries.map((delivery) => {
            const currentIndex = STATUS_FLOW.indexOf(delivery.status);
            const nextStatus = STATUS_FLOW[currentIndex + 1];

            return (
              <div key={delivery._id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{delivery.customer?.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Phone size={12} /> {delivery.customer?.phone}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor[delivery.status]}`}>
                    {delivery.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-gray-500 flex items-start gap-1 mb-2">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  {delivery.deliveryAddress?.street}, {delivery.deliveryAddress?.city},{' '}
                  {delivery.deliveryAddress?.state} - {delivery.deliveryAddress?.pincode}
                </p>

                {delivery.order?.items?.map((item) => (
                  <p key={item._id} className="text-sm text-gray-600">
                    {item.name} × {item.quantity}
                  </p>
                ))}

                <div className="flex gap-2 mt-3">
                  {nextStatus && (
                    <button
                      onClick={() => updateStatus(delivery._id, nextStatus)}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium capitalize"
                    >
                      Mark as {nextStatus.replace('_', ' ')}
                    </button>
                  )}
                  <button
                    onClick={() => markMissed(delivery._id)}
                    className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-medium"
                  >
                    Mark Missed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentDeliveries;
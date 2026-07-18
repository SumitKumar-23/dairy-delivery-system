import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AgentHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/deliveries/my-deliveries')
      .then((res) => setDeliveries(res.data.filter((d) => ['delivered', 'missed'].includes(d.status))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Delivery History</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : deliveries.length === 0 ? (
        <p className="text-gray-400">No completed deliveries yet.</p>
      ) : (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <div key={delivery._id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800 text-sm">{delivery.customer?.name}</p>
                <p className="text-xs text-gray-400">
                  {delivery.deliveredAt
                    ? new Date(delivery.deliveredAt).toLocaleString()
                    : new Date(delivery.updatedAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  delivery.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {delivery.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentHistory;
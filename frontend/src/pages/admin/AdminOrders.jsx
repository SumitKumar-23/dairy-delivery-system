import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const statusColor = {
  placed: 'bg-blue-50 text-blue-600',
  assigned: 'bg-purple-50 text-purple-600',
  out_for_delivery: 'bg-yellow-50 text-yellow-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/admin/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">All Orders</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800 text-sm">{order.customer?.name}</p>
                <p className="text-xs text-gray-400">
                  {order.items.length} item(s) · ₹{order.totalAmount} · {order.orderType}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor[order.orderStatus]}`}>
                {order.orderStatus.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
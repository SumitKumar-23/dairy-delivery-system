import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const STATUS_FLOW = ['placed', 'assigned', 'out_for_delivery', 'delivered'];

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/orders/vendor/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const statusColor = {
    placed: 'bg-blue-50 text-blue-600',
    assigned: 'bg-purple-50 text-purple-600',
    out_for_delivery: 'bg-yellow-50 text-yellow-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-600',
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Orders</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);
            const nextStatus = STATUS_FLOW[currentIndex + 1];

            return (
              <div key={order._id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{order.customer?.phone}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor[order.orderStatus]}`}>
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                {order.items.map((item) => (
                  <p key={item._id} className="text-sm text-gray-600">
                    {item.name} × {item.quantity}
                  </p>
                ))}

                <div className="flex justify-between items-center mt-3">
                  <span className="font-semibold text-gray-800">₹{order.totalAmount}</span>
                  {nextStatus && (
                    <button
                      onClick={() => updateStatus(order._id, nextStatus)}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium capitalize"
                    >
                      Mark as {nextStatus.replace('_', ' ')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState(null); // { orderId, productId, name }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders/my-orders');
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openReviewForm = (orderId, productId, name) => {
    setReviewingItem({ orderId, productId, name });
    setRating(5);
    setComment('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/reviews', {
        productId: reviewingItem.productId,
        orderId: reviewingItem.orderId,
        rating,
        comment,
      });
      toast.success('Review submitted — thank you!');
      setReviewingItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%)] text-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 mb-6">Your Orders</h1>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[28px] p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-5 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize font-medium">
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                      <p className="text-sm font-medium text-slate-700">
                        {item.name} <span className="text-slate-400 font-normal">× {item.quantity}</span>
                      </p>
                      {order.orderStatus === 'delivered' && (
                        <button
                          onClick={() => openReviewForm(order._id, item.product, item.name)}
                          className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 px-2 py-1 rounded-md font-medium flex items-center gap-1 transition"
                        >
                          <Star size={12} className="fill-amber-600" /> Rate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-right font-bold text-slate-900 mt-3 text-lg">₹{order.totalAmount}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Rate {reviewingItem.name}</h2>
            <form onSubmit={submitReview} className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star
                      size={28}
                      className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewingItem(null)}
                  className="px-4 border border-gray-200 rounded-lg text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
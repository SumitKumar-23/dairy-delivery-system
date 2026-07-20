import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = {
  'Milk': '🥛',
  'Curd': '🥣',
  'Paneer': '🧀',
  'Butter': '🧈',
  'Cheese': '🧀',
  'Ghee': '🍯',
  'Cream': '🍦',
  'Yogurt': '🍧',
  'Flavored Milk': '🧃',
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/cart');
      setCart(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axiosInstance.put('/cart/update', { productId, quantity });
      setCart(res.data);
      window.dispatchEvent(new Event('cart:updated'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axiosInstance.delete(`/cart/remove/${productId}`);
      setCart(res.data);
      toast.success('Item removed');
      window.dispatchEvent(new Event('cart:updated'));
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const deliveryCharge = subtotal > 200 || subtotal === 0 ? 0 : 20;
  const total = subtotal + deliveryCharge;

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Unable to load Razorpay'));
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in your complete delivery address');
      return;
    }

    setPlacing(true);
    try {
      const orderRes = await axiosInstance.post('/orders', {
        deliveryAddress: address,
        paymentMethod: 'Card',
      });

      const orderId = orderRes.data?._id || orderRes.data?.id;
      const paymentRes = await axiosInstance.post('/payments/create-razorpay-order', { orderId });

      await loadRazorpayScript();

      const options = {
        key: paymentRes.data.keyId,
        amount: paymentRes.data.amount,
        currency: paymentRes.data.currency,
        name: 'DairyFresh',
        description: `Order ${orderId}`,
        order_id: paymentRes.data.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#2563eb',
        },
        handler: async function (response) {
          try {
            await axiosInstance.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Order confirmed.');
            navigate('/orders');
          } catch (verifyError) {
            toast.error(verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%)] text-slate-900">
        <Navbar />
        <p className="text-center text-slate-400 mt-10">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%)] text-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 mb-6 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> Your Cart
        </h1>

        {(!cart?.items || cart.items.length === 0) ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[28px] p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-300 mb-4">
              <ShoppingBag size={32} />
            </div>
            <p className="text-lg font-medium text-slate-600">Your cart is empty</p>
            <button onClick={() => navigate('/home')} className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              Browse products
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-4 flex items-center gap-4 shadow-sm transition hover:shadow-md">
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100/50 rounded-[16px] w-16 h-16 flex items-center justify-center text-3xl shadow-inner">
                    {CATEGORY_ICONS[item.product.category] || '🥛'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{item.product.name}</p>
                    <p className="text-sm text-slate-500">{item.product.unit} · <span className="font-medium text-slate-700">₹{item.product.price}</span></p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-2 py-1">
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1 rounded-full hover:bg-slate-200 text-slate-600 transition">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center text-slate-700">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1 rounded-full hover:bg-slate-200 text-slate-600 transition">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product._id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary + Address */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-sm h-fit sticky top-24">
              <h2 className="font-semibold text-slate-800 mb-4">Order Summary</h2>
              <div className="text-sm space-y-2 mb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-700">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery</span>
                  <span className="font-medium text-slate-700">{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-slate-100 text-base">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <h3 className="font-medium text-slate-700 text-sm mb-3">Delivery Address</h3>
              <form onSubmit={handlePlaceOrder} className="space-y-3">
                <input
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={placing}
                  className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 mt-2"
                >
                  {placing ? 'Placing order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
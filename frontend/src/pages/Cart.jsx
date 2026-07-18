import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-10">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Your Cart</h1>

        {(!cart?.items || cart.items.length === 0) ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            Your cart is empty.
            <button onClick={() => navigate('/')} className="block mx-auto mt-3 text-blue-600 font-medium">
              Browse products
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-3">
              {cart.items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="bg-gray-50 rounded-lg w-14 h-14 flex items-center justify-center text-2xl">
                    🥛
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-400">{item.product.unit} · ₹{item.product.price}</p>
                  </div>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary + Address */}
            <div className="bg-white rounded-xl p-5 shadow-sm h-fit">
              <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
              <div className="text-sm space-y-1 mb-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <h3 className="font-medium text-gray-700 text-sm mb-2">Delivery Address</h3>
              <form onSubmit={handlePlaceOrder} className="space-y-2">
                <input
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
                <button
                  type="submit"
                  disabled={placing}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium mt-3 hover:bg-blue-700 disabled:opacity-50"
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
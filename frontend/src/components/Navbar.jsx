import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Bell, LifeBuoy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get('/cart');
      const items = res.data?.items || [];
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchCartCount();
  }, []);

  useEffect(() => {
    const handleCartUpdated = () => fetchCartCount();
    window.addEventListener('cart:updated', handleCartUpdated);
    window.addEventListener('focus', handleCartUpdated);

    return () => {
      window.removeEventListener('cart:updated', handleCartUpdated);
      window.removeEventListener('focus', handleCartUpdated);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-2 text-blue-700 shadow-sm">
          <span className="text-lg">🥛</span>
          <span className="text-base font-semibold tracking-tight">DairyFresh</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link to="/subscriptions" className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600">
            Subscriptions
          </Link>
          <Link to="/orders" className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600">
            Orders
          </Link>
          <Link to="/support" className="rounded-full p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600">
            <LifeBuoy size={18} />
          </Link>

          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="relative rounded-full p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-slate-100 px-3 py-3 text-sm font-semibold text-slate-700">Notifications</div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`cursor-pointer border-b border-slate-100 p-3 text-sm transition hover:bg-slate-50 ${
                        !n.isRead ? 'bg-blue-50/60 font-medium text-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {n.message}
                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="relative rounded-full p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-700">
            <User size={16} />
            <span className="max-w-[100px] truncate font-medium">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="rounded-full p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
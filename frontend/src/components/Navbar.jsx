import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🥛 DairyFresh
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/subscriptions" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
            Subscriptions
          </Link>
          <Link to="/orders" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
            Orders
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-blue-600">
            <ShoppingCart size={20} />
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User size={18} />
            {user?.name}
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
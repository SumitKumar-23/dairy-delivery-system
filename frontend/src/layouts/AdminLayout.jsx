import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/tickets", label: "Tickets", icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%)] text-slate-900 flex">
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 flex flex-col shadow-sm">
        <div className="p-6 border-b border-white/60">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="DairyFresh Logo" className="h-6 w-6 object-contain" />
            <h1 className="text-lg font-bold tracking-tight text-blue-700">DairyFresh</h1>
          </Link>
          <p className="text-xs text-slate-500 mt-1 pl-8">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                location.pathname === path
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white/90 hover:text-blue-600"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/60">
          <p className="text-xs text-slate-500 px-3 mb-2 font-medium">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 w-full transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

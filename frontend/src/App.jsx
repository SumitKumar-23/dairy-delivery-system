import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Subscriptions from "./pages/Subscriptions";
import VendorLayout from "./layouts/VendorLayout";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorOrders from "./pages/vendor/VendorOrders";
import AgentLayout from "./layouts/AgentLayout";
import AgentDeliveries from "./pages/agent/AgentDeliveries";
import AgentHistory from "./pages/agent/AgentHistory";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Support from "./pages/Support";
import AdminTickets from "./pages/admin/AdminTickets";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Subscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<VendorProducts />} />
            <Route path="orders" element={<VendorOrders />} />
          </Route>
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["delivery_agent"]}>
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AgentDeliveries />} />
            <Route path="history" element={<AgentHistory />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
          <Route
            path="/support"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route path="tickets" element={<AdminTickets />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

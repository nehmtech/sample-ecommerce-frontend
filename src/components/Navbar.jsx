import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { logout } from "../services/api";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");
    try { await logout(refresh); } catch {}
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
            ShopBase
          </Link>

          <div className="flex items-center gap-6">
      
            <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Products
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
                  <ShoppingCart size={22} />
                  {cart?.item_count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cart.item_count}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <Package size={22} />
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={18} className="text-indigo-500" />
                  <span className="font-medium">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
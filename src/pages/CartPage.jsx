import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, loading, update, remove } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 mt-2">Start adding some products!</p>
        <Link to="/products" className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
              {item.product.image ? (
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
              <p className="text-sm text-gray-400">Ksh. {item.product.price} each</p>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button onClick={() => update(item.id, item.quantity - 1)} className="px-2 py-1.5 text-gray-500 hover:text-gray-900"><Minus size={14} /></button>
              <span className="px-3 py-1.5 font-medium text-sm">{item.quantity}</span>
              <button onClick={() => update(item.id, item.quantity + 1)} className="px-2 py-1.5 text-gray-500 hover:text-gray-900"><Plus size={14} /></button>
            </div>
            <span className="font-semibold text-gray-900 w-20 text-right">Ksh. {item.subtotal}</span>
            <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-2"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
          <span>Total</span>
          <span>Ksh. {cart.total}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
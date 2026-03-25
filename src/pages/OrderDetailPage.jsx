import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../services/api";
import { ArrowLeft } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>{order.status}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {order.shipping_address}<br />
            {order.shipping_city}, {order.shipping_postal_code}<br />
            {order.shipping_country}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Order Info</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Placed: {new Date(order.created_at).toLocaleString()}</p>
            <p>Customer: {order.user.username}</p>
            <p>Email: {order.user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Items</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-gray-900">Ksh. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-gray-100 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>Ksh. {order.total_price}</span>
        </div>
      </div>
    </div>
  );
}
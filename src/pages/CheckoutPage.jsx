import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, initializePayment } from "../services/api";

export default function CheckoutPage() {
  const [form, setForm] = useState({ shipping_address: "", shipping_city: "", shipping_postal_code: "", shipping_country: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    // Step 1: create the order
    const orderRes = await createOrder(form);
    const orderId = orderRes.data.id;

    // Step 2: initialize payment
    const payRes = await initializePayment(orderId);
    
    // Step 3: redirect to Paystack hosted page
    window.location.href = payRes.data.authorization_url;

  } catch (err) {
    setError(err.response?.data?.detail || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const field = (name, label, placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {field("shipping_address", "Street Address", "123 Main St")}
            {field("shipping_city", "City", "New York")}
            {field("shipping_postal_code", "Postal Code", "10001")}
            {field("shipping_country", "Country", "United States")}
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {cart && (
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">Ksh. {item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>Total:</span>
              <span>Ksh. {cart.total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
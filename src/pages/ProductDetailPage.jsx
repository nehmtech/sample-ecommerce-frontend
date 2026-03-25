import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(slug)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    setAdding(true);
    try { await add(product.id, qty); } finally { setAdding(false); }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-2xl overflow-hidden h-80 md:h-full">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📦</div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-indigo-500 uppercase tracking-wide">{product.category_name}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-gray-500 mt-4 leading-relaxed">{product.description}</p>
          <div className="text-3xl font-bold text-gray-900 mt-6">Ksh. {product.price}</div>
          <p className="text-sm text-gray-400 mt-1">{product.stock} in stock</p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-500 hover:text-gray-900">−</button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-gray-500 hover:text-gray-900">+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={adding || product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <ShoppingCart size={18} />
              {product.stock === 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
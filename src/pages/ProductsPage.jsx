import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { add } = useCart();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    getProducts(params)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleAdd = async (productId) => {
    setAddingId(productId);
    try { await add(productId, 1); } finally { setAddingId(null); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
              <Link to={`/products/${product.slug}`}>
                <div className="h-48 bg-gray-50 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
                  )}
                </div>
                
              </Link>
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-500 uppercase tracking-wide">{product.category_name}</span>
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mt-1 hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-gray-900">Ksh. {product.price}</span>
                  <button
                    onClick={() => handleAdd(product.id)}
                    disabled={addingId === product.id || product.stock === 0}
                    className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <ShoppingCart size={14} />
                    {product.stock === 0 ? "Out of Stock" : addingId === product.id ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import axios from "axios";

const BASE_URL = "https://sample-ecommerce-backend-production.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
        localStorage.setItem("access", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const register = (data) => api.post("/auth/register/", data);
export const login = (data) => api.post("/auth/login/", data);
export const logout = (refresh) => api.post("/auth/logout/", { refresh });
export const getMe = () => api.get("/auth/me/");

// ─── Categories ──────────────────────────────────────────────────────────────
export const getCategories = () => api.get("/categories/");
export const getCategory = (slug) => api.get(`/categories/${slug}/`);

// ─── Products ────────────────────────────────────────────────────────────────
export const getProducts = (params) => api.get("/products/", { params });
export const getProduct = (slug) => api.get(`/products/${slug}/`);

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const getCart = () => api.get("/cart/");
export const addToCart = (product_id, quantity = 1) => api.post("/cart/add/", { product_id, quantity });
export const updateCartItem = (item_id, quantity) =>  api.patch(`/cart/items/${item_id}/update/`, { quantity });
export const removeCartItem = (item_id) =>  api.delete(`/cart/items/${item_id}/remove/`);
export const clearCart = () => api.delete("/cart/clear/");

// ─── Orders ──────────────────────────────────────────────────────────────────
export const getOrders = () => api.get("/orders/");
export const getOrder = (id) => api.get(`/orders/${id}/`);
export const createOrder = (shippingData) => api.post("/orders/", shippingData);

//-------- Payments --------------------
export const initializePayment = (orderId) => api.post(`/orders/${orderId}/pay/`);
export const verifyPayment = (orderId) => api.get(`/orders/${orderId}/verify/`);

export default api;

import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const add = async (productId, qty = 1) => {
    const res = await addToCart(productId, qty);
    setCart(res.data);
  };

  const update = async (itemId, qty) => {
    const res = await updateCartItem(itemId, qty);
    setCart(res.data);
  };

  const remove = async (itemId) => {
    const res = await removeCartItem(itemId);
    setCart(res.data);
  };

  const clear = async () => {
    const res = await clearCart();
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
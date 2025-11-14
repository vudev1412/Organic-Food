// 📁 src/contexts/AppProvider.tsx

import React, { useState } from "react";
// Import Context và Hook từ file vừa tạo
import { CurrentAppContext } from "./app.context";

type Tprops = {
  children: React.ReactNode;
};

// File này BÂY GIỜ CHỈ export duy nhất một component
export const AppProvider = ({ children }: Tprops) => {
  // --- Toàn bộ state và logic của bạn giữ nguyên ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // 🛒 Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: IProductCard, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            quantity,
          },
        ];
      }
    });
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // 🔢 Cập nhật số lượng
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // 🧹 Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };
  // --- Hết phần logic ---

  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isAppLoading,
        setIsAppLoading,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </CurrentAppContext.Provider>
  );
};

// 📁 src/contexts/AppProvider.tsx

import React, { useState, useEffect } from "react";
// Import Context và Hook từ file vừa tạo
import { CurrentAppContext } from "./app.context";
// import { getCartByUserAPI } from "../../service/api"; // TODO: Uncomment khi có API

const CART_STORAGE_KEY = "organic_cart_items";

type Tprops = {
  children: React.ReactNode;
};

// File này BÂY GIỜ CHỈ export duy nhất một component
export const AppProvider = ({ children }: Tprops) => {
  // --- Toàn bộ state và logic của bạn giữ nguyên ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
    // Kiểm tra xem code có đang chạy ở trình duyệt không (đề phòng lỗi nếu dùng Next.js)
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      try {
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error("Lỗi parse cart:", error);
        return [];
      }
    }
    return [];
  });



  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync cart with DB when user logs in
  // TODO: Uncomment khi có API
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // syncCartWithDB();
    }
  }, [isAuthenticated, user?.id]);

  // TODO: Uncomment khi có API cart endpoint
  // const syncCartWithDB = async () => {
  //   try {
  //     // const response = await getCartByUserAPI();
  //     // const cartItems = response.data?.data?.items;
  //     // if (cartItems && Array.isArray(cartItems)) {
  //     //   // Convert DB cart format to local cart format
  //     //   const convertedCart: ICartItem[] = cartItems.map((item: ICartItemResponse) => ({
  //     //     id: item.product.id,
  //     //     name: item.product.name,
  //     //     slug: item.product.slug,
  //     //     image: item.product.image,
  //     //     price: item.product.price,
  //     //     originalPrice: item.originalPrice || item.product.originalPrice,
  //     //     discount: item.discount || item.product.discount,
  //     //     quantity: item.quantity,
  //     //   }));
  //     //   setCartItems(convertedCart);
  //     //   localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(convertedCart));
  //     // }
  //   } catch (error) {
  //     console.error("Failed to sync cart with DB:", error);
  //   }
  // };

  // 🛒 Thêm sản phẩm vào giỏ hàng (với ràng buộc product.quantity)
  const addToCart = (product: IProductCard, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      const maxAvailable = product.quantity || 0;

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          maxAvailable
        );
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                maxQuantityAvailable: maxAvailable,
              }
            : item
        );
      } else {
        const newQuantity = Math.min(quantity, maxAvailable);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            quantity: newQuantity,
            maxQuantityAvailable: maxAvailable,
          },
        ];
      }
    });
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // 🔢 Cập nhật số lượng (với ràng buộc theo maxQuantityAvailable)
  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === productId) {
            // Giới hạn số lượng theo maxQuantityAvailable từ product.quantity
            const maxQuantity = item.maxQuantityAvailable || 100;
            const finalQuantity = Math.min(newQuantity, maxQuantity);
            return { ...item, quantity: finalQuantity };
          }
          return item;
        })
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

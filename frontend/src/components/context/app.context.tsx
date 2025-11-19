// 📁 src/contexts/AppContext.tsx

import { createContext, useContext } from "react";

// 1. Định nghĩa Interface (khuôn khổ data)
export interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (v: IUser | null) => void;
  user: IUser | null;
  isAppLoading: boolean;
  setIsAppLoading: (v: boolean) => void;
  cartItems: ICartItem[];
  addToCart: (product: IProductCard, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// 2. Tạo và export Context
export const CurrentAppContext = createContext<IAppContext | null>(null);

// 3. Tạo và export Hook (cách truy cập)
export const useCurrentApp = () => {
  const ctx = useContext(CurrentAppContext);
  if (!ctx) {
    throw new Error("useCurrentApp must be used within <AppProvider>");
  }
  return ctx;
};

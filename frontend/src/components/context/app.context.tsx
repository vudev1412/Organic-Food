// File path: /src/components/context/app.context.tsx

import { createContext, useContext } from "react";

// ==================== CART INTERFACES ====================
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

  // ✅ THÊM TOAST VÀO CONTEXT
  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
    duration?: number
  ) => void;
}

// ==================== TOAST INTERFACES ====================
export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// ==================== CONTEXT ====================
export const CurrentAppContext = createContext<IAppContext | null>(null);

// ==================== HOOK ====================
export const useCurrentApp = () => {
  const ctx = useContext(CurrentAppContext);
  if (!ctx) {
    throw new Error("useCurrentApp must be used within <AppProvider>");
  }
  return ctx;
};

// ✅ EXPORT THÊM HOOK RIÊNG CHO TOAST (optional, để tương thích code cũ)
export const useToast = () => {
  const ctx = useCurrentApp();
  return {
  showToast: ctx.showToast,
  };
};

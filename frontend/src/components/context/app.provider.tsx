// File path: /src/components/context/app.provider.tsx

import React, { useState, useEffect, useCallback } from "react";
import { CurrentAppContext, type ToastMessage } from "./app.context";
import {
  addToCartAPI,
  getMyCartAPI,
  updateCartAPI,
  fetchAccountAPI,
} from "../../service/api";

// ✅ IMPORT TOAST STYLES
import "./toast.scss"; // Đảm bảo file này tồn tại

const CART_STORAGE_KEY = "organic_cart_items";

// Helper lấy giỏ hàng từ local storage an toàn
const getLocalCartSnapshot = (): ICartItem[] => {
  if (typeof window === "undefined") return [];
  const localSnapshot = localStorage.getItem(CART_STORAGE_KEY);
  if (!localSnapshot) return [];
  try {
    return JSON.parse(localSnapshot) as ICartItem[];
  } catch (error) {
    console.error("Failed to parse local cart snapshot:", error);
    return [];
  }
};

type Tprops = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: Tprops) => {
  // ==================== CART STATE ====================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  // Khởi tạo cartItems từ LocalStorage (client-side only)
  const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
    if (typeof window !== "undefined") {
      // Nếu đã có token (nghĩa là user đang F5), return rỗng luôn để tránh nạp lại dữ liệu cũ
      if (localStorage.getItem("access_token")) {
        return [];
      }
      // -------------------

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
  // ==================== TOAST STATE ====================
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ==================== TOAST FUNCTIONS ====================
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "success",
      duration = 1500
    ) => {
      const id = Date.now().toString();
      const toast: ToastMessage = { id, message, type, duration };
      console.log("Showing toast:", toast);

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  // === THÊM ĐOẠN NÀY: Khôi phục User khi F5 ===
  useEffect(() => {
    const fetchAccount = async () => {
      setIsAppLoading(true); // Bắt đầu loading
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          // Gọi API lấy thông tin user từ token
          const res = await fetchAccountAPI();
          if (res && res.data) {
            setUser(res.data.data.user); // Lưu info user vào state
            setIsAuthenticated(true); // Đã đăng nhập
          }
        } catch (error) {
          // Token lỗi hoặc hết hạn -> Xóa sạch
          console.log("Token hết hạn hoặc không hợp lệ");
          localStorage.removeItem("access_token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsAppLoading(false); // Kết thúc loading
    };

    fetchAccount();
  }, []); // [] rỗng để chỉ chạy 1 lần khi mount
  // ============================================
  // ==================== CART EFFECTS ====================

  // 1. Lưu vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // 2. Check token & Sync khi App khởi động hoặc login thành công
  useEffect(() => {
    // const token = localStorage.getItem("access_token");
    if (isAuthenticated) {
      syncCartWithDB();
    }
  }, [isAuthenticated]);

  // ==================== CART HELPER FUNCTIONS ====================

  const fetchCartFromDB = async () => {
    try {
      const payload = await getMyCartAPI();
      let remoteItems: ICartItemDTO[] = [];

      // Lấy data từ API
      if (payload?.data && Array.isArray(payload.data)) {
        remoteItems = payload.data;
      } else if (payload?.data?.data && Array.isArray(payload.data.data)) {
        remoteItems = payload.data.data;
      } else if (Array.isArray(payload)) {
        remoteItems = payload;
      }

      // Map dữ liệu
      const convertedCart: ICartItem[] = remoteItems.map(
        (item: ICartItemDTO) => {
          const finalPrice = item.price;
          const basePrice =
            item.originalPrice && item.originalPrice > 0
              ? item.originalPrice
              : finalPrice;

          let discountData: IDiscount | undefined = undefined;
          if (item.promotionType && item.value) {
            discountData = {
              id: item.promotionId ?? 0,
              type: item.promotionType,
              value: item.value,
            };
          }

          return {
            id: item.id,
            name: item.productName,
            slug: item.slug || "",
            image: item.image,
            price: finalPrice,
            originalPrice: basePrice,
            discount: discountData,
            quantity: item.quantity,
            maxQuantityAvailable: item.stock, // ✅ LẤY STOCK TỪ API
          };
        }
      );

      setCartItems(convertedCart);
    } catch (error) {
      console.error("Failed to fetch remote cart:", error);
    }
  };
  const syncCartWithDB = async () => {
    try {
      const localCart = getLocalCartSnapshot();
      if (localCart.length > 0) {
        await Promise.all(
          localCart.map((item) => addToCartAPI(item.id, item.quantity))
        );
        localStorage.removeItem(CART_STORAGE_KEY);
      }

      await fetchCartFromDB();
    } catch (error) {
      console.error("Failed to sync cart with DB:", error);
    }
  };

  // ==================== CART ACTIONS ====================

  const addToCart = async (product: IProductCard, quantity: number) => {
    console.log(product, quantity);

    // ✅ LẤY STOCK TỪ product.quantity
    const maxAvailable = product.quantity || 100;

    if (isAuthenticated) {
      // === ONLINE: Gọi API trực tiếp ===
      try {
        const response = await addToCartAPI(product.id, quantity);

        // Kiểm tra lỗi từ API
        if (response.data?.error || response.error) {
          const errorField = response.data?.error || response.error;
          const errorMsg = Array.isArray(errorField)
            ? errorField.join(", ")
            : errorField;
          showToast(errorMsg, "error");
          return false;
        }

        // Cập nhật lại giỏ hàng từ DB
        await fetchCartFromDB();
        showToast("Đã thêm vào giỏ hàng", "success");
        return true;
      } catch (error: any) {
        showToast("Không thể thêm vào giỏ hàng", "error");
        return false;
      }
    } else {
      // === OFFLINE: Kiểm tra tồn kho LOCAL ===

      const currentQtyInCart =
        cartItems.find((item) => item.id === product.id)?.quantity || 0;
      const totalQty = currentQtyInCart + quantity;

      if (totalQty > maxAvailable) {
        showToast(`Sản phẩm chỉ còn ${maxAvailable} trong kho`, "error");
        return false;
      }

      // Thêm vào giỏ LOCAL
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);

        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // ✅ TÍNH GIÁ SAU GIẢM TỪ DISCOUNT
          let finalPrice = product.price; // Giá gốc

          if (product.discount) {
            if (product.discount.type === "PERCENT") {
              // Giảm %: finalPrice = price * (1 - value/100)
              finalPrice = product.price * (1 - product.discount.value / 100);
            } else if (product.discount.type === "FIXED_AMOUNT") {
              // Giảm cố định: finalPrice = price - value
              finalPrice = Math.max(0, product.price - product.discount.value);
            }
          }

          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              slug: product.slug,
              image: product.image,
              price: finalPrice, // Giá sau khi giảm
              originalPrice: product.price, // Giá gốc
              discount: product.discount,
              quantity,
              maxQuantityAvailable: maxAvailable,
            },
          ];
        }
      });

      showToast("Đã thêm vào giỏ hàng", "success");
      return true;
    }
  };

  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      try {
        const response = await updateCartAPI(productId, 0);

        if (response.data?.error || response.error) {
          const errorField = response.data?.error || response.error;
          const errorMsg = Array.isArray(errorField)
            ? errorField.join(", ")
            : errorField;

          showToast(errorMsg, "error");
          throw new Error(errorMsg);
        }

        await fetchCartFromDB();
      } catch (error) {
        console.error("Remove failed:", error);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        // ✅ KIỂM TRA STOCK TRƯỚC KHI GỌI API
        const currentItem = cartItems.find((item) => item.id === productId);
        if (
          currentItem?.maxQuantityAvailable &&
          newQuantity > currentItem.maxQuantityAvailable
        ) {
          showToast(
            `Sản phẩm chỉ còn ${currentItem.maxQuantityAvailable} trong kho`,
            "error"
          );
          return;
        }

        // --- ONLINE: Gọi API ---
        const response = await updateCartAPI(productId, newQuantity);
        console.log("Update API Response:", response);

        // Kiểm tra lỗi từ API
        if (response.data?.error || response.error) {
          const errorField = response.data?.error || response.error;
          const errorMsg = Array.isArray(errorField)
            ? errorField.join(", ")
            : errorField;

          showToast(errorMsg, "error");
          return;
        }

        await fetchCartFromDB(); // cập nhật giỏ từ DB
      } catch (error: any) {
        console.error("Update cart failed:", error);

        let errorMsg = "Cập nhật thất bại";

        if (error.message && !error.response) {
          errorMsg = error.message;
        } else if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.error) {
            errorMsg = Array.isArray(errorData.error)
              ? errorData.error.join(", ")
              : errorData.error;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          }
        }

        showToast(errorMsg, "error");
        return;
      }
    } else {
      // --- OFFLINE: Cập nhật local cart ---
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === productId) {
            const maxQuantity = item.maxQuantityAvailable || 100;

            // Kiểm tra vượt tồn kho
            if (newQuantity > maxQuantity) {
              showToast(
                `Số lượng sản phẩm này chỉ còn ${maxQuantity}`,
                "error"
              );
              // Vẫn trả về item với quantity = maxQuantity
              return { ...item, quantity: maxQuantity };
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  // ==================== RENDER ====================
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
        showToast, // ✅ THÊM TOAST VÀO VALUE
      }}
    >
      {children}

      {/* ✅ TOAST CONTAINER */}
      {/* INLINE TOAST CONTAINER — luôn hoạt động */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          zIndex: 999999,
          pointerEvents: "none", // để không chặn click UI
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              minWidth: "260px",
              padding: "12px 16px",
              borderRadius: "6px",
              color: toast.type === "warning" ? "#000" : "#fff",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              opacity: 1,
              transform: "translateX(0)",
              background:
                toast.type === "success"
                  ? "#28a745"
                  : toast.type === "error"
                  ? "#dc3545"
                  : toast.type === "warning"
                  ? "#ffc107"
                  : "#17a2b8",
              animation: "fadeInToast 0.3s ease-out",
              pointerEvents: "auto", // click close được
            }}
          >
            <span>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                fontSize: "16px",
                color: "inherit",
                cursor: "pointer",
                marginLeft: "12px",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CurrentAppContext.Provider>
  );
};

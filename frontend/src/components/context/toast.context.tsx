import { createContext, useContext } from "react";

// 1. All types and interfaces
export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
    duration?: number
  ) => void;
}

// 2. The Context definition
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

// 3. The custom hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

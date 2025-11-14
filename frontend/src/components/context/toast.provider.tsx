import React, { useState, useCallback } from "react";
// Import the context and types from the new file
import { ToastContext, type ToastMessage } from "./toast.context";
// Import the styles
import "./toast.scss";

interface ToastProviderProps {
  children: React.ReactNode;
}

// This file now only exports the component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "success",
      duration = 3000
    ) => {
      const id = Date.now().toString();
      const toast: ToastMessage = { id, message, type, duration };
      console.log("Showing toast:", toast);

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        // We can call the memoized removeToast function
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast] // Add removeToast as a dependency
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* All inline styles are removed! 
        The imported './toast.scss' handles everything.
      */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              <span>{toast.message}</span>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
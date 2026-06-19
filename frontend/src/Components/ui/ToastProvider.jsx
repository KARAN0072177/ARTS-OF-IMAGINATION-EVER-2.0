import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CgClose } from "react-icons/cg";

const ToastContext = createContext(null);

const variantStyles = {
  success: "border-emerald-400/40 bg-emerald-950/95 text-emerald-50",
  error: "border-red-400/40 bg-red-950/95 text-red-50",
  info: "border-blue-400/40 bg-slate-950/95 text-blue-50",
  warning: "border-amber-400/40 bg-amber-950/95 text-amber-50",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const toast = {
      id,
      message,
      type: options.type || "info",
    };

    setToasts((currentToasts) => [...currentToasts, toast].slice(-4));

    window.setTimeout(() => {
      dismissToast(id);
    }, options.duration || 3200);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-2xl backdrop-blur ${variantStyles[toast.type] || variantStyles.info}`}
            role="status"
          >
            <span className="leading-6">{toast.message}</span>
            <button
              type="button"
              className="mt-1 shrink-0 rounded-full p-1 opacity-75 transition hover:bg-white/10 hover:opacity-100"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <CgClose />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

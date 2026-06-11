"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, AlertTriangle, Sparkles, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 3000;

const typeConfig: Record<
  ToastType,
  { icon: React.ReactNode; borderColor: string }
> = {
  success: {
    icon: <Rocket className="h-4 w-4 text-[#FF6A00]" />,
    borderColor: "#FF6A00",
  },
  error: {
    icon: <AlertTriangle className="h-4 w-4 text-[#FF3B30]" />,
    borderColor: "#FF3B30",
  },
  info: {
    icon: <Sparkles className="h-4 w-4 text-[#8E8E93]" />,
    borderColor: "#8E8E93",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, TOAST_DURATION);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container — bottom-left */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const config = typeConfig[t.type];

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ x: -100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex min-w-[280px] max-w-[380px] items-center gap-3 rounded-xl border border-[#333333] bg-[#1c1c1e] px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                style={{ borderLeftWidth: 4, borderLeftColor: config.borderColor }}
              >
                <span className="shrink-0">{config.icon}</span>

                <p className="flex-1 font-sans text-sm font-medium text-white">
                  {t.message}
                </p>

                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 rounded-md p-1 text-[#8E8E93] transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

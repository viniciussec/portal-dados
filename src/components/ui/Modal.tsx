"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MsIcon } from "@/components/ui/MsIcon";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
  size?: "md" | "lg";
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
  size = "md",
  primaryAction,
  secondaryAction,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const iconName =
    type === "warning" ? "error" : type === "success" ? "check_circle" : "info";
  const iconColor =
    type === "warning"
      ? "text-amber-500"
      : type === "success"
        ? "text-emerald-500"
        : "text-blue-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${size === "lg" ? "max-w-3xl" : "max-w-lg"}`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
              <div className="flex items-center gap-3">
                <MsIcon name={iconName} size={24} className={iconColor} />
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <MsIcon name="close" className="m-2" size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-slate-600 max-h-[60vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {(primaryAction || secondaryAction) && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto text-center"
                  >
                    {secondaryAction.label}
                  </button>
                )}
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="px-5 py-2.5 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-600"
                  >
                    {primaryAction.label}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

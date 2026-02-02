import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="text-white font-bold">{title}</div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition"
              aria-label="Close"
              title="Close"
            >
              <X size={18} className="text-slate-200" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

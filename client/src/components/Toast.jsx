import React from "react";

export default function Toast({ message }) {
  if (!message) return null;

  const isDanger = message.type === "danger";
  const icon = isDanger ? "⚠️" : "✅";

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "fixed top-6 right-6 z-[9999] px-6 py-3 rounded-xl border backdrop-blur-md transition-all flex items-center gap-3 pointer-events-none",
        isDanger
          ? "bg-rose-600/20 border-rose-500/50 text-rose-100"
          : "bg-indigo-600/20 border-indigo-500/50 text-indigo-100"
      ].join(" ")}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm">{message.text}</span>
    </div>
  );
} 

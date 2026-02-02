import React from "react";

export default function Toast({ message }) {
  if (!message) return null;

  const isDanger = message.type === "danger";
  return (
    <div
      className={[
        "fixed top-6 right-6 z-50 px-6 py-3 rounded-xl border backdrop-blur-md transition-all",
        isDanger ? "bg-rose-500/20 border-rose-500/50" : "bg-indigo-500/20 border-indigo-500/50"
      ].join(" ")}
    >
      {message.text}
    </div>
  );
}

import React, { useRef, useState } from "react";
import { api } from "../lib/api";

export default function AuthCard({ onAuthed, showMsg, initialMode = "login" }) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 10; // Slightly more tilt
    const ry = ((x - cx) / cx) * -10;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05)`;
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) {
      showMsg("Username and password required.", "danger");
      return;
    }
    setBusy(true);
    try {
      const fn = authMode === "login" ? api.auth.login : api.auth.register;
      const data = await fn(formData);
      showMsg(`Welcome, ${data.username}!`);
      onAuthed(data.username);
    } catch (err) {
      showMsg(err.message || "Auth failed", "danger");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0f111a]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />

      <div className="perspective-1000">
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative bg-white/[0.03] backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 w-[400px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out transform-gpu"
        >
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              NEXUS MERN
            </h1>
            <p className="text-xs font-medium tracking-widest text-indigo-300/50 uppercase mt-2">
              Authentication Portal
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="group">
              <input
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            
            <div className="group">
              <input
                type="password"
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              disabled={busy}
              className="relative w-full overflow-hidden group py-4 rounded-2xl font-bold text-white transition-all transform-gpu active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {busy ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : authMode === "login" ? "Sign In" : "Join Nexus"}
              </span>
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors"
            >
              {authMode === "login" ? (
                <>New here? <span className="text-indigo-400 underline underline-offset-4 decoration-indigo-400/30">Create an account</span></>
              ) : (
                <>Already a member? <span className="text-indigo-400 underline underline-offset-4 decoration-indigo-400/30">Sign in instead</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
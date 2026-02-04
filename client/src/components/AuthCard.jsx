import React, { useRef, useState } from "react";
import { api } from "../lib/api";
import "./AuthCard.css";

export default function AuthCard({ onAuthed, showMsg, initialMode = "login" }) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const cardRef = useRef(null);

  const showLocalMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 10;
    const ry = ((x - cx) / cx) * -10;
    // Applying tilt to card
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;

    // Slight parallax for the starfield
    const stars = el.querySelector('.card-stars');
    if (stars) {
      stars.style.transform = `translateX(${ry * 2}px) translateY(${rx * -2}px)`;
    }
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";

    const stars = el.querySelector('.card-stars');
    if (stars) {
      stars.style.transform = "translateX(0) translateY(0)";
    }
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
    <div className="nexus-container">
      {/* styles moved to AuthCard.css */}

      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="auth-perspective">
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="auth-card-wrapper"
        >
          {/* THE SPARK */}
          <div className="spark-border" />
          
          <div className="auth-card-inner">
            {/* Starfield / Parallax Dust Effect */}
            <div className="card-stars" aria-hidden="true" />

            <div className="text-center mb-10">
              <div className="brand-icon">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="brand-title">NEXUS<span className="text-indigo-500">MERN</span></h1>
              <p className="brand-subtitle">Secure Access Portal</p>
            </div>

            {message && (
              <div className={`auth-alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={submit} className="auth-form">
              <input
                className="auth-input"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <button disabled={busy} className="auth-submit-btn">
                <span className="flex items-center justify-center gap-2">
                  {busy ? <div className="spinner" /> : (
                    <>
                      {authMode === "login" ? "Sign In" : "Create Account"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center footer-nav">
              <button
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-slate-500 hover:text-white text-sm transition-colors"
              >
                {authMode === "login" ? "New to Nexus? Register Now" : "Already joined? Back to Login"}
              </button>
            </div>
          </div>
        </div>



        <p className="system-tag">Powered by Nexus Engine &bull; System v2.4.0</p>
      </div>
    </div>
  );
}
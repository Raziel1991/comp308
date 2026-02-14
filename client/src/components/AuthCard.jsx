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
      showLocalMsg("Username and password required.", "error");
      return;
    }
    setBusy(true);
    try {
      const fn = authMode === "login" ? api.auth.login : api.auth.register;
      const data = await fn(formData);
      showMsg(`Welcome, ${data.username}!`);
      onAuthed(data.username);
    } catch (err) {
      showLocalMsg(err.message || "Auth failed", "error");
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
        <div className="footer-links" aria-label="Contributors">
          <a href="https://github.com/Raziel1991" target="_blank" rel="noopener noreferrer" className="gh-link" title="Raziel1991 on GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .5C5.5.5.5 5.5.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.6 5.4-5.2 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C20.8 21.3 24 17 24 12 24 5.5 18.5.5 12 .5z"/></svg>
            Raziel1991
          </a>
          <a href="https://github.com/AngelicaCuadrado" target="_blank" rel="noopener noreferrer" className="gh-link" title="AngelicaCuadrado on GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .5C5.5.5.5 5.5.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.6 5.4-5.2 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C20.8 21.3 24 17 24 12 24 5.5 18.5.5 12 .5z"/></svg>
            AngelicaCuadrado
          </a>
          <a href="https://github.com/sduffney" target="_blank" rel="noopener noreferrer" className="gh-link" title="sduffney on GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .5C5.5.5.5 5.5.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.6 5.4-5.2 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C20.8 21.3 24 17 24 12 24 5.5 18.5.5 12 .5z"/></svg>
            sduffney
          </a>
        </div>
      </div>
    </div>
  );
}
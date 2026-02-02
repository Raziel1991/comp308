import React, { useState } from "react";
import { api } from "../lib/api";

export default function AuthCard({ onAuthed, showMsg, initialMode = "login" }) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">NEXUS MERN</h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            disabled={busy}
            className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-60"
          >
            {busy ? "Working..." : authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          <span
            className="cursor-pointer hover:text-white"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "New here? Register" : "Have an account? Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

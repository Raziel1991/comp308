import React, { useEffect, useMemo, useState } from "react";
import {
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Search,
  Library,
  Rocket,
  ArrowRight
} from "lucide-react";
import { api } from "../lib/api";

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 transition">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20">
          <Icon className="text-indigo-300" size={18} />
        </div>
        <div className="text-white font-bold">{title}</div>
      </div>
      <div className="text-slate-400 text-sm mt-3 leading-relaxed">{desc}</div>
    </div>
  );
}

function GamePreviewCard({ game }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white font-bold truncate">{game.title}</div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">
            {game.genre} • {game.platform}
          </div>
        </div>
        <div className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          {game.releaseYear}
        </div>
      </div>
      <div className="text-sm text-slate-300 mt-3 line-clamp-3 italic">
        “{game.description}”
      </div>
      <div className="mt-4 text-xs text-indigo-300">
        {game.developer} • Rating {game.rating}/5
      </div>
    </div>
  );
}

export default function LandingPage({ onOpenAuth }) {
  const [games, setGames] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.games.list();
        setGames(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return games;
    const s = q.trim().toLowerCase();
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(s) ||
        g.genre.toLowerCase().includes(s) ||
        g.developer.toLowerCase().includes(s) ||
        g.platform.toLowerCase().includes(s)
    );
  }, [games, q]);

  const preview = filtered.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <div className="max-w-6xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30">
              <Gamepad2 className="text-indigo-300" />
            </div>
            <div>
              <div className="text-white text-xl font-black italic tracking-tight">
                NEXUS <span className="text-indigo-400">MERN</span>
              </div>
              <div className="text-slate-400 text-xs uppercase tracking-[0.25em]">
                your game library, upgraded
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => onOpenAuth("login")}
              className="px-5 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition"
            >
              Sign in
            </button>
            <button
              onClick={() => onOpenAuth("register")}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 transition"
            >
              Create account
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <Sparkles size={14} className="text-indigo-300" />
              3D background • Tailwind UI • MERN backend
            </div>

            <h1 className="mt-5 text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
              Build your
              <span className="text-indigo-400"> personal</span> game library.
            </h1>

            <p className="mt-5 text-slate-300 text-lg leading-relaxed">
              Track your collection, explore the catalog, and keep your taste organized.
              Basically, Steam—but without the “why do I own 74 games I’ve never launched?” guilt.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOpenAuth("register")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition font-bold text-white"
              >
                Get started <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onOpenAuth("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-bold text-slate-200"
              >
                I already have an account
              </button>
            </div>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase tracking-widest">Catalog</div>
                <div className="text-white text-2xl font-black mt-1">{games.length || "—"}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase tracking-widest">Auth</div>
                <div className="text-white text-2xl font-black mt-1">JWT</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase tracking-widest">UI</div>
                <div className="text-white text-2xl font-black mt-1">Three.js</div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="text-white font-bold text-lg">Explore the catalog</div>
            <div className="text-slate-400 text-sm mt-1">
              Search is public. Adding games to your collection requires login.
            </div>

            <div className="mt-4 flex items-center gap-2 bg-black/25 border border-white/10 rounded-2xl px-4 py-3">
              <Search size={16} className="text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search games, genres, developers..."
                className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2 mt-3" />
                    <div className="h-3 bg-white/10 rounded w-full mt-4" />
                    <div className="h-3 bg-white/10 rounded w-5/6 mt-2" />
                  </div>
                ))
              ) : preview.length > 0 ? (
                preview.map((g) => <GamePreviewCard key={g._id} game={g} />)
              ) : (
                <div className="text-slate-500 text-sm col-span-full">
                  No matches. Try a different search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-14">
            <div className="text-white text-3xl font-black">Features</div>

            // Feature list
            

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Feature
              icon={ShieldCheck}
              title="Secure auth"
              desc="Register/login with JWT stored in an HTTPOnly cookie. No token leaks in localStorage."
            />
            <Feature
              icon={Library}
              title="Collections"
              desc="Add/remove games to your personal library and view details in a side panel."
            />
            <Feature
              icon={Rocket}
              title="Fast UI"
              desc="Vite + React hooks + Tailwind styling. Smooth, modern, and clean structure."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 pb-10 text-center text-xs text-slate-500">
          <div>Built for COMP308 Exercise 2 • MERN stack • The background stars are there to distract from bugs (kidding… mostly).</div>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm">
            <a href="https://github.com/Raziel1991" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition" title="Raziel1991 on GitHub">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true" focusable="false"><path d="M12 .5C5.5.5.5 5.5.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.6 5.4-5.2 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C20.8 21.3 24 17 24 12 24 5.5 18.5.5 12 .5z"/></svg>
              <span>Raziel1991</span>
            </a>

            <a href="https://github.com/AngelicaCuadrado" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition" title="AngelicaCuadrado on GitHub">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true" focusable="false"><path d="M12 .5C5.5.5.5 5.5.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.6 5.4-5.2 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C20.8 21.3 24 17 24 12 24 5.5 18.5.5 12 .5z"/></svg>
              <span>AngelicaCuadrado</span>
            </a>

            <a href="https://github.com/sduffney" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition" title="sduffney on GitHub">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true" focusable="false"><path d="M12 .5C5.5.5.5 5.5.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.6 5.4-5.2 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6C20.8 21.3 24 17 24 12 24 5.5 18.5.5 12 .5z"/></svg>
              <span>sduffney</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { LogOut, Search } from "lucide-react";

import ThreeBackground from "./components/ThreeBackground";
import Toast from "./components/Toast";
import AuthCard from "./components/AuthCard";
import GameCard from "./components/GameCard";
import GameDetailsPanel from "./components/GameDetailsPanel";
import LandingPage from "./components/LandingPage";
import Modal from "./components/Modal";
import { api } from "./lib/api";

export default function App() {
  const [username, setUsername] = useState(null);
  const [activeTab, setActiveTab] = useState("library");
  const [message, setMessage] = useState(null);

  const [availableGames, setAvailableGames] = useState([]);
  const [myGames, setMyGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [search, setSearch] = useState("");

  // NEW: auth modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const showMsg = (text, type = "info") => {
    setMessage({ text, type });
    window.setTimeout(() => setMessage(null), 3000);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  // Boot: check cookie session
  useEffect(() => {
    (async () => {
      try {
        const me = await api.auth.me();
        setUsername(me.username);
      } catch {
        // not logged in
      }
    })();
  }, []);

  // When logged in: load library + games
  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const [games, collection] = await Promise.all([
          api.games.list(),
          api.games.myCollection()
        ]);
        setAvailableGames(games);
        setMyGames(collection);
      } catch (err) {
        showMsg(err.message || "Failed to load data", "danger");
      }
    })();
  }, [username]);

  // Search list (logged in view)
  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const games = await api.games.list(search);
        setAvailableGames(games);
      } catch (err) {
        showMsg(err.message || "Search failed", "danger");
      }
    })();
  }, [search, username]);

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setUsername(null);
      setMyGames([]);
      setSelectedGame(null);
      setAvailableGames([]);
    }
  };

  const addGame = async (gameId) => {
    try {
      const updated = await api.games.add(gameId);
      setMyGames(updated);
      showMsg("Added to collection");
    } catch (err) {
      showMsg(err.message || "Error adding game", "danger");
    }
  };

  const removeGame = async (gameId) => {
    try {
      const updated = await api.games.remove(gameId);
      setMyGames(updated);
      setSelectedGame(null);
      showMsg("Removed from collection");
    } catch (err) {
      showMsg(err.message || "Error removing game", "danger");
    }
  };

  const ownedSet = useMemo(() => new Set(myGames), [myGames]);

  const myGameDetails = useMemo(() => {
    if (!availableGames.length) return [];
    return availableGames.filter((g) => ownedSet.has(g._id));
  }, [availableGames, ownedSet]);

  const listToShow = activeTab === "library" ? myGameDetails : availableGames;
  const isOwned = selectedGame ? ownedSet.has(selectedGame._id) : false;

  return (
    <div className="min-h-screen text-slate-200 font-sans">
      <ThreeBackground />

      {/* Everything interactive ABOVE background */}
      <div className="relative z-10">
        <Toast message={message} />

        {!username ? (
          <>
            <LandingPage onOpenAuth={openAuth} />

            <Modal
              open={authOpen}
              title={authMode === "login" ? "Sign in" : "Create account"}
              onClose={() => setAuthOpen(false)}
            >
              <AuthCard
                initialMode={authMode}
                onAuthed={(u) => {
                  setUsername(u);
                  setAuthOpen(false);
                }}
                showMsg={showMsg}
              />
            </Modal>
          </>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* existing logged-in UI stays the same */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                  NEXUS <span className="text-indigo-500">MERN</span>
                </h1>
                <span className="text-xs text-slate-400 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  logged as <span className="text-white font-semibold">{username}</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search games..."
                    className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 w-56"
                  />
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10">
                  <button
                    onClick={() => setActiveTab("library")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold ${
                      activeTab === "library" ? "bg-indigo-600" : ""
                    }`}
                  >
                    Collection
                  </button>
                  <button
                    onClick={() => setActiveTab("store")}
                    className={`px-6 py-2 rounded-xl text-sm font-bold ${
                      activeTab === "store" ? "bg-indigo-600" : ""
                    }`}
                  >
                    Explore
                  </button>
                  <button onClick={logout} className="p-2 text-rose-400" title="Logout">
                    <LogOut />
                  </button>
                </div>
              </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listToShow.map((game) => (
                    <GameCard
                      key={game._id}
                      game={game}
                      activeTab={activeTab === "store" ? "store" : "library"}
                      owned={ownedSet.has(game._id)}
                      onSelect={setSelectedGame}
                      onAdd={addGame}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <GameDetailsPanel
                  selectedGame={selectedGame}
                  owned={isOwned}
                  onAdd={addGame}
                  onRemove={removeGame}
                  onClose={() => setSelectedGame(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

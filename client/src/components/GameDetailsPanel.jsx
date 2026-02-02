import React from "react";

export default function GameDetailsPanel({
  selectedGame,
  owned,
  onAdd,
  onRemove,
  onClose
}) {
  if (!selectedGame) {
    return (
      <div className="h-64 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center text-slate-600 text-center p-8">
        Select a game to view internal records
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 sticky top-8">
      <h2 className="text-2xl font-bold mb-1">{selectedGame.title}</h2>
      <p className="text-indigo-400 text-sm mb-4">
        {selectedGame.developer} • {selectedGame.releaseYear}
      </p>
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">
        {selectedGame.genre} • {selectedGame.platform} • Rating: {selectedGame.rating}/5
      </p>
      <p className="text-slate-300 italic mb-6">"{selectedGame.description}"</p>

      <div className="space-y-3">
        {owned ? (
          <button
            onClick={() => onRemove(selectedGame._id)}
            className="w-full bg-rose-600 py-3 rounded-xl font-bold hover:bg-rose-500 transition"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => onAdd(selectedGame._id)}
            className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition"
          >
            Add to Collection
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full bg-white/5 py-3 rounded-xl font-bold hover:bg-white/10 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { Plus } from "lucide-react";

export default function GameCard({ game, activeTab, owned, onSelect, onAdd }) {
  return (
    <div
      onClick={() => onSelect(game)}
      className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-indigo-500/50 cursor-pointer group transition-all"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{game.title}</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            {game.genre} • {game.platform}
          </p>
        </div>

        {activeTab === "store" && !owned && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(game._id);
            }}
            className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
            title="Add to Collection"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

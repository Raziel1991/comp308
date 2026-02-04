import Game from "../models/Game.js";
import User from "../models/User.js";

// Public: list all games
export async function listAll(req, res) {
  const q = (req.query.q || "").trim();
  const filter = q
    ? {
        $or: [
          { title: new RegExp(q, "i") },
          { genre: new RegExp(q, "i") },
          { developer: new RegExp(q, "i") },
          { platform: new RegExp(q, "i") }
        ]
      }
    : {};

  const games = await Game.find(filter).sort({ title: 1 });
  res.json(games);
}

// Protected: CRUD for games
export async function createGame(req, res) {
  const { title, genre, platform, releaseYear, developer, rating, description } = req.body;

  const missing = [title, genre, platform, releaseYear, developer, rating, description]
    .some(v => v === undefined || v === null || v === "");

  if (missing) return res.status(400).json({ msg: "All game fields are required." });

  const game = await Game.create({ title, genre, platform, releaseYear, developer, rating, description });
  res.status(201).json(game);
}

export async function updateGame(req, res) {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!game) return res.status(404).json({ msg: "Game not found" });
  res.json(game);
}

export async function deleteGame(req, res) {
  const game = await Game.findByIdAndDelete(req.params.id);
  if (!game) return res.status(404).json({ msg: "Game not found" });

  await User.updateMany({ games: game._id }, { $pull: { games: game._id } });
  res.json({ msg: "Deleted", id: game._id });
}

// Protected: user collection
//protection    

//if (!req.user?.id) return res.status(401).json({ msg: "Unauthorized" });

export async function myCollection(req, res) {
  const includeDetails = String(req.query.details).toLowerCase() === "true";
  // select both names just in case older records used gamesOwned
  const user = await User.findById(req.user.id)
    .select("games gamesOwned")
    .populate(includeDetails ? "games" : "");

  if (!user) return res.status(404).json({ msg: "User not found" });

  const gamesField = user.games || user.gamesOwned || [];

  if (includeDetails) return res.json(gamesField);
  return res.json(gamesField.map(g => g.toString()));
} 

export async function addToCollection(req, res) {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).json({ msg: "gameId required" });

  const game = await Game.findById(gameId);
  if (!game) return res.status(404).json({ msg: "Game not found" });

  const user = await User.findById(req.user.id).select("games gamesOwned");
  if (!user) return res.status(404).json({ msg: "User not found" });

  // normalize to `games` for consistent handling
  if (!user.games) user.games = user.gamesOwned || [];

  const already = user.games.some(id => id.toString() === gameId);
  if (!already) user.games.push(game._id);

  await user.save();
  res.json((user.games || []).map(g => g.toString()));
} 

export async function removeFromCollection(req, res) {
  const { gameId } = req.params;

  const user = await User.findById(req.user.id).select("games gamesOwned");
  if (!user) return res.status(404).json({ msg: "User not found" });

  if (!user.games) user.games = user.gamesOwned || [];

  user.games = user.games.filter(id => id.toString() !== gameId);
  await user.save();

  res.json((user.games || []).map(g => g.toString()));
}

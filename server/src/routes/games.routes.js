import { Router } from "express";
import {
  addToCollection,
  createGame,
  deleteGame,
  listAll,
  myCollection,
  removeFromCollection,
  updateGame
} from "../controllers/games.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listAll);

router.get("/my-collection", requireAuth, myCollection);
router.post("/add", requireAuth, addToCollection);
router.delete("/remove/:gameId", requireAuth, removeFromCollection);

// CRUD for games (protected)
router.post("/", requireAuth, createGame);
router.put("/:id", requireAuth, updateGame);
router.delete("/:id", requireAuth, deleteGame);

export default router;

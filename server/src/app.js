import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import { authRoutes } from "./routes/auth.routes.js";

import gamesRoutes from "./routes/games.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true
    })
  );

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/games", gamesRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

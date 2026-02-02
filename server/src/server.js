import "dotenv/config";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";
import { seedGamesIfEmpty } from "./seed/seedGames.js";

const PORT = process.env.PORT || 5000;

await connectDb(process.env.MONGO_URI);
await seedGamesIfEmpty();

const app = createApp();
console.log("MONGO_URI:", process.env.MONGO_URI);
app.listen(PORT, () => console.log(` API running on http://localhost:${PORT}`));

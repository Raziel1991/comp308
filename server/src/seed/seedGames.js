import Game from "../models/Game.js";

const SEED = [
  {
    title: "Cyberpunk 2077",
    genre: "RPG",
    platform: "PC/PS/Xbox",
    releaseYear: 2020,
    developer: "CD Projekt Red",
    rating: 4.5,
    description: "An open-world, action-adventure story set in Night City."
  },
  {
    title: "Elden Ring",
    genre: "Soulslike",
    platform: "PC/PS/Xbox",
    releaseYear: 2022,
    developer: "FromSoftware",
    rating: 4.9,
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring."
  },
  {
    title: "The Witcher 3",
    genre: "RPG",
    platform: "PC/PS/Xbox/Switch",
    releaseYear: 2015,
    developer: "CD Projekt Red",
    rating: 4.8,
    description: "Become a professional monster slayer and embark on an adventure of epic proportions."
  },
  {
    title: "Stardew Valley",
    genre: "Simulation",
    platform: "PC/Console/Mobile",
    releaseYear: 2016,
    developer: "ConcernedApe",
    rating: 4.7,
    description: "You have inherited your grandfather's old farm plot in Stardew Valley."
  },
  {
    title: "Hades",
    genre: "Roguelike",
    platform: "PC/Console",
    releaseYear: 2020,
    developer: "Supergiant Games",
    rating: 4.9,
    description: "Defy the god of the dead as you hack and slash out of the Underworld."
  },
  {
    title: "Doom Eternal",
    genre: "FPS",
    platform: "PC/PS/Xbox/Switch",
    releaseYear: 2020,
    developer: "id Software",
    rating: 4.6,
    description: "Hell's armies have invaded Earth. Become the Slayer in an epic single-player campaign."
  }
];

export async function seedGamesIfEmpty() {
  const count = await Game.countDocuments();
  if (count > 0) return;

  await Game.insertMany(SEED);
  console.log("🌱 Seeded initial games");
}

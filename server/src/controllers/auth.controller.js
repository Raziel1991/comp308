import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function setAuthCookie(res, token) {
  const secure = String(process.env.COOKIE_SECURE).toLowerCase() === "true";

  res.cookie("token", token, {
    httpOnly: true,
    secure,            // true in HTTPS production
    sameSite: "lax",   // localhost ports are still same-site
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  });
}

export async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ msg: "Username and password required." });
  if (password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters." });

  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ msg: "Username already taken." });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, password: hash, games: [] });

  const token = jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
  setAuthCookie(res, token);

  res.status(201).json({ username: user.username });
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Username and password required." });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ msg: "Invalid credentials." });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ msg: "Invalid credentials." });

  const token = jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
  setAuthCookie(res, token);

  res.json({ username: user.username });
}

export async function logout(req, res) {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ msg: "Logged out" });
}

export async function me(req, res) {
  // requireAuth already verified token
  res.json({ username: req.user.username, id: req.user.id });
}


res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.COOKIE_SECURE === "true",
  maxAge: 7 * 24 * 60 * 60 * 1000
});


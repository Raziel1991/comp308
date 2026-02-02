import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  // 1) Cookie token (preferred)
  const cookieToken = req.cookies?.token;

  // 2) x-auth-token (legacy)
  const headerToken = req.headers["x-auth-token"];

  // 3) Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

  const token = cookieToken || headerToken || bearerToken;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support multiple payload shapes
    const id =
      decoded.id ||
      decoded.userId ||
      decoded._id ||
      decoded.sub ||
      decoded.user?.id ||
      decoded.user?._id;

    if (!id) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    req.user = {
      id: String(id),
      username: decoded.username
    };

    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid" });
  }
}

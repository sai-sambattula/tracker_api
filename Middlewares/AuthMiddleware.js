import { verifyAccesToken } from "../Utils/jwtutils.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccesToken(token);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}
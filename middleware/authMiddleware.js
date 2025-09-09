const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided!" });

  const parts = authHeader.split(" ");
  if (parts !== 2) return res.status(401).json({ error: " Token Error!" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: "Token malformed!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token!" });
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  });
}

module.exports = authMiddleware;

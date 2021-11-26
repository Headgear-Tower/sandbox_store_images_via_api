const jwt = require("jsonwebtoken");
const config = require("config");

function authentication(req, res, next) {
  // next passes control to the next middleware function

  const token = req.headers["x-auth-token"];

  if (!token) {
    res.status(401).send("Access denied. No token provided");
    return;
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = authentication;

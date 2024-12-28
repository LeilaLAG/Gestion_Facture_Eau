const jwt = require("jsonwebtoken");
const Security_key = process.env.SECURE_KEY; // Store securely in .env

function refreshToken(req, res) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, Security_key);

    const newToken = jwt.sign({ userId: decoded.userId }, Security_key, {
      expiresIn: "1h",
    });
    res.cookie("authToken", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    return res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = refreshToken
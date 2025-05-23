const jwt = require('jsonwebtoken');

const Security_key = process.env.SECURE_KEY; // Store securely in .env

function authenticate(req, res, next) {
  const token = req.cookies.authToken; // Get the token from the cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, Security_key);
    req.user = decoded;
    next(); // Proceed to the next route handler
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = authenticate;

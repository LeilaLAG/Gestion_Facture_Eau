const jwt = require('jsonwebtoken');

const Security_key = process.env.SECURE_KEY; // Store securely in .env

function authenticate(req, res, next) {
  const token = req.cookies.authToken; // Get the token from the cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, Security_key);
    const currentTime = Math.floor(Date.now() / 1000);

    // Attach user data to the request object
    req.user = decoded;

    // Check if the token is within 10 minutes of expiration
    const timeToExpiration = decoded.exp - currentTime;
    if (timeToExpiration < 600) { // Less than 10 minutes
      const newToken = jwt.sign({ userId: decoded.userId }, Security_key, { expiresIn: '1h' });
      res.cookie('authToken', newToken, {
        httpOnly: true,
        secure: true, // Use HTTPS in production
        sameSite: 'Strict',
        maxAge: 3600000, // 1 hour
      });
    }

    next(); // Proceed to the next route handler
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = authenticate;

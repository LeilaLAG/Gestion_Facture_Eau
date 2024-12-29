const users = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const Security_key = process.env.SECURE_KEY;

async function login(req, res) {
    try{
        const { email, password } = req.body;
      
        const logingInUser = await users.findOne({ email : email });
      
        if (logingInUser === undefined) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      
        const isPasswordMatch = await bcrypt.compare(password, logingInUser.password);
      
        if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      
        const token = jwt.sign({ userId: logingInUser._id }, Security_key, {
          expiresIn: '1h', 
        });
      
        res.cookie('authToken', token, {
          httpOnly: true, // Prevents access to the cookie via JavaScript
          secure: true, // Set to true in production for HTTPS
          sameSite: 'Strict', // Prevents the cookie from being sent in cross-site requests
          maxAge: 3600000, // Set cookie expiration time (1 hour)
        });
      
        return res.status(200).json({ message: 'Login successful'});
    }
    catch(error){
        return res.status(500).json({ message: 'An error occurred during login.', error });
    }
}

module.exports = { login };

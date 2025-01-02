const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Security_key = process.env.SECURE_KEY;

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};

const getOneUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ _id: userId });
  res.status(200).json({ user });
};

const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const addedUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    return res.status(200).json({ addedUser });
  } catch (err) {
    return res.status(400).json({ error: "Error adding a new user" });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userToUpdate = await User.findOneAndUpdate({ _id: userId }, req.body);
    return res.status(200).json({ userToUpdate });
  } catch (err) {
    return res.status(400).json({ error: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const userToDelete = await User.findOneAndDelete({ _id: userId });
  res.status(200).json({ userToDelete });
};

const resetPassword = async (req, res) => {
  const { email, userId } = req.body;

  try {
    // Generate a JWT token
    const Security_key = "your_security_key"; // Replace with your secret key
    const token = jwt.sign({ userId: userId }, Security_key, {
      expiresIn: "1h",
    });

    // Create password reset link
    const requestPasswordResetUrl = `http://localhost:8000/request-password-reset?token=${token}`;

    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anassboussalem8@gmail.com", // Replace with your email
        pass: "your-app-password", // Replace with your Gmail app password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: "anassboussalem8@gmail.com", // Sender's email
      to: email, // Recipient's email
      subject: "Password Reset",
      text: `Reset your password here: ${requestPasswordResetUrl}`,
    });

    return res.status(200).send("Password reset email sent");
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Error sending email" });
  }
};


module.exports = { getUsers, getOneUser, createUser, updateUser, deleteUser , resetPassword };

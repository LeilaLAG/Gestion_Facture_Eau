const User = require("../models/User");
const bcrypt = require('bcrypt')

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
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const addedUser = await User.create({...req.body , password : hashedPassword});
    return res.status(200).json({ addedUser });
  }
  catch(err){
    return res.status(400).json({ error : "Error adding a new user" });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  const userToUpdate = await User.findOneAndUpdate({ _id: userId }, req.body);
  res.status(200).json({ userToUpdate });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const userToDelete = await User.findOneAndDelete({ _id: userId });
  res.status(200).json({ userToDelete });
};

module.exports = { getUsers, getOneUser, createUser, updateUser, deleteUser };

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  function: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  privileges: {
    clients: { type: Boolean, default: false },
    compteurs: { type: Boolean, default: false },
    factures: { type: Boolean, default: false },
    revenus: { type: Boolean, default: false },
    charges: { type: Boolean, default: false },
    caisse: { type: Boolean, default: false },
  },
  crudAccess: {
    clients: {
      add: { type: Boolean, default: false },
      mod: { type: Boolean, default: false },
      dlt: { type: Boolean, default: false },
    },
    compteurs: {
      add: { type: Boolean, default: false },
      mod: { type: Boolean, default: false },
      dlt: { type: Boolean, default: false },
    },
    factures: {
      add: { type: Boolean, default: false },
      mod: { type: Boolean, default: false },
      dlt: { type: Boolean, default: false },
    },
    revenus: {
      add: { type: Boolean, default: false },
      mod: { type: Boolean, default: false },
      dlt: { type: Boolean, default: false },
    },
    charges: {
      add: { type: Boolean, default: false },
      mod: { type: Boolean, default: false },
      dlt: { type: Boolean, default: false },
    },
  },
});

module.exports = mongoose.model("User", UserSchema);

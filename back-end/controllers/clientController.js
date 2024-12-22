const Client = require("../models/Client");

const getClients = async (req, res) => {
  const Clients = await Client.find({});
  res.status(200).json({ Clients });
};

const getOneClient = async (req, res) => {
  const { clientId } = req.body;
  const client = await Client.findOne({ _id: clientId });
  res.status(200).json({ client });
};

const createClient = async (req, res) => {
  const addedClient = await Client.create(req.body);
  res.status(200).json({ addedClient });
};

const updateClient = async (req, res) => {
  const { clientId } = req.params;

  const clientToUpdate = await Client.findOneAndUpdate(
    { _id: clientId },
    req.body
  );
  res.status(200).json({ clientToUpdate });
};

const deleteClient = async (req, res) => {
  const { clientId } = req.params;

  const clientToDelete = await Client.findOneAndDelete({ _id: clientId });
  res.status(200).json({ clientToDelete });
};

module.exports = {
  getClients,
  getOneClient,
  createClient,
  updateClient,
  deleteClient,
};

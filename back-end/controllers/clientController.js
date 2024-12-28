const Client = require("../models/Client");

const getClients = async (req, res) => {
  const {companyId} = req.params
  const Clients = await Client.find({companyId : companyId});
  res.status(200).json({ Clients });
};

const getOneClient = async (req, res) => {
  const { clientId } = req.body;
  const client = await Client.findOne({ _id: clientId });
  res.status(200).json({ client });
};

const createClient = async (req, res) => {
  try {
    const checkClient = await Client.findOne({companyId : req.body.companyId , $or : [
      {numClient : req.body.numClient},
    ]})

    if(checkClient){
      return res.status(400).json({error : "client exist deja"})
    }
    const addedClient = await Client.create(req.body);
    return res.status(200).json({ addedClient });
  }
  catch(err){
    return res.status(400).json({error : "Server Error"})
  }
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

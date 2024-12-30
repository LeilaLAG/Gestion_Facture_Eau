const Client = require("../models/Client");

const getClients = async (req, res) => {
  try {
    const {companyId} = req.params
    const Clients = await Client.find({companyId : companyId});
    return res.status(200).json({ Clients });
  }
  catch(err){
    return res.status(400).json({error : "Server Error getting all clients"})
  }
};

const getOneClient = async (req, res) => {
  try{
    const { clientId , companyId } = req.params;
    const client = await Client.findOne({companyId : companyId , _id: clientId });
    return res.status(200).json({ client });
  }
  catch(err){
    return res.status(400).json({error : "Server Error getting one client"})
  }
};

const createClient = async (req, res) => {
  const { companyId } = req.body;
  
  try {
    const maxNumClient = await Client.findOne({companyId : companyId}).sort({ numClient: -1 })
    const newMaxNumClient = maxNumClient ? maxNumClient.numClient+1 : 1
    const addedClient = await Client.create({...req.body , numClient : newMaxNumClient});
    return res.status(200).json({ addedClient });
  }
  catch(err){
    return res.status(400).json({error : "Server Error creatiing client"})
  }
};

const updateClient = async (req, res) => {
  
  try {
    const { clientId } = req.params;

    const clientToUpdate = await Client.findOneAndUpdate(
      { _id: clientId },
      {...req.body , modified_at : new Date()}
    );
    return res.status(200).json({ clientToUpdate });
  }
  catch(err){
    return res.status(400).json({error : "Server Error updating client"})
  }

};

const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;
  
    const clientToDelete = await Client.findOneAndDelete({ _id: clientId });
    await Client.findOneAndUpdate(
      { _id: clientId },
      req.body
    );
    return res.status(200).json({ clientToDelete });

  }
  catch(err){
    return res.status(400).json({error : "Server Error deletting client"})
  }
};

module.exports = {
  getClients,
  getOneClient,
  createClient,
  updateClient,
  deleteClient,
};

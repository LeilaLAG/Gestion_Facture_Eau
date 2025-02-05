const Compteur = require("../models/Compteur");

const getCompteurs = async (req, res) => {
  try {
    const { companyId } = req.params;
    const compteurs = await Compteur.find({ companyId: companyId });
    return res.status(200).json({ compteurs });
  } catch (err) {
    return res.status(400).json({ error: "Server Error getting all clients" });
  }
};

const getOneCompteur = async (req, res) => {
  try {
    const { compteurId, companyId } = req.params;
    const compteur = await Compteur.findOne({
      companyId: companyId,
      _id: compteurId,
    });
    return res.status(200).json({ compteur });
  } catch (err) {
    return res.status(400).json({ error: "Server Error getting one client" });
  }
};

const createCompteur = async (req, res) => {
  const { companyId } = req.body;

  try {
    const compteursNumber = (
      await Compteur.find({ numClient: req.body.numClient })
    ).length;

    if (compteursNumber >= 5) {
      return res
        .status(200)
        .json({
          maxCompteurs: "5 est le max nombre des compteurs pour un client",
        });
    }
    const maxNumCompteur = await Compteur.findOne({
      companyId: companyId,
    }).sort({ numCompteur: -1 });
    const newMaxNumCompteur = maxNumCompteur
      ? maxNumCompteur.numCompteur + 1
      : 1;
    const addedCompteur = await Compteur.create({
      ...req.body,
      numCompteur: newMaxNumCompteur,
    });
    return res.status(200).json({ addedCompteur });
  } catch (err) {
    return res.status(400).json({ error: "Server Error creating client" });
  }
};

const updateCompteur = async (req, res) => {
  try {
    const { compteurId } = req.params;

    
    if(req.body.updateStartPointFromFacture){
      const compteurToUpdate = await Compteur.findOneAndUpdate(
        { _id: compteurId },
        {startPoint : req.body.updateStartPointFromFacture, modified_at: new Date() }
      );
      return res.status(200).json({ compteurToUpdate });
    }
    else{
      const compteurToUpdate = await Compteur.findOneAndUpdate(
        { _id: compteurId },
        { ...req.body, modified_at: new Date() }
      );
      return res.status(200).json({ compteurToUpdate });
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const deleteCompteur = async (req, res) => {
  try {
    const { compteurId } = req.params;

    const compteurToDelete = await Compteur.findOneAndDelete({
      _id: compteurId,
    });
    // await Compteur.findOneAndUpdate({ _id: compteurId }, req.body);
    return res.status(200).json({ compteurToDelete });
  } catch (err) {
    return res.status(400).json({ error: "Server Error deletting client" });
  }
};

const deleteClientCompteurs = async (req, res) => {
  try {
    const { clientId } = req.params;
    const clientCompteursToDelete = await Compteur.deleteMany({
      numClient: clientId,
    });
    return res.status(200).json(clientCompteursToDelete);
  } catch (err) {
    return res.status(400).json({ error: "Server Error deletting client" });
  }
};

module.exports = {
  getCompteurs,
  getOneCompteur,
  createCompteur,
  updateCompteur,
  deleteCompteur,
  deleteClientCompteurs,
};

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
    const compteur = await Compteur.find({
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
    return res.status(400).json({ error: "Server Error creatiing client" });
  }
};

const updateCompteur = async (req, res) => {
  try {
    const { compteurId } = req.params;

    const compteurToUpdate = await Compteur.findOneAndUpdate(
      { _id: compteurId },
      { ...req.body, modified_at: new Date() }
    );
    return res.status(200).json({ compteurToUpdate });
  } catch (err) {
    return res.status(400).json({ error: "Server Error updating client" });
  }
};

const deleteCompteur = async (req, res) => {
  try {
    const { compteurId } = req.params;

    const compteurToDelete = await Compteur.findOneAndDelete({
      _id: compteurId,
    });
    await Compteur.findOneAndUpdate({ _id: compteurId }, req.body);
    return res.status(200).json({ compteurToDelete });
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
};

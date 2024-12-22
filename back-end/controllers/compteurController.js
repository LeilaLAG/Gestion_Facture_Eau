const Compteur = require("../models/Compteur");

const getCompteurs = async (req, res) => {
  const compteurs = await Compteur.find({});
  res.status(200).json({ compteurs });
};

const getOneCompteur = async (req, res) => {
  const { compteurId } = req.body;
  const compteur = await Compteur.find({ _id: compteurId });
  res.status(200).json({ compteur });
};

const createCompteur = async (req, res) => {
  const addedCompteur = await Compteur.create(req.body);
  res.status(200).json({ addedCompteur });
};

const updateCompteur = async (req, res) => {
  const { compteurId } = req.params;

  const compteurToUpdate = await Compteur.findOneAndUpdate(
    { _id: compteurId },
    req.body
  );
  res.status(200).json({ compteurToUpdate });
};

const deleteCompteur = async (req, res) => {
  const { compteurId } = req.params;

  const compteurToDelete = await Compteur.findOneAndDelete({ _id: compteurId });
  res.status(200).json({ compteurToDelete });
};

module.exports = {
  getCompteurs,
  getOneCompteur,
  createCompteur,
  updateCompteur,
  deleteCompteur,
};

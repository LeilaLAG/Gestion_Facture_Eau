const Facture = require("../models/Facture");

const getFactures = async (req, res) => {
  const factures = await Facture.find({});
  res.status(200).json({ factures });
};

const getOneFacture = async (req, res) => {
  const { factureId } = req.params;
  const facture = await Facture.findOne({ _id: factureId });
  res.status(200).json({ facture });
};

const createFacture = async (req, res) => {
  const addedFacture = await Facture.create(req.body);
  res.status(200).json({ addedFacture });
};

const updateFacture = async (req, res) => {
  const { factureId } = req.params;

  const factureToUpdate = await Facture.findOneAndUpdate(
    { _id: factureId },
    req.body
  );
  res.status(200).json({ factureToUpdate });
};

const deleteFacture = async (req, res) => {
  const { factureId } = req.params;

  const factureToDelete = await Facture.findOneAndDelete({ _id: factureId });
  res.status(200).json({ factureToDelete });
};

module.exports = {
  getFactures,
  getOneFacture,
  createFacture,
  updateFacture,
  deleteFacture,
};

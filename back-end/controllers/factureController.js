const Facture = require("../models/Facture");

const getFactures = async (req, res) => {
  try {
    const { companyId } = req.params;
    const factures = await Facture.find({ companyId });
    return res.status(200).json({ factures });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all factures" });
  }
};

const getOneFacture = async (req, res) => {
  try {
    const { factureId, companyId } = req.params;
    const facture = await Facture.findOne({ numFacture: factureId, companyId });
    return res.status(200).json({ facture });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting facture" });
  }
};

const createFacture = async (req, res) => {
  try {
    const { companyId } = req.body;
    const maxNumFacture = await Facture.findOne({
      companyId: companyId,
    }).sort({ numFacture: -1 });
    const newMaxNumFacture = maxNumFacture ? maxNumFacture.numFacture + 1 : 1;
    const addedFacture = await Facture.create({
      ...req.body,
      numFacture: newMaxNumFacture,
    });
    return res.status(200).json({ addedFacture });
  } catch (err) {
    return res.status(400).json({ error: "Server Error creating facture" });
  }
};

const updateFacture = async (req, res) => {
  const { factureId } = req.params;

  try {
    const factureToUpdate = await Facture.findOneAndUpdate(
      { numFacture: factureId },
      req.body
    );
    return res.status(200).json({ factureToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating facture" });
  }
};

const deleteFacture = async (req, res) => {
  const { factureId } = req.params;

  try {
    const factureToDelete = await Facture.findOneAndDelete({
      _id: factureId,
    });
    return res.status(200).json({ factureToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting facture" });
  }
};

module.exports = {
  getFactures,
  getOneFacture,
  createFacture,
  updateFacture,
  deleteFacture,
};

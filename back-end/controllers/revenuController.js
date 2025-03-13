const Revenu = require("../models/Revenu");

const getRevenus = async (req, res) => {
  try {
    const { companyId } = req.params;
    const revenus = await Revenu.find({ companyId });
    res.status(200).json({ revenus });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all revenus" });
  }
};

const getOneRevenu = async (req, res) => {
  try {
    const { revenuId } = req.params;
    const revenu = await Revenu.findOne({ _id: revenuId });
    res.status(200).json({ revenu });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting one revenu" });
  }
};

const createRevenu = async (req, res) => {
  try {
    const addedRevenu = await Revenu.create(req.body);
    return res.status(200).json({ addedRevenu });
  } catch (err) {
    return res.status(400).json({
      error: "Un erreur est servenu lors de la creaction de Revenu",
    });
  }
};

const updateRevenu = async (req, res) => {
  try {
    const { revenuId } = req.params;

    const RevenuToUpdate = await Revenu.findOneAndUpdate(
      { _id: revenuId },
      req.body
    );
    res.status(200).json({ RevenuToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating revenu" });
  }
};

const deleteRevenu = async (req, res) => {
  try {
    const { revenuId } = req.params;

    const RevenuToDelete = await Revenu.findOneAndDelete({ _id: revenuId });
    res.status(200).json({ RevenuToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting revenu" });
  }
};

module.exports = {
  getRevenus,
  getOneRevenu,
  createRevenu,
  updateRevenu,
  deleteRevenu,
};

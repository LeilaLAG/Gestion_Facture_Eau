const Tranche = require("../models/Tranche");

const getTranches = async (req, res) => {
  try {
    const { companyId } = req.params;
    const tranches = await Tranche.find({ companyId });
    res.status(200).json({ tranches });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all tranches" });
  }
};

const getOneTranche = async (req, res) => {
  try {
    const { trancheId, companyId } = req.params;
    const tranche = await Tranche.findOne({ _id: trancheId, companyId });
    res.status(200).json({ tranche });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting one tranche" });
  }
};

const createTranche = async (req, res) => {
  try {
    const addedTranche = await Tranche.create(req.body);
    res.status(200).json({ addedTranche });
  } catch (error) {
    return res.status(400).json({ error: "Server Error creating tranche" });
  }
};

const updateTranche = async (req, res) => {
  try {
    const { trancheId } = req.params;

    const trancheToUpdate = await Tranche.findOneAndUpdate(
      { _id: trancheId },
      req.body
    );
    res.status(200).json({ trancheToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating tranche" });
  }
};

const deleteTranche = async (req, res) => {
  try {
    const { trancheId } = req.params;

    const trancheToDelete = await Tranche.findOneAndDelete({ _id: trancheId });
    res.status(200).json({ trancheToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting tranche" });
  }
};

module.exports = {
  getTranches,
  getOneTranche,
  createTranche,
  updateTranche,
  deleteTranche,
};

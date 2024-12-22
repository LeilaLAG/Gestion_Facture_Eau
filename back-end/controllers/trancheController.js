const Tranche = require("../models/Tranche");

const getTranches = async (req, res) => {
  const tranches = await Tranche.find({});
  res.status(200).json({ tranches });
};

const getOneTranche = async (req, res) => {
  const { trancheId } = req.body;
  const tranche = await Tranche.findOne({ _id: trancheId });
  res.status(200).json({ tranche });
};

const createTranche = async (req, res) => {
  const addedTranche = await Tranche.create(req.body);
  res.status(200).json({ addedTranche });
};

const updateTranche = async (req, res) => {
  const { trancheId } = req.params;

  const trancheToUpdate = await Tranche.findOneAndUpdate(
    { _id: trancheId },
    req.body
  );
  res.status(200).json({ trancheToUpdate });
};

const deleteTranche = async (req, res) => {
  const { trancheId } = req.params;

  const trancheToDelete = await Tranche.findOneAndDelete({ _id: trancheId });
  res.status(200).json({ trancheToDelete });
};

module.exports = {
  getTranches,
  getOneTranche,
  createTranche,
  updateTranche,
  deleteTranche,
};

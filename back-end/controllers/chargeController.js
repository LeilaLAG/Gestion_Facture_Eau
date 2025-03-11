const Charge = require("../models/Charge");

const getCharges = async (req, res) => {
  try {
    const { companyId } = req.params;
    const charges = await Charge.find({ companyId });
    res.status(200).json({ charges });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all Charges" });
  }
};

const getOneCharge = async (req, res) => {
  try {
    const { chargeId } = req.params;
    const charge = await Charge.findOne({ _id: chargeId });
    return res.status(200).json({ charge });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting one Charge" });
  }
};

const createCharge = async (req, res) => {
  try {
    const addedCharge = await Charge.create(req.body);
    return res.status(200).json({ addedCharge });
  } catch (err) {
    return res.status(400).json({
      error: "Un erreur est servenu lors de la creaction de Charge",
    });
  }
};

const updateCharge = async (req, res) => {
  try {
    const { chargeId } = req.params;

    const chargeToUpdate = await Charge.findOneAndUpdate(
      { _id: chargeId },
      req.body
    );
    return res.status(200).json({ chargeToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating Charge" });
  }
};

const deleteCharge = async (req, res) => {
  try {
    const { chargeId } = req.params;

    const chargeToDelete = await Charge.findOneAndDelete({ _id: chargeId });
    return res.status(200).json({ chargeToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting Charge" });
  }
};

module.exports = {
  getCharges,
  getOneCharge,
  createCharge,
  updateCharge,
  deleteCharge,
};

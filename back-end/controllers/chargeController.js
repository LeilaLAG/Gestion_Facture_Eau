const Charge = require("../models/Charge");

const getCharges = async (req, res) => {
  try {
    const { companyId } = req.params;
    const Charges = await Charge.find({ companyId });
    res.status(200).json({ Charges });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all Charges" });
  }
};

const getOneCharge = async (req, res) => {
  try {
    const { ChargeId } = req.params;
    const Charge = await Charge.findOne({ _id: ChargeId });
    res.status(200).json({ Charge });
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
    const { ChargeId } = req.params;

    const ChargeToUpdate = await Charge.findOneAndUpdate(
      { _id: ChargeId },
      req.body
    );
    res.status(200).json({ ChargeToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating Charge" });
  }
};

const deleteCharge = async (req, res) => {
  try {
    const { ChargeId } = req.params;

    const ChargeToDelete = await Charge.findOneAndDelete({ _id: ChargeId });
    res.status(200).json({ ChargeToDelete });
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

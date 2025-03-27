const Credit = require("../models/Credit");

const getCredits = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { year, month, compId } = req.query;

    const filter = { companyId };
    if (year) {
      filter.$expr = { $eq: [{ $year: "$datePaiement" }, parseInt(year)] };
    }

    if (month) {
      filter.$expr = {
        $and: [
          { $eq: [{ $year: "$datePaiement" }, parseInt(year)] }, // Ensure year matches
          { $eq: [{ $month: "$datePaiement" }, parseInt(month)] }, // Ensure month matches
        ],
      };
    }
    const Credits = await Credit.find(filter);
    return res.status(200).json({ Credits });
  } catch (error) {
    return res.status(400).json({
      error: "Un erreur est servenu lors de la recupération des Credits",
    });
  }
};

const getOneCredit = async (req, res) => {
  try {
    const { creditId, companyId } = req.params;
    const credit = await Credit.findOne({ _id: creditId, companyId });
    return res.status(200).json({ credit });
    // console.log({ credit });
  } catch (error) {
    console.log("error");
    return res.status(400).json({ error: "Server Error getting one Credit" });
  }
};

const createCredit = async (req, res) => {
  try {
    const addedCredit = await Credit.create(req.body);
    return res.status(200).json({ addedCredit });
  } catch (err) {
    return res.status(400).json({
      error: "Un erreur est servenu lors de la creaction de Credit",
    });
  }
};

const updateCredit = async (req, res) => {
  try {
    const { creditId } = req.params;

    const CreditToUpdate = await Credit.findOneAndUpdate(
      { _id: creditId },
      req.body
    );
    return res.status(200).json({ CreditToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating Credit" });
  }
};

const deleteCredit = async (req, res) => {
  try {
    const { CreditId } = req.params;

    const CreditToDelete = await Credit.findOneAndDelete({ _id: CreditId });
    return res.status(200).json({ CreditToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting Credit" });
  }
};

module.exports = {
  getCredits,
  getOneCredit,
  createCredit,
  updateCredit,
  deleteCredit,
};

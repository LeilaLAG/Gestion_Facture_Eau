const Company = require("../models/Company");

const getCompanies = async (req, res) => {
  const companies = await Company.find({});
  res.status(200).json({ companies });
};

const getOneCompanie = async (req, res) => {
  const { companyName } = req.params;
  const companie = await Company.findOne({ companyName: companyName });
  res.status(200).json({ companie });
};

const createCompany = async (req, res) => {
  try {
    const addedCompany = await Company.create(req.body);
    return res.status(200).json({ addedCompany });
  } catch (err) {
    return res
      .status(400)
      .json({
        error: "Un erreur est servenu lors de la creaction de votre société",
      });
  }
};

const updateCompany = async (req, res) => {
  const { companyId } = req.params;

  const companyToUpdate = await Company.findOneAndUpdate(
    { _id: companyId },
    req.body
  );
  res.status(200).json({ companyToUpdate });
};

const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  const companyToDelete = await Company.findOneAndDelete({ _id: companyId });
  res.status(200).json({ companyToDelete });
};

module.exports = {
  getCompanies,
  getOneCompanie,
  createCompany,
  updateCompany,
  deleteCompany,
};

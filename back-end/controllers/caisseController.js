const Revenu = require("../models/Revenu");
const Charge = require("../models/Charge");
const Facture = require("../models/Facture");

async function caisseStats(req, res) {
  const { companyId } = req.params;
  const {month} = req.query

  function filterCaisseData(dataDate) {
    const currentYear = new Date().getFullYear();
    const filter = { companyId };
    filter.$expr = {
      $and: [
        { $eq: [{ $year: dataDate }, parseInt(currentYear)] },
        { $eq: [{ $month: dataDate }, parseInt(month)] },
      ],
    };
    return filter;
  }

  const [revenuStats, chargeStats, factureStats , unpaidFactureStats] = await Promise.all([
    Revenu.aggregate([
      { $match: filterCaisseData("$dateRevenu") },
      { $group: { _id: null, total: { $sum: "$montant" } } },
    ]),
    Charge.aggregate([
      { $match: filterCaisseData("$datePaiment") },
      { $group: { _id: null, total: { $sum: "$montant" } } },
    ]),
    Facture.aggregate([
      { $match: filterCaisseData("$dateFacture") },
      { $match: { painementStatus: "Payée" } },
      { $group: { _id: null, total: { $sum: "$totalFacture" } } },
    ]),
    Facture.aggregate([
      { $match: filterCaisseData("$dateFacture") },
      { $match: { painementStatus: "Non payée" } },
      { $group: { _id: null, total: { $sum: "$totalFacture" } } },
    ]),
  ]);

  return res.status(200).json({
    totalRevenu: revenuStats.length ? revenuStats[0].total : 0,
    totalCharge: chargeStats.length ? chargeStats[0].total : 0,
    totalFactures: factureStats.length ? factureStats[0].total : 0,
    totaleUnpaidFactureStats: unpaidFactureStats.length ? unpaidFactureStats[0].total : 0,
  });
}

module.exports = { caisseStats };

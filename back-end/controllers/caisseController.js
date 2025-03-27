const Revenu = require("../models/Revenu");
const Charge = require("../models/Charge");
const Facture = require("../models/Facture");
const Client = require("../models/Client");
const Credit = require("../models/Credit");

async function caisseStats(req, res) {
  const { companyId } = req.params;
  const {month} = req.query
  const {year} = req.query

  function filterCaisseData(dataDate) {
    const filter = { companyId };
    filter.$expr = {
      $and: [
        { $eq: [{ $year: dataDate }, parseInt(year)] },
        { $eq: [{ $month: dataDate }, parseInt(month)] },
      ],
    };
    return filter;
  }

  const [revenuStats, chargeStats, factureStats , unpaidFactureStats , allFactures , factureNonPaye , facturePaye , creditsPaye ,  clients] = await Promise.all([
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

    Facture.find(filterCaisseData("$dateFacture")),

    Facture.find({companyId , painementStatus: "Non payée" }),

    Facture.aggregate([
      { $match: filterCaisseData("$dateFacture") },
      { $match: { painementStatus: "Payée" } },
    ]),

    Credit.aggregate([
      { $match: filterCaisseData("$datePaiement") },
      { $group: { _id: null, total: { $sum: "$montantPaye" } } },
    ]),
    
    Client.find({companyId}),
  ]);

  return res.status(200).json({
    totalRevenu: revenuStats.length ? revenuStats[0].total : 0,
    totalCharge: chargeStats.length ? chargeStats[0].total : 0,
    totalFactures: factureStats.length ? factureStats[0].total : 0,
    totaleUnpaidFactureStats: unpaidFactureStats.length ? unpaidFactureStats[0].total : 0,
    allFactures : allFactures,
    factureNonPaye : factureNonPaye,
    facturePaye : facturePaye,
    creditsPaye : creditsPaye.length ? creditsPaye[0].total : 0,
    clients : clients
  });
}

module.exports = { caisseStats };

const Revenu = require('../models/Revenu')
const Charge = require('../models/Charge')
const Facture = require('../models/Facture')

async function caisseStats(req, res) {
    const { companyId } = req.params;
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    const [revenuStats, chargeStats, factureStats] = await Promise.all([
        Revenu.aggregate([
            { $match: { companyId, dateRevenu: { $gte: startOfYear, $lt: endOfYear } } },
            { $group: { _id: null, total: { $sum: "$montant" } } }
        ]),
        Charge.aggregate([
            { $match: { companyId, dateGeneration: { $gte: startOfYear, $lt: endOfYear } } },
            { $group: { _id: null, total: { $sum: "$montant" } } }
        ]),
        Facture.aggregate([
            { $match: { companyId, dateFacture: { $gte: startOfYear, $lt: endOfYear } } },
            { $group: { _id: null, total: { $sum: "$totalFacture" } } }
        ])
    ]);

    return res.status(200).json({
        totalRevenu: revenuStats.length ? revenuStats[0].total : 0,
        totalCharge: chargeStats.length ? chargeStats[0].total : 0,
        totalFactures: factureStats.length ? factureStats[0].total : 0
    });
}

module.exports = { caisseStats };

const Facture = require("../models/Facture");
const Compteur = require("../models/Compteur");
const Client = require("../models/Client");
const Tranche = require("../models/Tranche");

const getFactures = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { year, month } = req.query;

    const filter = { companyId };

    if (year) {
      filter.$expr = { $eq: [{ $year: "$dateFacture" }, parseInt(year)] };
    }

    if (month) {
      filter.$expr = {
        $and: [
          { $eq: [{ $year: "$dateFacture" }, parseInt(year)] }, // Ensure year matches
          { $lte: [{ $month: "$dateFacture" }, parseInt(month)] }, // Ensure month matches
        ],
      };
    }

    const factures = await Facture.find(filter);
    return res.status(200).json({ factures });
  } catch (error) {
    return res.status(500).json({ error: "Server Error getting all factures" });
  }
};

const getOneFacture = async (req, res) => {
  try {
    const { factureId, companyId } = req.params;

    const facture = await Facture.findOne({ _id: factureId, companyId });

    const client = await Client.findOne({
      companyId,
      numClient: facture.numClient,
    });

    const lastSixBills = await Facture.find({
      companyId,
      numClient: facture.numClient,
      dateFacture: { $lte: facture.dateFacture },
    })
      .sort({ dateFacture: -1 })
      .limit(6);

    return res.status(200).json({ facture, client, lastSixBills });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting facture" });
  }
};

const createFacture = async (req, res) => {
  try {
    const {
      companyId,
      numCompteur,
      numClient,
      valeurCompteurPreleve,
      dateFacture,
    } = req.body;

    const lastFacture = await Facture.findOne({
      companyId,
      numCompteur,
      numClient,
    }).sort({ dateFacture: -1 });
    let lastCompteurPrelevement = 0;
    let total = 0;
    let consomation = 0;

    if (lastFacture) {
      if (
        new Date(dateFacture).getFullYear() ===
        new Date(lastFacture.dateFacture).getFullYear()
      ) {
        if (
          new Date(dateFacture).getMonth() -
            new Date(lastFacture.dateFacture).getMonth() !==
          1
        ) {
          return res.status(200).json({
            invalidDateFacture: `La derniere facture générée est ${
              new Date(lastFacture.dateFacture).getMonth() + 1
            }/${new Date(
              lastFacture.dateFacture
            ).getFullYear()}, la date entrée est invalide`,
          });
        }
      } else {
        if (
          new Date(dateFacture).getFullYear() -
            new Date(lastFacture.dateFacture).getFullYear() !==
            1 &&
          new Date(dateFacture).getMonth() !== 11
        ) {
          return res.status(200).json({
            invalidDateFacture: `La derniere facture générée est ${
              new Date(lastFacture.dateFacture).getMonth() + 1
            }/${new Date(
              lastFacture.dateFacture
            ).getFullYear()}, la date entrée est invalide`,
          });
        }
      }
    }

    if (!lastFacture) {
      const CompteurStartPoint = await Compteur.findOne({
        companyId,
        numCompteur,
      });
      lastCompteurPrelevement = CompteurStartPoint.startPoint;
    } else {
      const lastClientBill = await Facture.findOne({
        companyId,
        numClient,
        numCompteur,
      }).sort({ dateFacture: -1 });
      lastCompteurPrelevement = lastClientBill.valeurCompteurPreleve;
    }

    if (valeurCompteurPreleve < lastCompteurPrelevement) {
      if (!req.query.confirmed) {
        return res.status(200).json({
          invalidData: `Etes-vous sure que la valeur de compteur prélevée ${valeurCompteurPreleve} est correcte? ${lastCompteurPrelevement} est la valeur ancienne. Si oui, cela signifie que ce client poccéde un nouvel compteur et par clicker sur "Oui" on va faire un mise à jour au point de depart du compteur et générer la nouvelle facture`,
        });
      } else {
        lastCompteurPrelevement = 0;
        await Compteur.findOneAndUpdate(
          { numCompteur },
          { startPoint: parseFloat(valeurCompteurPreleve) }
        );
      }
    }

    const trancheActive = await Tranche.findOne({ companyId, isActive: true });

    if (!trancheActive) {
      return res.status(200).json({
        activeTranche:
          "If faut activer une tranche pour calculer le totale facture",
      });
    }

    consomation = valeurCompteurPreleve - lastCompteurPrelevement;

    const tranches = await Tranche.find({
      companyId,
      created_at: { $lte: trancheActive.created_at },
    });

    // tranches.map(tranche=>{
    //   total = (consomation-tranche.maxTonnage)*tranche.prix
    // })

    if (tranches.length === 1) {
      total = consomation * tranches[0].prix;
    } else if (tranches.length === 2) {
      if (consomation <= tranches[0].maxTonnage) {
        total = consomation * tranches[0].prix;
      } else {
        total =
          tranches[0].maxTonnage * tranches[0].prix +
          (consomation - tranches[0].maxTonnage) * tranches[1].prix;
      }
    } else if (tranches.length === 3) {
      if (consomation <= tranches[0].maxTonnage) {
        total = consomation * tranches[0].prix;
      } else {
        total = tranches[0].maxTonnage * tranches[0].prix;
        if (consomation - tranches[0].maxTonnage <= tranches[1].maxTonnage) {
          total += (consomation - tranches[0].maxTonnage) * tranches[1].prix;
        } else {
          total +=
            tranches[1].maxTonnage * tranches[1].prix +
            (consomation - (tranches[0].maxTonnage + tranches[1].maxTonnage)) *
              tranches[2].prix;
        }
      }
    }
    // else if(tranches.length === 4){
    //   if(consomation <= tranches[0].maxTonnage){
    //     total = consomation * tranches[0].prix
    //   }
    //   else{
    //     total = tranches[0].maxTonnage * tranches[0].prix
    //     if((consomation-tranches[0].maxTonnage) <= tranches[1].maxTonnage){
    //       total += (consomation-tranches[0].maxTonnage) * tranches[1].prix
    //     }
    //     else if((consomation-tranches[1].maxTonnage) <= tranches[2].maxTonnage){
    //       total += (tranches[1].maxTonnage * tranches[1].prix) + (consomation-(tranches[0].maxTonnage+tranches[1].maxTonnage)) * tranches[2].prix
    //     }
    //     else {
    //       total += (tranches[2].maxTonnage * tranches[3].prix) + (consomation-tranches[3].maxTonnage) * tranches[3].prix
    //     }
    //   }
    // }

    const addedFacture = await Facture.create({
      ...req.body,
      lastCompteurPrelevement: lastCompteurPrelevement,
      totalFacture: total,
    });
    return res.status(200).json({ addedFacture });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const updateFacture = async (req, res) => {
  const { factureId } = req.params;

  const { painementStatus, datePainement } = req.body;

  try {
    const factureToUpdate = await Facture.findOneAndUpdate(
      { _id: factureId },
      {
        ...req.body,
        datePainement: painementStatus === "Non payée" ? null : datePainement,
      }
    );
    return res.status(200).json({ factureToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating facture" });
  }
};

const updateFacturePainementStatus = async (req, res) => {
  const { factureId } = req.params;

  const { painementStatus, datePainement } = req.body;

  try {
    const factureToUpdate = await Facture.findOneAndUpdate(
      { _id: factureId },
      {
        painementStatus: painementStatus,
        datePainement: new Date(),
      }
    );
    return res.status(200).json({ factureToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating facture" });
  }
};

const deleteFacture = async (req, res) => {
  const { factureId } = req.params;

  try {
    const factureToDelete = await Facture.findOneAndDelete({
      _id: factureId,
    });
    return res.status(200).json({ factureToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting facture" });
  }
};

module.exports = {
  getFactures,
  getOneFacture,
  createFacture,
  updateFacture,
  deleteFacture,
  updateFacturePainementStatus,
};

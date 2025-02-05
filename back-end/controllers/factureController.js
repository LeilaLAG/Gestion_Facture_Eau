const Facture = require("../models/Facture");
const Compteur = require("../models/Compteur");
const Client = require("../models/Client");

const getFactures = async (req, res) => {
  try {
    const { companyId } = req.params;
    const factures = await Facture.find({ companyId });
    return res.status(200).json({ factures });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all factures" });
  }
};

const getOneFacture = async (req, res) => {
  try {
    const { factureId, companyId } = req.params;
    const facture = await Facture.findOne({ _id: factureId, companyId });
    const client = await Client.findOne({companyId , numClient : facture.numClient})
    return res.status(200).json({ facture , client});
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting facture" });
  }
};

const createFacture = async (req, res) => {
  try {
    const { companyId , numCompteur , numClient , valeurCompteurPreleve} = req.body;

    const lastFacture = await Facture.findOne({companyId , numCompteur , numClient}).sort({ dateFacture:-1 })
    let lastCompteurPrelevement = 0
    let total = 0

    if(!lastFacture){
      const CompteurStartPoint = await Compteur.findOne({companyId , numCompteur})
      lastCompteurPrelevement = CompteurStartPoint.startPoint
    }
    else{
      const lastClientBill = await Facture.findOne({companyId , numClient , numCompteur}).sort({ dateFacture:-1 })
      lastCompteurPrelevement = lastClientBill.valeurCompteurPreleve
    }

    if(valeurCompteurPreleve < lastCompteurPrelevement){
      if(!req.query.confirmed){
        return res.status(200).json({ invalidData : `Etes-vous sure que la valeur de compteur prélevée ${valeurCompteurPreleve} est correcte? ${lastCompteurPrelevement} est la valeur ancienne. Si oui, cela signifie que ce client poccéde un nouvel compteur et par clicker sur "Oui" on va faire un mise à jour au point de depart du compteur et générer la nouvelle facture`});
      }
      else{
        lastCompteurPrelevement = 0
        await Compteur.findOneAndUpdate({numCompteur} , {startPoint : parseFloat(valeurCompteurPreleve)})
      }
    }
    
    total = (valeurCompteurPreleve - lastCompteurPrelevement)*12 //12 is just an example until we work on tranche

    const addedFacture = await Facture.create({
      ...req.body,
      totalFacture : total
    });
    return res.status(200).json({ addedFacture });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const updateFacture = async (req, res) => {
  const { factureId } = req.params;

  const {valeurCompteurPreleve , companyId , numCompteur , numClient , totalFacture , painementStatus , datePainement} = req.body;

  let total = 0
  const lastFacture = await Facture.findOne({companyId , numCompteur , numClient}).sort({ dateFacture:-1 })
  let lastCompteurPrelevement = lastFacture.valeurCompteurPreleve
  
  total = (valeurCompteurPreleve - lastCompteurPrelevement)*12 //12 is just an example until we work on tranche

  try {
    const factureToUpdate = await Facture.findOneAndUpdate(
      { _id: factureId },
      {...req.body , 
        totalFacture : totalFacture + total,
        datePainement : painementStatus === "Non payée" ? null : datePainement
      }
    );
    return res.status(200).json({ factureToUpdate });
  } catch (error) {
    return res.status(400).json({ error: "Server Error updating facture" });
  }
};

const updateFacturePainementStatus = async (req, res) => {
  const { factureId } = req.params;

  const {painementStatus , datePainement} = req.body;

  try {
    const factureToUpdate = await Facture.findOneAndUpdate(
      { _id: factureId },
      {
        painementStatus : painementStatus,
        datePainement : new Date()
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
  updateFacturePainementStatus
};

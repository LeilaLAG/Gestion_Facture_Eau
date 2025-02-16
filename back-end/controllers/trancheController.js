const Tranche = require("../models/Tranche");

const getTranches = async (req, res) => {
  try {
    const { companyId } = req.params;
    const tranches = await Tranche.find({ companyId }).sort({created_at : 1});
    res.status(200).json({ tranches });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting all tranches" });
  }
};

const getOneTranche = async (req, res) => {
  try {
    const { companyId , trancheId } = req.params;
    const tranche = await Tranche.findOne({ _id : trancheId , companyId });
    return res.status(200).json({ tranche });
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting one tranche" });
  }
};

const getActiveTranche = async (req, res) => {
  try {
    const { companyId } = req.params;
    const tranche = await Tranche.findOne({ companyId , isActive : true });
    if(tranche){
      return res.status(200).json({ tranche });
    }
    else{
      return res.status(200).json({tranche : { error : "Aucune tranche est active" }});
    }
  } catch (error) {
    return res.status(400).json({ error: "Server Error getting one tranche" });
  }
};

const createTranche = async (req, res) => {
  
  try {
    const {prix , maxTonnage , companyId , nameTranche} = req.body
    const lastTranche = await Tranche.findOne({ companyId }).sort({ created_at: -1 });
    const isTrancheNameExist = await Tranche.findOne({nameTranche , companyId})
  
    if(lastTranche){
      
      if(isTrancheNameExist){
        return res.status(200).json({ errorMsg : "Il est recommandé de saisir un nom unique pour la tranche" });
      }
      else if(lastTranche.prix >= prix){
        return res.status(200).json({ errorMsg : `Prix doit etre superieur au prix du tranche précedant ( >${lastTranche.prix })` });
      }
      else if(lastTranche.maxTonnage >= maxTonnage){
        return res.status(200).json({ errorMsg : `Max tonnage doit etre superieur au max tonnage du tranche précedant ( >${lastTranche.maxTonnage })` });
      }
      else{
        const addedTranche = await Tranche.create(req.body);
        return res.status(200).json({ addedTranche });
      }
    }
    else{
      const addedTranche = await Tranche.create(req.body);
      return res.status(200).json({ addedTranche });
    }

  } catch (error) {
    return res.status(400).json({ error: "Server Error creating tranche" });
  }

};

const updateTranche = async (req, res) => {
  try {
    const { trancheId } = req.params;
    const { activate } = req.query;
    const { prix , maxTonnage , nameTranche , companyId , created_at } = req.body;

    if(activate){
      await Tranche.updateMany( {_id : {$ne : trancheId}} , {$set : {isActive : false}} )
      const trancheToUpdate = await Tranche.findOneAndUpdate(
        { _id: trancheId },
        req.body
      );
      res.status(200).json({ trancheToUpdate });
    }
    else{
      
      const isTrancheNameExist = await Tranche.findOne({nameTranche , companyId , _id : {$ne : trancheId}})
      const trancheBefore = await Tranche.findOne({ companyId , created_at : {$lt : created_at}}).sort({created_at : -1});
      const trancheAfter = await Tranche.findOne({ companyId , created_at : {$gt : created_at}}).sort({created_at : 1});
  
      if(trancheBefore){
        if(trancheBefore.prix >= prix){
          return res.status(200).json({ errorMsg : `Prix doit etre superieur au prix du tranche précedant ( >${trancheBefore.prix })` });
        }
        else if(trancheBefore.maxTonnage >= maxTonnage){
          return res.status(200).json({ errorMsg : `Max tonnage doit etre superieur au max tonnage du tranche précedant ( >${trancheBefore.maxTonnage })` });
        }
      }

      if(trancheAfter){
        if(trancheAfter.prix <= prix){
          return res.status(200).json({ errorMsg : `Prix doit etre inférieur au prix du tranche aprés ( <${trancheAfter.prix })` });
        }
        else if(trancheAfter.maxTonnage <= maxTonnage){
          return res.status(200).json({ errorMsg : `Max tonnage doit etre inférieur au max tonnage du tranche aprés ( <${trancheAfter.maxTonnage })` });
        }
      }

      if(isTrancheNameExist){
        return res.status(200).json({ errorMsg : "Il est recommandé de saisir un nom unique pour la tranche" });
      }

      const trancheToUpdate = await Tranche.findOneAndUpdate(
        { _id: trancheId },
        req.body
      );
      return res.status(200).json({ trancheToUpdate });
    }

  } catch (error) {
    return res.status(400).json({ error: "Server Error updating tranche" });
  }
};

const deleteTranche = async (req, res) => {
  try {
    const { trancheId } = req.params;

    const trancheToDelete = await Tranche.findOneAndDelete({ _id: trancheId });
    res.status(200).json({ trancheToDelete });
  } catch (error) {
    return res.status(400).json({ error: "Server Error deleting tranche" });
  }
};

module.exports = {
  getTranches,
  getOneTranche,
  createTranche,
  updateTranche,
  deleteTranche,
  getActiveTranche
};

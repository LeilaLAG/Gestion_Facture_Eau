const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  getCompanies,
  getOneCompanie,
  createCompany,
  deleteCompany,
  updateCompany,
} = require("./controllers/companyController");
const {
  getUsers,
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
} = require("./controllers/userController");
const {
  getClients,
  getOneClient,
  createClient,
  deleteClient,
  updateClient,
} = require("./controllers/clientController");
const {
  getCompteurs,
  getOneCompteur,
  createCompteur,
  deleteCompteur,
  updateCompteur,
} = require("./controllers/compteurController");
const {
  getFactures,
  getOneFacture,
  createFacture,
  deleteFacture,
  updateFacture,
} = require("./controllers/factureController");
const {
  getTranches,
  getOneTranche,
  createTranche,
  deleteTranche,
  updateTranche,
} = require("./controllers/trancheController");

const app = express();

app.use(cors());
app.use(express.json());

// Company
app.get("/api/companies", getCompanies);
app.get("/api/companie/:companyId", getOneCompanie);
app.post("/api/addCompany", createCompany);
app.put("/api/updateCompany/:companyId", updateCompany);
app.delete("/api/deleteCompany/:companyId", deleteCompany);

// User
app.get("/api/users", getUsers);
app.get("/api/user/:userId", getOneUser);
app.post("/api/addUser", createUser);
app.put("/api/updateUser/:userId", updateUser);
app.delete("/api/deleteUser/:userId", deleteUser);

// Client
app.get("/api/clients", getClients);
app.get("/api/client/:clientId", getOneClient);
app.post("/api/addClient", createClient);
app.put("/api/updateClient/:clientId", updateClient);
app.delete("/api/deleteClient/:clientId", deleteClient);

// Compteur
app.get("/api/compteurs", getCompteurs);
app.get("/api/compteurs/:compteurId", getOneCompteur);
app.post("/api/addCompteur", createCompteur);
app.put("/api/updateCompteur/:compteurId", updateCompteur);
app.delete("/api/deleteCompteur/:compteurId", deleteCompteur);

// Facture
app.get("/api/factures", getFactures);
app.get("/api/facture/factureId", getOneFacture);
app.post("/api/addFacture", createFacture);
app.put("/api/updateFacture/:factureId", updateFacture);
app.delete("/api/deleteFacture/:factureId", deleteFacture);

// Tranche
app.get("/api/tranches", getTranches);
app.get("/api/tranche/:trancheId", getOneTranche);
app.post("/api/addTranche", createTranche);
app.put("/api/updateTranche/:trancheId", updateTranche);
app.delete("/api/deleteTranche/:trancheId", deleteTranche);

mongoose.connect("mongodb://127.0.0.1:27017/db_GFE");
app.listen(8000, () => {
  console.log("server is listening on port 8000");
});

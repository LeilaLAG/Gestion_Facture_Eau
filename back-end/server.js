const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const authenticate = require('./middleware/authMiddleware')
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
const {login} = require('./controllers/loginController')

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Enable sending credentials (cookies, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Login
app.post('/api/login' , login)

// signup
app.post("/api/addCompany", createCompany);
app.post("/api/addUser", createUser);

app.use('/api' , authenticate);

// Logout
app.post('/api/logout' , (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,  // Important: Cookie is only accessible via HTTP(S) requests
    secure: true,    // Set to true if using HTTPS in production
    sameSite: 'Strict', // Helps prevent CSRF attacks
    maxAge: 0,       // Set the maxAge to 0 to expire the cookie immediately
  })}
)

// check auth
app.get('/api/checkAuth' , authenticate)

// Company
app.get("/api/companies", getCompanies);
app.get("/api/companie/:companyName", getOneCompanie);
app.put("/api/updateCompany/:companyId", updateCompany);
app.delete("/api/deleteCompany/:companyId", deleteCompany);

// User
app.get("/api/users", getUsers);
app.get("/api/user/:userId", getOneUser);
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

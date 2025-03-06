const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); //to retreive the data from the .env
const authenticate = require("./middleware/authMiddleware");
const refreshToken = require("./middleware/refreshToken");
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
  resetPassword,
  ModifyPassword,
  updateEmployeePrivileges,
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
  deleteClientCompteurs,
} = require("./controllers/compteurController");
const {
  getFactures,
  getOneFacture,
  createFacture,
  deleteFacture,
  updateFacture,
  updateFacturePainementStatus,
} = require("./controllers/factureController");
const {
  getTranches,
  getOneTranche,
  getActiveTranche,
  createTranche,
  deleteTranche,
  updateTranche,
} = require("./controllers/trancheController");
const {
  getRevenus,
  getOneRevenu,
  getActiveRevenu,
  createRevenu,
  deleteRevenu,
  updateRevenu,
} = require("./controllers/revenuController");
const {
  getCharges,
  getOneCharge,
  createCharge,
  deleteCharge,
  updateCharge,
} = require("./controllers/chargeController");
const { login } = require("./controllers/loginController");
const User = require("./models/User");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // React app's URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Enable sending credentials (cookies, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Login
app.post("/api/login", login);

// signup
app.post("/api/addCompany", createCompany);
app.post("/api/addAdmin", createUser);

// all companies
app.get("/api/companies", getCompanies);

// password reset
app.post("/api/ResetPassword", resetPassword);
app.put("/api/modify_password/:email", ModifyPassword);

// authentication middleware
app.use("/api", authenticate);

// check auth
app.post("/api/checkAuth", authenticate, async (req, res) => {
  const userInfo = await User.findOne({ _id: req.user.userId }).select(
    "-password"
  );
  return res.status(200).json({
    user: req.user,
    userInfo: userInfo,
  });
});

// refresh token
app.post("/api/refresh-token", refreshToken);

// Company
app.get("/api/companie/:companyName", getOneCompanie);
app.put("/api/updateCompany/:companyId", updateCompany);
app.delete("/api/deleteCompany/:companyId", deleteCompany);

// User
app.get("/api/users/:companyId", getUsers);
app.get("/api/user/:userId", getOneUser);
app.post("/api/addEmployee", createUser);
app.put("/api/updateUser/:userId", updateUser);
app.put("/api/updateEmployeePrivileges", updateEmployeePrivileges);
app.delete("/api/deleteUser/:userId", deleteUser);

// Client
app.get("/api/clients/:companyId", getClients);
app.get("/api/clients/:clientId/:companyId", getOneClient);
app.post("/api/addClient", createClient);
app.put("/api/updateClient/:clientId", updateClient);
app.delete("/api/deleteClient/:clientId", deleteClient);

// Compteur
app.get("/api/compteurs/:companyId", getCompteurs);
app.get("/api/compteurs/:compteurId/:companyId", getOneCompteur);
app.post("/api/addCompteur", createCompteur);
app.put("/api/updateCompteur/:compteurId", updateCompteur);
app.delete("/api/deleteCompteur/:compteurId", deleteCompteur);
app.delete("/api/deleteClientCompteurs/:clientId", deleteClientCompteurs);

// Facture
app.get("/api/factures/:companyId", getFactures);
app.get("/api/factures/:factureId/:companyId", getOneFacture);
app.post("/api/addFacture", createFacture);
app.put("/api/updateFacture/:factureId", updateFacture);
app.put(
  "/api/updateFacturePainementStatus/:factureId",
  updateFacturePainementStatus
);
app.delete("/api/deleteFacture/:factureId", deleteFacture);

// Tranche
app.get("/api/tranches/:companyId", getTranches);
app.get("/api/tranches/:trancheId/:companyId", getOneTranche);
app.get("/api/activeTranche/:companyId", getActiveTranche);
app.post("/api/addTranche", createTranche);
app.put("/api/updateTranche/:trancheId", updateTranche);
app.delete("/api/deleteTranche/:trancheId", deleteTranche);

// Revenu
app.get("/api/revenus/:companyId", getRevenus);
app.get("/api/revenus/:trancheId/:companyId", getOneRevenu);
app.post("/api/addRevenu", createRevenu);
app.put("/api/updateRevenu/:RevenuId", updateRevenu);
app.delete("/api/deleteRevenu/:RevenuId", deleteRevenu);

// Charge
app.get("/api/charges/:companyId", getCharges);
app.get("/api/charges/:chargeId/:companyId", getOneCharge);
app.post("/api/addcharge", createCharge);
app.put("/api/updatecharge/:chargeId", updateCharge);
app.delete("/api/deletecharge/:chargeId", deleteCharge);

// Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true, // Secure only in production
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// db connection
const host = process.env.Host;
const port = process.env.Port;
const db = process.env.DBName;
mongoose.connect(`${host}/${db}`);
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

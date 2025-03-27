import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Route, Routes } from "react-router-dom";
import LogIn from "./components/LogIn";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Clients from "./components/Clients";
import Compteurs from "./components/Compteurs";
import AddForm from "./components/AddForm";
import ModForm from "./components/MofFrom";
import UserModFrom from "./components/UserModFrom";
import PasswordReset from "./components/PasswordReset";
import Facture from "./components/Facture";
import Home from "./components/Home";
import Employees from "./components/Employees";
import AddEmployee from "./components/AddEmployee";
import PrintFacture from "./components/PrintFacture";
import Tranches from "./components/Tranches";
import Accueil from "./components/Accueil";
import PrintAllFactures from "./components/PrintAllFactures";
import Charge from "./components/Charge";
import Revenu from "./components/Revenu";
import Caisse from "./components/Caisse";
import Credit from "./components/Credit";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* authentication -------------------------------------------- */}
        <Route path="/log-in" element={<LogIn />} />

        {/* home page --------------------------------------------------- */}
        <Route
          path="/accueil"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* employees --------------------------------------------------- */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/add-employee"
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        {/* user ---------------------------------------------------*/}
        <Route
          path="/users/update-user/:userId"
          element={
            <ProtectedRoute>
              <UserModFrom />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* clients ---------------------------------------------------- */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/add-client"
          element={
            <ProtectedRoute>
              <AddForm page={"client"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/update-client/:clientId"
          element={
            <ProtectedRoute>
              <ModForm page={"client"} />
            </ProtectedRoute>
          }
        />

        {/* compteurs ---------------------------------------------------- */}
        <Route
          path="/compteurs"
          element={
            <ProtectedRoute>
              <Compteurs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compteurs/add-compteur/:numClient"
          element={
            <ProtectedRoute>
              <AddForm page={"compteur"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compteurs/update-compteur/:compteurId"
          element={
            <ProtectedRoute>
              <ModForm page={"compteur"} />
            </ProtectedRoute>
          }
        />

        {/* facture --------------------------------------------------- */}
        <Route
          path="/factures"
          element={
            <ProtectedRoute>
              <Facture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facture/add-facture/:numClient"
          element={
            <ProtectedRoute>
              <AddForm page={"facture"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facture/update-facture/:factureId"
          element={
            <ProtectedRoute>
              <ModForm page={"facture"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facture/print-facture/:factureId"
          element={
            <ProtectedRoute>
              <PrintFacture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facture/print-all-factures"
          element={
            <ProtectedRoute>
              <PrintAllFactures />
            </ProtectedRoute>
          }
        />

        {/* tranches ---------------------------------------------------- */}
        <Route
          path="/tranches"
          element={
            <ProtectedRoute>
              <Tranches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tranches/add-tranche"
          element={
            <ProtectedRoute>
              <AddForm page={"tranche"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tranches/update-tranche/:trancheId"
          element={
            <ProtectedRoute>
              <ModForm page={"tranche"} />
            </ProtectedRoute>
          }
        />

        {/* Accueil ---------------------------------------------------- */}
        <Route path="/" element={<Accueil />} />

        {/* revenus ---------------------------------------------------- */}
        <Route
          path="/revenus"
          element={
            <ProtectedRoute>
              <Revenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenus/add-revenu"
          element={
            <ProtectedRoute>
              <AddForm page={"revenu"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenus/update-revenu/:revenuId"
          element={
            <ProtectedRoute>
              <ModForm page={"revenu"} />
            </ProtectedRoute>
          }
        />

        {/* charges ---------------------------------------------------- */}
        <Route
          path="/charges"
          element={
            <ProtectedRoute>
              <Charge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charges/add-charge"
          element={
            <ProtectedRoute>
              <AddForm page={"charge"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charges/update-charge/:chargeId"
          element={
            <ProtectedRoute>
              <ModForm page={"charge"} />
            </ProtectedRoute>
          }
        />

        {/* credits ---------------------------------------------------- */}
        <Route
          path="/credits"
          element={
            <ProtectedRoute>
              <Credit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credits/add-credit"
          element={
            <ProtectedRoute>
              <AddForm page={"credit"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credits/update-credit/:creditId"
          element={
            <ProtectedRoute>
              <ModForm page={"credit"} />
            </ProtectedRoute>
          }
        />

        {/* caisse ------------------------------------------------- */}
        <Route
          path="/caisse"
          element={
            <ProtectedRoute>
              <Caisse />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

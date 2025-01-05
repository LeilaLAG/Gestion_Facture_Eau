import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Clients from "./components/Clients";
import Compteurs from "./components/Compteurs";
import AddForm from "./components/AddForm";
import ModForm from "./components/MofFrom";
import UserModFrom from "./components/UserModFrom";
import PasswordReset from "./components/PasswordReset";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* authentication -------------------------------------------- */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />

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

        {/* user ---------------------------------------------------*/}
        <Route
          path="/users/update-user/:userId"
          element={
            <ProtectedRoute>
              <UserModFrom />
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
          path="/compteurs/add-compteur"
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
      </Routes>
    </div>
  );
}

export default App;

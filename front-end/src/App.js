import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Clients from "./components/Clients";
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
        <Route
          path="/users/reset-user-password/:userId"
          element={
            <ProtectedRoute>
              <PasswordReset />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

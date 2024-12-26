import React from "react";
import "../style/menu.css";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function Menu() {
  const { user } = useUser();

  return (
    <div className="Menu shadow">
      <div className="userSetting text-end mb-4">
        <img src="Assets/setting.png" alt="setting" width={20} />
        {/* <div className="userSettingBox">
            {user.email}
        </div> */}
      </div>
      <div className="UserInfoSegment">
        <div>
          <img src="Assets/profile.png" alt="user" width={80} />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2">
              <p className="userFullName">{user.fullName}</p>
              <p className="userFunction btn btn-warning p-1 pt-0 pb-0">
                {user.function}
              </p>
            </div>
            <p className="userCompany">{user.companyId}</p>
          </div>
          <form
            className="logoutForm"
            onSubmit={() => {
              axios
                .post(
                  "http://localhost:8000/api/logout",
                  {},
                  { withCredentials: true }
                )
                .then((res) => {
                  console.log("Logout successful");
                })
                .catch((error) => {
                  console.error("Error logging out:", error);
                });
            }}
          >
            <button type="submit" className="btn btn-danger fw-bold">
              Logout
            </button>
          </form>
        </div>
      </div>
      <hr />
      <nav className="navLinks">
        <ul>
          <li>
            <img src="Assets/clients.png" alt="clients" width={20} />
            <span>Clients</span>
          </li>
          <ul className="subNavLinks">
            <li>Ajouter client</li>
            <li>Clients statistique</li>
          </ul>
          <li>
            <img src="Assets/counter.png" alt="clients" width={20} />
            <span>Compteurs</span>
          </li>
          <ul className="subNavLinks">
            <li>Ajouter Compteur</li>
          </ul>
          <li>
            <img src="Assets/bill.png" alt="clients" width={20} />
            <span>Facture</span>
          </li>
          <ul className="subNavLinks">
            <li>Creer facture</li>
            <li>Imprimer facture</li>
          </ul>
          <li>
            <img src="Assets/tranche.png" alt="clients" width={20} />
            <span>Tranche</span>
          </li>
          <ul className="subNavLinks">
            <li>Creer tranche</li>
          </ul>
        </ul>
      </nav>
    </div>
  );
}

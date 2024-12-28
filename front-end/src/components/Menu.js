import React from "react";
import "../style/menu.css";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";
import { useLocation } from "react-router-dom";

export default function Menu() {
  const { user } = useUser();

  const currentUrl = useLocation()

  return (
    <div className="Menu shadow">
      <div className="userSetting text-end mb-4">
        <img src="Assets/setting.png" alt="setting" width={20} />
      </div>
      <div className="UserInfoSegment">
        <div>
          <img src="Assets/profile.png" alt="user" width={80} />
        </div>

        <div className="">
          <div className="w-100">
            <div className="d-flex align-items-center gap-2">
              <p className="userFullName">{user.fullName}</p>
              <p className="userFunction btn btn-warning p-2 pt-0 pb-0">
                {user.function}
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-end">
              <p className="userCompany">{user.companyId}</p>
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
                <button type="submit" className="btn btn-danger fw-bold pt-1 pb-1 p-3" >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <nav className="navLinks">
        <ul>
          <li className={currentUrl.pathname === "/clients" ? "activeLink" : ""}>
            <img src="Assets/clients.png" alt="clients" width={20} />
            <a href="/clients">Clients</a>
          </li>
          <ul className="subNavLinks">
            <li className={currentUrl.pathname === "/add-client" ? "activeSubLink" : ""}><a href="/add-client">Ajouter client</a></li>
          </ul>
          <li>
            <img src="Assets/counter.png" alt="compteur" width={20} />
            <span>Compteurs</span>
          </li>
          <ul className="subNavLinks">
            <li>Ajouter Compteur</li>
          </ul>
          <li>
            <img src="Assets/bill.png" alt="facture" width={20} />
            <span>Facture</span>
          </li>
          <ul className="subNavLinks">
            <li>Creer facture</li>
            <li>Imprimer facture</li>
          </ul>
          <li>
            <img src="Assets/tranche.png" alt="tranche" width={20} />
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

import React from "react";
import "../style/menu.css";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";
import { useLocation } from "react-router-dom";

export default function Menu() {
  const { user } = useUser();

  const currentUrl = useLocation();

  return (
    <div className="Menu shadow">
      <div className="userSetting text-end mb-4">
        <div className="dropdown dropstart">
          <img
            src="/Assets/setting.png"
            alt="setting"
            width={20}
            className="dropdown-toggle"
            data-bs-toggle="dropdown"
          />
          <ul className="dropdown-menu shadow">
            <li>
              <a
                className="dropdown-item"
                href={`/users/update-user/${user._id}`}
              >
                Modifier votre profile
              </a>
            </li>
            <hr className="mt-1 mb-1" />
            <li>
              <a className="dropdown-item" href="/">
                Initialiser mot de passe
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="UserInfoSegment">
        <div>
          <img src="/Assets/profile.png" alt="user" width={80} />
        </div>

        <div className="">
          <div className="w-100">
            <div className="d-flex align-items-center gap-2">
              <p className="userFullName">{user.fullName}</p>
              <p className="userFunction btn btn-warning p-2 pt-0 pb-0">
                {user.function}
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-end flex-wrap">
              <div>
                <div className="p-2 pt-0 pb-0 mt-1 d-flex align-items-center gap-2">
                  <img src="/Assets/company.png" alt="name" width={15} />
                  <span className="userCompany">{user.companyId}</span>
                </div>
                <div
                  className="p-2 pt-0 pb-0 mt-1 d-flex align-items-center gap-2"
                  style={{ fontSize: "13px" }}
                >
                  <img src="/Assets/email.png" alt="email" width={15} />
                  <span>{user.email}</span>
                </div>
              </div>
              <form
                className="logoutForm mt-2"
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
                <button
                  type="submit"
                  className="btn btn-danger fw-bold pt-1 pb-1 p-3"
                >
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
          <li
            className={currentUrl.pathname === "/clients" ? "activeLink" : ""}
          >
            <img src="/Assets/clients.png" alt="clients" width={20} />
            <a href="/clients">Clients</a>
          </li>
          {/* <ul className="subNavLinks">
            <li
              className={
                currentUrl.pathname === "/clients/add-client"
                  ? "activeSubLink"
                  : ""
              }
            >
              <a href="/clients/add-client">Ajouter client</a>
            </li>
          </ul> */}
          <li>
            <img src="/Assets/counter.png" alt="compteur" width={20} />
            <a href="/compteurs">Compteur</a>
          </li>
          {/* <ul className="subNavLinks">
            <li
              className={
                currentUrl.pathname === "/compteurs/add-compteur"
                  ? "activeSubLink"
                  : ""
              }
            >
              <a href="/compteurs/add-compteur">Ajouter compteur</a>
            </li>
          </ul> */}
          <li>
            <img src="/Assets/bill.png" alt="facture" width={20} />
            <a href="/factures">Facture</a>
          </li>
          {/* <ul className="subNavLinks">
            <li
              className={
                currentUrl.pathname === "/factures/add-facture"
                  ? "activeSubLink"
                  : ""
              }
            >
              <a href="/factures/add-facture">Creer facture</a>
            </li>
          </ul> */}
          <li>
            <img src="/Assets/tranche.png" alt="tranche" width={20} />
            <a href="/tranches">Tranche</a>
          </li>
          {/* <ul className="subNavLinks">
            <li
              className={
                currentUrl.pathname === "/tranches/add-tranche"
                  ? "activeSubLink"
                  : ""
              }
            >
              <a href="/tranches/add-tranche">Creer tranche</a>
            </li>
          </ul> */}
        </ul>
      </nav>
    </div>
  );
}

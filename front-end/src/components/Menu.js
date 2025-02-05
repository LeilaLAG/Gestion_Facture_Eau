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
        <div className="dropdown">
          <button
            className="btn btn-dark p-3 pt-1 pb-1 dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Options
          </button>
          <ul className="dropdown-menu shadow">
            <li className="d-flex align-items-center gap-2 dropdown-item">
              <img src="/Assets/clientEdit.png" alt="edit client" width={20} />
              <a
                className="text-dark"
                style={{ textDecoration: "none" }}
                href={`/users/update-user/${user._id}`}
              >
                Modifier votre profile
              </a>
            </li>
            {user.function === "Admin" && (
              <div>
                <hr className="m-0 mt-1 mb-1" />
                <li className="d-flex align-items-center gap-2 dropdown-item">
                  <img src="/Assets/signup.png" alt="companuId" width={20} />
                  <a
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                    href="/users/add-employee"
                  >
                    Ajouter un employer
                  </a>
                </li>
                <hr className="m-0 mt-1 mb-1" />
                <li className="d-flex align-items-center gap-2 dropdown-item">
                  <img src="/Assets/employee.png" alt="companuId" width={20} />
                  <a
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                    href="/employees"
                  >
                    Vos employers
                  </a>
                </li>
                <hr className="m-0 mt-1 mb-1" />
                <li className="d-flex align-items-center gap-2 dropdown-item">
                  <img src="/Assets/tranche.png" alt="tranche" width={20} />
                  <a
                    className="text-dark"
                    style={{ textDecoration: "none" }}
                    href="/tranches"
                  >
                    Tranches
                  </a>
                </li>
              </div>
            )}
            <hr className="m-0 mt-1 mb-1" />
            <li className="">
              <form
                className="logoutForm"
                onSubmit={() => {
                  axios
                    .post(
                      `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/logout`,
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
                  className="pt-1 pb-1 p-3 d-flex align-items-center gap-2 dropdown-item"
                  style={{
                    outline: "none",
                    border: "none",
                    backgroundColor: "white",
                  }}
                >
                  <img src="/Assets/logout.png" alt="logout" width={20} />
                  Déconnexion
                </button>
              </form>
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
              <p className="userFunction bg_blue_button p-2 pt-0 pb-0">
                {user.role}
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
            </div>
          </div>
        </div>
      </div>
      <hr />
      <nav className="navLinks">
        {user.function === "Admin" && (
          <ul>
            <li
              className={currentUrl.pathname === "/clients" ? "activeLink" : ""}
            >
              <img src="/Assets/clients.png" alt="clients" width={20} />
              <a href="/clients">Clients</a>
            </li>
            <li
              className={
                currentUrl.pathname === "/compteurs" ? "activeLink" : ""
              }
            >
              <img src="/Assets/counter.png" alt="compteur" width={20} />
              <a href="/compteurs">Compteurs</a>
            </li>
            <li
              className={
                currentUrl.pathname === "/factures" ? "activeLink" : ""
              }
            >
              <img src="/Assets/bill.png" alt="facture" width={20} />
              <a href="/factures">Factures</a>
            </li>

            {/* <li
              className={
                currentUrl.pathname === "/tranches" ? "activeLink" : ""
              }
            >
              <img src="/Assets/tranche.png" alt="tranche" width={20} />
              <a href="/tranches">Tranche</a>
            </li> */}
          </ul>
        )}

        {user.function === "Employer" && (
          <ul>
            {user.privileges.clients && (
              <li
                className={
                  currentUrl.pathname === "/clients" ? "activeLink" : ""
                }
              >
                <img src="/Assets/clients.png" alt="clients" width={20} />
                <a href="/clients">Clients</a>
              </li>
            )}

            {user.privileges.compteurs && (
              <li
                className={
                  currentUrl.pathname === "/compteurs" ? "activeLink" : ""
                }
              >
                <img src="/Assets/counter.png" alt="compteur" width={20} />
                <a href="/compteurs">Compteurs</a>
              </li>
            )}

            {user.privileges.factures && (
              <li
                className={
                  currentUrl.pathname === "/factures" ? "activeLink" : ""
                }
              >
                <img src="/Assets/bill.png" alt="facture" width={20} />
                <a href="/factures">Factures</a>
              </li>
            )}

            {/* {user.privileges.tranches && (
              <li
                className={
                  currentUrl.pathname === "/tranches" ? "activeLink" : ""
                }
              >
                <img src="/Assets/tranche.png" alt="tranche" width={20} />
                <a href="/tranches">Tranche</a>
              </li>
            )} */}
          </ul>
        )}
      </nav>
    </div>
  );
}

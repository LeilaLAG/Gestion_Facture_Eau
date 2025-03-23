import React, { useEffect, useState } from "react";
import "../style/menu.css";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";
import { useLocation } from "react-router-dom";
import Tooltip from "./Tooltip";
import Swal from "sweetalert2";

export default function Menu({print}) {
  const { user } = useUser();

  const currentUrl = useLocation();

  const [ActiveTranche, setActiveTranche] = useState({});

  const [showMenu, setShowMenu] = useState(false);

  const rubriques = [
    "accueil",
    "clients",
    "compteurs",
    "factures",
    "revenus",
    "charges",
    "caisse",
  ];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/activeTranche/${user.companyId}`,
        { withCredentials: true }
      )
      .then((res) => {
        setActiveTranche(res.data.tranche);
      })
      .catch((err) => console.log({ error: "Aucune tranche est active" }));

    const handleResize = () => {
      const menu = document.getElementsByClassName("Menu")[0];

      if (window.innerWidth <= 1140) {
        if (showMenu) {
          // setShowMenu(true);
          menu.style.position = "absolute";
        } else {
          menu.style.position = "relative";
          // setShowMenu(false);
        }
      } else {
        menu.style.position = "relative";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user.companyId, showMenu]);

  function logOut(e) {
    e.preventDefault();
    Swal.fire({
      title: `<img src="/Assets/logout.gif" alt="delete" width="50" />`,
      text: "Voulez-vous déconnecter ?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .post(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/logout`,
            {},
            { withCredentials: true }
          )
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      }
    });
  }

  return (
    <div
      className={`Menu shadow ${print}`}
      style={{ minWidth: showMenu ? "25%" : "max-content" }}
    >
      <div className="centerDiv justify-content-between gap-2">
        <button
          className="btn btn-outline-dark p-2 pt-1 pb-1 showMenu"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {!showMenu ? (
            <i className="bi bi-list" title="étendre le menu"></i>
          ) : (
            <i className="bi bi-x-lg" title="réduire le menu"></i>
          )}
        </button>
        <div className="userSetting text-end">
          <div className="dropdown">
            <button
              className="btn btn-outline-dark p-2 pt-1 pb-1"
              data-bs-toggle="dropdown"
              title="Vos options"
            >
              <i className="bi bi-gear"></i>
            </button>
            <ul className="dropdown-menu shadow">
              <li className="d-flex align-items-center gap-2 dropdown-item">
                <img
                  src="/Assets/clientEdit.png"
                  alt="edit client"
                  width={20}
                />
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
                      Ajouter un employé
                    </a>
                  </li>
                  <hr className="m-0 mt-1 mb-1" />
                  <li className="d-flex align-items-center gap-2 dropdown-item">
                    <img
                      src="/Assets/employee.png"
                      alt="employees list"
                      width={20}
                    />
                    <a
                      className="text-dark"
                      style={{ textDecoration: "none" }}
                      href="/employees"
                    >
                      Vos employés
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
                <form className="logoutForm" onSubmit={(e) => logOut(e)}>
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
      </div>

      {showMenu ? (
        <div id="menuContent">
          <div className="UserInfoSegment mt-5">
            <div className="p-2 pb-1">
              <div className="profileLogo centerDiv">
                <span>{user.fullName.charAt(0)}</span>
              </div>
            </div>
            <div style={{ overflowX: "hidden" }}>
              <div className="w-100">
                <div className="d-flex align-items-center gap-2">
                  <p className="userFullName">{user.fullName}</p>
                  <p className="userFunction bg_blue_button badge rounded-pill">
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
                      title={`${user.email}`}
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
                {rubriques.map((rubrique, i) => (
                  <>
                    <li
                      className={
                        currentUrl.pathname === `/${rubrique}`
                          ? "activeLink"
                          : ""
                      }
                    >
                      <img
                        src={`/Assets/${rubrique}.png`}
                        alt={`${rubrique}`}
                        width={20}
                      />
                      <a href={`/${rubrique}`}>{rubrique}</a>
                    </li>
                    {rubrique === "factures" &&
                      currentUrl.pathname === "/factures" && (
                        <div className="ActiveTrancheContainer mb-2">
                          {ActiveTranche.error ? (
                            <div className="ActiveTranche badge bg_red_button badge rounded-pill">
                              <div className="centerDiv gap-1">
                                <i className="bi bi-exclamation-circle"></i>
                                <p className="m-0">{ActiveTranche.error}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="ActiveTranche badge bg_blue_button badge rounded-pill">
                              <div className="centerDiv gap-1">
                                <i className="bi bi-check-all"></i>
                                <p className="m-0">
                                  {ActiveTranche.nameTranche}
                                </p>
                                <Tooltip
                                  text={`Prix: ${ActiveTranche.prix}Dh . Max-tonnage: ${ActiveTranche.maxTonnage}m³`}
                                >
                                  <i className="bi bi-info-circle"></i>
                                </Tooltip>
                                <a
                                  href="/tranches"
                                  className="text-light fw-light"
                                >
                                  ( Voir vos tranches )
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </>
                ))}
              </ul>
            )}
            {user.function === "Employer" && (
              <ul>
                {rubriques.map((rubrique, i) => (
                  <>
                    {rubrique === "accueil" && (
                      <li
                        className={
                          currentUrl.pathname === "/accueil" ? "activeLink" : ""
                        }
                      >
                        <img
                          src={`/Assets/accueil.png`}
                          alt="accueil"
                          width={20}
                        />
                        <a href="/accueil">accueil</a>
                      </li>
                    )}
                    {user.privileges[rubrique] && (
                      <li
                        className={
                          currentUrl.pathname === `/${rubrique}`
                            ? "activeLink"
                            : ""
                        }
                      >
                        <img
                          src={`/Assets/${rubrique}.png`}
                          alt={`${rubrique}`}
                          width={20}
                        />
                        <a href={`/${rubrique}`}>{rubrique}</a>
                      </li>
                    )}
                    {rubrique === "factures" &&
                      currentUrl.pathname === "/factures" && (
                        <div className="ActiveTrancheContainer mb-2">
                          {ActiveTranche.error ? (
                            <div className="ActiveTranche badge bg_red_button badge rounded-pill">
                              <div className="centerDiv gap-1">
                                <i className="bi bi-exclamation-circle"></i>
                                <p className="m-0">{ActiveTranche.error}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="ActiveTranche badge bg_blue_button badge rounded-pill">
                              <div className="centerDiv gap-1">
                                <i className="bi bi-check-all"></i>
                                <p className="m-0">
                                  {ActiveTranche.nameTranche}
                                </p>
                                <Tooltip
                                  text={`Prix: ${ActiveTranche.prix}Dh . Max-tonnage: ${ActiveTranche.maxTonnage}m³`}
                                >
                                  <i className="bi bi-info-circle"></i>
                                </Tooltip>
                                <a
                                  href="/tranches"
                                  className="text-light fw-light"
                                >
                                  ( Voir vos tranches )
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </>
                ))}
              </ul>
            )}
          </nav>
        </div>
      ) : (
        <nav className="shrinkNavLinks mt-4">
          {user.function === "Admin" && (
            <ul>
              {rubriques.map((rubrique, i) => (
                <div key={i}>
                  <li
                    className={
                      currentUrl.pathname === `/${rubrique}` ? "activeLink" : ""
                    }
                  >
                    <a href={`/${rubrique}`}>
                      <img
                        src={`/Assets/${rubrique}.png`}
                        alt={`${rubrique}`}
                        width={20}
                      />
                    </a>
                  </li>
                  <p>{rubrique}</p>
                </div>
              ))}
            </ul>
          )}

          {user.function === "Employer" && (
            <ul>
              {rubriques.map((rubrique, i) => (
                <>
                  {rubrique === "accueil" && (
                    <div>
                      <li
                        className={
                          currentUrl.pathname === "/accueil" ? "activeLink" : ""
                        }
                      >
                        <a href="/accueil">
                          <img
                            src={`/Assets/accueil.png`}
                            alt="accueil"
                            width={20}
                          />
                        </a>
                      </li>
                      <p>accueil</p>
                    </div>
                  )}
                  {user.privileges[rubrique] && (
                    <div>
                      <li
                        className={
                          currentUrl.pathname === `/${rubrique}`
                            ? "activeLink"
                            : ""
                        }
                      >
                        <a href={`/${rubrique}`}>
                          <img
                            src={`/Assets/${rubrique}.png`}
                            alt={`${rubrique}`}
                            width={20}
                          />
                        </a>
                      </li>
                      <p>{rubrique}</p>
                    </div>
                  )}
                </>
              ))}
            </ul>
          )}
        </nav>
      )}
    </div>
  );
}

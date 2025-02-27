import React, { useEffect, useState } from "react";
import "../style/menu.css";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";
import { useLocation } from "react-router-dom";
import Tooltip from "./Tooltip";
import Swal from "sweetalert2";

export default function Menu() {
  const { user } = useUser();

  const currentUrl = useLocation();

  const [ActiveTranche, setActiveTranche] = useState({});

  const [showMenu, setShowMenu] = useState(false);

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
      title: `<img src="Assets/logout.gif" alt="delete" width="50" />`,
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
      className="Menu shadow"
      style={{ minWidth: showMenu ? "25%" : "max-content" }}
    >
      <button
        className="btn btn-outline-dark p-2 pt-1 pb-1 showMenu"
        onClick={() => setShowMenu((prev) => !prev)}
        title="Réduire le menu"
      >
        {!showMenu ? <i class="bi bi-list"></i> : <i class="bi bi-x-lg"></i>}
      </button>
      {showMenu ? (
        <div id="menuContent">
          <div className="userSetting text-end mb-4">
            <div className="dropdown">
              <button
                className="btn btn-dark p-3 pt-1 pb-1"
                data-bs-toggle="dropdown"
                title="Vos options"
              >
                <img
                  src="/Assets/options.png"
                  alt="options"
                  width={17}
                  style={{ verticalAlign: "sub" }}
                />
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
                      <img
                        src="/Assets/signup.png"
                        alt="companuId"
                        width={20}
                      />
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
                        alt="companuId"
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
                <li
                  className={
                    currentUrl.pathname === "/home" ? "activeLink" : ""
                  }
                >
                  <img src="/Assets/accueil.png" alt="accueil" width={20} />
                  <a href="/home">Accueil</a>
                </li>
                <li
                  className={
                    currentUrl.pathname === "/clients" ? "activeLink" : ""
                  }
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
                {currentUrl.pathname === "/factures" && (
                  <div className="ActiveTrancheContainer mb-2">
                    {ActiveTranche.error ? (
                      <div className="ActiveTranche badge bg_red_button badge rounded-pill">
                        <div className="centerDiv gap-1">
                          <i class="bi bi-exclamation-circle"></i>
                          <p className="m-0">{ActiveTranche.error}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="ActiveTranche badge bg_blue_button badge rounded-pill">
                        <div className="centerDiv gap-1">
                          <i class="bi bi-check-all"></i>
                          <p className="m-0">{ActiveTranche.nameTranche}</p>
                          <Tooltip
                            text={`Prix: ${ActiveTranche.prix}Dh . Max-tonnage: ${ActiveTranche.maxTonnage}m³`}
                          >
                            <i class="bi bi-info-circle"></i>
                          </Tooltip>
                          <a href="/tranches" className="text-light fw-light">
                            ( Voir vos tranches )
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <li
                  className={
                    currentUrl.pathname === "/caisse" ? "activeLink" : ""
                  }
                >
                  <img src="/Assets/money.png" alt="money" width={20} />
                  <a href="/caisse">Caisse</a>
                </li>
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
      ) : (
        <nav className="shrinkNavLinks mt-5">
          {/* <img
            src="/Assets/aquamanageicon.png"
            className="mb-3"
            alt="aquamanageicon"
            width={30}
          /> */}
          {user.function === "Admin" && (
            <ul>
              <div>
                <li
                  className={
                    currentUrl.pathname === "/home" ? "activeLink" : ""
                  }
                >
                  <a href="/home">
                    <img src="/Assets/accueil.png" alt="homr" width={20} />
                  </a>
                </li>
                <p>Accueil</p>
              </div>
              <div>
                <li
                  className={
                    currentUrl.pathname === "/clients" ? "activeLink" : ""
                  }
                >
                  <a href="/clients">
                    <img src="/Assets/clients.png" alt="clients" width={20} />
                  </a>
                </li>
                <p>Clients</p>
              </div>
              <div>
                <li
                  className={
                    currentUrl.pathname === "/compteurs" ? "activeLink" : ""
                  }
                >
                  <a href="/compteurs">
                    <img src="/Assets/counter.png" alt="compteur" width={20} />
                  </a>
                </li>
                <p>Compteurs</p>
              </div>
              <div>
                <li
                  className={
                    currentUrl.pathname === "/factures" ? "activeLink" : ""
                  }
                >
                  <a href="/factures">
                    <img src="/Assets/bill.png" alt="facture" width={20} />
                  </a>
                </li>
                <p>Factures</p>
              </div>
              <div>
                <li
                  className={
                    currentUrl.pathname === "/caisse" ? "activeLink" : ""
                  }
                >
                  <a href="/caisse">
                    <img src="/Assets/money.png" alt="money" width={20} />
                  </a>
                </li>
                <p>Caisse</p>
              </div>
            </ul>
          )}

          {user.function === "Employer" && (
            <ul>
              <div>
                <li
                  className={
                    currentUrl.pathname === "/home" ? "activeLink" : ""
                  }
                >
                  <a href="/home">
                    <img src="/Assets/accueil.png" alt="homr" width={20} />
                  </a>
                </li>
                <p>Accueil</p>
              </div>
              {user.privileges.clients && (
                <div>
                  <li
                    className={
                      currentUrl.pathname === "/clients" ? "activeLink" : ""
                    }
                  >
                    <a href="/clients">
                      <img src="/Assets/clients.png" alt="clients" width={20} />
                    </a>
                  </li>
                  <p>Clients</p>
                </div>
              )}

              {user.privileges.compteurs && (
                <div>
                  <li
                    className={
                      currentUrl.pathname === "/compteurs" ? "activeLink" : ""
                    }
                  >
                    <a href="/compteurs">
                      <img
                        src="/Assets/counter.png"
                        alt="compteur"
                        width={20}
                      />
                    </a>
                  </li>
                  <p>Compteurs</p>
                </div>
              )}

              {user.privileges.factures && (
                <div>
                  <li
                    className={
                      currentUrl.pathname === "/factures" ? "activeLink" : ""
                    }
                  >
                    <a href="/factures">
                      <img src="/Assets/bill.png" alt="facture" width={20} />
                    </a>
                  </li>
                  <p>Factures</p>
                </div>
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
          <div className="dropdown">
            <button
              className="profileLogo centerDiv"
              data-bs-toggle="dropdown"
              style={{
                width: "25px",
                height: "25px",
                fontSize: "10px",
                margin: "3px",
                marginBottom: "20px",
              }}
            >
              <span>{user.fullName.charAt(0)}</span>
            </button>
            <ul className="dropdown-menu shadow p-2">
              <li
                className="centerDiv justify-content-start gap-2"
                style={{ padding: "5px 10px" }}
              >
                <img src="/Assets/user.png" alt="" width={15} />
                {user.fullName}
              </li>
              <hr className="m-0 p-0"></hr>
              <li
                className="centerDiv justify-content-start gap-2"
                style={{ padding: "5px 10px" }}
              >
                <img src="/Assets/email.png" alt="" width={15} />
                {user.email}
              </li>
              <hr className="m-0 p-0"></hr>
              <li
                className="centerDiv justify-content-start gap-2"
                style={{ padding: "5px 10px" }}
              >
                <img src="/Assets/company.png" alt="" width={15} />
                {user.companyId}
              </li>
            </ul>
          </div>
          <div
            className="userSetting text-end mb-4"
            style={{
              position: "absolute",
              bottom: "20px",
            }}
          >
            <div className="dropdown">
              <button
                className="btn btn-dark p-1"
                data-bs-toggle="dropdown"
                title="Vos options"
              >
                <img
                  src="/Assets/options.png"
                  alt="options"
                  width={20}
                  style={{ verticalAlign: "sub" }}
                />
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
                      <img
                        src="/Assets/signup.png"
                        alt="companuId"
                        width={20}
                      />
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
        </nav>
      )}
    </div>
  );
}

import React from "react";
import Menu from "./Menu";
import Main from "./Main";
import { useUser } from "../Auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ErrorMsg from "../costumComponents/ErrorMsg";
import GetClients from "../hooks/GetClients";
import BarChart from "../costumComponents/Chart";
import DoughnutChart from "../costumComponents/DoughnutChart";

import GetFactures from "../hooks/GetFactures";

export default function Home() {
  const { user } = useUser();

  const factures = GetFactures(new Date().getFullYear(), "" );
  const facturesPerMonth = () => {
    const ftPerMonth = [];
    if (factures !== "loading") {
      ftPerMonth.push(
        factures.filter(
          (facture) => facture.painementStatus === "Payée"
        ).length
      );
      ftPerMonth.push(
        factures.filter(
          (facture) => facture.painementStatus === "Non payée"
        ).length
      );
    }

    return ftPerMonth;
  };
  console.log(facturesPerMonth());
  
  const clients = GetClients();
  const clientsPerMonth = () => {
    const cltPerMonth = [];
    if (clients !== "loading") {
      for (let index = 0; index < 12; index++) {
        cltPerMonth.push(
          clients.filter(
            (client) => new Date(client.dateRegisterClient).getMonth() === index
          ).length
        );
      }
    }
    return cltPerMonth;
  };
  
  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <div className="centerDiv w-100 h-100">
          <div className="">
            {/* <img src="/Assets/home.png" alt="home" width={50} />
            <h2 className="mt-2">Bienvenue sur la page d'accueil</h2> */}
            {user.function === "Employer" && (
              <div className="">
                <p className="fs-4 fw-bold">
                  Vous pouvez accéder aux rubriques suivantes :
                </p>
                {!user.privileges.clients &&
                !user.privileges.compteurs &&
                !user.privileges.factures &&
                !user.privileges.caisse ? (
                  <div className="centerDiv">
                    <ErrorMsg
                      msg={
                        "Vous n'avez aucun privillege, contactez votre Admin"
                      }
                      errorIconWidth={20}
                      coleur={"red"}
                      boldness="bold"
                      imgPath="Assets/empty.png"
                    />
                  </div>
                ) : (
                  <div className="">
                    {user.privileges.clients && (
                      <div>
                        <a
                          href="/clients"
                          className="fw-bold d-flex gap-2"
                          style={{
                            textDecoration: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          <input type="checkbox" checked />
                          <span>clients</span>
                        </a>
                        <ul className="">
                          {user.crudAccess.clients.add && (
                            <li className="">
                              Vous pouvez ajouter nouveaux clients
                            </li>
                          )}
                          {user.crudAccess.clients.mod && (
                            <li className="">
                              Vous pouvez modifier les informations des clients
                            </li>
                          )}
                          {user.crudAccess.clients.dlt && (
                            <li className="">
                              Vous pouvez supprimer des clients
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    {user.privileges.compteurs && (
                      <div>
                        <a
                          href="/compteurs"
                          className="fw-bold d-flex gap-2"
                          style={{
                            textDecoration: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          <input type="checkbox" checked />
                          <span>compteurs</span>
                        </a>
                        <ul className="">
                          {user.crudAccess.compteurs.add && (
                            <li className="">
                              Vous pouvez ajouter des nouveaux compteurs
                            </li>
                          )}
                          {user.crudAccess.compteurs.mod && (
                            <li className="">
                              Vous pouvez modifier les informations des
                              compteurs
                            </li>
                          )}
                          {user.crudAccess.compteurs.dlt && (
                            <li className="">
                              Vous pouvez supprimer des compteurs
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    {user.privileges.factures && (
                      <div>
                        <a
                          href="/factures"
                          className="fw-bold d-flex gap-2"
                          style={{
                            textDecoration: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          <input type="checkbox" checked />
                          <span>factures</span>
                        </a>
                        <div className="">
                          {user.crudAccess.factures.add && (
                            <li className="">
                              Vous pouvez génerer des nouvelles factures
                            </li>
                          )}
                          {user.crudAccess.factures.mod && (
                            <li className="">
                              Vous pouvez modifier les informations des factures
                            </li>
                          )}
                          {user.crudAccess.factures.dlt && (
                            <li className="">
                              Vous pouvez supprimer des factures
                            </li>
                          )}
                        </div>
                      </div>
                    )}
                    {user.privileges.revenus && (
                      <div>
                        <a
                          href="/revenus"
                          className="fw-bold d-flex gap-2"
                          style={{
                            textDecoration: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          <input type="checkbox" checked />
                          <span>revenus</span>
                        </a>
                        <div className="">
                          {user.crudAccess.revenus.add && (
                            <li className="">
                              Vous pouvez génerer des nouvelles revenus
                            </li>
                          )}
                          {user.crudAccess.revenus.mod && (
                            <li className="">
                              Vous pouvez modifier les informations des revenus
                            </li>
                          )}
                          {user.crudAccess.revenus.dlt && (
                            <li className="">
                              Vous pouvez supprimer des revenus
                            </li>
                          )}
                        </div>
                      </div>
                    )}
                    {user.privileges.charges && (
                      <div>
                        <a
                          href="/charges"
                          className="fw-bold d-flex gap-2"
                          style={{
                            textDecoration: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          <input type="checkbox" checked />
                          <span>charges</span>
                        </a>
                        <div className="">
                          {user.crudAccess.charges.add && (
                            <li className="">
                              Vous pouvez génerer des nouvelles charges
                            </li>
                          )}
                          {user.crudAccess.charges.mod && (
                            <li className="">
                              Vous pouvez modifier les informations des charges
                            </li>
                          )}
                          {user.crudAccess.charges.dlt && (
                            <li className="">
                              Vous pouvez supprimer des charges
                            </li>
                          )}
                        </div>
                      </div>
                    )}
                    {user.privileges.caisse && (
                      <div>
                        <a
                          href="/caisse"
                          className="fw-bold d-flex gap-2"
                          style={{
                            textDecoration: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          <input type="checkbox" checked />
                          <span>caisse</span>
                        </a>
                        <div className="">
                            <li className="">
                              Vous pouvez accéder les statistiques de la caisse
                            </li>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Main>
    </div>
  );
}

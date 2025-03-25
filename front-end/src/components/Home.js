import React from "react";
import Menu from "./Menu";
import Main from "./Main";
import { useUser } from "../Auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ErrorMsg from "../costumComponents/ErrorMsg";
import GetClients from "../hooks/GetClients";
import BarChart from "../costumComponents/Chart";
import GetFactures from "../hooks/GetFactures";


export default function Home() {
  const { user } = useUser();

  const factures = GetFactures(new Date().getFullYear(),"" ) ;
  const facturesPerMonth = () => {
    const ftPerMonth = [];
    if (factures !== "loading") {
      ftPerMonth.push(
        factures.filter(
          (facture) => facture.painementStatus==="Payée"
        ).length
      );
      ftPerMonth.push(
        factures.filter(
          (facture) => facture.painementStatus==="Non payée"
        ).length
      );
    }

    return ftPerMonth;
  };
  //console.log(facturesPerMonth());
  console.log (factures!== "loading" &&factures 
   )
  
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
          <div className="text-center">
            <img src="/Assets/home.png" alt="home" width={50} />
            <h2 className="mt-2">Bienvenue sur la page d'accueil</h2>

            {user.function === "Admin" ? (
              <div>
                <BarChart clients={clientsPerMonth()} page={"home"} />
                <BarChart factures={facturesPerMonth()} page={"factureHome"} />
              </div>
            ) : (
              user.function === "Employer" && (
                <div className="border boder-1 rounder p-3 rounded shadow">
                  <p>Vous pouvez accéder aux rubriques suivantes :</p>
                  {!user.privileges.clients &&
                  !user.privileges.compteurs &&
                  !user.privileges.factures ? (
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
                    <div className="centerDiv gap-2">
                      {user.privileges.clients && (
                        <div>
                          <a
                            href="/clients"
                            className="centerDiv d-flex gap-4 fw-bold text-dark btn btn-info p-4 pb-1 pt-1"
                            style={{ textDecoration: "none" }}
                          >
                            clients
                          </a>
                          <div className="centerDiv gap-2 mt-1">
                            {user.crudAccess.clients.add && (
                              <div className="btn btn-success p-2 pb-0 pt-0">
                                <i class="bi bi-plus-circle" title="Ajout"></i>
                              </div>
                            )}
                            {user.crudAccess.clients.mod && (
                              <div className="btn btn-primary p-2 pb-0 pt-0">
                                <i class="bi bi-pen" title="Modification"></i>
                              </div>
                            )}
                            {user.crudAccess.clients.dlt && (
                              <div className="btn btn-primary p-2 pb-0 pt-0">
                                <i
                                  className="bi bi-trash3-fill"
                                  title="Suppression"
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {user.privileges.compteurs && (
                        <div>
                          <a
                            href="/compteurs"
                            className="centerDiv d-flex gap-4 fw-bold text-dark btn btn-info p-4 pb-1 pt-1"
                            style={{ textDecoration: "none" }}
                          >
                            compteurs
                          </a>
                          <div className="centerDiv gap-2 mt-1">
                            {user.crudAccess.compteurs.add && (
                              <div className="btn btn-success p-2 pb-0 pt-0">
                                <i class="bi bi-plus-circle" title="Ajout"></i>
                              </div>
                            )}
                            {user.crudAccess.compteurs.mod && (
                              <div className="btn btn-primary p-2 pb-0 pt-0">
                                <i class="bi bi-pen" title="Modification"></i>
                              </div>
                            )}
                            {user.crudAccess.compteurs.dlt && (
                              <div className="btn btn-primary p-2 pb-0 pt-0">
                                <i
                                  className="bi bi-trash3-fill"
                                  title="Suppression"
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {user.privileges.factures && (
                        <div>
                          <a
                            href="/factures"
                            className="centerDiv d-flex gap-4 fw-bold text-dark btn btn-info p-4 pb-1 pt-1"
                            style={{ textDecoration: "none" }}
                          >
                            factures
                          </a>
                          <div className="centerDiv gap-2 mt-1">
                            {user.crudAccess.factures.add && (
                              <div className="btn btn-success p-2 pb-0 pt-0">
                                <i class="bi bi-plus-circle" title="Ajout"></i>
                              </div>
                            )}
                            {user.crudAccess.factures.mod && (
                              <div className="btn btn-primary p-2 pb-0 pt-0">
                                <i class="bi bi-pen" title="Modification"></i>
                              </div>
                            )}
                            {user.crudAccess.factures.dlt && (
                              <div className="btn btn-primary p-2 pb-0 pt-0">
                                <i
                                  className="bi bi-trash3-fill"
                                  title="Suppression"
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </Main>
    </div>
  );
}

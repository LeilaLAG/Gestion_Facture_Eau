import React from "react";
import Menu from "./Menu";
import Main from "./Main";
import { useUser } from "../Auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <div className="centerDiv w-100 h-100">
          <div className="text-center">
            <img src="/Assets/home.png" alt="home" width={50} />
            <h2 className="mt-2">Bienvenue sur la page d'accueil</h2>
            {user.function === "Employer" && (
              <div className="border boder-1 rounder p-3 rounded shadow">
                <p>Vous pouvez accéder aux rubriques suivantes :</p>
                <div className="centerDiv gap-2">
                  {user.privileges.clients && (
                    <div>
                      <a
                        href="/clients"
                        className="centerDiv d-flex gap-4 fw-bold text-dark btn btn-info p-4 pb-1 pt-1"
                        style={{ textDecoration: "none" }}
                      >
                        clients
                      <div className="centerDiv gap-2">
                        {user.crudAccess.clients.add && (
                          <i class="bi bi-plus-circle" title="Ajout"></i>
                        )}
                        {user.crudAccess.clients.mod && (
                          <i class="bi bi-pen" title="Modification"></i>
                        )}
                        {user.crudAccess.clients.dlt && (
                          <i
                            className="bi bi-trash3-fill"
                            title="Suppression"
                          ></i>
                        )}
                      </div>
                      </a>
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
                      <div className="centerDiv gap-2">
                        {user.crudAccess.compteurs.add && (
                          <i class="bi bi-plus-circle" title="Ajout"></i>
                        )}
                        {user.crudAccess.compteurs.mod && (
                          <i class="bi bi-pen" title="Modification"></i>
                        )}
                        {user.crudAccess.compteurs.dlt && (
                          <i
                            className="bi bi-trash3-fill"
                            title="Suppression"
                          ></i>
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
                      <div className="centerDiv gap-2">
                        {user.crudAccess.factures.add && (
                          <i class="bi bi-plus-circle" title="Ajout"></i>
                        )}
                        {user.crudAccess.factures.mod && (
                          <i class="bi bi-pen" title="Modification"></i>
                        )}
                        {user.crudAccess.factures.dlt && (
                          <i
                            className="bi bi-trash3-fill"
                            title="Suppression"
                          ></i>
                        )}
                      </div>
                    </div>
                  )}
                  {user.privileges.tranches && (
                    <div>
                      <a
                        href="/tranches"
                        className="centerDiv d-flex gap-4 fw-bold text-dark btn btn-info p-4 pb-1 pt-1"
                        style={{ textDecoration: "none" }}
                      >
                        tranches
                      </a>
                      <div className="centerDiv gap-2">
                        {user.crudAccess.tranches.add && (
                          <i class="bi bi-plus-circle" title="Ajout"></i>
                        )}
                        {user.crudAccess.tranches.mod && (
                          <i class="bi bi-pen" title="Modification"></i>
                        )}
                        {user.crudAccess.tranches.dlt && (
                          <i
                            className="bi bi-trash3-fill"
                            title="Suppression"
                          ></i>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import FilterData from "./FilterData";
import GetFactures from "../hooks/GetFactures";
import GetClients from "../hooks/GetClients";
import { useUser } from "../Auth/ProtectedRoute";

export default function Facture() {
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  let factureData = GetFactures();
  const clients = GetClients();
  const { user } = useUser();

  const [facture, setFacture] = useState([]);
  const [filterParams, setFilterParams] = useState({ numFacture: "" });

  useEffect(() => {
    setFacture(factureData);
  }, [factureData]);

  function handleDeletefact(e, factToDlt) {
    e.preventDefault();

    function removeDeletedFact() {
      setFacture((prev) => prev.filter((fact) => fact._id !== factToDlt._id));
    }

    Swal.fire({
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
      text: `Êtes-vous sûr de supprimer la facture n° ${factToDlt.numFacture} ?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteFacture/${factToDlt._id}`,
            { withCredentials: true }
          )
          .then(() => {
            toast.success("La facture a été supprimée.");
            removeDeletedFact();
          })
          .catch(() =>
            toast.error("Un problème est survenu lors de la suppression !")
          );
      }
    });
  }

  function handleFilterParams(e) {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  }

  function handleSubmitFilter(e) {
    e.preventDefault();

    const { numFacture } = filterParams;

    if (numFacture !== "") {
      setFacture(factureData.filter((fact) => fact.numFacture === numFacture));
    } else {
      setFacture(factureData);
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des factures :</h3>
        {facture === "loading" ? (
          <div className="centerDiv w-100">
            <Loading />
          </div>
        ) : (
          <>
            <article
              style={{ position: "sticky", top: "0%" }}
              className="pt-2 pb-2 bg-white accordion"
              id="accordionExample"
            >
              <FilterData
                page="facture"
                onSubmitFilter={handleSubmitFilter}
                onChangeFilter={handleFilterParams}
              />
              <div className="d-flex align-items-center gap-4 p-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="/Assets/bill.png"
                    alt="fact count"
                    width={20}
                    title="Nombre total de factures"
                  />
                  <span className="fw-bold">{facture.length}</span>
                </div>
                {user.function === "Employer"
                  ? user.crudAccess.factures.add && (
                      <a
                        href="/facture/add-facture"
                        className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Ajouter une nouvelle facture
                      </a>
                    )
                  : user.function === "Admin" && (
                      <a
                        href="/facture/add-facture"
                        className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Ajouter une nouvelle facture
                      </a>
                    )}
              </div>
            </article>

            {clients === "loading" ? (
              <Loading />
            ) : clients.length <= 0 ? (
              <div className="mt-5">
                <ErrorMsg
                  msg={"Aucun client a été enregistrer"}
                  errorIconWidth={20}
                  coleur={"red"}
                  boldness="bold"
                  imgPath="Assets/empty.png"
                />
              </div>
            ) : (
              clients.map((client, i) => (
                <div
                  className="accordion border border-4 mb-2 rounded"
                  key={client.numClient || i}
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button fw-bold p-2"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#client-${i}`}
                      aria-expanded="true"
                      aria-controls={`client-${i}`}
                    >
                      <img src="/Assets/user.png" alt="" width={18} />
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span className="m-3 mt-0 mb-0">
                          {client.nameClient}
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`client-${i}`}
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body p-2">
                      <table
                        className="table table-bordered text-center w-100"
                        style={{ verticalAlign: "middle" }}
                      >
                        <thead>
                          <tr>
                            <th>N°</th>
                            <th>Date facture</th>
                            <th>Date de paiement</th>
                            <th>N° compteur</th>
                            <th>Valeur compteur prélève</th>
                            <th>Statut de paiement</th>
                            <th>Total Facture</th>
                            <th>Date de génération</th>
                            <th colSpan={2}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facture.length <= 0 ? (
                            <tr className="border border-0">
                              <td colSpan={10} className="border border-0 pt-4">
                                <ErrorMsg
                                  msg={
                                    "Aucune facture a été enregistrer pour ce client"
                                  }
                                  errorIconWidth={20}
                                  coleur={"red"}
                                  boldness="bold"
                                  imgPath="Assets/empty.png"
                                />
                              </td>
                            </tr>
                          ) : (
                            facture.map((fact, index) => (
                              <tr key={index}>
                                <td>{fact.numFacture}</td>
                                <td>
                                  {new Date(
                                    fact.dateFacture
                                  ).toLocaleDateString("eu", DateConfig)}
                                </td>
                                <td>
                                  {new Date(
                                    fact.datePainement
                                  ).toLocaleDateString("eu", DateConfig)}
                                </td>
                                <td>{fact.numCompteur}</td>
                                <td>{fact.valeurCompteurPreleve}</td>
                                <td>{fact.painementStatus}</td>
                                <td>{fact.totalFacture}</td>
                                <td>
                                  {new Date(
                                    fact.dateGenerationFacture
                                  ).toLocaleDateString("eu", {
                                    ...DateConfig,
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>
                                <td>
                                  <a
                                    href={`/facture/update-facture/${fact.numFacture}`}
                                    className="btn btn-primary"
                                    title="Modifier"
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </a>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={(e) => handleDeletefact(e, fact)}
                                    title="Supprimer"
                                  >
                                    <i className="bi bi-trash3-fill"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </Main>
    </div>
  );
}

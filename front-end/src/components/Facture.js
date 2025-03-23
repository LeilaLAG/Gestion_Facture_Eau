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
import GetCompteurs from "../hooks/GetCompteurs";

export default function Facture() {
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const [filterParams, setFilterParams] = useState({
    numClient: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  let factureData = GetFactures(filterParams.year, filterParams.month, "");

  const clientData = GetClients();
  const compteurData = GetCompteurs();

  const { user } = useUser();

  const [facture, setFacture] = useState([]);
  const [clients, setClients] = useState([]);
  const [compteurs, setCompteurs] = useState([]);

  // const [filterByDateFacture, setFilterByDateFacture] = useState("");
  const [filterByNumCompteur, setFilterByNumCompteur] = useState(0);

  useEffect(() => {
    setFacture(factureData);
    setClients(clientData);
    setCompteurs(compteurData);
  }, [factureData, clientData, compteurData]);

  function handleDeletefact(e, factToDlt) {
    e.preventDefault();

    function removeDeletedFact() {
      setFacture((prev) => prev.filter((fact) => fact._id !== factToDlt._id));
    }

    Swal.fire({
      title: `<img src="/Assets/trash.gif" alt="delete" width="50" />`,
      text: `Êtes-vous sûr de supprimer la facture ${factToDlt._id}?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
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

    setClients(clientData);

    const { nameClient } = filterParams;

    if (nameClient !== "") {
      setClients((prev) =>
        prev.filter((client) => client.nameClient === nameClient)
      );
      return;
    }
  }

  function filterFacture(e) {
    e.preventDefault();
    // const filter_date = new Date(filterByDateFacture).getFullYear();

    setFacture(factureData);

    // if (filterByDateFacture !== "") {
    //   setFacture((prev) =>
    //     prev.filter(
    //       (f) =>
    //         new Date(f.dateFacture).getFullYear() === filter_date &&
    //         f.numClient === client
    //     )
    //   );
    // }
    if (filterByNumCompteur !== 0) {
      setFacture((prev) =>
        prev.filter(
          (f) => parseInt(f.numCompteur) === parseInt(filterByNumCompteur)
        )
      );
    }
  }

  function handlePaiedFacture(e, factureId) {
    e.preventDefault();

    Swal.fire({
      title: `<img src="/Assets/paid.gif" alt="delete" width="50" />`,
      text: `Êtes-vous sûr que cette facture ${factureId} a été payer ?`,
      showCancelButton: true,
      confirmButtonColor: "#6fac0d",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      // cancelButtonColor : "#d33",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .put(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/updateFacturePainementStatus/${factureId}`,
            { painementStatus: "Payée" },
            { withCredentials: true }
          )
          .then(() => {
            window.location.reload();
          })
          .catch(() =>
            toast.error(
              "Un problème est survenu lors de la modification de status du paiement !"
            )
          );
      }
    });
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
              style={{ position: "sticky", top: "0%", zIndex: 10 }}
              className="pt-2 pb-2 bg-white accordion"
              id="accordionExample"
            >
              <FilterData
                page="facture"
                onSubmitFilter={handleSubmitFilter}
                onChangeFilter={handleFilterParams}
              />
              <div className="d-flex align-items-center gap-4 pt-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">Nombre totale des factures :</span>
                  <img
                    src="/Assets/factures.png"
                    alt="fact count"
                    width={20}
                    title="Nombre total de factures"
                  />
                  <span className="fw-bold">{facture.length}</span>
                </div>
              </div>
            </article>
            <a
              className="btn btn-dark p-3 pt-1 pb-1 fw-bold mb-2 centerDiv"
              href="/facture/print-all-factures"
            >
              <i className="bi bi-printer"></i>
              <span style={{marginLeft : "10px"}}>Imprimer tous les factures de {new Date().getMonth() + 1 === 1 ? 12 : new Date().getMonth()} / {new Date().getMonth() + 1 === 1 ? new Date().getFullYear()-1 : new Date().getFullYear()}</span>
            </a>

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
                        <div className="d-flex align-items-center m-3 mt-0 mb-0">
                          <img
                            src="/Assets/factures.png"
                            alt="facture count"
                            width={20}
                          />
                          <span className="m-2 mt-0 mb-0">
                            {
                              facture.filter(
                                (c) => c.numClient === client.numClient
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`client-${i}`}
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div
                      className="accordion-body p-2 "
                      style={{ overflowX: "auto" }}
                    >
                      <form
                        onSubmit={function (e) {
                          filterFacture(e);
                        }}
                        className="d-flex align-items-center gap-3"
                      >
                        <label className="fw-bold">Filtrer par:</label>
                        <select
                          className="form-control pb-1 pt-1 w-25"
                          onChange={(e) =>
                            setFilterByNumCompteur(e.target.value)
                          }
                        >
                          <option>Numéro de compteur</option>
                          {compteurs !== "loading" &&
                            compteurs
                              .filter((c) => c.numClient === client.numClient)
                              .map((clientComp, i) => (
                                <option key={i} value={clientComp.numCompteur}>
                                  N°-{clientComp.numCompteur}
                                </option>
                              ))}
                        </select>

                        <button className="btn btn-info p-4 pb-1 pt-1 fw-bold">
                          Filter
                        </button>
                      </form>
                      {user.function === "Employer"
                        ? user.crudAccess.factures.add && (
                            <a
                              href={`/facture/add-facture/${client.numClient}`}
                              className="btn btn-success pt-1 pb-1 p-3 fw-bold mt-2"
                              style={{ fontSize: "13px" }}
                            >
                              Générer une nouvelle facture
                            </a>
                          )
                        : user.function === "Admin" && (
                            <a
                              href={`/facture/add-facture/${client.numClient}`}
                              className="btn btn-success pt-1 pb-1 p-3 fw-bold mt-2"
                              style={{ fontSize: "13px" }}
                            >
                              Générer une nouvelle facture
                            </a>
                          )}
                      <table
                        className="table table-bordered text-center w-100 mt-2 mb-0"
                        style={{ verticalAlign: "middle" }}
                      >
                        <thead>
                          <tr>
                            <th>N°</th>
                            <th>Date de consomation</th>
                            <th>Date de paiement</th>
                            <th>N° compteur</th>
                            <th title="Valeur compteur prélève">V.C.P</th>
                            <th>Statut de paiement</th>
                            <th>Total de Facture</th>
                            <th>Date de génération</th>
                            <th colSpan={4}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facture.filter(
                            (f) => f.numClient === client.numClient
                          ).length <= 0 ? (
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
                            facture
                              .filter((f) => f.numClient === client.numClient)
                              .sort(
                                (a, b) =>
                                  new Date(b.dateFacture) -
                                  new Date(a.dateFacture)
                              )
                              .map((fact, index) => (
                                <tr key={index}>
                                  <td title={fact._id}>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "70px",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {fact._id}
                                    </span>
                                  </td>
                                  <td>
                                    {new Date(
                                      fact.dateFacture
                                    ).toLocaleDateString("eu", DateConfig)}
                                  </td>
                                  <td>
                                    {fact.datePainement
                                      ? new Date(
                                          fact.datePainement
                                        ).toLocaleDateString("eu", DateConfig)
                                      : "-"}
                                  </td>
                                  <td>N°-{fact.numCompteur}</td>
                                  <td>{fact.valeurCompteurPreleve}</td>
                                  <td
                                    style={{ fontWeight: "bold" }}
                                    className={
                                      fact.painementStatus === "Payée"
                                        ? "text-success"
                                        : "text-danger"
                                    }
                                  >
                                    {fact.painementStatus}
                                  </td>
                                  <td>{fact.totalFacture} Dh</td>
                                  <td>
                                    {new Date(
                                      fact.dateGenerationFacture
                                    ).toLocaleDateString("eu", DateConfig)}
                                  </td>
                                  <td>
                                    <a
                                      href={`/facture/print-facture/${fact._id}`}
                                      className="btn btn-dark"
                                      title="Imprimer"
                                    >
                                      <i className="bi bi-printer"></i>
                                    </a>
                                  </td>
                                  {user.function === "Employer"
                                    ? user.crudAccess.factures.mod && (
                                        <div className="centerDiv gap-1">
                                          <td>
                                            <form
                                              onSubmit={(e) =>
                                                handlePaiedFacture(e, fact._id)
                                              }
                                            >
                                              <button
                                                className="btn btn-success"
                                                title="Payée"
                                                disabled={
                                                  fact.painementStatus ===
                                                  "Payée"
                                                    ? true
                                                    : false
                                                }
                                              >
                                                <i className="bi bi-cash-stack"></i>
                                              </button>
                                            </form>
                                          </td>
                                          <td>
                                            <form
                                              method="put"
                                              action={`/facture/update-facture/${fact._id}`}
                                            >
                                              <button
                                                className="btn btn-primary"
                                                title="Modifier"
                                              >
                                                <i className="bi bi-pencil-square"></i>
                                              </button>
                                            </form>
                                          </td>
                                        </div>
                                      )
                                    : user.function === "Admin" && (
                                        <div className="centerDiv gap-1">
                                          <td>
                                            <form
                                              onSubmit={(e) =>
                                                handlePaiedFacture(e, fact._id)
                                              }
                                            >
                                              <button
                                                className="btn btn-success"
                                                title="Payée"
                                                disabled={
                                                  fact.painementStatus ===
                                                  "Payée"
                                                    ? true
                                                    : false
                                                }
                                              >
                                                <i className="bi bi-cash-stack"></i>
                                              </button>
                                            </form>
                                          </td>
                                          <hr />
                                          <td>
                                            <form
                                              method="put"
                                              action={`/facture/update-facture/${fact._id}`}
                                            >
                                              <button
                                                className="btn btn-primary"
                                                title="Modifier"
                                              >
                                                <i className="bi bi-pencil-square"></i>
                                              </button>
                                            </form>
                                          </td>
                                        </div>
                                      )}

                                  {user.function === "Employer"
                                    ? user.crudAccess.factures.dlt && (
                                        <td>
                                          <form
                                            onSubmit={(e) =>
                                              handleDeletefact(e, fact)
                                            }
                                          >
                                            <button
                                              className="btn btn-danger"
                                              title="Supprimer"
                                            >
                                              <i className="bi bi-trash3-fill"></i>
                                            </button>
                                          </form>
                                        </td>
                                      )
                                    : user.function === "Admin" && (
                                        <td>
                                          <form
                                            onSubmit={(e) =>
                                              handleDeletefact(e, fact)
                                            }
                                          >
                                            <button
                                              className="btn btn-danger"
                                              title="Supprimer"
                                            >
                                              <i className="bi bi-trash3-fill"></i>
                                            </button>
                                          </form>
                                        </td>
                                      )}
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

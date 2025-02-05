import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import GetCompteurs from "../hooks/GetCompteurs";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { useUser } from "../Auth/ProtectedRoute";
import GetClients from "../hooks/GetClients";
import FilterData from "./FilterData";

export default function Compteurs() {
  const { user } = useUser();

  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  let compteursData = GetCompteurs();
  const clientData = GetClients();

  //To enable realtime deletion simulating websockets
  const [compteurs, setCompteurs] = useState([]);
  const [clients, setClients] = useState([]);
  useEffect(() => {
    setCompteurs(compteursData);
    setClients(clientData);
  }, [compteursData, clientData]);

  function handleDeleteCompteur(e, compteurToDlt) {
    e.preventDefault();

    function removeDeletedCompteur() {
      setCompteurs((prv) =>
        prv.filter((compteur) => compteur._id !== compteurToDlt._id)
      );
    }

    Swal.fire({
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer le compteur N°${compteurToDlt.numCompteur}`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteCompteur/${compteurToDlt._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            toast.success("Le compteur a été supprimer");
            removeDeletedCompteur();
          })
          .catch((err) =>
            toast.error("Un problem est servenue lors de la suppresion!")
          );
      }
    });
  }

  // filtring --------------------------------------------------------
  const [filterParams, setFilterParams] = useState({
    nameClient: "",
  });

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
      setCompteurs((prev) =>
        prev.filter(
          (f) => f.numClient === clients[0].numClient
        ))
      return
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des compteurs :</h3>
        {compteurs === "loading" ? (
          <div className="centerDiv w-100">
            <Loading />
          </div>
        ) : (
          <div className="pb-2">
            <article
              style={{ position: "sticky", top: "0%", zIndex: 10 }}
              className="pt-2 pb-2 bg-white accordion"
            >
              <FilterData
                page="compteur"
                onSubmitFilter={(e) => handleSubmitFilter(e)}
                onChangeFilter={(e) => handleFilterParams(e)}
              />
              <div className="d-flex align-items-center gap-4 pt-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">Nombre totale des compteurs :</span>
                  <img
                    src="/Assets/counter.png"
                    alt="compteur count"
                    width={20}
                    title="Nombre totale de compteurs"
                  />
                  <span className="fw-bold">{compteurs.length}</span>
                </div>
              </div>
            </article>
            {clients !== "loading" &&
              (clients.length <= 0 ? (
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
                    key={i}
                  >
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button fw-bold p-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${i}`}
                        aria-expanded="true"
                        aria-controls={i}
                      >
                        <img src="/Assets/user.png" alt="" width={18} />
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <span className="m-3 mt-0 mb-0">
                            {client.nameClient}
                          </span>
                          <div className="d-flex align-items-center m-3 mt-0 mb-0">
                            <img
                              src="/Assets/counter.png"
                              alt="compteur count"
                              width={20}
                            />
                            <span className="m-2 mt-0 mb-0">
                              {
                                compteurs.filter(
                                  (c) => c.numClient === client.numClient
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      id={i}
                      className="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body p-2">
                        <table
                          className="table table-bordered text-center w-100 mt-2 mb-0"
                          style={{ verticalAlign: "middle" }}
                        >
                          <thead>
                            <tr>
                              <th>N°</th>
                              <th>Point De depart</th>
                              <th>Date d'utilisation</th>
                              <th>Credit</th>
                              <th>Date de modification</th>
                              <th colSpan={2}>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {compteurs.filter(
                              (c) => c.numClient === client.numClient
                            ).length <= 0 ? (
                              <tr className="border border-0">
                                <td
                                  colSpan={8}
                                  className="border border-0 pt-4"
                                >
                                  <ErrorMsg
                                    msg={
                                      "Aucun Compteur a été enregistrer pour ce client"
                                    }
                                    errorIconWidth={20}
                                    coleur={"red"}
                                    boldness="bold"
                                    imgPath="Assets/empty.png"
                                  />
                                </td>
                              </tr>
                            ) : (
                              compteurs
                                .filter((c) => c.numClient === client.numClient)
                                .map((compteur, i) =>
                                  compteur.error ? (
                                    <tr key={i} className="border border-0">
                                      <td
                                        colSpan={8}
                                        className="border border-0 pt-4"
                                      >
                                        <ErrorMsg
                                          msg={compteur.error}
                                          errorIconWidth={20}
                                          coleur={"red"}
                                          boldness="bold"
                                          imgPath="Assets/error.png"
                                        />
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr key={i}>
                                      <td>{compteur.numCompteur}</td>
                                      <td>{compteur.startPoint}</td>
                                      <td>
                                        {new Date(
                                          compteur.useDate
                                        ).toLocaleDateString("eu", DateConfig)}
                                      </td>
                                      <td>{compteur.credit}</td>
                                      <td>
                                        {!compteur.modified_at
                                          ? "-"
                                          : new Date(
                                              compteur.modified_at
                                            ).toLocaleDateString("eu", {
                                              ...DateConfig,
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                      </td>
                                      {user.function === "Employer"
                                        ? user.crudAccess.compteurs.mod && (
                                            <td>
                                              <form
                                                method="put"
                                                action={`/compteurs/update-compteur/${compteur._id}`}
                                              >
                                                <button
                                                  className="btn btn-primary"
                                                  title="Modifier"
                                                >
                                                  <i className="bi bi-pencil-square"></i>
                                                </button>
                                              </form>
                                            </td>
                                          )
                                        : user.function === "Admin" && (
                                            <td>
                                              <form
                                                method="put"
                                                action={`/compteurs/update-compteur/${compteur._id}`}
                                              >
                                                <button
                                                  className="btn btn-primary"
                                                  title="Modifier"
                                                >
                                                  <i className="bi bi-pencil-square"></i>
                                                </button>
                                              </form>
                                            </td>
                                          )}

                                      {user.function === "Employer"
                                        ? user.crudAccess.compteurs.dlt && (
                                            <td>
                                              <form
                                                onSubmit={(e) =>
                                                  handleDeleteCompteur(
                                                    e,
                                                    compteur
                                                  )
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
                                                  handleDeleteCompteur(
                                                    e,
                                                    compteur
                                                  )
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
                                  )
                                )
                            )}
                          </tbody>
                          {user.function === "Employer"
                            ? user.crudAccess.compteurs.add && (
                                <td colSpan={4} className="text-start">
                                  {compteurs.filter(
                                    (c) => c.numClient === client.numClient
                                  ).length < 5 && (
                                    <a
                                      href={`/compteurs/add-compteur/${client.numClient}`}
                                      className="btn btn-success pt-1 pb-1 p-3 fw-bold mt-2"
                                      style={{ fontSize: "13px" }}
                                    >
                                      Ajouter un nouveau compteur
                                    </a>
                                  )}
                                </td>
                              )
                            : user.function === "Admin" && (
                                <td colSpan={4} className="text-start">
                                  {compteurs.filter(
                                    (c) => c.numClient === client.numClient
                                  ).length < 5 && (
                                    <a
                                      href={`/compteurs/add-compteur/${client.numClient}`}
                                      className="btn btn-success pt-1 pb-1 p-3 fw-bold mt-2"
                                      style={{ fontSize: "13px" }}
                                    >
                                      Ajouter un nouveau compteur
                                    </a>
                                  )}
                                </td>
                              )}
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              ))}
          </div>
        )}
      </Main>
    </div>
  );
}

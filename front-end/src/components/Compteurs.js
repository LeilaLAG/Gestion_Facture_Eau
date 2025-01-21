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
  useEffect(() => {
    setCompteurs(compteursData);
  }, [compteursData]);

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
      confirmButtonText: "Oui, supprimer",
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
    numCompteur: "",
  });

  function handleFilterParams(e) {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  }

  function handleSubmitFilter(e) {
    e.preventDefault();

    setCompteurs(compteursData);

    const { numCompteur } = filterParams;

    if (numCompteur !== "") {
      setCompteurs((prev) =>
        prev.filter(
          (compteur) => parseInt(compteur.numCompteur) === parseInt(numCompteur)
        )
      );
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des compteurs :</h3>
        {compteurs === "loading" ? (
          <div className="d-flex justify-content-center w-100">
            <Loading />
          </div>
        ) : (
          <div className="pb-2">
            <article
              style={{ position: "sticky", top: "0%" }}
              className="pt-2 pb-2 bg-white accordion"
              id="accordionExample"
            >
              <FilterData
                page="compteur"
                onSubmitFilter={(e) => handleSubmitFilter(e)}
                onChangeFilter={(e) => handleFilterParams(e)}
              />
              <div className="d-flex align-items-center gap-4 p-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="/Assets/counter.png"
                    alt="compteur count"
                    width={20}
                    title="Nombre totale de compteurs"
                  />
                  <span className="fw-bold">{compteurs.length}</span>
                </div>
                <hr width={40} />
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="/Assets/counterEdit.png"
                    alt="modified compteurs"
                    width={22}
                    title="Nombre de compteurs modifier"
                  />
                  <span className="fw-bold">
                    {
                      compteurs.filter(
                        (compteur) =>
                          compteur.modified_at &&
                          compteur.companyId === user.companyId
                      ).length
                    }
                  </span>
                </div>
                {/* <a
                  href="/compteurs/add-compteur"
                  className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                  style={{ fontSize: "13px" }}
                >
                  Ajouter un nouveau compteur
                </a> */}
              </div>
            </article>
            {clientData !== "loading" &&
              clientData.map((client, i) => (
                <details key={i}>
                  <summary>{client.nameClient}</summary>
                  <table
                    className="table table-bordered text-center w-100"
                    style={{ verticalAlign: "middle" }}
                  >
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th>Point De Depart</th>
                        <th>Date d'utilisation</th>
                        <th>Credit</th>
                        <th>Nom Client</th>
                        <th>Date de modification</th>
                        <th colSpan={2}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {compteurs.filter((c) => c.numClient === client.numClient)
                        .length <= 0 ? (
                        <tr className="border border-0">
                          <td colSpan={8} className="border border-0 pt-4">
                            <ErrorMsg
                              msg={"Aucun data"}
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
                                <td>{client.nameClient}</td>
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
                                <td>
                                  <form
                                    method="put"
                                    action={`/compteurs/update-compteur/${compteur._id}`}
                                  >
                                    <button className="btn btn-primary">
                                      <i className="bi bi-pencil-square"></i>
                                    </button>
                                  </form>
                                </td>
                                <td>
                                  <form
                                    onSubmit={(e) =>
                                      handleDeleteCompteur(e, compteur)
                                    }
                                  >
                                    <button className="btn btn-danger">
                                      <i className="bi bi-trash3-fill"></i>
                                    </button>
                                  </form>
                                </td>
                              </tr>
                            )
                          )
                      )}
                    </tbody>
                    <td>
                      {compteurs.filter((c) => c.numClient === client.numClient)
                        .length < 5 && (
                        <a
                          href={`/compteurs/add-compteur/${client.numClient}`}
                          className="btn btn-success pt-1 pb-1 p-3 fw-bold mt-3"
                          style={{ fontSize: "13px" }}
                        >
                          Ajouter un nouveau compteur
                        </a>
                      )}
                    </td>
                  </table>
                </details>
              ))}
            {/* <table
              className="table table-bordered text-center w-100"
              style={{ verticalAlign: "middle" }}
            >
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Point De Depart</th>
                  <th>Date d'utilisation</th>
                  <th>Credit</th>
                  <th>Nom Client</th>
                  <th>Date de modification</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {compteurs.length <= 0 ? (
                  <tr className="border border-0">
                    <td colSpan={8} className="border border-0 pt-4">
                      <ErrorMsg
                        msg={"Aucun data"}
                        errorIconWidth={20}
                        coleur={"red"}
                        boldness="bold"
                        imgPath="Assets/empty.png"
                      />
                    </td>
                  </tr>
                ) : (
                  compteurs.map((compteur, i) =>
                    compteur.error ? (
                      <tr key={i} className="border border-0">
                        <td colSpan={8} className="border border-0 pt-4">
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
                          {new Date(compteur.useDate).toLocaleDateString(
                            "eu",
                            DateConfig
                          )}
                        </td>
                        <td>{compteur.credit}</td>
                        <td>
                          {clientData !== "loading" &&
                            clientData.find(
                              (client) =>
                                client.numClient === compteur.numClient
                            ).nameClient}
                        </td>
                        <td>
                          {!compteur.modified_at
                            ? "-"
                            : new Date(compteur.modified_at).toLocaleDateString(
                                "eu",
                                {
                                  ...DateConfig,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                        </td>
                        <td>
                          <form
                            method="put"
                            action={`/compteurs/update-compteur/${compteur._id}`}
                          >
                            <button className="btn btn-primary">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </form>
                        </td>
                        <td>
                          <form
                            onSubmit={(e) => handleDeleteCompteur(e, compteur)}
                          >
                            <button className="btn btn-danger">
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </form>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table> */}
          </div>
        )}
      </Main>
    </div>
  );
}

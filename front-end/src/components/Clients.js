import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import GetClients from "../hooks/GetClients";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { useUser } from "../Auth/ProtectedRoute";
import FilterData from "./FilterData";

export default function Clients() {
  const { user } = useUser();
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  let clientsData = GetClients();

  // To enable realtime deletion simulating websockets
  const [clients, setClients] = useState([]);
  useEffect(() => {
    setClients(clientsData);
  }, [clientsData]);

  // Deleting -------------------------------------------------------
  function handleDeleteClient(e, clientToDlt) {
    e.preventDefault();

    function removeDeletedClient() {
      setClients((prv) =>
        prv.filter((client) => client._id !== clientToDlt._id)
      );
    }

    Swal.fire({
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer le client ${clientToDlt.nameClient}? tous les données (compteurs et factures) vont etre supprimer aussi`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteClient/${clientToDlt._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            axios
              .delete(
                `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteClientCompteurs/${clientToDlt.numClient}`,
                {
                  withCredentials: true,
                }
              )
              .then((res) => {
                toast.success("Le client a été supprimer");
                removeDeletedClient();
              })
              .catch((err) =>
                toast.error(
                  "Un problem est servenue lors de la suppresion des données client!"
                )
              );
          })
          .catch((err) =>
            toast.error("Un problem est servenue lors de la suppresion!")
          );
      }
    });
  }

  // filtring --------------------------------------------------------
  const [filterParams, setFilterParams] = useState({
    cin: "",
    tele: "",
  });

  function handleFilterParams(e) {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  }

  function handleSubmitFilter(e) {
    e.preventDefault();

    setClients(clientsData);

    const { cin, tele } = filterParams;

    if (cin !== "") {
      setClients((prev) => prev.filter((client) => client.cin === cin));
    }

    if (tele !== "") {
      setClients((prev) => prev.filter((client) => client.tele === tele));
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des clients :</h3>
        {clients === "loading" ? (
          <div className="centerDiv w-100">
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
                page="client"
                onSubmitFilter={(e) => handleSubmitFilter(e)}
                onChangeFilter={(e) => handleFilterParams(e)}
              />
              <div className="d-flex align-items-center gap-4 pt-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">Nombre totale des clients :</span>
                  <img
                    src="/Assets/clients.png"
                    alt="client count"
                    width={20}
                    title="Nombre totale de clients"
                  />
                  <span className="fw-bold">{clients.length}</span>
                </div>
                {/* <hr width={40} />
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="/Assets/clientEdit.png"
                    alt="modified clients"
                    width={22}
                    title="Nombre de clients modifier"
                  />
                  <span className="fw-bold">
                    {
                      clients.filter(
                        (client) =>
                          client.modified_at &&
                          client.companyId === user.companyId
                      ).length
                    }
                  </span>
                </div> */}
                {user.function === "Employer"
                  ? user.crudAccess.clients.add && (
                      <a
                        href="/clients/add-client"
                        className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Ajouter un nouveau client
                      </a>
                    )
                  : user.function === "Admin" && (
                      <a
                        href="/clients/add-client"
                        className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Ajouter un nouveau client
                      </a>
                    )}
              </div>
            </article>
            <table
              className="table table-bordered text-center w-100"
              style={{ verticalAlign: "middle" }}
            >
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Nom complet</th>
                  <th>CIN</th>
                  <th>Date de naissance</th>
                  <th>Telephone</th>
                  <th>Adresse</th>
                  <th>Date d'enregistrement</th>
                  <th>Date de modification</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length <= 0 ? (
                  <tr className="border border-0">
                    <td colSpan={8} className="border border-0 pt-4">
                      <ErrorMsg
                        msg={"Aucun client a été enregistrer"}
                        errorIconWidth={20}
                        coleur={"red"}
                        boldness="bold"
                        imgPath="Assets/empty.png"
                      />
                    </td>
                  </tr>
                ) : (
                  clients.map((client, i) =>
                    client.error ? (
                      <tr key={i} className="border border-0">
                        <td colSpan={8} className="border border-0 pt-4">
                          <ErrorMsg
                            msg={client.error}
                            errorIconWidth={20}
                            coleur={"red"}
                            boldness="bold"
                            imgPath="Assets/error.png"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td>{client.numClient}</td>
                        <td>{client.nameClient}</td>
                        <td>{client.cin}</td>
                        <td>
                          {new Date(client.birthDate).toLocaleDateString(
                            "eu",
                            DateConfig
                          )}
                        </td>
                        <td>{client.tele}</td>
                        <td title={client.adresse}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "70px",
                              overflow: "hidden",
                              whiteSpace:"nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {client.adresse}
                          </span>
                        </td>
                        <td>
                          {new Date(
                            client.dateRegisterClient
                          ).toLocaleDateString("eu", {
                            ...DateConfig,
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          {!client.modified_at
                            ? "-"
                            : new Date(client.modified_at).toLocaleDateString(
                                "eu",
                                {
                                  ...DateConfig,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                        </td>
                        {user.function === "Employer"
                          ? user.crudAccess.clients.mod && (
                              <td>
                                <form
                                  method="put"
                                  action={`/clients/update-client/${client._id}`}
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
                                  action={`/clients/update-client/${client._id}`}
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
                          ? user.crudAccess.clients.dlt && (
                              <td>
                                <form
                                  onSubmit={(e) =>
                                    handleDeleteClient(e, client)
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
                                    handleDeleteClient(e, client)
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
            </table>
          </div>
        )}
      </Main>
    </div>
  );
}

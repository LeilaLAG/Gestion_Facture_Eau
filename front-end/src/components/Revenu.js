import React, { useEffect, useState } from "react";
import Main from "./Main";
import Menu from "./Menu";
import Loading from "../costumComponents/Loading";
import toast, { Toaster } from "react-hot-toast";
import GetRevenus from "../hooks/GetRevenus";
import ErrorMsg from "../costumComponents/ErrorMsg";
import Swal from "sweetalert2";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";

export default function Revenu() {
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const revenusData = GetRevenus();

  const { user } = useUser();

  // To enable realtime deletion simulating websockets
  const [revenus, setrevenus] = useState([]);
  useEffect(() => {
    setrevenus(revenusData);
  }, [revenusData]);

  // Deleting -------------------------------------------------------
  function handleDeleterevenu(e, revenuToDlt) {
    e.preventDefault();

    function removeDeletedrevenu() {
      setrevenus((prv) =>
        prv.filter((revenu) => revenu._id !== revenuToDlt._id)
      );
    }

    Swal.fire({
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer ce revenu ?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleterevenu/${revenuToDlt._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            toast.success("Le revenu a été supprimer");
            removeDeletedrevenu();
          })
          .catch((err) =>
            toast.error("Un problem est servenue lors de la suppresion!")
          );
      }
    });
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des revenus :</h3>
        {revenus === "loading" ? (
          <div className="centerDiv w-100">
            <Loading />
          </div>
        ) : (
          <div className="pb-2" style={{ overflowX: "auto" }}>
            <table
              className="table table-bordered text-center w-100 mb-1"
              style={{ verticalAlign: "middle" }}
            >
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Designation</th>
                  <th>Montant</th>
                  <th>Date revenus</th>
                  <th colSpan={3}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {revenus.length <= 0 ? (
                  <tr className="border border-0">
                    <td colSpan={8} className="border border-0 pt-4">
                      <ErrorMsg
                        msg={"Aucune revenu a été enregistrer"}
                        errorIconWidth={20}
                        coleur={"red"}
                        boldness="bold"
                        imgPath="Assets/empty.png"
                      />
                    </td>
                  </tr>
                ) : (
                  revenus.map((revenu, i) =>
                    revenu.error ? (
                      <tr key={i} className="border border-0">
                        <td colSpan={8} className="border border-0 pt-4">
                          <ErrorMsg
                            msg={revenu.error}
                            errorIconWidth={20}
                            coleur={"red"}
                            boldness="bold"
                            imgPath="Assets/error.png"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td title={revenu._id}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "120px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {revenu._id}
                          </span>
                        </td>
                        <td>{revenu.designation}</td>
                        <td>{revenu.montant} Dh</td>
                        <td>
                          {new Date(revenu.dateRevenu).toLocaleDateString(
                            "eu",
                            {
                              ...DateConfig,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        {user.function === "Employer"
                          ? user.crudAccess.revenus.mod && (
                              <td>
                                <form
                                  method="put"
                                  action={`/revenus/update-revenu/${revenu._id}`}
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
                                  action={`/revenus/update-revenu/${revenu._id}`}
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
                          ? user.crudAccess.revenus.dlt && (
                              <td>
                                <form
                                  onSubmit={(e) =>
                                    handleDeleterevenu(e, revenu)
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
                                    handleDeleterevenu(e, revenu)
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
            {user.function === "Employer"
              ? user.crudAccess.revenus.add && (
                  <div
                    className="centerDiv p-2 rounded"
                    colSpan={8}
                    style={{
                      border: "1px dashed lightgray",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    <a
                      href="/revenus/add-revenu"
                      className="centerDiv gap-2 fs-5 text-success"
                    >
                      <i className="bi bi-plus-circle"></i>
                      <p
                        className="m-0 text-dark centerDiv gap-2"
                        style={{ opacity: ".7", fontSize: "13px" }}
                      >
                        <span>Ajouter un nouvel revenu</span>
                      </p>
                    </a>
                  </div>
                )
              : user.function === "Admin" && (
                  <div
                    className="centerDiv p-2 rounded"
                    colSpan={8}
                    style={{
                      border: "1px dashed lightgray",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    <a
                      href="/revenus/add-revenu"
                      className="centerDiv gap-2 fs-5 text-success"
                    >
                      <i className="bi bi-plus-circle"></i>
                      <p
                        className="m-0 text-dark centerDiv gap-2"
                        style={{ opacity: ".7", fontSize: "13px" }}
                      >
                        <span>Ajouter un nouvel revenu</span>
                      </p>
                    </a>
                  </div>
                )}
          </div>
        )}
      </Main>
    </div>
  );
}

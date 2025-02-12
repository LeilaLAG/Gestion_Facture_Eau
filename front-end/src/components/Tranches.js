import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { useUser } from "../Auth/ProtectedRoute";
import GetTranches from "../hooks/GetTranches";

export default function Tranches() {
  const { user } = useUser();
  let tranchesData = GetTranches();

  // To enable realtime deletion simulating websockets
  const [tranches, setTranches] = useState([]);
  useEffect(() => {
    setTranches(tranchesData);
  }, [tranchesData]);

  // Deleting -------------------------------------------------------
  function handleDeletetranche(e, trancheToDlt) {
    e.preventDefault();

    function removeDeletedTranche() {
      setTranches((prv) =>
        prv.filter((tranche) => tranche._id !== trancheToDlt._id)
      );
    }

    Swal.fire({
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer la tranche ${trancheToDlt.nametranche}?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteTranche/${trancheToDlt._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            toast.success("La tranche a été supprimer");
            removeDeletedTranche();
          })
          .catch((err) =>
            toast.error("Un problem est servenue lors de la suppresion!")
          );
      }
    });
  }

  // filtring --------------------------------------------------------

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des tranches :</h3>
        {tranches === "loading" ? (
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
              <div className="d-flex align-items-center gap-4 pt-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">Nombre totale des tranches :</span>
                  <img
                    src="/Assets/tranche.png"
                    alt="tranche count"
                    width={20}
                    title="Nombre totale des tranches"
                  />
                  <span className="fw-bold">{tranches.length}</span>
                </div>
                {user.function === "Employer"
                  ? user.crudAccess.tranches.add && (
                      <a
                        href="/tranches/add-tranche"
                        className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Ajouter une nouvelle tranche
                      </a>
                    )
                  : user.function === "Admin" && (
                      <a
                        href="/tranches/add-tranche"
                        className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Ajouter une nouvelle tranche
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
                  <th>Nom tranche</th>
                  <th>Prix</th>
                  <th>Tonnage Maximal</th>
                  <th>Active</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tranches.length <= 0 ? (
                  <tr className="border border-0">
                    <td colSpan={8} className="border border-0 pt-4">
                      <ErrorMsg
                        msg={"Aucune tranche a été enregistrer"}
                        errorIconWidth={20}
                        coleur={"red"}
                        boldness="bold"
                        imgPath="Assets/empty.png"
                      />
                    </td>
                  </tr>
                ) : (
                  tranches.map((tranche, i) =>
                    tranche.error ? (
                      <tr key={i} className="border border-0">
                        <td colSpan={8} className="border border-0 pt-4">
                          <ErrorMsg
                            msg={tranche.error}
                            errorIconWidth={20}
                            coleur={"red"}
                            boldness="bold"
                            imgPath="Assets/error.png"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td>{tranche._id}</td>
                        <td>{tranche.nameTranche}</td>
                        <td>{tranche.prix}</td>
                        <td>{tranche.maxTonnage}</td>
                        <td>
                          {tranche.isActive ? (
                            <img src="Assets/check.png" alt="Yes" width={20} />
                          ) : (
                            <img src="Assets/cancel.png" alt="No" width={20} />
                          )}
                        </td>
                        {user.function === "Employer"
                          ? user.crudAccess.tranches.mod && (
                              <td>
                                <form
                                  method="put"
                                  action={`/tranches/update-tranche/${tranche._id}`}
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
                                  action={`/tranches/update-tranche/${tranche._id}`}
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
                          ? user.crudAccess.tranches.dlt && (
                              <td>
                                <form
                                  onSubmit={(e) =>
                                    handleDeletetranche(e, tranche)
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
                                    handleDeletetranche(e, tranche)
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

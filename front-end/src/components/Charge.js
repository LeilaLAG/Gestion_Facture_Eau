import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import GetCharges from "../hooks/GetCharges";
import { useUser } from "../Auth/ProtectedRoute";

export function Charge() {
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  let chargesData = GetCharges(year, month);

  const { user } = useUser();

  // To enable realtime deletion simulating websockets
  const [charges, setCharges] = useState([]);
  useEffect(() => {
    setCharges(chargesData);
  }, [chargesData]);

  // Deleting -------------------------------------------------------
  function handleDeleteCharge(e, chargeToDlt) {
    e.preventDefault();

    function removeDeletedCharge() {
      setCharges((prv) =>
        prv.filter((charge) => charge._id !== chargeToDlt._id)
      );
    }

    Swal.fire({
      title: `<img src="/Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer cette charge ?`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      padding: "10px",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteCharge/${chargeToDlt._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            toast.success("La charge a été supprimer");
            removeDeletedCharge();
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
      <Menu print={"noPrin"} />
      <Main>
        <div style={{ display: "none" }} className="Print">
          <img src="/Assets/aquamanage.svg" alt="" width={100} />
          <div className="mt-2 mb-2 d-flex align-items-center gap-2">
            <img src="/Assets/company.png" alt="name" width={15} />
            <span>{user.companyId}</span>
          </div>
        </div>
        <h3 className="fw-bold mb-4">Liste des charges :</h3>
        <form className="m-1 d-flex align-items-center gap-2 mb-3">
          <label className="fw-bold noPrin">Filtrer les charges </label>
          <div className="noPrin">
            <input
              type="number"
              className="p-2 pt-0 pb-0"
              max={12}
              min={1}
              name="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder={`${month}`}
            />
            <span> / </span>
            <input
              type="text"
              className="p-2 pt-0 pb-0"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder={`${year}`}
            />
          </div>
        </form>
        <div className="mb-3 m-1 noPrin">
          <button
            className="btn btn-dark p-3 pt-1 pb-1 fw-bold"
            onClick={() => window.print()}
          >
            <i style={{ marginRight: "10px" }} className="bi bi-printer"></i>
            Imprimer les charges de {month} / {year}
          </button>
        </div>
        {charges === "loading" ? (
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
                <tr
                  style={{ display: "none", width: "100%" }}
                  className="Print border border-0"
                >
                  {month} / {year}
                </tr>
                <tr>
                  <th>N°</th>
                  <th>Designation</th>
                  <th>Montant en Dh</th>
                  <th className="noPrin">Date Generation</th>
                  <th>Date Paiment</th>
                  <th>Responsable</th>
                  <th className="noPrin" colSpan={3}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {charges.length <= 0 ? (
                  <tr className="border border-0">
                    <td colSpan={8} className="border border-0 pt-4">
                      <ErrorMsg
                        msg={"Aucune charge a été enregistrer"}
                        errorIconWidth={20}
                        coleur={"red"}
                        boldness="bold"
                        imgPath="Assets/empty.png"
                      />
                    </td>
                  </tr>
                ) : (
                  charges.map((charge, i) =>
                    charge.error ? (
                      <tr key={i} className="border border-0">
                        <td colSpan={8} className="border border-0 pt-4">
                          <ErrorMsg
                            msg={charge.error}
                            errorIconWidth={20}
                            coleur={"red"}
                            boldness="bold"
                            imgPath="Assets/error.png"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td title={charge._id}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "120px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {charge._id}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              width: "120px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {charge.designation}
                          </span>
                        </td>
                        <td>{charge.montant} Dh</td>
                        <td className="noPrin">
                          {new Date(charge.dateGeneration).toLocaleDateString(
                            "eu",
                            {
                              ...DateConfig,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td>
                          {new Date(charge.datePaiment).toLocaleDateString(
                            "eu",
                            DateConfig
                          )}
                        </td>
                        <td>{charge.responsable}</td>
                        {user.function === "Employer"
                          ? user.crudAccess.charges.mod && (
                              <td className="noPrin">
                                <form
                                  method="put"
                                  action={`/charges/update-charge/${charge._id}`}
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
                              <td className="noPrin">
                                <form
                                  method="put"
                                  action={`/charges/update-charge/${charge._id}`}
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
                          ? user.crudAccess.charges.dlt && (
                              <td className="noPrin">
                                <form
                                  onSubmit={(e) =>
                                    handleDeleteCharge(e, charge)
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
                              <td className="noPrin">
                                <form
                                  onSubmit={(e) =>
                                    handleDeleteCharge(e, charge)
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
              ? user.crudAccess.charges.add && (
                  <div
                    className="centerDiv p-2 rounded noPrin"
                    colSpan={8}
                    style={{
                      border: "1px dashed lightgray",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    <a
                      href="/charges/add-charge"
                      className="centerDiv gap-2 fs-5 text-success"
                    >
                      <i className="bi bi-plus-circle"></i>
                      <p
                        className="m-0 text-dark centerDiv gap-2"
                        style={{ opacity: ".7", fontSize: "13px" }}
                      >
                        <span>Ajouter une nouvelle charge</span>
                      </p>
                    </a>
                  </div>
                )
              : user.function === "Admin" && (
                  <div
                    className="centerDiv p-2 rounded noPrin"
                    colSpan={8}
                    style={{
                      border: "1px dashed lightgray",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
                    <a
                      href="/charges/add-charge"
                      className="centerDiv gap-2 fs-5 text-success"
                    >
                      <i className="bi bi-plus-circle"></i>
                      <p
                        className="m-0 text-dark centerDiv gap-2"
                        style={{ opacity: ".7", fontSize: "13px" }}
                      >
                        <span>Ajouter une nouvelle charge</span>
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

export default Charge;

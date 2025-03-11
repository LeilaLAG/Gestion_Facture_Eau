import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import Tooltip from "./Tooltip";
import GetCharges from "../hooks/GetCharges";

export function Charge() {
  let chargesData = GetCharges();
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

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
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
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
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des charges :</h3>
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
                <tr>
                  {/* <th>N°</th> */}
                  <th>Designation</th>
                  <th>Montant en Dh</th>
                  <th>Date Generation</th>
                  <th>Date Paiment</th>
                  <th>Responsable</th>
                  <th colSpan={3}>Actions</th>
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
                        <td>{charge.designation}</td>
                        <td>{charge.montant} Dh</td>
                        <td>
                          {new Date(charge.dataGeneration).toLocaleDateString(
                            "eu",
                            {
                              ...DateConfig,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td>
                          {new Date(charge.dataPaiment).toLocaleDateString(
                            "eu",
                            {
                              ...DateConfig,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td>{charge.responsable}</td>

                        <td>
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

                        <td>
                          <form onSubmit={(e) => handleDeleteCharge(e, charge)}>
                            <button
                              className="btn btn-danger"
                              title="Supprimer"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </form>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
            <div
              className="centerDiv p-2 rounded"
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
                <i class="bi bi-plus-circle"></i>
                <p
                  className="m-0 text-dark centerDiv gap-2"
                  style={{ opacity: ".7", fontSize: "13px" }}
                >
                  <span>Ajouter une nouvelle charge</span>
                  <Tooltip>
                    <i class="bi bi-info-circle"></i>
                  </Tooltip>
                </p>
              </a>
            </div>
          </div>
        )}
      </Main>
    </div>
  );
}

export default Charge;

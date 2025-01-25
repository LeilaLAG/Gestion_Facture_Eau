import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
// import { useUser } from "../Auth/ProtectedRoute";
import FilterData from "./FilterData";
import GetFactures from "../hooks/GetFactures";

export default function Facture() {
  //   const { user } = useUser();
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  let factureData = GetFactures();

  // To enable realtime deletion simulating websockets
  const [facture, setFacture] = useState([]);
  useEffect(() => {
    setFacture(factureData);
  }, [factureData]);

  // Deleting -------------------------------------------------------
  function handleDeletefact(e, factToDlt) {
    e.preventDefault();

    function removeDeletedfact() {
      setFacture((prv) => prv.filter((fact) => fact._id !== factToDlt._id));
    }

    Swal.fire({
      title: `<img src="Assets/trash.gif" alt="delete" width="50" />`,
      text: `Etes vous sure de supprimer la facture n° ${factToDlt.numFacture}`,
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
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            toast.success("La facture a été supprimer");
            removeDeletedfact();
          })
          .catch((err) =>
            toast.error("Un problem est servenue lors de la suppresion!")
          );
      }
    });
  }

  // filtring --------------------------------------------------------
  const [filterParams, setFilterParams] = useState({
    numFacture: "",
  });

  function handleFilterParams(e) {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  }

  function handleSubmitFilter(e) {
    e.preventDefault();

    setFacture(factureData);

    const { numFacture } = filterParams;

    if (numFacture !== "") {
      setFacture((prev) =>
        prev.filter((fact) => fact.numFacture === numFacture)
      );
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
          <div className="pb-2">
            <article
              style={{ position: "sticky", top: "0%" }}
              className="pt-2 pb-2 bg-white accordion"
              id="accordionExample"
            >
              <FilterData
                page="facture"
                onSubmitFilter={(e) => handleSubmitFilter(e)}
                onChangeFilter={(e) => handleFilterParams(e)}
              />
              <div className="d-flex align-items-center gap-4 p-2 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="/Assets/bill.png"
                    alt="fact count"
                    width={20}
                    title="Nombre totale de facture"
                  />
                  <span className="fw-bold">{facture.length}</span>
                </div>
                <hr width={40} />
                {/* <div className="d-flex align-items-center gap-2">
                  <img
                    src="/Assets/factEdit.png"
                    alt="modified facture"
                    width={22}
                    title="Nombre de facture modifier"
                  />
                  <span className="fw-bold">
                    {
                      facture.filter(
                        (fact) =>
                          fact.modified_at &&
                          fact.companyId === user.companyId
                      ).length
                    }
                  </span>
                </div> */}
                <a
                  href="/facture/add-facture"
                  className="btn btn-success pt-1 pb-1 p-3 fw-bold"
                  style={{ fontSize: "13px" }}
                >
                  Ajouter une nouvelle facture
                </a>
              </div>
            </article>
            <table
              className="table table-bordered text-center w-100"
              style={{ verticalAlign: "middle" }}
            >
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Date facture</th>
                  <th>Date de painemment</th>
                  <th>N° compteur</th>
                  <th>Valeur compteur preleve</th>
                  <th>Status de painement</th>
                  <th>Totale Facture</th>
                  <th>Date generation facture</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facture.length <= 0 ? (
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
                  facture.map((fact, i) =>
                    fact.error ? (
                      <tr key={i} className="border border-0">
                        <td colSpan={8} className="border border-0 pt-4">
                          <ErrorMsg
                            msg={fact.error}
                            errorIconWidth={20}
                            coleur={"red"}
                            boldness="bold"
                            imgPath="Assets/error.png"
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td>{fact.numFacture}</td>
                        <td>
                          {new Date(fact.dateFacture).toLocaleDateString(
                            "eu",
                            DateConfig
                          )}
                        </td>
                        <td>
                          {new Date(fact.datePainement).toLocaleDateString(
                            "eu",
                            DateConfig
                          )}
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
                          <form
                            method="put"
                            action={`/facture/update-fact/${fact._id}`}
                          >
                            <button className="btn btn-primary" title="Modifier">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </form>
                        </td>
                        <td>
                          <form onSubmit={(e) => handleDeletefact(e, fact)}>
                            <button className="btn btn-danger" title="Supprimer">
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
          </div>
        )}
      </Main>
    </div>
  );
}

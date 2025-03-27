import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Main from "./Main";
import GetCompteurs from "../hooks/GetCompteurs";
import Loading from "../costumComponents/Loading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
// import Swal from "sweetalert2";
import { useUser } from "../Auth/ProtectedRoute";

export default function Credit() {
  const { user } = useUser();

  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  let compteursData = GetCompteurs();

  //To enable realtime deletion simulating websockets
  const [compteurs, setCompteurs] = useState([]);
  const [credits, setCredits] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [compId, setCompId] = useState("");
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/credits/${user.companyId}?month=${month}&year=${year}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setCredits(res.data.Credits);
      })
      .catch((err) =>
        alert(
          "Un erreur est servenu lors de la récupération de données des credits! veuillez actualiser la page ou essayer plus tard"
        )
      );
    setCompteurs(compteursData);
  }, [compteursData, user.companyId, month, year, compId]);

  // function handleDeleteCompteur(e, compteurToDlt) {
  //   e.preventDefault();

  //   function removeDeletedCompteur() {
  //     setCompteurs((prv) =>
  //       prv.filter((compteur) => compteur._id !== compteurToDlt._id)
  //     );
  //   }

  //   Swal.fire({
  //     title: `<img src="/Assets/trash.gif" alt="delete" width="50" />`,
  //     text: `Etes vous sure de supprimer le compteur N°${compteurToDlt.numCompteur}`,
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     confirmButtonText: "Oui",
  //     cancelButtonText: "Annuler",
  //     padding: "10px",
  //   }).then((res) => {
  //     if (res.isConfirmed) {
  //       axios
  //         .delete(
  //           `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/deleteCompteur/${compteurToDlt._id}`,
  //           {
  //             withCredentials: true,
  //           }
  //         )
  //         .then((res) => {
  //           toast.success("Le compteur a été supprimer");
  //           removeDeletedCompteur();
  //         })
  //         .catch((err) =>
  //           toast.error("Un problem est servenue lors de la suppresion!")
  //         );
  //     }
  //   });
  // }
 
  const printCreditList = (id) => {
    // Create a new window
    const printWindow = window.open("", "", "width=800,height=600");

    const tableRows = credits
    .filter(c=>c.numCompteur === id)
      .map(function(credit){
          return `
            <tr>
              <td>${credit.montantPaye}</td>
              <td>${new Date(
                credit.datePaiement
              ).toLocaleDateString("eu", DateConfig)}</td>
            </tr>
          `;
      })
      .join("");

    // Write the table HTML into the new window's document
    printWindow.document.write(`
        <html>
        <head>
          <title>Liste des crédits</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f2f2f2;
              text-align: center;
            }
          </style>
        </head>
        <body>
        
        <div style="margin-bottom : 20px">
          <h2>Liste des crédits</h2>
          <div>
            <img src="/Assets/aquamanage.svg" alt="" width="100" />
            <div className="mt-2 mb-2 d-flex align-items-center gap-2">
              <img src="/Assets/company.png" alt="name" width={15} />
              <span>${user.companyId}</span>
            </div>
          </div>
        </div>
        
          <table>
            <thead>
              <tr>
              Numéro de compteur
              ${id}
              </tr>
              <tr>
                <th>Montant payé</th>
                <th>Date de paiement</th>
              </tr>
            </thead>
            <tbody>
             ${tableRows}
            </tbody>
          </table>
        </body>
        </html>
      `);

    // Close the document to finish rendering
    printWindow.document.close();

    // Wait a bit and then trigger the print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="d-flex h-100">
      {/* <Toaster position="top-right" /> */}
      <Menu />
      <Main>
        <h3 className="fw-bold mb-4">Liste des credits :</h3>
        <form className="m-1 d-flex align-items-center gap-2 mb-3">
          <label className="fw-bold noPrin">Filtrer les credits </label>
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
          <div className="noPrin">
            <input
              type="number"
              className="p-2 pt-0 pb-0"
              name="compId"
              value={compId}
              onChange={(e) => setCompId(e.target.value)}
              placeholder={"Numero Compteur"}
            />
          </div>
        </form>
        <div className="mb-2">
          <a
            href={`/credits/add-credit`}
            className="btn btn-success pt-1 pb-1 p-3 fw-bold mt-2"
            style={{ fontSize: "13px" }}
          >
            Generer un credit
          </a>
        </div>
        {compteurs === "loading" ? (
          <div className="centerDiv w-100">
            <Loading />
          </div>
        ) : (
          <div className="pb-2">
            {compteurs.length <= 0 ? (
              <div className="mt-5">
                <ErrorMsg
                  msg={"Aucun compteur a été enregistrer"}
                  errorIconWidth={20}
                  coleur={"red"}
                  boldness="bold"
                  imgPath="Assets/empty.png"
                />
              </div>
            ) : compId &&
              compteurs.filter((c) => c.numCompteur === parseInt(compId))
                .length <= 0 ? (
              <div className="mt-5">
                <ErrorMsg
                  msg={"Ce compteur n'existe pas"}
                  errorIconWidth={20}
                  coleur={"red"}
                  boldness="bold"
                  imgPath="Assets/empty.png"
                />
              </div>
            ) : (
              compteurs
                .filter((c) =>
                  compId
                    ? c.numCompteur === parseInt(compId)
                    : c && c.credit > 0
                )
                .map((compteur, i) => (
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
                        <img src="/Assets/compteurs.png" alt="" width={18} />
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <span className="m-3 mt-0 mb-0">
                            <img src="/Assets/compteur.png" alt="" width={18} />
                            {compteur.numCompteur}
                          </span>
                          <button className="btn btn-dark p-3 pt-1 pb-1" onClick={()=>printCreditList(compteur.numCompteur)}>
                            <i style={{ marginRight: "10px" }} className="bi bi-printer"></i>
                            Imprimer la liste des crédits
                          </button>
                          <div style={{marginRight:'10px'}}>
                            {compteur.credit} Dh
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      id={i}
                      className="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div
                        className="accordion-body p-2"
                        style={{ overflowX: "auto" }}
                      >
                        <table
                          className="table table-bordered text-center w-100 mt-2 mb-0"
                          style={{ verticalAlign: "middle" }}
                        >
                          <thead>
                            <tr>
                              <th>N°</th>
                              <th>Montant payé</th>
                              <th>Date paiement</th>
                              <th colSpan={2}>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {credits.filter(
                              (c) => c.numCompteur === compteur.numCompteur
                            ).length <= 0 ? (
                              <tr className="border border-0">
                                <td
                                  colSpan={8}
                                  className="border border-0 pt-4"
                                >
                                  <ErrorMsg
                                    msg={
                                      "Aucun credit a été enregistrer pour ce compteur"
                                    }
                                    errorIconWidth={20}
                                    coleur={"red"}
                                    boldness="bold"
                                    imgPath="Assets/empty.png"
                                  />
                                </td>
                              </tr>
                            ) : (
                              credits
                                .filter(
                                  (c) => c.numCompteur === compteur.numCompteur
                                )
                                .map((credit, i) =>
                                  credit.error ? (
                                    <tr key={i} className="border border-0">
                                      <td
                                        colSpan={8}
                                        className="border border-0 pt-4"
                                      >
                                        <ErrorMsg
                                          msg={credit.error}
                                          errorIconWidth={20}
                                          coleur={"red"}
                                          boldness="bold"
                                          imgPath="Assets/error.png"
                                        />
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr key={i}>
                                      <td>{credit._id}</td>
                                      <td>{credit.montantPaye} Dh</td>
                                      <td>
                                        {new Date(
                                          credit.datePaiement
                                        ).toLocaleDateString("eu", DateConfig)}
                                      </td>

                                      <td>
                                        <form
                                          method="put"
                                          action={`/credits/update-credit/${credit._id}`}
                                        >
                                          <button
                                            className="btn btn-primary"
                                            title="Modifier"
                                          >
                                            <i className="bi bi-pencil-square"></i>
                                          </button>
                                        </form>
                                      </td>

                                      {/* <td>
                                      <form
                                        onSubmit={(e) =>
                                          handleDeleteCompteur(e, compteur)
                                        }
                                      >
                                        <button
                                          className="btn btn-danger"
                                          title="Supprimer"
                                        >
                                          <i className="bi bi-trash3-fill"></i>
                                        </button>
                                      </form>
                                    </td> */}
                                    </tr>
                                  )
                                )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </Main>
    </div>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../Auth/ProtectedRoute";
import Menu from "./Menu";
import Main from "./Main";
import Card from "../costumComponents/Card";
import { BarChart } from "../costumComponents/Chart";
import { PieChart } from "../costumComponents/Chart";

export default function Caisse() {
  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const { user } = useUser();
  const [revenu, setRevenu] = useState(0);
  const [charge, setCharge] = useState(0);
  const [facture, setFacture] = useState(0);
  const [unpaidFacture, setUnpaidFacture] = useState(0);

  const [allFactures, setAllFactures] = useState([]);
  const [factureNonPaye, setFactureNonPaye] = useState([]);
  const [facturePaye, setFacturePaye] = useState([]);
  const [clients, setClients] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/caisse/${user.companyId}?month=${month}&year=${year}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setRevenu(res.data.totalRevenu);
        setCharge(res.data.totalCharge);
        setFacture(res.data.totalFactures);
        setUnpaidFacture(res.data.totaleUnpaidFactureStats);
        setAllFactures(res.data.allFactures);
        setFactureNonPaye(res.data.factureNonPaye);
        setFacturePaye(res.data.facturePaye);
        setClients(res.data.clients);
      })
      .catch((err) =>
        alert(
          "Un erreur est servenu lors de la récupération de données de la caisse! veuillez actualiser la page ou essayer plus tard"
        )
      );
  }, [user, month, year]);

  const printFacturesRepport = (typeFacture) => {
    // Create a new window
    const printWindow = window.open("", "", "width=800,height=600");

    const tableRows = clients
      .map(
        (client) =>
          typeFacture.find((bill) => bill.numClient === client.numClient) !==
            undefined &&
          `
          <tr>
            <td>${
              typeFacture.find(
                (bill) => bill.numClient === client.numClient
              ) !== undefined
                ? typeFacture.find(
                    (bill) => bill.numClient === client.numClient
                  ).numCompteur
                : "-"
            }</td>
            <td>${client.numClient}</td>
            <td>${client.nameClient}</td>
            <td>${
              typeFacture === factureNonPaye
                ? typeFacture.filter(
                    (bill) => bill.numClient === client.numClient
                  ).length
                : typeFacture === facturePaye
                ? new Date(
                    typeFacture.find(
                      (bill) => bill.numClient === client.numClient
                    ).datePainement
                  ).toLocaleDateString("eu", DateConfig)
                : typeFacture.find(
                    (bill) => bill.numClient === client.numClient
                  ).painementStatus
            }</td>
            <td>
              ${typeFacture.reduce(
                (total, bill) =>
                  bill.numClient === client.numClient
                    ? total + bill.totalFacture
                    : total,
                0
              )} Dh
            </td>
          </tr>
        `
      )
      .join("");

    // Write the table HTML into the new window's document
    printWindow.document.write(`
        <html>
        <head>
          <title>${
            typeFacture === factureNonPaye
              ? "Liste des factures non payées"
              : typeFacture === facturePaye
              ? "Liste des revenus de factures"
              : "Liste des factures"
          }</title>
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
        <h2>${
          typeFacture === factureNonPaye
            ? "Liste des factures non payées"
            : typeFacture === facturePaye
            ? "Liste des revenus de factures"
            : "Liste des factures"
        }</h2>
        <div>
          <img src="/Assets/aquamanage.svg" alt="" width="100" />
          <div className="mt-2 mb-2 d-flex align-items-center gap-2">
            <img src="/Assets/company.png" alt="name" width={15} />
            <span>${user.companyId}</span>
          </div>
        </div>
        <p>${
          typeFacture === allFactures || typeFacture === facturePaye
            ? month + " / " + year
            : ""
        }</p>
          <table>
            <thead>
              <tr>
                <th>Numero de compteur</th>
                <th>Numero de client</th>
                <th>Nom de client</th>
                <th>${
                  typeFacture === factureNonPaye
                    ? "Nombre des factures"
                    : typeFacture === facturePaye
                    ? "Date de paiement"
                    : "status de paiement"
                }</th>
                <th>Totale</th>
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
      <Menu print="noPrin" />
      <Main>
        <div style={{ display: "none" }} className="Print">
          <img src="/Assets/aquamanage.svg" alt="" width={100} />
          <div className="mt-2 mb-2 d-flex align-items-center gap-2">
            <img src="/Assets/company.png" alt="name" width={15} />
            <span>{user.companyId}</span>
          </div>
        </div>
        <h3 className="fw-bold mb-4">La caisse :</h3>
        <form className="m-1 d-flex align-items-center gap-2 mb-2">
          <label className="fw-bold noPrin">
            Filtrer les données de la caisse{" "}
          </label>
          <div>
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
        <div className="mt-2 mb-2 m-1 noPrin">
          <div>
            <button
              className="btn btn-dark p-3 pt-1 pb-1 fw-bold m-1"
              onClick={() => window.print()}
            >
              <i style={{ marginRight: "10px" }} className="bi bi-printer"></i>
              Rapport de la caisse
            </button>
          </div>
          <button
            className="btn btn-primary p-3 pt-1 pb-1 fw-bold m-1"
            onClick={() => printFacturesRepport(allFactures)}
          >
            <i style={{ marginRight: "10px" }} className="bi bi-printer"></i>
            Rapport des factures
          </button>
          <button
            className="btn btn-success p-3 pt-1 pb-1 fw-bold m-1"
            onClick={() => printFacturesRepport(facturePaye)}
          >
            <i style={{ marginRight: "10px" }} className="bi bi-printer"></i>
            Rapport des revenus des factures payées
          </button>
          <button
            className="btn btn-danger p-3 pt-1 pb-1 fw-bold m-1"
            onClick={() => printFacturesRepport(factureNonPaye)}
          >
            <i style={{ marginRight: "10px" }} className="bi bi-printer"></i>
            Rapport des factures non payées
          </button>
        </div>
        <div className="d-flex flex-wrap">
          <div>
            <div className="d-flex flex-wrap">
              <Card
                text={revenu + " Dh"}
                title={"revenus"}
                icon={"/Assets/revenus.png"}
                textSize="20px"
              />
              <Card
                text={charge + " Dh"}
                title={"charges"}
                icon={"/Assets/charges.png"}
                textSize="20px"
              />
              <Card
                text={facture + " Dh"}
                title={"factures payées"}
                icon={"/Assets/factures.png"}
                textSize="20px"
              />
              <Card
                text={unpaidFacture + " Dh"}
                title={"factures non payées"}
                icon={"/Assets/factures.png"}
                textSize="20px"
              />
              <Card
                text={
                  facture + revenu - charge < 0
                    ? (facture + revenu - charge) * -1 + " Dh"
                    : facture + revenu - charge + " Dh"
                }
                rnedementStatus={facture + revenu - charge}
                title={"Rendement"}
                icon={"/Assets/rendement.png"}
                textSize="20px"
                textWeight={700}
                couleur={facture + revenu - charge > 0 ? "green" : "red"}
              />
            </div>
            <div className="d-flex align-items-center flex-wrap justify-content-between mt-4">
              <div style={{ width: "60%" }} className="noPrin">
                <span
                  className="text-center w-100"
                  style={{ fontSize: "13px", display: "inline-block" }}
                >
                  Avancement de la caisse
                </span>
                <BarChart
                  caisse={[revenu, charge, facture, unpaidFacture]}
                  page={"caisse"}
                />
              </div>
              <div style={{ width: "35%" }}>
                <PieChart allRevenu={[revenu, facture]} page={"caisse"} />
                <span
                  className="text-center w-100"
                  style={{ fontSize: "13px", display: "inline-block" }}
                >
                  Totale des revenus
                </span>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import GetFactures from "../hooks/GetFactures";
import axios from "axios";
import { useUser } from "../Auth/ProtectedRoute";
import { BarChart } from "../costumComponents/Chart";
import ErrorMsg from "../costumComponents/ErrorMsg";

export default function PrintAllFactures() {
  const DateConfig = { year: "numeric", month: "2-digit" };
  const { user } = useUser();
  const companyId = user.companyId;

  const [clientsData, setClientsData] = useState({});

  let factureData = GetFactures(
    new Date().getMonth() + 1 === 1
      ? new Date().getFullYear() - 1
      : new Date().getFullYear(),
    "",
    new Date().getMonth() + 1 === 1 ? 12 : new Date().getMonth()
  );

  useEffect(() => {
    function fetchBillData(factureId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/factures/${factureId}/${companyId}/`,
          { withCredentials: true }
        )
        .then((res) => {
          setClientsData((prevData) => ({
            ...prevData,
            [factureId]: {
              client: res.data.client,
              lastSixBills: res.data.lastSixBills,
            },
          }));
        });
    }
    if (factureData !== "loading") {
      factureData.forEach((bill) => fetchBillData(bill._id));
    }
  }, [factureData, companyId]);

  return (
    <div className="vh-100 d-flex flex-wrap justify-content-around">
      <div className="noPrin">
        <div style={{position:"sticky"  , top : "10px"}}>
          <button
            className="btn btn-dark p-4 pb-1 pt-1 fw-bold"
            onClick={() => window.print()}
          >
            Imprimer
          </button>
          <a
            href="/factures"
            className="btn btn-danger p-4 pb-1 pt-1 fw-bold"
            style={{ marginLeft: "10px" }}
          >
            Retour
          </a>
        </div>
      </div>
      <div className="">
        {factureData !== "loading" &&
          (factureData.length === 0 ? (
            <div className="centerDiv h-100">
              <ErrorMsg
                msg={`Aucune facture à imprimer pour le mois ${
                  new Date().getMonth() + 1 === 1 ? 12 : new Date().getMonth()
                }`}
                errorIconWidth={20}
                coleur={"red"}
                boldness="bold"
                imgPath="/Assets/empty.png"
              />
            </div>
          ) : (
            factureData.map((billToPrint) => {
              const clientData = clientsData[billToPrint._id] || {};
              const client = clientData.client || {};
              const lastClientBills = clientData.lastSixBills || [];

              const lastBillsConsumption = lastClientBills
                .map((bill) =>
                  parseFloat(
                    bill.valeurCompteurPreleve - bill.lastCompteurPrelevement
                  )
                )
                .reverse();

              const lastBillsDates = lastClientBills
                .map((bill) =>
                  new Date(bill.dateFacture).toLocaleDateString(
                    "eu",
                    DateConfig
                  )
                )
                .reverse();

              return (
                <>
                  <div
                    className="border border-2 p-4 billsToPrint mt-2"
                    key={billToPrint._id}
                  >
                    <div className="centerDiv justify-content-between align-items-end">
                      <h3 className="text-center mb-4 fw-bold">
                        Facture d'eau
                      </h3>
                      <div>
                        <img src="/Assets/aquamanage.svg" alt="" width={70} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 border border-1 p-1 text-center">
                        <span className="fw-bold">Société: </span>
                        <span>{user.companyId}</span>
                      </div>
                      <div className="mb-2 border border-1 p-1 text-center">
                        <span className="fw-bold">N° facture: </span>
                        <span>{billToPrint._id}</span>
                      </div>
                      <div className="mb-2 centerDiv gap-5 text-center border border-1 p-1">
                        <div>
                          <span className="fw-bold">N° compteur: </span>
                          <span>{billToPrint.numCompteur}</span>
                        </div>
                        <div>
                          <span className="fw-bold">Client: </span>
                          <span>{client.nameClient || "Chargement..."}</span>
                        </div>
                        <div>
                          <span className="fw-bold">Adresse client: </span>
                          <span>{client.adresse || "Chargement..."}</span>
                        </div>
                      </div>
                      <div className="mb-2 border border-1 p-2">
                        <div className="mb-2 centerDiv justify-content-between">
                          <span className="fw-bold">
                            Date de consommation:{" "}
                          </span>
                          <span>
                            {new Date(
                              billToPrint.dateFacture
                            ).toLocaleDateString("eu", DateConfig)}
                          </span>
                        </div>
                        <div className="centerDiv justify-content-between">
                          <span className="fw-bold">Date de génération: </span>
                          <span>
                            {new Date(
                              billToPrint.dateGenerationFacture
                            ).toLocaleDateString("eu", {
                              ...DateConfig,
                              day: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-1 p-2 mb-2">
                      <div className="mb-2 centerDiv justify-content-between">
                        <span className="fw-bold">
                          Valeur du compteur prélevée:{" "}
                        </span>
                        <span>{billToPrint.valeurCompteurPreleve} m³</span>
                      </div>
                      <div className="mb-2 centerDiv justify-content-between">
                        <span className="fw-bold">
                          Valeur du compteur du mois dernier:{" "}
                        </span>
                        <span>{billToPrint.lastCompteurPrelevement} m³</span>
                      </div>
                      <div className="mb-2 centerDiv justify-content-between">
                        <span className="fw-bold">
                          Votre consommation ce mois:{" "}
                        </span>
                        <span>
                          {parseFloat(
                            billToPrint.valeurCompteurPreleve -
                              billToPrint.lastCompteurPrelevement
                          )}{" "}
                          m³
                        </span>
                      </div>
                      <div className="mb-2 centerDiv justify-content-between">
                        <span className="fw-bold">Total facture: </span>
                        <span className="fw-bold text-decoration-underline">
                          {billToPrint.totalFacture} Dh
                        </span>
                      </div>
                    </div>

                    <div
                      style={{ height: "180px" }}
                      className="border border-1 p-1"
                    >
                      <BarChart
                        page="printBill"
                        lastClientBillsConsomation={lastBillsConsumption}
                        lastClientBillsDate={lastBillsDates}
                      />
                    </div>
                  </div>
                </>
              );
            })
          ))}
      </div>
    </div>
  );
}

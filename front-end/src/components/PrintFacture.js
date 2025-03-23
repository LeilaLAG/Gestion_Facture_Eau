import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../Auth/ProtectedRoute";
import { BarChart } from "../costumComponents/Chart";

export default function PrintFacture() {
  const { factureId } = useParams();

  const { user } = useUser();
  const companyId = user.companyId;

  const DateConfig = {
    year: "numeric",
    month: "2-digit",
  };

  const [billToPrint, setBillToPrint] = useState({});
  const [client, setClient] = useState({});
  const [lastClientBills, setLastClientBills] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/factures/${factureId}/${companyId}/`,
        { withCredentials: true }
      )
      .then((res) => {
        setClient(res.data.client);
        setBillToPrint(res.data.facture);
        setLastClientBills(res.data.lastSixBills);
      });
  }, [factureId, companyId]);

  function settingUpBillDataToSendToChart() {
    let clientBillsToSendToChart = [];

    lastClientBills.map((bill) =>
      clientBillsToSendToChart.push(
        parseFloat(bill.valeurCompteurPreleve - bill.lastCompteurPrelevement)
      )
    );
    return clientBillsToSendToChart.reverse();
  }

  function settingUpBillDataDatesToSendToChart() {
    let clientBillsDateToSendToChart = [];

    lastClientBills.map((bill) =>
      clientBillsDateToSendToChart.push(
        new Date(bill.dateFacture).toLocaleDateString("eu", DateConfig)
      )
    );
    return clientBillsDateToSendToChart.reverse();
  }

  return (
    <div className="centerDiv flex-wrap justify-content-around h-100">
      <div className="noPrin centerDiv">
        <div style={{position:"sticky"  , top : "20px"}}>
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
      <div className="border border-2 p-4 billToPrint" >
        <div className="centerDiv justify-content-between align-items-end">
          <h3 className="text-center mb-4 fw-bold">Facture d'eau</h3>
          <div>
            <img src="/Assets/aquamanage.svg" alt="" width={70} />
          </div>
        </div>
        <div className="">
          <div className="mb-2 border border-1 p-1 text-center">
            <span className="fw-bold">Société: </span>
            <span>{user.companyId}</span>
          </div>
          <div className="mb-2 border border-1 p-1 text-center">
            <span className="fw-bold">N° facture: </span>
            <span>{billToPrint._id}</span>
          </div>
          <div className="mb-2 centerDiv gap-5 text-center border border-1 p-1 ">
            <div>
              <span className="fw-bold">N° compteur: </span>
              <span>{billToPrint.numCompteur}</span>
            </div>
            <div>
              <span className="fw-bold">Client: </span>
              <span>{client.nameClient}</span>
            </div>
            <div>
              <span className="fw-bold">Adresse client: </span>
              <span>{client.adresse}</span>
            </div>
          </div>
          <div className="mb-2 border border-1 p-2">
            <div className="mb-2 centerDiv justify-content-between">
              <span className="fw-bold">Date de consomation: </span>
              <span>
                {new Date(billToPrint.dateFacture).toLocaleDateString(
                  "eu",
                  DateConfig
                )}
              </span>
            </div>
            <div className="centerDiv justify-content-between">
              <span className="fw-bold">Date de génération: </span>
              <span>
                {new Date(billToPrint.dateGenerationFacture).toLocaleDateString(
                  "eu",
                  { ...DateConfig, day: "2-digit" }
                )}
              </span>
            </div>
          </div>
        </div>
        {/* <hr /> */}
        <div className="border border-1 p-2 mb-2">
          <div className="mb-2 centerDiv justify-content-between">
            <span className="fw-bold">Valeur du compteur prélevée: </span>
            <span>{billToPrint.valeurCompteurPreleve} m³</span>
          </div>
          <div className="mb-2 centerDiv justify-content-between">
            <span className="fw-bold">Valeur du compteur du moi dernier:</span>
            <span>{billToPrint.lastCompteurPrelevement} m³</span>
          </div>
          <div className="mb-2 centerDiv justify-content-between">
            <span className="fw-bold">Votre consomation ce moi: </span>
            <span>
              {parseFloat(
                billToPrint.valeurCompteurPreleve -
                  billToPrint.lastCompteurPrelevement
              )}{" "}
              m³
            </span>
          </div>
          <div className="mb-2 centerDiv justify-content-between">
            <span className="fw-bold">Totale facture: </span>
            <span className="fw-bold text-decoration-underline">
              {billToPrint.totalFacture} Dh
            </span>
          </div>
        </div>
        {/* <hr /> */}
        <div className="border border-1 p-1" style={{ height: "180px" }}>
          <BarChart
            page="printBill"
            lastClientBillsConsomation={settingUpBillDataToSendToChart()}
            lastClientBillsDate={settingUpBillDataDatesToSendToChart()}
          />
        </div>
      </div>
    </div>
  );
}

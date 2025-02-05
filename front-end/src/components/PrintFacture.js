import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../Auth/ProtectedRoute";
// import GetClients from "../hooks/GetClients";

export default function PrintFacture() {
  const { factureId } = useParams();

  const { user } = useUser();
  const companyId = user.companyId;

  //   const clientData = GetClients();

  const DateConfig = {
    year: "numeric",
    month: "2-digit",
    // day: "2-digit",
  };

  const [billToPrint, setBillToPrint] = useState({});
  const [client, setClient] = useState({});

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/factures/${factureId}/${companyId}/`,
        { withCredentials: true }
      )
      .then((res) => {
        setClient(res.data.client);
        setBillToPrint(res.data.facture);
      });
  }, [factureId, companyId]);

  return (
    <div className="centerDiv h-100">
      <div className="border border-2 p-4 w-50">
        <h3 className="text-center mb-4">Facture d'eau</h3>
        <div className="">
          <div className="mb-2">
            <span className="fw-bold">N° compteur: </span>
            <span>{billToPrint.numCompteur}</span>
          </div>
          <div className="mb-2">
            <span className="fw-bold">N° facture: </span>
            <span>{billToPrint._id}</span>
          </div>
          <div className="mb-2">
            <span className="fw-bold">Date de consomation: </span>
            <span>
              {new Date(billToPrint.dateFacture).toLocaleDateString(
                "eu",
                DateConfig
              )}
            </span>
          </div>
          <div className="mb-2">
            <span className="fw-bold">Date de génération: </span>
            <span>
              {new Date(billToPrint.dateGenerationFacture).toLocaleDateString(
                "eu",
                { ...DateConfig, day: "2-digit" }
              )}
            </span>
          </div>
          <div className="mb-2">
            <span className="fw-bold">Client: </span>
            <span>{client.nameClient}</span>
          </div>
        </div>
        <hr />
        <div>
          <div className="mb-2">
            <span className="fw-bold">Valeur du compteur prélevée: </span>
            <span>{billToPrint.valeurCompteurPreleve}</span>
          </div>
          <div className="mb-2">
            <span className="fw-bold">Totale facture: </span>
            <span>{billToPrint.totalFacture} dh</span>
          </div>
        </div>
        <div className="mt-4 noPrin" >
        <button className="btn btn-dark p-4 pb-1 pt-1 fw-bold" onClick={()=>window.print()}>Imprimer</button>
        <a href="/factures" className="btn btn-danger p-4 pb-1 pt-1 fw-bold" style={{marginLeft : "10px"}}>Retour</a>
        </div>
      </div>
    </div>
  );
}

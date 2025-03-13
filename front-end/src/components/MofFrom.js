import React, { useEffect, useState } from "react";
import Main from "./Main";
import Menu from "./Menu";
import { useUser } from "../Auth/ProtectedRoute";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ActionLoading from "../costumComponents/ActionLoading";
import { useParams } from "react-router-dom";
import GetClients from "../hooks/GetClients";
import ModClient from "./crufForm/ModClient";
import ModCompteur from "./crufForm/ModCompteur";
import ModFacture from "./crufForm/ModFacture";
import ModTranche from "./crufForm/ModTranche";
import ModCharge from "./crufForm/ModCharge";
import ModRevenu from "./crufForm/ModRevenu";

export default function ModForm({ page }) {
  const { user } = useUser();
  const clients = GetClients();

  const { clientId } = useParams();
  const { compteurId } = useParams();
  const { factureId } = useParams();
  const { trancheId } = useParams();
  const { chargeId } = useParams();
  const { revenuId } = useParams();

  let dataObject = {};
  let endPoint = "";

  if (page === "client") {
    dataObject = {
      nameClient: "",
      cin: "",
      birthDate: "",
      tele: "",
      adresse: "",
      dateRegisterClient: "",
      companyId: user.companyId,
    };

    endPoint = "updateClient";
  } else if (page === "compteur") {
    dataObject = {
      startPoint: 0,
      useDate: "",
      credit: 0.0,
      numClient: 0,
      companyId: user.companyId,
    };
    endPoint = "updateCompteur";
  } else if (page === "facture") {
    dataObject = {
      // dateFacture: "",
      datePainement: "",
      numCompteur: 0,
      valeurCompteurPreleve: 0,
      painementStatus: "",
      totalFacture: 0.0,
      companyId: user.companyId,
    };
    endPoint = "updateFacture";
  } else if (page === "tranche") {
    dataObject = {
      nameTranche: "",
      prix: 0.0,
      maxTonnage: 0,
      // isActive: false,
      companyId: user.companyId,
    };
    endPoint = "updateTranche";
  } else if (page === "charge") {
    dataObject = {
      designation: "",
      montant: 0,
      datePaiment: "",
      responsable: "",
      companyId: user.companyId,
    };
    endPoint = "updateCharge";
  } else if (page === "revenu") {
    dataObject = {
      designation: "",
      montant: 0,
      companyId: user.companyId,
    };
    endPoint = "updateRevenu";
  }

  const [dataToMod, setDataToMod] = useState(dataObject);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/clients/${clientId}/${user.companyId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setDataToMod(res.data.client))
        .catch((err) => toast.error("Un problem est servenue!"));
    } else if (compteurId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/compteurs/${compteurId}/${user.companyId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setDataToMod(res.data.compteur))
        .catch((err) => toast.error("Un problem est servenue!"));
    } else if (factureId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/factures/${factureId}/${user.companyId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setDataToMod(res.data.facture))
        .catch((err) => toast.error("Un problem est servenue!"));
    } else if (trancheId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/tranches/${trancheId}/${user.companyId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setDataToMod(res.data.tranche))
        .catch((err) => toast.error("Un problem est servenue!"));
    } else if (chargeId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/charges/${chargeId}/${user.companyId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setDataToMod(res.data.charge))
        .catch((err) => toast.error("error"));
    } else if (revenuId) {
      axios
        .get(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/revenus/${revenuId}/${user.companyId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setDataToMod(res.data.revenu))
        .catch((err) => toast.error("error"));
    }
  }, [
    clientId,
    compteurId,
    factureId,
    trancheId,
    chargeId,
    revenuId,
    user.companyId,
  ]);

  function handleModInfo(e) {
    e.preventDefault();
    setDataToMod({
      ...dataToMod,
      [e.target.name]:
        e.target.name === "isActive" ? Boolean(e.target.value) : e.target.value,
    });
  }

  function checkClientInfo() {
    if (page === "client") {
      if (dataToMod.numClient === "") {
        toast.error("Saisir le numero du client!");
        return false;
      } else if (!dataToMod.nameClient.trim().match(/[A-Za-z]{3,}/)) {
        toast.error(
          "Le nom complet du client doit contien 3 caracteres minimum!"
        );
        return false;
      } else if (!dataToMod.cin.trim().match(/^[A-Z0-9]{8}$/)) {
        toast.error("Saisir un CIN valide!");
        return false;
      } else if (dataToMod.birthDate === "") {
        toast.error("Saisir la date de naissance!");
        return false;
      } else if (!dataToMod.tele.trim().match(/[0-9]{10}/)) {
        toast.error("Saisir un numero de telephone valide!");
        return false;
      } else if (dataToMod.adresse.trim().length < 10) {
        toast.error("L'adresse du client doit contien 10 caracteres minimum!");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkCompteurInfo() {
    if (page === "compteur") {
      if (dataToMod.startPoint > 99999) {
        toast.error("La valeur du compteur ne doit pas depasser 99999!");
        return false;
      } else if (dataToMod.useDate === "") {
        toast.error("Saisir la date d'utilisation du compteur");
        return false;
      } else if (dataToMod.numClient === "") {
        toast.error("Choisir un client!");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkFactureInfo() {
    if (page === "facture") {
      if (dataToMod.dateFacture === "") {
        toast.error("choisir la date de facture");
        return false;
      } else if (dataToMod.painementStatus === "") {
        toast.error("Saisir la situation du paiment");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkTrancheInfo() {
    if (page === "tranche") {
      if (dataToMod.nameTranche === "") {
        toast.error("saisir le nom du tranche");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkChargeInfo() {
    if (page === "charge") {
      if (dataToMod.designation === "") {
        toast.error("saisir la designation de charge");
        return false;
      } else if (dataToMod.montant === "" || dataToMod.montant === 0) {
        toast.error("Saisir le montant de charge");
        return false;
      } else if (isNaN(dataToMod.montant)) {
        toast.error("le montant doit etre un nombre");
        return false;
      } else if (dataToMod.datePaiment === "") {
        toast.error("Saisir la date de paiment de charge");
        return false;
      } else if (dataToMod.responsable === "") {
        toast.error("choisir un responsable pour la charge");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkRevenuInfo() {
    if (page === "revenu") {
      if (dataToMod.designation === "") {
        toast.error("saisir la designation de revenu");
        return false;
      } else if (dataToMod.montant === "" || dataToMod.montant === 0) {
        toast.error("Saisir le montant de revenu");
        return false;
      } else {
        return true;
      }
    }
  }

  function handleModData(e) {
    e.preventDefault();

    if (
      checkClientInfo() ||
      checkCompteurInfo() ||
      checkFactureInfo() ||
      checkTrancheInfo() ||
      checkChargeInfo() ||
      checkRevenuInfo()
    ) {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_HOST}:${
            process.env.REACT_APP_PORT
          }/api/${endPoint}/${
            clientId || compteurId || factureId || trancheId || chargeId || revenuId
          }`,
          dataToMod,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (page === "client" && res.data.isClientexisting) {
            toast.error("Cette CIN exist deja!");
            setLoading(false);
            return;
          } else if (page === "tranche" && res.data.errorMsg) {
            toast.error(res.data.errorMsg);
            setLoading(false);
            return;
          }

          toast.success(`${page} a été modifier avec succée`);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Un problem est servenu lors de la modification!");
        });
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <div className="centerDiv h-100">
          <form
            method="POST"
            onSubmit={(e) => handleModData(e)}
            className="shadow p-5 pt-4 pb-4 rounded AddModForms"
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                width: "50px",
                height: "50px",
                right: "0",
                top: "0",
                borderRadius: "0px 10px 0px 10px",
              }}
              className="bg-primary"
            ></div>
            <h3 className="text-center mb-4">{`Modifier ${page}`}</h3>
            {page === "client" && (
              <ModClient
                onChangeModInfo={(e) => handleModInfo(e)}
                dataToMod={dataToMod}
              />
            )}

            {page === "compteur" && (
              <ModCompteur
                onChangeModInfo={(e) => handleModInfo(e)}
                dataToMod={dataToMod}
                clients={clients}
              />
            )}

            {page === "facture" && (
              <ModFacture
                onChangeModInfo={(e) => handleModInfo(e)}
                dataToMod={dataToMod}
              />
            )}

            {page === "tranche" && (
              <ModTranche
                onChangeModInfo={(e) => handleModInfo(e)}
                dataToMod={dataToMod}
              />
            )}

            {page === "charge" && (
              <ModCharge
                onChangeModInfo={(e) => handleModInfo(e)}
                dataToMod={dataToMod}
              />
            )}

            {page === "revenu" && (
              <ModRevenu
                onChangeModInfo={(e) => handleModInfo(e)}
                dataToMod={dataToMod}
              />
            )}

            <div className="mt-4 d-flex gap-3">
              <button className="btn btn-primary fw-bold" disabled={loading}>
                {loading ? <ActionLoading /> : "Modifier"}
              </button>
              <a href={`/${page}s`} className="btn btn-danger fw-bold">
                Retour
              </a>
            </div>
          </form>
        </div>
      </Main>
    </div>
  );
}

import React, { useState } from "react";
import Main from "./Main";
import Menu from "./Menu";
import { useUser } from "../Auth/ProtectedRoute";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ActionLoading from "../costumComponents/ActionLoading";
import AddClient from "./crufForm/AddClient";
import AddCompteur from "./crufForm/AddCompteur";
import GetClients from "../hooks/GetClients";
import { useParams } from "react-router-dom";
import AddFacture from "./crufForm/AddFacture";
import Swal from "sweetalert2";
import AddTranche from "./crufForm/AddTranche";
import AddCharge from "./crufForm/AddCharge";
import AddRevenu from "./crufForm/AddRevenu";
import AddCredit from "./crufForm/AddCredit";

export default function AddForm({ page }) {
  const { user } = useUser();
  const { numClient } = useParams();

  const clients = GetClients();

  let dataObject = {};
  let endPoint = "";

  if (page === "client") {
    dataObject = {
      nameClient: "",
      cin: "",
      password: "",
      birthDate: "",
      tele: "",
      adresse: "",
      dateRegisterClient: new Date().toISOString(),
      companyId: user.companyId,
    };

    endPoint = "addClient";
  } else if (page === "compteur") {
    dataObject = {
      startPoint: 0,
      useDate: "",
      credit: 0.0,
      numClient: parseInt(numClient) || 0,
      companyId: user.companyId,
    };
    endPoint = "addCompteur";
  } else if (page === "facture") {
    dataObject = {
      dateFacture: "",
      datePainement: "",
      numCompteur: 0,
      numClient: parseInt(numClient) || 0,
      valeurCompteurPreleve: 0,
      painementStatus: "Non payée",
      totalFacture: 0.0,
      companyId: user.companyId,
    };
    endPoint = "addFacture";
  } else if (page === "tranche") {
    dataObject = {
      nameTranche: "",
      prix: "",
      maxTonnage: 0,
      isActive: false,
      companyId: user.companyId,
    };
    endPoint = "addTranche";
  } else if (page === "charge") {
    dataObject = {
      designation: "",
      montant: 0,
      datePaiment: "",
      responsable: "",
      companyId: user.companyId,
    };
    endPoint = "addCharge";
  } else if (page === "revenu") {
    dataObject = {
      designation: "",
      montant: 0,
      companyId: user.companyId,
    };
    endPoint = "addRevenu";
  } else if (page === "credit") {
    dataObject = {
      numCompteur: "",
      montantPaye: 0,
      companyId: user.companyId,
    };
    endPoint = "addCredit";
  }

  const [dataToAdd, setDataToAdd] = useState(dataObject);
  const [loading, setLoading] = useState(false);

  function handleAddInfo(e) {
    e.preventDefault();
    setDataToAdd({ ...dataToAdd, [e.target.name]: e.target.value });
  }

  function checkClientInfo() {
    if (page === "client") {
      if (!dataToAdd.nameClient.trim().match(/[A-Za-z]{3,}/)) {
        toast.error(
          "Le nom complet du client doit contien 3 caracteres minimum!"
        );
        return false;
      } else if (!dataToAdd.cin.trim().match(/^[A-Z0-9]{7,8}$/)) {
        toast.error("Saisir un CIN valide!");
        return false;
      } else if (dataToAdd.birthDate === "") {
        toast.error("Saisir la date de naissance!");
        return false;
      } else if (!dataToAdd.tele.trim().match(/[0-9]{10}/)) {
        toast.error("Saisir un numero de telephone valide!");
        return false;
      } else if (dataToAdd.adresse.trim().length < 10) {
        toast.error("L'adresse du client doit contien 10 caracteres minimum!");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkCompteurInfo() {
    if (page === "compteur") {
      if (dataToAdd.startPoint > 99999) {
        toast.error("La valeur du compteur ne doit pas depasser 99999!");
        return false;
      } else if (dataToAdd.useDate === "") {
        toast.error("Saisir la date d'utilisation du compteur");
        return false;
      } else if (dataToAdd.numClient === "") {
        toast.error("Choisir un client!");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkFactureInfo() {
    if (page === "facture") {
      if (dataToAdd.dateFacture === "") {
        toast.error("Saisir la date de consomation");
        return false;
      } else if (dataToAdd.numCompteur === 0) {
        toast.error("choisir un compteur");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkTrancheInfo() {
    if (page === "tranche") {
      if (dataToAdd.nameTranche === "") {
        toast.error("saisir le nom du tranche");
        return false;
      } else if (dataToAdd.prix === "") {
        toast.error("Saisir le prix du tranche");
        return false;
      } else if (isNaN(dataToAdd.prix)) {
        toast.error("le prix doit etre un nombre");
        return false;
      } else if (dataToAdd.maxTonnage === 0) {
        toast.error("Saisir le tonnage maximal du tranche");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkChargeInfo() {
    if (page === "charge") {
      if (dataToAdd.designation === "") {
        toast.error("saisir la designation de charge");
        return false;
      } else if (dataToAdd.montant === "" || dataToAdd.montant === 0) {
        toast.error("Saisir le montant de charge");
        return false;
      } else if (isNaN(dataToAdd.montant)) {
        toast.error("le montant doit etre un nombre");
        return false;
      } else if (dataToAdd.datePaiment === "") {
        toast.error("Saisir la date de paiment de charge");
        return false;
      } else if (dataToAdd.responsable === "") {
        toast.error("choisir un responsable pour la charge");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkRevenuInfo() {
    if (page === "revenu") {
      if (dataToAdd.designation === "") {
        toast.error("saisir la designation de revenu");
        return false;
      } else if (dataToAdd.montant === "" || dataToAdd.montant === 0) {
        toast.error("Saisir le montant de revenu");
        return false;
      } else {
        return true;
      }
    }
  }

  function checkCreditInfo() {
    if (page === "credit") {
      if (dataToAdd.numCompteur === "") {
        toast.error("choisir un compteur");
        return false;
      } else if (dataToAdd.montantPaye <= 0 || isNaN(dataToAdd.montantPaye)) {
        toast.error("Saisir le montant paye de credit");
        return false;
      } else {
        return true;
      }
    }
  }

  function handleAddNewData(e) {
    e.preventDefault();

    if (
      checkClientInfo() ||
      checkCompteurInfo() ||
      checkFactureInfo() ||
      checkTrancheInfo() ||
      checkChargeInfo() ||
      checkRevenuInfo() ||
      checkCreditInfo()
    ) {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/${endPoint}`,
          dataToAdd,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (page === "client" && res.data.isClientexisting) {
            toast.error("Cette CIN exist deja!");
            setLoading(false);
            return;
          } else if (page === "compteur" && res.data.maxCompteurs) {
            toast.error(`${res.data.maxCompteurs}!`);
            setLoading(false);
            return;
          } else if (page === "facture" && res.data.invalidData) {
            Swal.fire({
              title: `<img src="/Assets/warning.gif" alt="delete" width="50" />`,
              text: `${res.data.invalidData}`,
              showCancelButton: true,
              confirmButtonColor: "#1c37cd",
              confirmButtonText: "Oui",
              cancelButtonText: "Annuler",
              padding: "10px",
            }).then((res) => {
              if (res.isConfirmed) {
                axios
                  .post(
                    `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/${endPoint}?confirmed=true`,
                    dataToAdd,
                    {
                      withCredentials: true,
                    }
                  )
                  .then((res) => {
                    toast.success(`${page} a été ajouter avec succée`);
                    setLoading(false);
                    return;
                  })
                  .catch((err) => {
                    toast.error("Un problème est survenu");
                    console.error(err.response.data.error);
                    setLoading(false);
                  });
              } else {
                setLoading(false);
              }
            });
            return;
          } else if (page === "facture" && res.data.activeTranche) {
            toast.error(`${res.data.activeTranche}!`);
            setLoading(false);
            return;
          } else if (page === "facture" && res.data.invalidDateFacture) {
            toast.error(`${res.data.invalidDateFacture}!`);
            setLoading(false);
            return;
          } else if (page === "tranche" && res.data.errorMsg) {
            toast.error(`${res.data.errorMsg}!`);
            setLoading(false);
            return;
          }

          toast.success(`${page} a été ajouter avec succée`);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          // console.log(err.response.data.error);
          // toast.error("Un problem est servenu lors de l'ajout!");
          // console.log(err);
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
            onSubmit={(e) => handleAddNewData(e)}
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
              className="bg-success"
            ></div>
            <h3 className="text-center mb-4">{`Ajouter des données ${page}`}</h3>
            {page === "client" && (
              <AddClient onChangeInfo={(e) => handleAddInfo(e)} />
            )}

            {page === "compteur" && (
              <AddCompteur
                clients={clients}
                onChangeInfo={(e) => handleAddInfo(e)}
                numClient={dataObject.numClient}
              />
            )}

            {page === "facture" && (
              <AddFacture
                onChangeInfo={(e) => handleAddInfo(e)}
                client={numClient}
              />
            )}

            {page === "tranche" && (
              <AddTranche onChangeInfo={(e) => handleAddInfo(e)} />
            )}

            {page === "charge" && (
              <AddCharge onChangeInfo={(e) => handleAddInfo(e)} />
            )}

            {page === "revenu" && (
              <AddRevenu onChangeInfo={(e) => handleAddInfo(e)} />
            )}

            {page === "credit" && (
              <AddCredit onChangeInfo={(e) => handleAddInfo(e)} />
            )}

            <div className="mt-4 d-flex gap-3">
              <button className="btn btn-success fw-bold" disabled={loading}>
                {loading ? <ActionLoading /> : "Ajouter"}
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

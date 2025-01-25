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

export default function AddForm({ page }) {
  const { user } = useUser();
  const clients = GetClients();
  const { numClient } = useParams();
  let dataObject = {};
  let endPoint = "";

  if (page === "client") {
    dataObject = {
      nameClient: "",
      cin: "",
      birthDate: "",
      tele: "",
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

  function handleAddNewData(e) {
    e.preventDefault();

    if (checkClientInfo() || checkCompteurInfo()) {
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
          }
          else if (page === "compteur" && res.data.maxCompteurs) {
            toast.error(`${res.data.error}!`);
            setLoading(false);
            return;
          }
          toast.success(`${page} a été ajouter avec succée`);
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Un problem est servenu lors de l'ajout!");
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
            className="shadow p-5 pt-4 pb-4 rounded w-50"
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
            <h3 className="text-center mb-4">{`Ajouter un ${page}`}</h3>
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
            <div className="mt-4 d-flex justify-content-around w-100">
              <button
                className="btn btn-success w-25 fw-bold"
                disabled={loading}
              >
                {loading ? <ActionLoading /> : "Ajouter"}
              </button>
              <a href={`/${page}s`} className="btn btn-danger w-25 fw-bold">
                Retour
              </a>
            </div>
          </form>
        </div>
      </Main>
    </div>
  );
}

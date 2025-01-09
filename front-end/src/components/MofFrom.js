import React, { useEffect, useState } from "react";
import Main from "./Main";
import Menu from "./Menu";
import { useUser } from "../Auth/ProtectedRoute";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ActionLoading from "../costumComponents/ActionLoading";
import { useParams } from "react-router-dom";
// import ErrorMsg from "../costumComponents/ErrorMsg";
import GetClients from "../hooks/GetClients";
import ModClient from "./crufForm/ModClient";
import ModCompteur from "./crufForm/ModCompteur";

export default function ModForm({ page }) {
  const { user } = useUser();
  const { clientId } = useParams();
  const { compteurId } = useParams();
  const clients = GetClients();

  let dataObject = {};
  let endPoint = "";

  if (page === "client") {
    dataObject = {
      nameClient: "",
      cin: "",
      birthDate: "",
      tele: "",
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
  }

  const [dataToMod, setDataToMod] = useState(dataObject);
  const [loading, setLoading] = useState(false);
  // const [errorMsgs, setErrorMsgs] = useState("");

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
    }
  }, [clientId, compteurId, user.companyId]);

  function handleModInfo(e) {
    e.preventDefault();
    setDataToMod({ ...dataToMod, [e.target.name]: e.target.value });
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
      } else {
        return true;
      }
    }
  }

  function checkCompteurInfo() {
    if (page === "compteur") {
      if(dataToMod.startPoint > 99999){
        toast.error("La valeur du compteur ne doit pas depasser 99999!");
        return false;
      }
      else if (dataToMod.useDate === "") {
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

  function handleModData(e) {
    e.preventDefault();

    if (checkClientInfo() || checkCompteurInfo()) {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/${endPoint}/${clientId || compteurId}`,
          dataToMod,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if(page === 'client' && res.data.isClientexisting){
            toast.error("Cette CIN exist deja!");
            setLoading(false);
          // setErrorMsgs("");
            return;
          }
          toast.success(`${page} a été modifier avec succée`);
          setLoading(false);
          // setErrorMsgs("");
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Un problem est servenu lors de la modification!");
          // if (page === "client") {
          //   setErrorMsgs(
          //     "CIN ou numéro de télephone existe déja dans votre liste de clients ou déja enregistrer dans une autre société"
          //   );
          // }
        });
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <div className="d-flex justify-content-center align-items-center h-100">
          <form
            method="POST"
            onSubmit={(e) => handleModData(e)}
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
              className="bg-primary"
            ></div>
            <h3 className="text-center mb-4">{`Modifier ${page}`}</h3>
            {/* {errorMsgs && (
              <ErrorMsg
                msg={errorMsgs}
                errorIconWidth={20}
                coleur={"red"}
                boldness="bold"
                imgPath="/Assets/error.png"
              />
            )} */}
            {page === "client" && (
              <ModClient onChangeModInfo={e=>handleModInfo(e)} dataToMod={dataToMod} />
            )}

            {page === "compteur" && (
              <ModCompteur onChangeModInfo={e=>handleModInfo(e)} dataToMod={dataToMod} clients={clients} />
            )}
            <div className="mt-4 d-flex justify-content-around w-100">
              <button
                className="btn btn-primary w-25 fw-bold"
                disabled={loading}
              >
                {loading ? <ActionLoading /> : "Modifier"}
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

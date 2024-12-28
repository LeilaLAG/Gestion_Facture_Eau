import React, { useState } from "react";
import Main from "./Main";
import Menu from "./Menu";
import { useUser } from "../Auth/ProtectedRoute";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ActionLoading from "../costumComponents/ActionLoading";

export default function AddForm({ page }) {
  const { user } = useUser();

  let dataObject = {};
  let endPoint = "";

  if (page === "client") {
    dataObject = {
      numClient: "",
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
      //
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
      if (dataToAdd.numClient === "") {
        toast.error("Saisir le numero du client!");
        return false;
      } else if (!dataToAdd.nameClient.trim().match(/[A-Za-z]{3,}/)) {
        toast.error(
          "Le nom complet du client doit contien 3 caracteres minimum!"
        );
        return false;
      } else if (!dataToAdd.cin.trim().match(/^[A-Z0-9]{8}$/)) {
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
    //validation compteur
  }

  function handleAddNewData(e) {
    e.preventDefault();

    if (checkClientInfo() || checkCompteurInfo()) {
      setLoading(true)
      axios
        .post(`http://localhost:8000/api/${endPoint}`, dataToAdd, {
          withCredentials: true,
        })
        .then((res) => {toast.success(`${page} a été ajouter avec succée`) ; setLoading(false)})
        .catch((err) =>{
          setLoading(false)
          toast.error("Un problem est servenue lors de l'ajout, Verifier si les données déja existes!")
        }
        );
    }
  }

  if (page === "client") {
    return (
      <div className="d-flex h-100">
        <Toaster position="top-right" />
        <Menu />
        <Main>
          <div className="d-flex justify-content-center align-items-center h-100">
            <form
              method="POST"
              onSubmit={(e) => handleAddNewData(e)}
              className="shadow p-5 pt-4 pb-4 rounded w-50"
            >
              <h3 className="text-center mb-4">{`Ajouter un ${page}`}</h3>
              {page === "client" && (
                <div>
                  <div className="mb-3">
                    <label className="d-block">Numéro</label>
                    <input
                      type="number"
                      name="numClient"
                      className="form-control"
                      placeholder="Saisir le numero du client"
                      onChange={(e) => handleAddInfo(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="d-block">Nom complet</label>
                    <input
                      type="text"
                      name="nameClient"
                      className="form-control"
                      placeholder="Saisir le nom complet du client"
                      onChange={(e) => handleAddInfo(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="d-block">CIN</label>
                    <input
                      type="text"
                      name="cin"
                      className="form-control"
                      placeholder="Saisir le CIN du client"
                      onChange={(e) => handleAddInfo(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="d-block">Date de naissance</label>
                    <input
                      type="date"
                      name="birthDate"
                      className="form-control"
                      onChange={(e) => handleAddInfo(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="d-block">Telephone</label>
                    <input
                      type="text"
                      name="tele"
                      className="form-control"
                      placeholder="Saisir le numero de telephone du client"
                      onChange={(e) => handleAddInfo(e)}
                    />
                  </div>
                </div>
              )}
              <div className="mt-4 d-flex justify-content-around w-100">
                <button className="btn btn-success w-25 fw-bold" disabled={loading}>
                  {loading ? <ActionLoading/> : "Ajouter"}
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
}

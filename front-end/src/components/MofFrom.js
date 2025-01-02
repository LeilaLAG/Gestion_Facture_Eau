import React, { useEffect, useState } from "react";
import Main from "./Main";
import Menu from "./Menu";
import { useUser } from "../Auth/ProtectedRoute";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ActionLoading from "../costumComponents/ActionLoading";
import { useParams } from "react-router-dom";
import ErrorMsg from "../costumComponents/ErrorMsg";
import GetClients from "../hooks/GetClients";

export default function ModForm({ page }) {
  const { user } = useUser();
  const { clientId } = useParams();
  const { compteurId } = useParams();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const data = await axios.get(
        `http://localhost:8000/api/clients/${user.companyId}/`,
        {
          withCredentials: true,
        }
      );
      setClients(data.data.Clients);
    }
    fetchData();
  }, [user.companyId]);

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
      numClient: "",
      companyId: user.companyId,
    };
    endPoint = "updateCompteur";
  }

  const [dataToMod, setDataToMod] = useState(dataObject);
  const [loading, setLoading] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");

  function convertDate(inputdate) {
    const date = new Date(inputdate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    console.log(`${yyyy}-${mm}-${dd}`);
    return `${yyyy}-${mm}-${dd}`;
  }

  useEffect(() => {
    if (clientId) {
      axios
        .get(`http://localhost:8000/api/client/${clientId}/${user.companyId}`, {
          withCredentials: true,
        })
        .then((res) => setDataToMod(res.data.client))
        .catch((err) => toast.error("Un problem est servenue!"));
    } else if (compteurId) {
      axios
        .get(
          `http://localhost:8000/api/compteurs/${compteurId}/${user.companyId}`,
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
      if (dataToMod.useDate === "") {
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
          `http://localhost:8000/api/${endPoint}/${clientId || compteurId}`,
          dataToMod,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          toast.success(`${page} a été modifier avec succée`);
          setLoading(false);
          setErrorMsgs("");
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Un problem est servenue lors de la modification!");
          if (page === "client") {
            setErrorMsgs(
              "CIN ou numéro de télephone existe déja dans votre liste de clients ou déja enregistrer dans une autre société"
            );
          }
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
            {errorMsgs && (
              <ErrorMsg
                msg={errorMsgs}
                errorIconWidth={20}
                coleur={"red"}
                boldness="bold"
                imgPath="/Assets/error.png"
              />
            )}
            {page === "client" && (
              <div className="mt-2">
                <div className="mb-3">
                  <label className="d-block">Nom complet</label>
                  <input
                    type="text"
                    name="nameClient"
                    className="form-control"
                    placeholder="Saisir le nom complet du client"
                    value={dataToMod.nameClient}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="d-block">CIN</label>
                  <input
                    type="text"
                    name="cin"
                    className="form-control"
                    placeholder="Saisir le CIN du client"
                    value={dataToMod.cin}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="d-block">Date de naissance</label>
                  <input
                    type="date"
                    name="birthDate"
                    className="form-control"
                    value={convertDate(dataToMod.birthDate)}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="d-block">Telephone</label>
                  <input
                    type="text"
                    name="tele"
                    className="form-control"
                    placeholder="Saisir le numero de telephone du client"
                    value={dataToMod.tele}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
              </div>
            )}

            {page === "compteur" && (
              <div className="mt-2">
                <div className="mb-3">
                  <label className="d-block">Point de depart</label>
                  <input
                    type="number"
                    name="startPoint"
                    className="form-control"
                    placeholder="Saisir le point de depart"
                    value={dataToMod.startPoint}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="d-block">Date D'utilisation</label>
                  <input
                    type="date"
                    name="useDate"
                    className="form-control"
                    placeholder="Choisir la date d'utilisation"
                    value={dataToMod.useDate}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="d-block">Credit</label>
                  <input
                    type="number"
                    name="credit"
                    className="form-control"
                    value={dataToMod.credit}
                    onChange={(e) => handleModInfo(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="d-block">Client</label>
                  <select name="numClient" onChange={(e) => handleModInfo(e)}>
                    {clients.map((client) => {
                      if (client.numClient === dataToMod.numClient) {
                        return (
                          <option
                            key={client.numClient}
                            value={client.numClient}
                            selected
                          >
                            {client.nameClient}
                          </option>
                        );
                      }
                      return (
                        <option key={client.numClient} value={client.numClient}>
                          {client.nameClient}
                        </option>
                      );
                    })}
                    {clients.length <= 0 ? (
                      <option>
                        <ErrorMsg
                          msg={"Aucun data"}
                          errorIconWidth={20}
                          coleur={"red"}
                          boldness="bold"
                          imgPath="Assets/empty.png"
                        />
                      </option>
                    ) : (
                      clients.map((client, i) =>
                        client.error ? (
                          <option key={i}>
                            {" "}
                            <ErrorMsg
                              msg={client.error}
                              errorIconWidth={20}
                              coleur={"red"}
                              boldness="bold"
                              imgPath="Assets/error.png"
                            />
                          </option>
                        ) : client.numClient === dataToMod.numClient ? (
                          <option
                            key={client.numClient}
                            value={client.numClient}
                            selected
                          >
                            {client.nameClient}
                          </option>
                        ) : (
                          <option key={i} value={client.numClient}>
                            {client.nameClient}
                          </option>
                        )
                      )
                    )}
                  </select>
                </div>
              </div>
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

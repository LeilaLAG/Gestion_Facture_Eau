import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menu from "./Menu";
import Main from "./Main";
import ActionLoading from "../costumComponents/ActionLoading";
import ErrorMsg from "../costumComponents/ErrorMsg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function UserModFrom() {
  const { userId } = useParams();

  const [userToMod, setUserToMod] = useState({});

  useEffect(()=>{
    async function fetchUser(){
      await axios.get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/user/${userId}`, {
        withCredentials: true,
      }).then(res=>setUserToMod(res.data.user))
      .catch(err=>toast.error(err.response.data.error))
    }

    fetchUser()
    
  } , [userId])

  const [loading, setLoading] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");

  function handleUserChange(e) {
    setUserToMod({ ...userToMod, [e.target.name]: e.target.value });
  }

  function handleModUser(e) {
    e.preventDefault();

    setLoading(true);

    if (!userToMod.fullName.trim().match(/[A-Za-z]{3,}/)) {
      setErrorMsgs("Le nom d'utilisateur doit contien 3 caracteres minimum!");
      setLoading(false);
    } else if (
      !userToMod.email
        .trim()
        .match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      setErrorMsgs("Le format de l'adresse Email est invalide!");
      setLoading(false);
    } else {
      axios
        .put(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/updateUser/${userId}`,
          userToMod,
          { withCredentials: true }
        )
        .then((res) => {
          setLoading(false);
          if(res.data.isEmailexist){
            setErrorMsgs("L'adresse Email est déja utilisée par un autre utilisateur")
          }
          else{
            toast.success("Votre profile a été modifier");
            setTimeout(()=>window.location.reload() , 3000)
          }
        })
        .catch((err) => {
          toast.error("Un erreur est servenue!");
          setLoading(false);
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
            method="PUT"
            onSubmit={(e) => handleModUser(e)}
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
              className="bg-dark"
            ></div>
            <h3 className="text-center mb-4">{`Modifier votre profile`}</h3>
            {errorMsgs && (
              <ErrorMsg
                msg={errorMsgs}
                errorIconWidth={20}
                coleur={"red"}
                boldness="bold"
                imgPath="/Assets/error.png"
              />
            )}
            <div className="mb-3 mt-3">
              <div className="mb-3">
                <label className="d-block">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Saisir votre nom d'utilisateur"
                  value={userToMod.fullName}
                  onChange={(e) => handleUserChange(e)}
                />
              </div>
              <div className="mb-3">
                <label className="d-block">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Saisir votre adresse Email"
                  value={userToMod.email}
                  onChange={(e) => handleUserChange(e)}
                />
              </div>
              <div className="mb-3">
                <label className="d-block">Role</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  placeholder="Saisir votre role"
                  value={userToMod.role}
                  onChange={(e) => handleUserChange(e)}
                />
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-around w-100">
              <button className="btn btn-dark w-25 fw-bold" disabled={loading}>
                {loading ? <ActionLoading /> : "Modifier"}
              </button>
              <a href="/home" className="btn btn-danger w-25 fw-bold">
                Retour
              </a>
            </div>
          </form>
        </div>
      </Main>
    </div>
  );
}

import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../Auth/ProtectedRoute";

export default function PasswordReset() {

    const {user} = useUser()
  const [email, setEmail] = useState("");

  function handleSendResetPasswordEmail(e) {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/api/ResetPassword",
        { email : email , userId : user._id },
        { withCredentials: true }
      )
      .then((res) =>
        toast.success("Votre email de reinitialisation a été envoyer")
      )
      .catch((res) => toast.error("Un erreur est servenu!"));
  }
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <Toaster />
      <div style={{ width: "40%" }}>
        <form
          className="shadow p-5 pt-4 pb-4 rounded"
          style={{ position: "relative" }}
          onSubmit={(e) => handleSendResetPasswordEmail(e)}
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
            className="bg-info"
          ></div>
          <h3 className="text-center mb-4 mt-4">
            Reinitialiser votre mot de passe
          </h3>
          <div className="mt-3">
            <label className="d-block">Adresse Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Saisir votre adrese email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-3"></div>
          <div className="mt-4 d-flex justify-content-around w-100">
            <button className="fw-bold btn btn-info w-25">Envoyer</button>
            <a href="/clients" className="btn btn-danger w-25 fw-bold">
              Retour
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

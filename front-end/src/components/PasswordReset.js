import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ActionLoading from "../costumComponents/ActionLoading";
import { useNavigate } from "react-router-dom";
import ErrorMsg from "../costumComponents/ErrorMsg";

export default function PasswordReset() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [tries, setTries] = useState(5);

  const [code, setCode] = useState(0);
  const [inputCode, setInputCode] = useState("");

  function handleSendResetPasswordEmail(e) {
    e.preventDefault();
    if (
      !email.trim().match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      return toast.error("Votre email format est invalide!");
    }
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/ResetPassword`,
        { email: email }
      )
      .then((res) => {
        toast.success("Votre email de reinitialisation a été envoyer");
        setLoading(false);
        setCode(res.data.verification_code);
        setShowCodeInput(true);
      })
      .catch((err) => {
        toast.error("Un erreur est servenu!");
        setLoading(false);
      });
  }

  function checkVerificationCode(e) {
    e.preventDefault();

    if (tries < 0) {
      setTimeout(() => window.location.reload(), 2000);
    }
    if (parseInt(inputCode) === parseInt(code)) {
      setShowResetForm(true);
    } else {
      setTries((prev) => prev - 1);
      toast.error("Ce code dde verification is invalide!");
    }
  }

  function RessettingPassword(e) {
    e.preventDefault();

    if (!password.trim().match(/[A-Za-z0-9._%+-]{8,}/)) {
      toast.error("Le mot de passe doit contien 8 caracteres minimum!");
    } else {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/modify_password/${email}`,
          { password: password }
        )
        .then((res) => {
          toast.success("Votre mot de passe a été reinitailisé");
          setTimeout(() => {
            navigate("/log-in");
          }, 2000);
        })
        .catch((err) => {
          toast.error("Un erreur est servenu!");
          setLoading(false);
        });
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <Toaster />
      <div style={{ width: "40%" }}>
        {showResetForm ? (
          <form
            className="shadow p-5 pt-4 pb-4 rounded"
            onSubmit={(e) => RessettingPassword(e)}
            style={{ position: "relative" }}
            method="post"
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
              <label>Nouveau mot de passe</label>
              <div className="LoginPasswordInput">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Saisir votre nouveau mot de passe"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src="Assets/show.png"
                  alt="show"
                  width={20}
                  className="showPasswordIcon"
                  style={{ bottom: "20%" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-around w-100">
              <button className="fw-bold btn btn-info w-25" disabled={loading}>
                Enregistrer
              </button>
            </div>
          </form>
        ) : showCodeInput ? (
          <form
            className="shadow p-5 pt-4 pb-4 rounded"
            onSubmit={(e) => checkVerificationCode(e)}
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
              className="bg-info"
            ></div>
            <h3 className="text-center mb-4 mt-4">
              Reinitialiser votre mot de passe
            </h3>
            <ErrorMsg
              msg={`Vous avez ${tries} tentatives`}
              errorIconWidth={20}
              coleur={"red"}
              boldness="bold"
              imgPath="/Assets/error.png"
            />
            <div className="mt-3">
              <label className="d-block">Code de verification</label>
              <div>
                <input
                  type="number"
                  name="inputCode"
                  className="form-control"
                  placeholder="Saisir le code de verification"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-around w-100">
              <button className="fw-bold btn btn-info w-25">Verifier</button>
              <a href="/reset-password" className="btn btn-danger w-25 fw-bold">
                Retour
              </a>
            </div>
          </form>
        ) : (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4 d-flex justify-content-around w-100">
              <button className="fw-bold btn btn-info w-25" disabled={loading}>
                {loading ? <ActionLoading /> : "Envoyer"}
              </button>
              <a href="/log-in" className="btn btn-danger w-25 fw-bold">
                Retour
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

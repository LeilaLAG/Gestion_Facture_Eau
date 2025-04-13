import axios from "axios";
import "../style/login.css";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActionLoading from "../costumComponents/ActionLoading";

export default function LogIn() {
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();

  function handleChangeLoginUserInfo(e) {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  }

  async function handleSubmitLoginUser(e) {
    e.preventDefault();

    setLoginLoading(true);
    setIsDisabled(true);

    await axios
      .post(
        `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/login`,
        {
          email: loginUser.email,
          password: loginUser.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        navigate("/accueil");
        setLoginLoading(false);
        setIsDisabled(false);
      })
      .catch((err) => {
        toast.error("L'adresse E-mail ou le mot de passe est incorrect!");
        setLoginLoading(false);
        setIsDisabled(false);
      });
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="LoginFormCOntainer h-100 d-flex justify-content-around">
        <div style={{height : "100dvh" , zIndex:'-1' }}>
          <img src="/Assets/loginImg1.jpg" alt="" />
        </div>
        <form
        method="POST"
          className="LoginFrom "
          onSubmit={(e) => {
            handleSubmitLoginUser(e);
          }}
        >
          <div>
            <div className="centerDiv mb-5">
              <img src="/Assets/aquamanage.svg" alt="logo" width={150}/>
            </div>
            <h1 className="mb-5 text-center">Authentifier</h1>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Saisir votre adresse email"
              onChange={(e) => {
                handleChangeLoginUserInfo(e);
              }}
            />
            <div className="LoginPasswordInput">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control mt-3"
                placeholder="Saisir votre mot de passe"
                onChange={(e) => {
                  handleChangeLoginUserInfo(e);
                }}
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
            <div className="text-end">
              <a style={{fontSize : "14px"}} href="/reset-password">Mot de pass oublier?</a>
            </div>
            <button
              className="bg_blue_button w-100 mt-3 fw-bold"
              disabled={isDisabled}
            >
              {loginLoading ? <ActionLoading /> : "Authentifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/signUp.css";
import "../style/customCompStyle.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import GetCompanies from "../hooks/GetCompanies";
import ActionLoading from "../costumComponents/ActionLoading";

export default function SignUp() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    function: "Admin",
    role: "",
    companyId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState("");

  const allCompanies = GetCompanies();

  const navigate = useNavigate();

  function handleChangeUserInfo(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmitUser(e) {
    e.preventDefault();

    if (
      !user.email
        .trim()
        .match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      toast.error("Le format de l'adresse Email est invalide!");
    } else if (!user.password.trim().match(/[A-Za-z0-9._%+-]{8,}/)) {
      toast.error("Le mot de passe doit contien 8 caracteres minimum!");
    } else if (!user.fullName.trim().match(/[A-Za-z]{3,}/)) {
      toast.error("Le nom d'utilisateur doit contien 3 caracteres minimum!");
    } else if (user.role === "") {
      toast.error("Choisir votre fonction!");
    } else if (!company.trim().match(/[A-Za-z]{3,}/)) {
      toast.error("Le nom de société doit contien 3 caracteres minimum!");
    } else if (
      allCompanies.find((societe) => company === societe.companyName) !==
      undefined
    ) {
      toast.error("Cette société existe déja!");
    } else {
      setSignupLoading(true);
      setIsDisabled(true);

      // adding user
      await axios
        .post(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/addUser`,
          {
            ...user,
            companyId: company,
          }
        )
        .then(async (res) => {
          if (res.data.isEmailexist) {
            toast.error("Cette adresse Email est déja utilisé!");
            setSignupLoading(false);
            setIsDisabled(false);
            return;
          }
          // adding company
          await axios.post(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/addCompany`,
            { companyName: company }
          );

          toast.success("Votre profile a été creer");
          setTimeout(() => {
            navigate("/log-in");
          }, 3000);
        })
        .catch((err) => {
          setSignupLoading(false);
          setIsDisabled(false);
          toast.error(err.response.data.error);
        });
    }
  }
  return (
    <div>
      <Toaster position="top-right" />
      <div className="LoginFormCOntainer h-100 d-flex justify-content-around">
        <div>
          <img src="Assets/loginImg.jpg" alt="" />
        </div>
        <form
          method="POST"
          className="LoginFrom shadow"
          onSubmit={(e) => {
            handleSubmitUser(e);
          }}
        >
          <div>
            <div className="d-flex justify-content-center align-items-center mb-5">
              <img src="Assets/waterLogo.png" alt="logo" width={40} />
              <div className="d-flex flex-column">
                <h1 className="fw-bold m-0" style={{ fontSize: "30px" }}>
                  G-F-E
                </h1>
                <span style={{ fontSize: "12px" }}>
                  Gestion des Facture d'Eau
                </span>
              </div>
            </div>
            <h1 className="mb-5 text-center">S'enregister</h1>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Saisir votre adresse email"
              onChange={(e) => {
                handleChangeUserInfo(e);
              }}
            />
            <div className="LoginPasswordInput">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control mt-3"
                placeholder="Saisir le mot de passe Admin"
                onChange={(e) => {
                  handleChangeUserInfo(e);
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
            <div className="LoginPasswordInput">
              <input
                type="text"
                name="fullName"
                className="form-control mt-3"
                placeholder="Saisir le nom de votre nom complet"
                onChange={(e) => {
                  handleChangeUserInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type="text"
                name="role"
                className="form-control mt-3"
                placeholder="Saisir le nom de votre role"
                onChange={(e) => {
                  handleChangeUserInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type="text"
                name="company"
                className="form-control mt-3"
                placeholder="Saisir le nom de votre société"
                onChange={(e) => {
                  setCompany(e.target.value);
                }}
              />
            </div>
            <button
              className="btn btn-primary w-100 mt-3 fw-bold"
              disabled={isDisabled}
            >
              {signupLoading ? <ActionLoading /> : "Crerer"}
            </button>
            <hr />
            <div className="text-center">
              <a className="color_blue_text" href="/log-in">
                Retour à la page d'authentification
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

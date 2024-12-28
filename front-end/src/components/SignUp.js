import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/signUp.css";
import "../style/customCompStyle.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import GetCompanies from "../hooks/GetCompanies";
import ActionLoading from "../costumComponents/ActionLoading";

export default function SignUp() {
  const [progress, setProgress] = useState(0);
  const [signupFormOpacity, setSignupFormOpacity] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    function: "",
    companyId: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const allCompanies = GetCompanies();

  const navigate = useNavigate();

  function handleSubmitCompany(e) {
    e.preventDefault();

    if (!company.trim().match(/[A-Za-z]{3,}/)) {
      toast.error(
        "Le nom de société doit contien 3 caracteres minimum!"
      );
    } else if (
      allCompanies.find((companie) => companie.companyName === company) !==
      undefined
    ) {
      toast.error(
        "Cette société existe déja. Veuillez saisir un nom de société unique"
      );
    } else {
      toast.success("Maintenant, creer votre profile");
      setProgress(1);
      setIsDisabled(false);
      setSignupFormOpacity(1);
    }
  }

  function handleChangeUserInfo(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmitUser(e) {
    e.preventDefault();

    if (!user.fullName.trim().match(/[A-Za-z]{3,}/)) {
      toast.error(
        "Le nom d'utilisateur doit contien 3 caracteres minimum!"
      );
    } else if (
      !user.email.trim().match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      toast.error("Le format de l'adresse Email est invalide!");
    } else if (!user.password.trim().match(/[A-Za-z0-9._%+-]{5,}/)) {
      toast.error("Le mot de passe doit contien 5 caracteres minimum!");
    } else if (user.function === "") {
      toast.error("Choisir votre fonction!");
    } else {
      setSignupLoading(true);
      setIsDisabled(true);
      await axios
        .post("http://localhost:8000/api/addCompany", { companyName: company })
        .then((res) => {
          console.log("company created");
        })
        .catch((err) => {
          setSignupLoading(false);
          setIsDisabled(false);
          console.error(
            "Un erreur est servenue, veuillez ressayer ou actualiser la page!"
          );
        });
      await axios
        .post("http://localhost:8000/api/addUser", {
          ...user,
          companyId: company,
          password: user.password,
        })
        .then((res) => {
          toast.success("Votre profile a été creer");
          setTimeout(() => {
            navigate("/log-in");
          }, 3000);
        })
        .catch((err) => {
          setSignupLoading(false);
          setIsDisabled(false);
          toast.error(
            "Un erreur est servenue, veuillez ressayer ou actualiser la page!"
          );
        });
    }
  }

  return (
    <div className="h-100 w-100 signUpContainer">
      <Toaster />
      <div className="d-flex justify-content-center align-items-center mb-5">
        <img src="Assets/waterLogo.png" alt="logo" width={40} />
        <div className="d-flex flex-column">
          <h1 className="fw-bold m-0" style={{ fontSize: "30px" }}>
            G-F-E
          </h1>
          <span style={{ fontSize: "12px" }}>Gestion des Facture d'Eau</span>
        </div>
      </div>
      <div className="d-flex align-items-end gap-2 mb-5 ">
        <h1 className="">Creer votre profile</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center w-100">
        <div className="d-flex justify-content-around w-100">
          <div className="signUpFormContainer">
            <div className="step">
              <p>1</p>
            </div>
            <form
              className="UserForm shadow"
              onSubmit={(e) => {
                handleSubmitCompany(e);
              }}
            >
              <h4 className="text-center fw-bold">Société</h4>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="Saisir votre nom de société"
                onChange={(e) => {
                  setProgress(0);
                  setIsDisabled(true);
                  setCompany(e.target.value);
                }}
              />
              <button className="btn btn-dark w-100 mt-2 fw-bold">
                Creer
              </button>
            </form>
          </div>
          <progress
            className="signUpFromProgressBar"
            value={progress}
          ></progress>
          <div className="signUpFormContainer">
            <div className="step">
              <p>2</p>
            </div>
            <form
              className="UserForm shadow"
              onSubmit={(e) => handleSubmitUser(e)}
              style={{ opacity: signupFormOpacity }}
            >
              <h4 className="text-center fw-bold">Utilisateur</h4>
              <input
                name="fullName"
                type="text"
                className="form-control mt-2"
                placeholder="Saisir votre nom d'utilisateur"
                onChange={(e) => handleChangeUserInfo(e)}
              />
              <input
                name="email"
                type="email"
                className="form-control mt-2"
                placeholder="Saisir votre adresse Email"
                onChange={(e) => handleChangeUserInfo(e)}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control mt-2"
                placeholder="Saisir un mot de passe"
                onChange={(e) => {
                  handleChangeUserInfo(e);
                }}
              />
              <img
                src="Assets/show.png"
                alt="show"
                width={20}
                className="showPasswordIcon"
                style={{ bottom: "40%" }}
                onClick={() => setShowPassword((prev) => !prev)}
              />
              <select
                className="form-control mt-2"
                name="function"
                onChange={(e) => handleChangeUserInfo(e)}
              >
                <option>Choisir une fonction</option>
                <option value={"Admin"}>Admin</option>
                <option value={"user1"}>user1</option>
                <option value={"user2"}>user2</option>
              </select>
              <button
                className="btn btn-primary w-100 mt-2 fw-bold"
                disabled={isDisabled}
              >
                {signupLoading ? <ActionLoading /> : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

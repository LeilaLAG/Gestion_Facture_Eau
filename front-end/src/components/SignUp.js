import React, { useState } from "react";
import "../style/login.css";
import "../style/customCompStyle.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import GetCompanies from "../hooks/GetCompanies";
import ActionLoading from "../costumComponents/ActionLoading";

export default function SignUp() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [Admin, setAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    function: "Admin",
    role: "",
    companyId: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const allCompanies = GetCompanies();

  function handleChangeAdminInfo(e) {
    setAdmin({ ...Admin, [e.target.name]: e.target.value });
  }

  function formTest() {
    if (
      !Admin.email
        .trim()
        .match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      toast.error("Le format de l'adresse Email est invalide!");
      return false;
    }
    if (!Admin.password.trim().match(/[A-Za-z0-9._%+-]{8,}/)) {
      toast.error("Le mot de passe doit contien 8 caracteres minimum!");
      return false;
    }
    if (!Admin.fullName.trim().match(/[A-Za-z]{3,}/)) {
      toast.error("Le nom d'utilisateur doit contien 3 caracteres minimum!");
      return false;
    }
    if (Admin.role === "") {
      toast.error("Choisir votre fonction!");
      return false;
    }
    if (!company.trim().match(/[A-Za-z]{3,}/)) {
      toast.error("Le nom de société doit contien 3 caracteres minimum!");
      return false;
    }
    if (
      allCompanies.find((societe) => company === societe.companyName) !==
      undefined
    ) {
      toast.error("Cette société existe déja!");
      return false;
    }
    return true;
  }

  async function handleSubmitAdmin(e) {
    e.preventDefault();

    if (formTest()) {
      setSignupLoading(true);
      setIsDisabled(true);

      // adding Admin
      await axios
        .post(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/addAdmin`,
          {
            ...Admin,
            companyId: company,
          }
        )
        .then(async (res) => {
          if (res.data.isEmailexist) {
            setSignupLoading(false);
            setIsDisabled(false);
            toast.error("Cette adresse Email est déja utilisé!");
            return;
          }
          // adding company
          await axios.post(
            `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/addCompany`,
            { companyName: company }
          );

          toast.success("Votre profile a été creer");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          setSignupLoading(false);
          setIsDisabled(false);
          toast.error("Un erreur est servenue lors de l'enregistrement !");
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
          onSubmit={(e) => {
            handleSubmitAdmin(e);
          }}
          className="LoginFrom shadow"
        >
          <div>
            <div>
              <div className="centerDiv mb-5">
                <img src="/Assets/aquamanage.svg" alt="logo" width={150} />
              </div>
              <h2 className="mb-3 text-center">Creer profile Admin</h2>
            </div>
            <div className="LoginPasswordInput">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Saisir l'adresse email"
                onChange={(e) => {
                  handleChangeAdminInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control mt-3"
                placeholder="Saisir le mot de passe"
                onChange={(e) => {
                  handleChangeAdminInfo(e);
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
                placeholder="Saisir le nom complet"
                onChange={(e) => {
                  handleChangeAdminInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type="text"
                name="role"
                className="form-control mt-3"
                placeholder="Saisir le role"
                onChange={(e) => {
                  handleChangeAdminInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type="text"
                name="company"
                className="form-control mt-3"
                placeholder="Saisir le nom de société"
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
          </div>
        </form>
      </div>
    </div>
  );
}

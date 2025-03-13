import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../Auth/ProtectedRoute";
import Menu from "./Menu";
import Main from "./Main";

export default function AddEmployee() {
  const { user } = useUser();

  const [isDisabled, setIsDisabled] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [Employee, setEmployee] = useState({
    fullName: "",
    email: "",
    password: "",
    function: "Employer",
    role: "",
    companyId: user.companyId,
  });
  const [showPassword, setShowPassword] = useState(false);


  function handleChangeEmployeeInfo(e) {
    setEmployee({ ...Employee, [e.target.name]: e.target.value });
  }

  function formTest() {
    if (
      !Employee.email
        .trim()
        .match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      toast.error("Le format de l'adresse Email est invalide!");
      return false;
    }
    if (!Employee.password.trim().match(/[A-Za-z0-9._%+-]{8,}/)) {
      toast.error("Le mot de passe doit contien 8 caracteres minimum!");
      return false;
    }
    if (!Employee.fullName.trim().match(/[A-Za-z]{3,}/)) {
      toast.error("Le nom d'utilisateur doit contien 3 caracteres minimum!");
      return false;
    }
    if (Employee.role === "") {
      toast.error("Choisir votre fonction!");
      return false;
    }
    return true;
  }

  async function handleSubmitEmployeeEmployer(e) {
    e.preventDefault();

    if (formTest()) {
      setSignupLoading(true);
      setIsDisabled(true);

      // adding Employee
      await axios
        .post(
          `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/addEmployee`,
          Employee,
          { withCredentials: true }
        )
        .then(async (res) => {
          
          if (res.data.isEmailexist) {
            setSignupLoading(false);
            setIsDisabled(false);
            toast.error("Cette adresse Email est déja utilisé!");
            return;
          }
          toast.success("Le profile a été creer");
          setTimeout(() => {
            window.location.reload()
          }, 2000);
        })
        .catch((err) => {
          setSignupLoading(false);
          setIsDisabled(false);
          toast.error(err.response.data.error);
        });
    }
  }

  return (
    <div className="d-flex h-100">
      <Toaster position="top-right" />
      <Menu />
      <Main>
        <div className="centerDiv h-100 ">
          <form
            method="post"
            onSubmit={(e) => handleSubmitEmployeeEmployer(e)}
            className="shadow p-5 pt-4 pb-4 rounded AddModForms"
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
              className="bg-warning"
            ></div>
            <h3 className="text-center mb-4">Ajouter un employé</h3>
            <div className="LoginPasswordInput">
              <input
                type="email"
                name="email"
                className="form-control mt-3"
                placeholder="Saisir l'adresse email de votre employé"
                onChange={(e) => {
                  handleChangeEmployeeInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control mt-3"
                placeholder="Saisir un mot de passe"
                onChange={(e) => {
                  handleChangeEmployeeInfo(e);
                }}
              />
              <img
                src="/Assets/show.png"
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
                placeholder="Saisir le nom de votre emplyé"
                onChange={(e) => {
                  handleChangeEmployeeInfo(e);
                }}
              />
            </div>
            <div className="LoginPasswordInput">
              <input
                type="text"
                name="role"
                className="form-control mt-3"
                placeholder="Saisir le role de votre employé"
                onChange={(e) => {
                  handleChangeEmployeeInfo(e);
                }}
              />
            </div>
            <div className="mt-4 d-flex gap-3">
              <button
                className="btn btn-warning fw-bold"
                disabled={isDisabled}
              >
                {signupLoading ? 'En cours de création ...' : "Créer"}
              </button>
              <a href="/employees" className="btn btn-danger fw-bold">
                Retour
              </a>
            </div>
          </form>
        </div>
      </Main>
    </div>
  );
}

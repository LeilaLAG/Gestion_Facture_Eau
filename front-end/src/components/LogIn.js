import axios from "axios";
import "../style/login.css";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActionLoading from "../costumComponents/ActionLoading";

export default function LogIn() {
  const [loginUser, setLoginUser] = useState({
    fullName: "",
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
        "http://localhost:8000/api/login",
        {
          fullName: loginUser.fullName,
          password: loginUser.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        navigate("/Home");
        setLoginLoading(false);
        setIsDisabled(false);
      })
      .catch((err) => {
        toast.error("Full name or password is invalid");
        setLoginLoading(false);
        setIsDisabled(false);
      });
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="LoginFormCOntainer h-100 d-flex justify-content-around">
        <div>
          <img src="Assets/loginImg.jpg" alt="" />
        </div>
        <form
          className="LoginFrom shadow"
          onSubmit={(e) => {
            handleSubmitLoginUser(e);
          }}
        >
          <div>
            <div className="d-flex justify-content-center align-items-center mb-5">
              <img src="Assets/waterLogo.png" alt="logo" width={40}/>
              <div className="d-flex flex-column">
                <h1 className="fw-bold m-0" style={{ fontSize: "30px" }}>G-F-E</h1>
                <span style={{fontSize : "12px"}}>Water bill management</span>
              </div>
            </div>
            <h1 className="mb-5 text-center">Log-In</h1>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Enter your full name"
              onChange={(e) => {
                handleChangeLoginUserInfo(e);
              }}
            />
            <div className="LoginPasswordInput">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control mt-3"
                placeholder="Enter your password"
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
            <button
              className="btn btn-dark w-100 mt-3 fw-bold"
              disabled={isDisabled}
            >
              {loginLoading ? <ActionLoading /> : "Log in"}
            </button>
            <hr/>
            <div className="text-center">
              <a className="text-dark" href="/Sign-up">Don't have a profile? Sign-up</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

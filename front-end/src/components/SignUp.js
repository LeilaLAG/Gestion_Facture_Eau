import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import "../style/signUp.css";
import "../style/customCompStyle.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import GetCompanies from "../hooks/GetCompanies";
// import FormErrorMsg from "../costumComponents/FormErrorMsg";

export default function SignUp() {
  const [progress, setProgress] = useState(0);
  const [signupFormOpacity, setSignupFormOpacity] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);

  const [company, setCompany] = useState("");
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    function: "",
    companyId: "",
  });

  const allCompanies = GetCompanies();

  const navigate = useNavigate()

  function handleSubmitCompany(e) {
    e.preventDefault();

    if (company === "" || company.length < 3) {
      toast.error(
        "Please enter a valid company name containing more than 2 caracters!"
      );
    } else if (
      allCompanies.find((companie) => companie.companyName === company) !==
      undefined
    ) {
      toast.error(
        "This comapny name already exists. Please enter a unique company name"
      );
    } else {
      axios
        .post("http://localhost:8000/api/addCompany", { companyName: company })
        .then((res) => {
          toast.success("Your company name is created");
          setProgress(1);
          setIsDisabled(false);
          setSignupFormOpacity(1);
        })
        .catch((err) =>
          toast.error(
            "Somthing went wrong! Please try again or reload the page"
          )
        );
    }
  }

  function handleChangeUserInfo(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmitUser(e) {
    e.preventDefault();

    if (user.fullName === "" || user.fullName.length < 3) {
      toast.error(
        "Please enter a valid name containing more than 2 caracters!"
      );
    } else if (
      !user.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    ) {
      toast.error("Please enter a valid email adresse!");
    } else if (!user.password.match("[A-Za-z0-9._%+-]{5,}")) {
      toast.error("Please enter a valid password with 5 caracters minimum!");
    } else if (user.function === "") {
      toast.error("Please choose your function!");
    } else {
      await axios
        .post("http://localhost:8000/api/addUser", {
          ...user,
          companyId: company,
          password : user.password
        })
        .then((res) => {
                toast.success("Your profile is created")
                setTimeout(() => {
                    navigate('/log-in')
                }, 3000);
            }
        )
        .catch((err) =>
          toast.error(
            "Somthing went wrong! Please try again or reload the page!"
          )
        );
    }
  }

  return (
    <div className="h-100 w-100 signUpContainer">
      <Toaster />
      <h1 className="fw-bold fw-1 mb-4">Sign-Up</h1>
      <div className="d-flex justify-content-center align-items-center w-100">
        <div className="d-flex justify-content-around w-100">
          <div className="signUpFormContainer">
            <div className="step">
              <p>1</p>
            </div>
            <form
              className="signUpForm shadow"
              onSubmit={(e) => {
                handleSubmitCompany(e);
              }}
            >
              <h4 className="text-center fw-bold">Company</h4>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="Enter company name"
                onChange={(e) => {
                  setProgress(0);
                  setIsDisabled(true);
                  setCompany(e.target.value);
                }}
              />
              {/* <FormErrorMsg msg="Enter a valid company name containing more than 2 caracters" coleur="red" width="200px" /> */}
              <button className="btn btn-dark w-100 mt-2 fw-bold">
                Create
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
              className="signUpForm shadow"
              onSubmit={(e) => handleSubmitUser(e)}
              style={{ opacity: signupFormOpacity }}
            >
              <h4 className="text-center fw-bold">User</h4>
              <input
                name="fullName"
                type="text"
                className="form-control mt-2"
                placeholder="Enter your full name"
                onChange={(e) => handleChangeUserInfo(e)}
              />
              <input
                name="email"
                type="email"
                className="form-control mt-2"
                placeholder="Enter your Email"
                onChange={(e) => handleChangeUserInfo(e)}
              />
              <input
                name="password"
                type="password"
                className="form-control mt-2"
                placeholder="Enter a password"
                onChange={(e) => handleChangeUserInfo(e)}
              />
              <select
                className="form-control mt-2"
                name="function"
                onChange={(e) => handleChangeUserInfo(e)}
              >
                <option>Choose function</option>
                <option value={"Admin"}>Admin</option>
                <option value={"user1"}>user1</option>
                <option value={"user2"}>user2</option>
              </select>
              <button
                className="btn btn-primary w-100 mt-2 fw-bold"
                disabled={isDisabled}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

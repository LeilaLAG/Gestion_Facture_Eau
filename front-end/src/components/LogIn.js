import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LogIn() {

    const [loginUser , setLoginUser] = useState({
        fullName : "",
        password : ""
    })

    const navigate = useNavigate()

    function handleChangeLoginUserInfo(e){
        setLoginUser({...loginUser , [e.target.name] : e.target.value})
    }
    
    async function handleSubmitLoginUser(e){
        e.preventDefault()

        await axios.post("http://localhost:8000/api/login" , {
            fullName: loginUser.fullName,
            password: loginUser.password,
          } , { withCredentials: true })
        .then(res=>navigate('/Home'))
        .catch(err=>toast.error("Full name or password is invalid"))
    }

  return (
    <div className="h-100 d-flex align-items-center justify-content-around">
        <Toaster/>
        <div>
            <h1 className="fw-bold" style={{fontSize : "50px"}}>Welcome To GFE</h1>
            <p style={{marginLeft : "10px"}}>Water bills management</p>
        </div>
      <form
        className="signUpForm shadow"
        style={{width : "300px"}}
        onSubmit={(e) => {
          handleSubmitLoginUser(e);
        }}
      >
        <h1 className="fw-bold fw-1 mb-4 text-center">Log-In</h1>
        <input
          type="text"
          name="fullName"
          className="form-control"
          placeholder="Enter your full name"
          onChange={(e) => {
            handleChangeLoginUserInfo(e)
          }}
        />
        <input
          type="password"
          name="password"
          className="form-control mt-2"
          placeholder="Enter your password"
          onChange={(e) => {
            handleChangeLoginUserInfo(e)
          }}
        />
        {/* <FormErrorMsg msg="Enter a valid company name containing more than 2 caracters" coleur="red" width="200px" /> */}
        <button className="btn btn-dark w-100 mt-2 fw-bold">LogIn</button>
      </form>
    </div>
  );
}

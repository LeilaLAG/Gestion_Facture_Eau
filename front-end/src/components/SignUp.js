import React, { useState } from "react";
import "../style/signUp.css";

export default function SignUp() {

    const [progress , setProgress] = useState(0);
    const [isDisabled , setIsDisabled] = useState(true);

    function handleProgressBar(e){
        e.preventDefault()
        setProgress(1)
    }

  return (
    <div className="h-100 w-100 signUpContainer">
        <h1 className="fw-bold fw-1 mb-4">SIGN UP</h1>
        <div className="d-flex justify-content-center align-items-center w-100">
            <div className="d-flex justify-content-around w-100">
                <div className="signUpFormContainer">
                    <div className="step">
                        <p>1</p>
                    </div>
                    <form className="signUpForm shadow" onSubmit={e=>{handleProgressBar(e) ; setIsDisabled(false)}}>
                        <h4 className="text-center fw-bold">Company</h4>
                        <input type="text" className="form-control" placeholder="Enter company name" onChange={e=>{setProgress(0) ; setIsDisabled(true)}} />
                        <button className="btn btn-dark w-100 mt-2 fw-bold">Create</button>
                    </form>
                </div>
                <progress className="signUpFromProgressBar" value={progress}></progress>
                <div className="signUpFormContainer">
                    <div className="step">
                        <p>2</p>
                    </div>
                    <form className="signUpForm shadow" style={{opacity : 1}}>
                        <h4 className="text-center fw-bold">User</h4>
                        <input type="text" className="form-control mt-2" placeholder="Enter your full name"/>
                        <input type="email" className="form-control mt-2" placeholder="Enter your Email"/>
                        <input type="password" className="form-control mt-2" placeholder="Enter a password"/>
                        <select className="form-control mt-2">
                            <option>Choose function</option>
                            <option>Admin</option>
                            <option>user1</option>
                            <option>user2</option>
                        </select>
                        <button className="btn btn-primary w-100 mt-2 fw-bold" disabled={isDisabled}>Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}

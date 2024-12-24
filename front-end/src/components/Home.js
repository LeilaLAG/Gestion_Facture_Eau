import axios from "axios";
import React from "react";

export default function Home() {
  return (
    <form
      onSubmit={() => {
        axios
          .post(
            "http://localhost:8000/api/logout",
            {},
            { withCredentials: true }
          )
          .then((res) => {
            console.log("Logout successful");
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      }}
    >
      <button type="submit" className="btn btn-danger fw-bold">Logout</button>
    </form>
  );
}

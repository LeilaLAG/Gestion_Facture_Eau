import React from "react";
import "../style/acceueil.css";
export default function Accueil() {
  return (
    <section className="hero" style={{ flexDirection: "column" }}>
      <div className="content" style={{ flexDirection: "column" }}>
        <img
          src="/Assets/aquamanage.svg"
          className=""
          alt="aquamanage"
          width={150}
        />
        <hr width={100} />
        <h1> Bienvenue sur Aqua Manage </h1>
        {/* <p>AQUA MANAGE, SIMPLE ET FACILE</p> */}
        <a href="/log-in" className="bg_blue_button fw-bold mt-4">
          Authentifier
        </a>
      </div>
    </section>
  );
}

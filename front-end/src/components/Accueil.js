import React from "react";
import "../style/acceueil.css";
export default function Accueil() {
  return (
    <section className="hero" style={{ flexDirection: "column" }}>
      <div className="content" style={{ flexDirection: "column" }}>
        <h1> Bienvenue </h1>
        <p>BRIGHT FUTURES BEGIN WITH CLEAN WATER</p>
        <a href="/log-in" className="bg_blue_button">
          Authentifier
        </a>
      </div>
    </section>
  );
}

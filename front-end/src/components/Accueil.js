import React from 'react'
import '../style/acceueil.css'
export default function Accueil() {
  return (
    <section className='hero' style={{ flexDirection: "column" }}>
      <div className='content'style={{ flexDirection: "column" }}>
     <h1> welcome </h1>
     <hr></hr>
      <p>
     BRIGHT FUTURES BEGIN WITH CLEAN WATER    .
      </p>
      <a href='http://localhost:3000/log-in'>sign in </a>
     </div>
    </section>
  )
}

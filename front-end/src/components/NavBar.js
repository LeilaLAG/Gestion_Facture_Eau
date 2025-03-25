import React from 'react';
import { Link } from 'react-router-dom';
import "../style/./NavBar.css";


const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/log-in">Home</Link>
      </div>
      <ul className="navbar-links">
           <li><Link to="/about">About</Link></li>
          <li><Link to="/application-Contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;

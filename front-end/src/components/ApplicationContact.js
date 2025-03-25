import React from 'react';
import "../style/ApplicationContact.css";

const ApplicationContact = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-description">If you have any questions or need support, please reach out to us:</p>
      <ul className="contact-list">
        <li className="contact-item">
          <i className="fas fa-envelope"></i> 
          Email: <a href="mailto:contact@m5tech.ma">contact@m5tech.ma</a>
        </li>
        <li className="contact-item">
          <i className="fas fa-phone"></i> 
          Phone: <a href="tel:+212 645-350405">+212 645-350405</a>
        </li>
        <li className="contact-item">
          <i className="fas fa-map-marker-alt"></i> 
          AFAQ 1 NO 486 SAADA MARRAKESH MOROCCO
        </li>
      </ul>
    </div>
  );
};

export default ApplicationContact;

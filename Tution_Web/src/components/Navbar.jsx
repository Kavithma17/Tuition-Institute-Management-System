import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        
        <div className="navbar-logo">
          <Link to="/">Excellance A/L</Link>
        </div>

      
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/classes" className="navbar-link">Classes</Link>
          <Link to="/lecturers" className="navbar-link">Our Lecturers</Link>
          <Link to="/about" className="navbar-link">About</Link>
         
           
        </div>

        
        <div className="navbar-button">
          <Link to="/login" className="get-started-btn">Student Login</Link>
        </div>

       
        <div className="navbar-hamburger" onClick={toggleMenu}>
          <span className="hamburger-icon">☰</span>
        </div>
      </div>

     
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
          <Link to="/classes" className="navbar-link" onClick={closeMenu}>Classes</Link>
          <Link to="/lecturers" className="navbar-link" onClick={closeMenu}>Our Lecturers</Link>
          <Link to="/about" className="navbar-link" onClick={closeMenu}>About</Link>
          <Link to="/login" className="get-started-btn" onClick={closeMenu}>Login</Link>
          
        </div>
      )}
    </nav>
  );
}

export default Navbar;

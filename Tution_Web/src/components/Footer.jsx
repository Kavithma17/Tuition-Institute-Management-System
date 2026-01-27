import React from 'react'
import "./Footer.css"


const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-bg">
          <div className="footer-shapes">
            <div className="footer-shape shape-1"></div>
            <div className="footer-shape shape-2"></div>
            <div className="footer-shape shape-3"></div>
          </div>
        </div>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">🎓</div>
                <h3>Excellence A/L Institute</h3>
              </div>
              <p>
                Transforming dreams into reality through quality education and unwavering commitment to student success.
              </p>
             
            </div>
            <div className="footer-section">
              <h4>A/L Subjects</h4>
              <ul>
                <li>Mathematics</li>
                <li>Physics</li>
                <li>Biology</li>
                <li>Combined Mathematics</li>
                <li>ICT</li>
                
              </ul>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/classes">Classes</a>
                </li>
                <li>
                  <a href="/lecturers">Lecturers</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="footer-contact">
                <p>📍 No. 123, Galle Road, Colombo 03</p>
                <p>📞 +94 11 234 5678</p>
                <p>✉️ info@excellenceal.lk</p>
                
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <p>&copy; 2024 Excellence A/L Institute. All rights reserved. | Crafted with ❤️ for student success</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Lecturers.css";
import Footer from "../components/Footer";
import { initScrollReveal } from "../hooks/scrollReveal";

const Lecturers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initScrollReveal();
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/teachers")
        setLecturers(res.data);
      } catch (err) {
        setError("Failed to fetch lecturers.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  // Filter lecturers by name based on search term
  const filteredLecturers = lecturers.filter((lecturer) =>
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lecturers-page">
      {/* Header */}
      <header className="lectures-header reveal reveal-up">
        <div className="container">
          <div className="header-content1">
            <h1 className="page-title1">
              Our <span className="highlight1 reveal reveal-up">Talented Lecturers</span>
            </h1>
            <p className="page-description1 reveal reveal-up">
              Meet all our dedicated teachers who are here to guide you.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content reveal reveal-up">
        <div className="container">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search lecturer by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Lecturers Grid */}
          <section className="lecturers-section reveal reveal-up">
            {loading && <p>Loading lecturers...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && (
              <div className="lecturers-grid">
                {filteredLecturers.length === 0 ? (
                  <p>No lecturers found.</p>
                ) : (
                  filteredLecturers.map((lecturer) => (
                    <div key={lecturer.id} className="lecturer-card ">
                      <div className="lecturer-image-container">
                        <img
                          src={lecturer.photoUrl || "/placeholder.svg"}
                          alt={lecturer.name}
                          className="lecturer-photo"
                        />
                      </div>
                      <div className="lecturer-info">
                        <h3 className="lecturer-name">{lecturer.name}</h3>
                        <p className="lecturer-title1">{lecturer.qualification}</p>
                        <p className="lecturer-title2">{lecturer.subject}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Lecturers;

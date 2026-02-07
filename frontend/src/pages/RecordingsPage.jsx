import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecordingsPage.css";
import Footer from "../components/Footer";

const RecordingsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [liveclasses, setLiveclasses] = useState([]);
  const [tutes, setTutes] = useState([]);
  const [activeTab, setActiveTab] = useState("recordings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const courseRes = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseRes.data);

        const recRes = await axios.get(`/api/recordings/course/${courseId}`);
        setRecordings(recRes.data);

        const liveRes = await axios.get(`/api/liveclasses/course/${courseId}`);
        setLiveclasses(liveRes.data);

        const tuteRes = await axios.get(`/api/tutes/course/${courseId}`);
        setTutes(tuteRes.data);

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load course content.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [courseId]);

  if (loading) {
    return (
      <div className="recordings-page recordings-page--state">
        <p className="loading">Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recordings-page recordings-page--state">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="recordings-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {course && (
          <div className="course-info">
            <h1>{course.classname}</h1>
            <p>
              Teacher: {course.teachername} | Month: {course.month}
            </p>
          </div>
        )}

        <div className="recordings-layout">
          {/* SIDEBAR */}
          <aside className="recordings-sidebar">
            <h3 className="sidebar-title">Course Content</h3>

            <button
              className={`sidebar-item ${
                activeTab === "recordings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("recordings")}
            >
              🎥 Recordings
            </button>

            <button
              className={`sidebar-item ${
                activeTab === "live" ? "active" : ""
              }`}
              onClick={() => setActiveTab("live")}
            >
              📡 Live Classes
            </button>

            <button
              className={`sidebar-item ${
                activeTab === "tutes" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tutes")}
            >
              📘 Tutes
            </button>
          </aside>

          {/* CONTENT */}
          <main className="recordings-main">
            {activeTab === "recordings" && (
              <>
                <h2 className="section-title">Recordings</h2>
                {recordings.length === 0 ? (
                  <p className="muted">No recordings available.</p>
                ) : (
                  <div className="recordings-grid">
                    {recordings.map((rec) => (
                      <div key={rec.id} className="content-card">
                        <h3>{rec.title}</h3>
                        {rec.description && <p>{rec.description}</p>}
                        <a
                          href={rec.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="action-btn"
                        >
                          Watch
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "live" && (
              <>
                <h2 className="section-title">Live Classes</h2>
                {liveclasses.length === 0 ? (
                  <p className="muted">No live classes scheduled.</p>
                ) : (
                  <div className="recordings-grid">
                    {liveclasses.map((live) => (
                      <div key={live.id} className="content-card">
                        <h3>{live.title}</h3>
                        <p>{live.dateTime}</p>
                        <a
                          href={live.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="action-btn"
                        >
                          Join
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "tutes" && (
              <>
                <h2 className="section-title">Tutes</h2>
                {tutes.length === 0 ? (
                  <p className="muted">No tutes uploaded.</p>
                ) : (
                  <div className="recordings-grid">
                    {tutes.map((t) => (
                      <div key={t.id} className="content-card">
                        <h3>{t.title}</h3>
                        <a
                          href={t.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="action-btn"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RecordingsPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecordingsPage.css";
import Footer from "../components/Footer";

const RecordingsPage = () => {
  const { courseId } = useParams(); // Get course ID from URL
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [liveclasses, setLiveclasses] = useState([]);
  const [tutes, setTutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        
        const courseRes = await axios.get(`http://localhost:8088/courses/${courseId}`);
        setCourse(courseRes.data);

        
        const recRes = await axios.get(`http://localhost:8088/recordings/course/${courseId}`);
        setRecordings(recRes.data);

        // Fetch live classes
        const liveRes = await axios.get(`http://localhost:8088/liveclasses/course/${courseId}`);
        setLiveclasses(liveRes.data);

        // Fetch tutes
        const tutesRes = await axios.get(`http://localhost:8088/tutes/course/${courseId}`);
        setTutes(tutesRes.data);

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch course content.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [courseId]);

  if (loading) return <p className="loading">Loading course content...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
  <>
    <div className="recordings-page-container2">
      <button className="back-btn2" onClick={() => navigate(-1)}>
        &larr; Back to Dashboard
      </button>

      {course && (
        <div className="course-header2">
          <h1 className="course-title2">{course.classname}</h1>
          <p className="course-meta2">
            Teacher: {course.teachername} | Price: {course.price} | Month: {course.month}
          </p>
        </div>
      )}

      {/* Recordings Section */}
      <section className="section-recordings2">
        <h2 className="section-title2">Recordings</h2>
        {recordings.length === 0 ? (
          <p className="empty-message">No recordings available.</p>
        ) : (
          <ul className="recordings-grid2">
            {recordings.map((rec) => (
              <li key={rec.id} className="recording-card rec-card2">
                <div className="rec-content2">
                  <h3 className="rec-title2">{rec.title}</h3>
                  {rec.description && <p className="rec-desc2">{rec.description}</p>}
                </div>
                <a href={rec.videoUrl} target="_blank" rel="noopener noreferrer" className="enroll-btn1">
                  Watch
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Live Classes Section */}
      <section className="section-liveclasses2">
        <h2 className="section-title2">Live Classes</h2>
        {liveclasses.length === 0 ? (
          <p className="empty-message">No live classes scheduled.</p>
        ) : (
          <ul className="recordings-grid2">
            {liveclasses.map((live) => (
              <li key={live.id} className="recording-card live-card2">
                <div className="rec-content2">
                  <h3 className="rec-title2">{live.title}</h3>
                  <p className="rec-desc2">Scheduled at: {live.dateTime}</p>
                </div>
                <a href={live.meetingUrl} target="_blank" rel="noopener noreferrer" className="enroll-btn1">
                  Join
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tutes Section */}
      <section className="section-tutes2">
        <h2 className="section-title2">Tutes</h2>
        {tutes.length === 0 ? (
          <p className="empty-message">No tutes uploaded.</p>
        ) : (
          <ul className="recordings-grid2">
            {tutes.map((tute) => (
              <li key={tute.id} className="recording-card tute-card2">
                <div className="rec-content2">
                  <h3 className="rec-title2">{tute.title}</h3>
                </div>
                <a href={tute.fileUrl} target="_blank" rel="noopener noreferrer" className="enroll-btn1">
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>

    <Footer />
  </>
);
}

export default RecordingsPage;

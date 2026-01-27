import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./Student_dash.css";

const StudentDash = () => {
  const navigate = useNavigate();
  const storedName = localStorage.getItem("username") || "Student";
  const [username, setUsername] = useState(storedName);
  const [courses, setCourses] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Fetch enrolled courses
    axios.get(`http://localhost:8088/enrollments/student/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));

    // ✅ Fetch AI motivational message
    axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gemini-1",
        messages: [{ role: "user", content: `Give a motivational quote for a student named ${username}` }],
      },
      { headers: { Authorization: `Bearer YOUR_GEMINI_API_KEY`, "Content-Type": "application/json" } }
    )
      .then(res => setAiMessage(res.data.choices[0].message.content))
      .catch(() => setAiMessage("Keep learning and stay motivated!"));

    // ✅ Fetch random background
    axios.get("https://api.unsplash.com/photos/random?query=study&client_id=YOUR_UNSPLASH_KEY")
      .then(res => setBgImage(res.data.urls.regular))
      .catch(() => setBgImage(""));

    // ✅ Fetch events
   
   

  }, [token, navigate, userId, username]);

  const eventsForSelectedDay = events.filter(
    (e) => new Date(e.date).toDateString() === date.toDateString()
  );

  return (
    <div className="student-dash-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="student-dash-header">
        <h2 className="student-dash-welcome">Welcome, {username} 👋</h2>
        <p className="student-dash-intro">{aiMessage}</p>
      </div>

      {/* ✅ Enrolled Courses */}
      <h3 className="student-dash-courses-title">Your Enrolled Courses:</h3>
      {courses.length === 0 ? (
        <p className="student-dash-no-courses">You are not enrolled in any courses yet.</p>
      ) : (
        <ul className="student-dash-courses-list">
          {courses.map((enrollment, index) => (
            <motion.li
              key={index}
              className="student-dash-course-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="course-name">{enrollment.course.name}</span>
              <span className="student-dash-enroll-month">
                Enrolled:{" "}
                {new Date(enrollment.enrolledAt).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="student-dash-progress-bar">
                <div
                  className="student-dash-progress"
                  style={{ width: `${enrollment.progress || 0}%` }}
                ></div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* ✅ View All Courses Button */}
      <motion.button
        className="student-dash-view-courses-btn"
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View All Courses
      </motion.button>

      {/* ✅ Calendar */}
      <h3 className="student-dash-calendar-title">My Calendar</h3>
      <Calendar onChange={setDate} value={date} className="student-dash-calendar" />
      {eventsForSelectedDay.length === 0 ? (
        <p className="student-dash-no-events">No events for this day.</p>
      ) : (
        <ul className="student-dash-events-list">
          {eventsForSelectedDay.map((e, idx) => (
            <li key={idx} className="student-dash-event-item">
              {e.title}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Logout */}
      <button
        className="student-dash-logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDash;

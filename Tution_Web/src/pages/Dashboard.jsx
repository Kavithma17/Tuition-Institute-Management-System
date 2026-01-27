import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username"); // make sure you save this on login

  // Fetch all courses and enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8088/courses");
        setCourses(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch courses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:8088/enrollments?username=${username}`);
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err.response || err);
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, [username]);

  // Enroll a student in a course
  const enrollCourse = async (courseId) => {
    if (!username) {
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:8088/enrollments", {
        courseId,
        username
      });
      alert("Enrolled successfully!");

      // Refresh enrolled courses immediately
      const res = await axios.get(`http://localhost:8088/enrollments?username=${username}`);
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to enroll. You may already be enrolled in this course.");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.classname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryCourses = (category) =>
    filteredCourses.filter((course) =>
      course.classname?.toLowerCase().includes(category.toLowerCase())
    );

  const renderCourseCards = (courseList) =>
    courseList.length === 0 ? (
      <p>No classes found in this category.</p>
    ) : (
      courseList.map((classItem) => (
        <div key={classItem.id} className="class-card">
          <div className="card-image">
            <img
              src={classItem.photourl || "/placeholder.svg"}
              alt={classItem.classname}
              loading="lazy"
            />
          </div>
          <div className="card-content1">
            <h3 className="card-title1">{classItem.classname}</h3>
            <p className="card-month1">{classItem.month}</p>
            <p className="card-price1">Price: {classItem.price}</p>
            <p className="card-teacher1">Teacher: {classItem.teachername}</p>
            <button
              className="enroll-btn1"
              onClick={() => enrollCourse(classItem.id)}
            >
              ENROLL NOW
            </button>
          </div>
        </div>
      ))
    );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {username}</h1>
        <p>Find your ideal classes and get ready to excel!</p>

        <input
          type="search"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </header>

      <main className="dashboard-main">
        {loading && <p>Loading classes...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Enrolled Courses */}
        <section className="enrolled-section">
          <h2>My Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <p>You haven't enrolled in any courses yet.</p>
          ) : (
            <ul>
              {enrolledCourses.map((enrollment) => (
                <li key={enrollment.id}>
                  {enrollment.course.classname} - Enrolled:{" "}
                  {new Date(enrollment.enrolledAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Available Courses */}
        {!loading && !error && (
          <div className="classes-list">
            {["Mathematics", "Physics", "Chemistry", "Biology", "ICT"].map(
              (subject) => (
                <section key={subject} className="subject-section">
                  <h2 className="subject-title">{subject}</h2>
                  <div className="classes-grid">
                    {renderCourseCards(getCategoryCourses(subject))}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

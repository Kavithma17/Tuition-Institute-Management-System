import "./Classes.css";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8088/courses");
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch courses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

 
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
            
            <p className="card-price1">Price: {classItem.price}</p>
            <p className="card-teacher1">{classItem.teachername}</p>
            
          </div>
        </div>
      ))
    );

  return (
    <div className="classes">
      {/* Header */}
      <header className="classes-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              Our <span className="highlight1">A/L Classes</span>
            </h1>
            <p className="page-description">
              Choose from our comprehensive range of A/L classes designed to help you achieve excellence in your
              examinations
            </p>
           
          </div>
        </div>
      </header>

      <div className="classes-page">
        <main className="main-content">
          <div className="container">
            {["Mathematics", "Physics", "Chemistry", "Biology", "ICT"].map((subject) => (
              <section key={subject} className="subject-section">
                <h2 className="subject-title">{subject}</h2>
                <div className="classes-grid">{renderCourseCards(getCategoryCourses(subject))}</div>
              </section>
            ))}
          </div>
        </main>
        
       
        
       
     

      </div>
      <Footer />


     
    </div>
  );
};

export default Classes;

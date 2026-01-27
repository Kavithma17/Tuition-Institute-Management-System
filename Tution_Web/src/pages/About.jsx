import React from "react";
import "./About.css";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="about">
    
   
       {/* Header */}
      <header className="lectures-header2">
        <div className="container">
          <div className="header-content2">
            <h1 className="page-title2">
              About <span className="highlight2">Our Institute</span>
            </h1>
            <p className="page-description2">
              Empowering A/L students to achieve their academic dreams through 
              dedicated teaching, cutting-edge facilities, and unwavering support — 
              shaping futures with passion and care.
            </p>
          </div>
        </div>
      </header>

      {/* About Institute Story */}
      <section className="institute-story">
  <div className="container story-grid">
    <div className="story-text-content">
       
            <h2 className="section-title3">
              Who <span className="highlight3">We Are</span>
            </h2>
     
      <p className="story-text">
        Excellence Tuition Institute was founded with a simple vision: to provide 
        high-quality, accessible A/L education to students from all backgrounds. Over the past 
        20+ years, we have grown into one of Sri Lanka’s most trusted names in education, known 
        for our student-centric approach, dedicated lecturers, and impressive results.
      </p>
      <p className="story-text">
        From state-of-the-art classrooms to personalized mentoring sessions, everything we do 
        revolves around ensuring each student receives the guidance and support they need to 
        excel — both academically and personally. We take pride in our holistic approach that 
        balances rigorous academics with motivation and mentorship.
      </p>
    </div>
    <div className="story-image">
      <img src="src/assets/c5.jpg" alt="Our Institute" />
    </div>
  </div>
</section>


      {/* Vision & Mission */}
      <section className="vision-mission">
        <div className="container">
           <div className="section-badge3">About Us</div>
            <h2 className="section-title3">
              Our Vision <span className="highlight3">& Mission</span>
            </h2>
          
          <div className="vision-mission-content">
            <div className="vision">
              <h3>Our Vision</h3>
              <p>
                To become Sri Lanka’s leading educational institution, inspiring thousands of 
                young minds to reach their fullest potential through excellence in teaching and mentorship.
              </p>
            </div>
            <div className="mission">
              <h3>Our Mission</h3>
              <p>
                To deliver top-tier A/L education by combining experienced lecturers, modern 
                learning tools, and a supportive culture that prepares students to thrive 
                in university and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ or Ask Any Questions */}
      <section className="faq">
        <div className="container">
          
            <h2 className="section-title3">
              Have Any <span className="highlight3"> Questions?</span>
            </h2>
         
          <div className="faq-content">
            <div className="faq-item">
              <h4>What makes your institute special?</h4>
              <p>
                Our focus on individual student growth, dedicated lectures with over a decade 
                of experience, and small group mentoring sessions help students excel with confidence.
              </p>
            </div>
            <div className="faq-item">
              <h4>How do I get started?</h4>
              <p>
                Simply call us or visit our office to speak to a counselor. We'll guide you 
                through our enrollment process and help select the best classes for you.
              </p>
            </div>
            <div className="faq-item">
              <h4>Can you guarantee results?</h4>
              <p>
                While ultimate success depends on each student’s dedication, our 
                proven teaching methods and personalized attention have consistently 
                helped students achieve district and island ranks.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default About;

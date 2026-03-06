import "./Home.css"
import Footer from "../components/Footer"
import { useEffect } from "react"
import { initScrollReveal } from "../hooks/scrollReveal";
import { initCountUp } from "../hooks/scrollReveal";



const Home = () => {
  useEffect(() => {
    initScrollReveal();
    initCountUp();
  }, []);
  return (
    <div className="home">


      {/* Hero Section */}
      <section id="home" className="hero reveal">
  <div className="container">
    <div className="hero-content">
      <div className="hero-text reveal reveal-up">

        <div className="hero-badge reveal delay-1">
          <span>🏆 #1 A/L Institute in Sri Lanka</span>
        </div>

        <h1 className="hero-title reveal delay-2">
          Master Your
          <span className="gradient-text"> A/L Dreams</span>
          <br />
          <span className="typing-text">Achieve Excellence</span>
        </h1>

        <div className="hero-stats">

  <div className="stat-card reveal delay-3">
    <div className="stat-icon">🏛️</div>
    <div className="stat-content">
      <span className="stat-number count-up" data-count="850">0</span>
      <span className="stat-label">University Selections</span>
    </div>
  </div>


  <div className="stat-card reveal delay-3">
    <div className="stat-icon">⭐</div>
    <div className="stat-content">
      <span className="stat-number count-up" data-count="15">0</span>
      <span className="stat-label">Years Excellence</span>
    </div>
  </div>

</div>


      </div>
    </div>
  </div>
</section>


      {/* About Section */}
<section id="about" className="about reveal">
  <div className="container">

    {/* Section Header */}
    <div className="section-header reveal delay-1">
      <div className="section-badge">About Excellence</div>
      <h2 className="section-title">
        Crafting <span className="highlight">Success Stories</span> Since 2008
      </h2>
      <p className="section-description">
        We don't just teach subjects – we build futures, create opportunities, and turn dreams into reality
      </p>
    </div>

    <div className="about-content">

      {/* LEFT: Text Content */}
      <div className="about-text reveal reveal-left delay-2">
        <div className="text-content">
          <h3>Your Gateway to University Success</h3>
          <p>
            We specialize in Advanced Level education with a revolutionary approach that combines traditional
            excellence with modern innovation. Our expert lecturers and cutting-edge teaching methodologies have
            transformed thousands of students into university scholars.
          </p>
        </div>

        {/* Achievements */}
        <div className="achievements-grid">
          <div className="achievement-card reveal delay-3">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-content">
              <h4>Island Rank Holders</h4>
              <p>25+ students achieved top island rankings</p>
            </div>
          </div>

          <div className="achievement-card reveal delay-4">
            <div className="achievement-icon">🎓</div>
            <div className="achievement-content">
              <h4>University Success</h4>
              <p>95% university selection rate</p>
            </div>
          </div>

          <div className="achievement-card reveal delay-5">
            <div className="achievement-icon">👨‍🏫</div>
            <div className="achievement-content">
              <h4>Expert Staff</h4>
              <p>PhD qualified lecturers</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Images */}
      <div className="about-images reveal reveal-right delay-3">
        <img src="/assets/about1.jpg" alt="Success Story 1" />
        <img src="/assets/about2.jpg" alt="Success Story 2" />
      </div>

    </div>
  </div>
</section>



      {/* Subjects Section */}
<section id="subjects" className="subjects reveal">
  <div className="container">

    {/* Section Header */}
    <div className="section-header reveal delay-1">
      <div className="section-badge">Our Expertise</div>
      <h2 className="section-title">
        Master Every <span className="highlight">A/L Subject</span>
      </h2>
      <p className="section-description">
        Comprehensive coaching for all A/L subjects with personalized attention and proven results
      </p>
    </div>

    {/* Subjects Grid */}
    <div className="subjects-grid">

      <div className="subject-card mathematics reveal delay-2">
        <div className="card-header">
          <div className="subject-icon">∑</div>
          <div className="subject-badge">Most Popular</div>
        </div>
        <div className="card-content">
          <h3>Mathematics</h3>
          <p>Master pure mathematics with our comprehensive approach covering all advanced topics</p>
          <div className="card-footer">
            <a href="/classes">
              <button className="btn-subject">Join Class</button>
            </a>
          </div>
        </div>
        <div className="card-glow-effect"></div>
      </div>

      <div className="subject-card physics reveal delay-3">
        <div className="card-header">
          <div className="subject-icon">⚛️</div>
          <div className="subject-badge">High Demand</div>
        </div>
        <div className="card-content">
          <h3>Physics</h3>
          <p>Explore the universe of physics with hands-on experiments and theoretical mastery</p>
          <div className="card-footer">
            <a href="/classes">
              <button className="btn-subject">Join Class</button>
            </a>
          </div>
        </div>
        <div className="card-glow-effect"></div>
      </div>

      <div className="subject-card chemistry reveal delay-4">
        <div className="card-header">
          <div className="subject-icon">🧪</div>
          <div className="subject-badge">Lab Included</div>
        </div>
        <div className="card-content">
          <h3>Chemistry</h3>
          <p>Dive deep into chemical reactions and molecular structures with practical sessions</p>
          <div className="card-footer">
            <a href="/classes">
              <button className="btn-subject">Join Class</button>
            </a>
          </div>
        </div>
        <div className="card-glow-effect"></div>
      </div>

      <div className="subject-card biology reveal delay-5">
        <div className="card-header">
          <div className="subject-icon">🧬</div>
          <div className="subject-badge">Medical Stream</div>
        </div>
        <div className="card-content">
          <h3>Biology</h3>
          <p>Understand life sciences with comprehensive coverage of all biological concepts</p>
          <div className="card-footer">
            <a href="/classes">
              <button className="btn-subject">Join Class</button>
            </a>
          </div>
        </div>
        <div className="card-glow-effect"></div>
      </div>

      <div className="subject-card combined-maths reveal delay-6">
        <div className="card-header">
          <div className="subject-icon">📐</div>
          <div className="subject-badge">Engineering</div>
        </div>
        <div className="card-content">
          <h3>Combined Mathematics</h3>
          <p>Advanced mathematical concepts for engineering and technology aspirants</p>
          <div className="card-footer">
            <a href="/classes">
              <button className="btn-subject">Join Class</button>
            </a>
          </div>
        </div>
        <div className="card-glow-effect"></div>
      </div>

      <div className="subject-card ict reveal delay-7">
        <div className="card-header">
          <div className="subject-icon">💻</div>
          <div className="subject-badge">Future Ready</div>
        </div>
        <div className="card-content">
          <h3>ICT</h3>
          <p>Master information technology with programming and system design expertise</p>
          <div className="card-footer">
            <a href="/classes">
              <button className="btn-subject">Join Class</button>
            </a>
          </div>
        </div>
        <div className="card-glow-effect"></div>
      </div>

    </div>
  </div>
</section>


      
{/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
     {/* Results Section */}
<section id="results" className="results reveal">
  <div className="container">

    {/* Header */}
    <div className="section-header reveal delay-1">
      <div className="section-badge">Our Pride</div>
      <h2 className="section-title">
        Outstanding <span className="highlight">A/L Results</span>
      </h2>
      <p className="section-description">
        Celebrating the success of our brilliant students who achieved their dreams
      </p>
    </div>

    <div className="results-content">

      {/* Result Cards */}
      <div className="results-showcase reveal delay-2">
        <div className="results-year">
          <h3>2023 A/L Results</h3>

          <div className="results-grid">
            <div className="result-card reveal delay-3">
              <div className="result-icon">🎯</div>
              <div className="result-number count-up" data-count="98.5">0</div>
              <div className="result-label">Pass Rate</div>
              <div className="result-glow"></div>
            </div>

            <div className="result-card reveal delay-4">
              <div className="result-icon">🏛️</div>
              <div className="result-number count-up" data-count="156">0</div>
              <div className="result-label">University Selections</div>
              <div className="result-glow"></div>
            </div>

            <div className="result-card reveal delay-5">
              <div className="result-icon">👑</div>
              <div className="result-number count-up" data-count="8">0</div>
              <div className="result-label">Island Ranks</div>
              <div className="result-glow"></div>
            </div>

            <div className="result-card reveal delay-6">
              <div className="result-icon">🏅</div>
              <div className="result-number count-up" data-count="45">0</div>
              <div className="result-label">District Ranks</div>
              <div className="result-glow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section reveal delay-3">
        <h3>Success Stories</h3>

        <div className="testimonials-container">
          <div className="testimonial-card reveal reveal-left delay-4">
            <div className="testimonial-header">
              <div className="student-photo">
                <img src="/assets/g1.jpg" alt="Kavindi Perera" />
                <div className="photo-ring"></div>
              </div>
              <div className="student-details">
                <strong>Kavindi Perera</strong>
                <span>Medicine - University of Colombo</span>
                <div className="achievement-badge">Island Rank 12</div>
              </div>
            </div>
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>
                Excellence A/L Institute transformed my academic journey. With their guidance, I achieved 3 A's
                and secured admission to Faculty of Medicine, University of Colombo!
              </p>
            </div>
          </div>

          <div className="testimonial-card reveal reveal-left delay-5">
            <div className="testimonial-header">
              <div className="student-photo">
                <img src="/assets/b1.jpg" alt="Ravindu Silva" />
                <div className="photo-ring"></div>
              </div>
              <div className="student-details">
                <strong>Ravindu Silva</strong>
                <span>Engineering - University of Moratuwa</span>
                <div className="achievement-badge">Island Rank 5</div>
              </div>
            </div>
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>
                The lecturers here are phenomenal! I achieved island 5th rank in Combined Mathematics and got
                selected to Faculty of Engineering.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


      {/* Photo Gallery Section */}
      <section className="gallery-section reveal">
  <div className="container">

    <div className="section-header reveal delay-1">
      <div className="section-badge">Our Institute</div>
      <h2 className="section-title">
        Experience Our <span className="highlight">Learning Environment</span>
      </h2>
      <p className="section-description">
        Take a virtual tour of our state-of-the-art facilities
      </p>
    </div>

    <div className="photo-gallery">
      <div className="gallery-row row-1">
        <div className="photo-item large-photo reveal delay-2">
          <img src="/assets/f.jpg" alt="Main Campus" />
          <div className="photo-overlay">
            <h3>Main Building</h3>
            <p>Modern facilities with latest technology</p>
          </div>
        </div>

        <div className="photo-column">
          <div className="photo-item reveal delay-3">
            <img src="/assets/f2.jpg" alt="Physics Lab" />
            <div className="photo-overlay"><h4>Physics Lab</h4></div>
          </div>

          <div className="photo-item reveal delay-4">
            <img src="/assets/f4.jpg" alt="Chemistry Lab" />
            <div className="photo-overlay"><h4>Chemistry Lab</h4></div>
          </div>
        </div>
      </div>

      <div className="gallery-row row-2">
        <div className="photo-item reveal delay-2"><img src="/assets/f3.jpg" /></div>
        <div className="photo-item reveal delay-3"><img src="/assets/f5.jpg" /></div>
        <div className="photo-item reveal delay-4"><img src="/assets/classroom.jpg" /></div>
        <div className="photo-item reveal delay-5"><img src="/assets/f6.jpg" /></div>
      </div>
    </div>

  </div>
</section>

{/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      {/* Contact Section */}
      <section id="contact" className="contact reveal reveal-up">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Get Started</div>
            <h2 className="section-title">
              Ready to Begin Your <span className="highlight">Success Journey?</span>
            </h2>
            <p className="section-description">Take the first step towards your university dreams. Contact us today!</p>
          </div>
          <div className="contact-content ">
            <div className="contact-info">
              <div className="contact-card reveal reveal-left">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>
                    No. 123, Galle Road
                    <br />
                    Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>
              <div className="contact-card reveal reveal-right">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h4>Call Us Now</h4>
                  <p>
                    +94 11 234 5678
                    <br />
                    +94 77 123 4567
                  </p>
                </div>
              </div>
              <div className="contact-card reveal reveal-left ">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p>
                    info@excellenceal.lk
                    <br />
                    admissions@excellenceal.lk
                  </p>
                </div>
              </div>
              
            </div>
            <div className="contact-form-container">
              <img src="/assets/one.jpg"/>
            </div>
          </div>
        </div>
      </section>

   <Footer/>
    </div>
  )
}

export default Home

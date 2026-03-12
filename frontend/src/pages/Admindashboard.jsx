import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Admindashboard.css";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"
import { resolvePublicUrl } from "../utils/resolvePublicUrl";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [adminNotice, setAdminNotice] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const overviewSectionRef = useRef(null);
  const teacherSectionRef = useRef(null);
  const courseSectionRef = useRef(null);
  const recordingSectionRef = useRef(null);
  const liveclassSectionRef = useRef(null);
  const tuteSectionRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    if (!sectionRef?.current) return;
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // ===== TEACHER STATES =====
  const [teachers, setTeachers] = useState([]);
  const [teacherForm, setTeacherForm] = useState({ name: "", qualification: "", subject: "", photoUrl: "" });
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  // ===== COURSE STATES =====
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ classname: "", month: "", price: "", teachername: "", photourl: "" });
  const [editingCourseId, setEditingCourseId] = useState(null);

  // ===== RECORDINGS STATES =====
  const [recordings, setRecordings] = useState([]);
  const [recordingForm, setRecordingForm] = useState({ title: "", url: "", description: "" });
  const [editingRecordingId, setEditingRecordingId] = useState(null);

  // ===== LIVECLASSES STATES =====
  const [liveclasses, setLiveclasses] = useState([]);
  const [liveclassForm, setLiveclassForm] = useState({ title: "", meetingUrl: "", dateTime: "" });
  const [editingLiveclassId, setEditingLiveclassId] = useState(null);

  // ===== TUTES STATES =====
  const [tutes, setTutes] = useState([]);
  const [tuteForm, setTuteForm] = useState({ title: "", fileUrl: "" });
  const [editingTuteId, setEditingTuteId] = useState(null);

  // ===== SELECTED COURSE =====
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // ===== ADMIN STATS (CHARTS) =====
  const [adminStats, setAdminStats] = useState(null);
  const [adminStatsError, setAdminStatsError] = useState(null);

  const fetchAdminStats = async () => {
    try {
      setAdminStatsError(null);
      const res = await axios.get("/api/admin/stats");
      setAdminStats(res.data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setAdminStatsError("Failed to load dashboard stats");
    }
  };

  const closeAdminNotice = () => {
    setAdminNotice(null);
  };

  const openDeleteConfirm = (deleteRequest) => {
    setPendingDelete(deleteRequest);
  };

  const closeDeleteConfirm = () => {
    setPendingDelete(null);
  };

  // ===== FETCH FUNCTIONS =====
  const fetchTeachers = async () => {
    try { const res = await axios.get("/api/teachers"); setTeachers(res.data); } 
    catch (err) { console.error("Error fetching teachers:", err); }
  };

  const fetchCourses = async () => {
    try { 
      const res = await axios.get("/api/courses"); 
      setCourses(res.data); 
      if (res.data.length > 0 && !selectedCourseId) setSelectedCourseId(res.data[0].id);
    } catch (err) { console.error("Error fetching courses:", err); }
  };

  const fetchRecordings = async (courseId) => {
    if (!courseId) return setRecordings([]);
    try { const res = await axios.get(`/api/recordings/course/${courseId}`); setRecordings(res.data); }
    catch (err) { console.error("Error fetching recordings:", err); }
  };

  const fetchLiveclasses = async (courseId) => {
    if (!courseId) return setLiveclasses([]);
    try { const res = await axios.get(`/api/liveclasses/course/${courseId}`); setLiveclasses(res.data); }
    catch (err) { console.error("Error fetching live classes:", err); }
  };

  const fetchTutes = async (courseId) => {
    if (!courseId) return setTutes([]);
    try { const res = await axios.get(`/api/tutes/course/${courseId}`); setTutes(res.data); }
    catch (err) { console.error("Error fetching tutes:", err); }
  };

  // ===== FETCH ALL ON COURSE CHANGE =====
  useEffect(() => {
    fetchRecordings(selectedCourseId);
    fetchLiveclasses(selectedCourseId);
    fetchTutes(selectedCourseId);
  }, [selectedCourseId]);

  useEffect(() => { fetchTeachers(); fetchCourses(); fetchAdminStats(); }, []);

  // ===== FORM SUBMITS =====
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacherId) await axios.put(`/api/teachers/${editingTeacherId}`, teacherForm);
      else await axios.post("/api/teachers", teacherForm);
      setTeacherForm({ name: "", qualification: "", subject: "", photoUrl: "" }); setEditingTeacherId(null); fetchTeachers();
    } catch (err) { console.error(err); }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) await axios.put(`/api/courses/${editingCourseId}`, courseForm);
      else await axios.post("/api/courses", courseForm);
      setCourseForm({ classname: "", month: "", price: "", teachername: "", photourl: "" }); setEditingCourseId(null); fetchCourses();
    } catch (err) { console.error(err); }
  };

 const handleRecordingSubmit = async (e) => {
  e.preventDefault();
  if (!selectedCourseId) {
    setAdminNotice({ type: "error", text: "Select a course!" });
    return;
  }

  try {
    if (editingRecordingId) {
      // Update recording
      const payload = {
        title: recordingForm.title,
        videoUrl: recordingForm.url,
        description: recordingForm.description || "",
      };

      await axios.put(`/api/recordings/${editingRecordingId}`, payload);
    } else {
      // Add new recording
      const courseId = selectedCourseId;
      const title = recordingForm.title;
      const url = recordingForm.url;
      const description = recordingForm.description || "";

      // Backend expects @RequestParam values (not JSON body)
      await axios.post(
        `/api/recordings?courseId=${encodeURIComponent(courseId)}` +
          `&title=${encodeURIComponent(title)}` +
          `&url=${encodeURIComponent(url)}` +
          `&description=${encodeURIComponent(description)}`
      );
    }

    // Reset form and refresh list
    setRecordingForm({ title: "", url: "", description: "" });
    setEditingRecordingId(null);
    fetchRecordings(selectedCourseId);

  } catch (err) {
    console.error("Error adding/updating recording:", err);
    console.error("Recording API error details:", {
      message: err?.message,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
    });
    setAdminNotice({ type: "error", text: "Failed to save recording." });
  }
};


  const handleLiveclassSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setAdminNotice({ type: "error", text: "Select a course!" });
      return;
    }
    try {
      if (editingLiveclassId) await axios.put(`/api/liveclasses/${editingLiveclassId}`, { ...liveclassForm });
      else await axios.post(`/api/liveclasses?courseId=${selectedCourseId}&title=${encodeURIComponent(liveclassForm.title)}&meetingUrl=${encodeURIComponent(liveclassForm.meetingUrl)}&dateTime=${encodeURIComponent(liveclassForm.dateTime)}`);
      setLiveclassForm({ title: "", meetingUrl: "", dateTime: "" }); setEditingLiveclassId(null); fetchLiveclasses(selectedCourseId);
      setAdminNotice({ type: "success", text: editingLiveclassId ? "Live class updated successfully!" : "Live class added successfully!" });
    } catch (err) {
      console.error(err);
      setAdminNotice({ type: "error", text: "Failed to save live class." });
    }
  };

  const handleTuteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setAdminNotice({ type: "error", text: "Select a course!" });
      return;
    }
    try {
      if (editingTuteId) await axios.put(`/api/tutes/${editingTuteId}`, { ...tuteForm });
      else await axios.post(`/api/tutes?courseId=${selectedCourseId}&title=${encodeURIComponent(tuteForm.title)}&fileUrl=${encodeURIComponent(tuteForm.fileUrl)}`);
      setTuteForm({ title: "", fileUrl: "" }); setEditingTuteId(null); fetchTutes(selectedCourseId);
      setAdminNotice({ type: "success", text: editingTuteId ? "Tute updated successfully!" : "Tute added successfully!" });
    } catch (err) {
      console.error(err);
      setAdminNotice({ type: "error", text: "Failed to save tute." });
    }
  };

  // ===== DELETE HANDLERS =====
  const handleDelete = (url, id, fetchFunc, itemLabel = "Item") => {
    openDeleteConfirm({ url, id, fetchFunc, itemLabel });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    const { url, id, fetchFunc, itemLabel } = pendingDelete;
    try {
      await axios.delete(`${url}/${id}`);
      fetchFunc(selectedCourseId);
      setAdminNotice({ type: "success", text: `${itemLabel} deleted successfully!` });
    } catch (err) {
      console.error(err);
      setAdminNotice({ type: "error", text: `Failed to delete ${itemLabel.toLowerCase()}.` });
    } finally {
      closeDeleteConfirm();
    }
  };

  return (
    
    <div className="admin-dashboard">
      {adminNotice && (
        <div className="enroll-popup-overlay" onClick={closeAdminNotice}>
          <div
            className={`enroll-popup ${adminNotice.type}`}
            role="dialog"
            aria-modal="true"
            aria-label="Admin message"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enroll-popup-text">{adminNotice.text}</div>
            <button type="button" className="enroll-popup-btn" onClick={closeAdminNotice}>
              OK
            </button>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="enroll-popup-overlay" onClick={closeDeleteConfirm}>
          <div
            className="enroll-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Delete confirmation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enroll-popup-text">
              Are you sure you want to delete this {pendingDelete.itemLabel.toLowerCase()}?
            </div>
            <div className="enroll-popup-actions">
              <button type="button" className="enroll-popup-btn" onClick={closeDeleteConfirm}>
                Cancel
              </button>
              <button type="button" className="enroll-popup-btn enroll-popup-btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <h1>Admin Dashboard</h1>

      <nav className="admin-quick-links" aria-label="Admin dashboard quick links">
        <button type="button" className="quick-link" onClick={() => scrollToSection(overviewSectionRef)}>Overview</button>
        <button type="button" className="quick-link" onClick={() => scrollToSection(teacherSectionRef)}>Teachers</button>
        <button type="button" className="quick-link" onClick={() => scrollToSection(courseSectionRef)}>Courses</button>
        <button type="button" className="quick-link" onClick={() => scrollToSection(recordingSectionRef)}>Recordings</button>
        <button type="button" className="quick-link" onClick={() => scrollToSection(liveclassSectionRef)}>Live Classes</button>
        <button type="button" className="quick-link" onClick={() => scrollToSection(tuteSectionRef)}>Tutes</button>
      </nav>

      {/* ===== CHARTS / STATS ===== */}
      <section className="admin-stats" ref={overviewSectionRef}>
        <h2>Overview</h2>
        {adminStatsError && (
          <div className="admin-stats-error">{adminStatsError}</div>
        )}

        <div className="admin-stats-grid2">
          <div className="stat-card2">
            <div className="stat-title2">Total Students</div>
            <div className="stat-value2">{adminStats ? adminStats.totalStudents : "—"}</div>
            <div className="stat-sub2">All registered students</div>
          </div>

          <div className="stat-card2">
            <div className="stat-title2">Revenue This Month</div>
            <div className="stat-value2">
              {adminStats
                ? Number(adminStats.revenueThisMonth || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "—"}
            </div>
            <div className="stat-sub2">Sum of course prices for enrollments this month</div>
          </div>

          <div className="stat-card2">
            <div className="stat-title2">Most Popular Course</div>
            <div className="stat-value2">
              {adminStats?.mostPopularCourseName ? adminStats.mostPopularCourseName : "—"}
            </div>
            <div className="stat-sub2">
              {adminStats?.mostPopularCourseEnrollments
                ? `${adminStats.mostPopularCourseEnrollments} enrollments`
                : "No enrollments yet"}
            </div>

            <div className="progress-wrap" aria-hidden="true">
              {(() => {
                const total = Number(adminStats?.totalEnrollments || 0);
                const top = Number(adminStats?.mostPopularCourseEnrollments || 0);
                const pct = total > 0 ? Math.min(100, Math.round((top / total) * 100)) : 0;
                return (
                  <>
                    <div className="progress-meta">Share: {pct}%</div>
                    <div className="progress-track">
                      <div className="progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEACHERS ===== */}
      <section ref={teacherSectionRef}>
        <h2>Teachers</h2>
        <form onSubmit={handleTeacherSubmit} className="course-form">
          <input type="text" placeholder="Name" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} required />
          <input type="text" placeholder="Qualification" value={teacherForm.qualification} onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })} required />
          <input type="text" placeholder="Subject" value={teacherForm.subject} onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })} required />
          <input type="text" placeholder="Photo URL" value={teacherForm.photoUrl} onChange={e => setTeacherForm({ ...teacherForm, photoUrl: e.target.value })} />
          <button type="submit">{editingTeacherId ? "Update" : "Add"}</button>
        </form>
        <table className="course-table">
          <thead><tr><th>Name</th><th>Qualification</th><th>Subject</th><th>Photo</th><th>Actions</th></tr></thead>
          <tbody>
            {teachers.map(t => <tr key={t.id}><td>{t.name}</td><td>{t.qualification}</td><td>{t.subject}</td><td>{t.photoUrl ? <img src={resolvePublicUrl(t.photoUrl, { fallback: "/assets/lec.jpg" })} width="50" /> : "No Photo"}</td><td>
              <button type="button" onClick={() => { scrollToSection(teacherSectionRef); setEditingTeacherId(t.id); setTeacherForm(t); }}>Edit</button>
              <button type="button" onClick={() => handleDelete("/api/teachers", t.id, fetchTeachers, "Teacher")}>Delete</button>
            </td></tr>)}
          </tbody>
        </table>
      </section>

      {/* ===== COURSES ===== */}
      <section ref={courseSectionRef}>
        <h2>Courses</h2>
        <form onSubmit={handleCourseSubmit} className="course-form">
          <input type="text" placeholder="Name" value={courseForm.classname} onChange={e => setCourseForm({ ...courseForm, classname: e.target.value })} required />
          <input type="text" placeholder="Month" value={courseForm.month} onChange={e => setCourseForm({ ...courseForm, month: e.target.value })} required />
          <input type="number" placeholder="Price" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} />
          <input type="text" placeholder="Teacher" value={courseForm.teachername} onChange={e => setCourseForm({ ...courseForm, teachername: e.target.value })} />
          <input type="text" placeholder="Image URL" value={courseForm.photourl} onChange={e => setCourseForm({ ...courseForm, photourl: e.target.value })} />
          <button type="submit">{editingCourseId ? "Update" : "Add"}</button>
        </form>
        <table className="course-table">
          <thead><tr><th>Name</th><th>Month</th><th>Price</th><th>Teacher</th><th>Image</th><th>Actions</th></tr></thead>
          <tbody>
            {courses.map(c => <tr key={c.id}><td>{c.classname}</td><td>{c.month}</td><td>{c.price}</td><td>{c.teachername}</td><td>{c.photourl ? <img src={resolvePublicUrl(c.photourl, { fallback: "/assets/class.jpg" })} width="50" /> : "No Image"}</td><td>
              <button type="button" onClick={() => { scrollToSection(courseSectionRef); setEditingCourseId(c.id); setCourseForm(c); }}>Edit</button>
              <button type="button" onClick={() => handleDelete("/api/courses", c.id, fetchCourses, "Course")}>Delete</button>
            </td></tr>)}
          </tbody>
        </table>
      </section>

      {/* ===== RECORDINGS ===== */}
      <section ref={recordingSectionRef}>
        <h2>Recordings</h2>
        <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
          <option value="" >-- Select Course --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.classname}</option>)}
        </select>
        <form onSubmit={handleRecordingSubmit} className="course-form">
          <input type="text" placeholder="Title" value={recordingForm.title} onChange={e => setRecordingForm({ ...recordingForm, title: e.target.value })} required />
          <input type="text" placeholder="Video URL" value={recordingForm.url} onChange={e => setRecordingForm({ ...recordingForm, url: e.target.value })} required />
          <textarea placeholder="Description" value={recordingForm.description} onChange={e => setRecordingForm({ ...recordingForm, description: e.target.value })}></textarea>
          <button type="submit">{editingRecordingId ? "Update" : "Add"}</button>
        </form>
        <table className="course-table">
          <thead><tr><th>Title</th><th>URL</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {recordings.map(r => <tr key={r.id}><td>{r.title}</td><td><a href={r.videoUrl} target="_blank">Watch</a></td><td>{r.description}</td><td>
              <button type="button" onClick={() => { scrollToSection(recordingSectionRef); setEditingRecordingId(r.id); setRecordingForm({ title: r.title, url: r.videoUrl, description: r.description }); }}>Edit</button>
              <button type="button" onClick={() => handleDelete("/api/recordings", r.id, fetchRecordings, "Recording")}>Delete</button>
            </td></tr>)}
          </tbody>
        </table>
      </section>

      {/* ===== LIVE CLASSES ===== */}
      <section ref={liveclassSectionRef}>
        <h2>Live Classes</h2>
        <form onSubmit={handleLiveclassSubmit} className="course-form">
          <input type="text" placeholder="Title" value={liveclassForm.title} onChange={e => setLiveclassForm({ ...liveclassForm, title: e.target.value })} required />
          <input type="text" placeholder="Meeting URL" value={liveclassForm.meetingUrl} onChange={e => setLiveclassForm({ ...liveclassForm, meetingUrl: e.target.value })} required />
          <input type="datetime-local" value={liveclassForm.dateTime} onChange={e => setLiveclassForm({ ...liveclassForm, dateTime: e.target.value })} required />
          <button type="submit">{editingLiveclassId ? "Update" : "Add"}</button>
        </form>
        <table className="course-table">
          <thead><tr><th>Title</th><th>URL</th><th>DateTime</th><th>Actions</th></tr></thead>
          <tbody>
            {liveclasses.map(l => <tr key={l.id}><td>{l.title}</td><td><a href={l.meetingUrl} target="_blank">Join</a></td><td>{l.dateTime}</td><td>
              <button type="button" onClick={() => { scrollToSection(liveclassSectionRef); setEditingLiveclassId(l.id); setLiveclassForm({ title: l.title, meetingUrl: l.meetingUrl, dateTime: l.dateTime }); }}>Edit</button>
              <button type="button" onClick={() => handleDelete("/api/liveclasses", l.id, fetchLiveclasses, "Live class")}>Delete</button>
            </td></tr>)}
          </tbody>
        </table>
      </section>

      {/* ===== TUTES ===== */}
      <section ref={tuteSectionRef}>
        <h2>Tutes</h2>
        <form onSubmit={handleTuteSubmit} className="course-form">
          <input type="text" placeholder="Title" value={tuteForm.title} onChange={e => setTuteForm({ ...tuteForm, title: e.target.value })} required />
          <input type="text" placeholder="File URL" value={tuteForm.fileUrl} onChange={e => setTuteForm({ ...tuteForm, fileUrl: e.target.value })} required />
          <button type="submit">{editingTuteId ? "Update" : "Add"}</button>
        </form>
        <table className="course-table">
          <thead><tr><th>Title</th><th>File</th><th>Actions</th></tr></thead>
          <tbody>
            {tutes.map(t => <tr key={t.id}><td>{t.title}</td><td><a href={t.fileUrl} target="_blank">Download</a></td><td>
              <button type="button" onClick={() => { scrollToSection(tuteSectionRef); setEditingTuteId(t.id); setTuteForm({ title: t.title, fileUrl: t.fileUrl }); }}>Edit</button>
              <button type="button" onClick={() => handleDelete("/api/tutes", t.id, fetchTutes, "Tute")}>Delete</button>
            </td></tr>)}
          </tbody>
        </table>
      </section>

      <button className="gohome" onClick={() => navigate("/")}>Go Home</button>
      
    </div>
     
  
  );
};

export default AdminDashboard;

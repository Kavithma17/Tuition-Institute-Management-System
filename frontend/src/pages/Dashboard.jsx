import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axiosClient from "../api/axiosClient";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(() => {
    try {
      return localStorage.getItem("dashboard.sort.all") || "none";
    } catch {
      return "none";
    }
  });
  const [enrolledSearchTerm, setEnrolledSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMenu, setActiveMenu] = useState("all");

const [todos, setTodos] = useState([]);
const [todoText, setTodoText] = useState("");

const [reminders, setReminders] = useState([]);

  const [reminderText, setReminderText] = useState("");
  const [reminderAt, setReminderAt] = useState("");

 const [notes, setNotes] = useState([]);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Payment Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("January 2026");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payLoading, setPayLoading] = useState(false);

  const [enrollNotice, setEnrollNotice] = useState(null);

  // Settings
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [settingsEmail, setSettingsEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem("dashboard.sort.all", sortOption);
    } catch {
      // ignore
    }
  }, [sortOption]);

  useEffect(() => {
    fetchCourses();
    fetchMyEnrollments();
     fetchTodos();
  fetchReminders();
   fetchNotes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeMenu !== "settings") return;
    fetchProfile();
    // eslint-disable-next-line
  }, [activeMenu]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfile(null);
      setProfileError("Please login first.");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);
      const res = await axiosClient.get("/api/users/dashboard");
      setProfile(res.data);
      setSettingsEmail(res.data?.email || "");
    } catch (e) {
      console.error("Failed to load profile", e);
      setProfileError("Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage(null);

    const email = settingsEmail.trim();
    const wantsPasswordChange = newPassword.trim().length > 0 || confirmPassword.trim().length > 0;

    if (wantsPasswordChange) {
      if (!currentPassword.trim()) {
        setSettingsMessage({ type: "error", text: "Current password is required." });
        return;
      }
      if (newPassword.trim().length < 6) {
        setSettingsMessage({ type: "error", text: "New password must be at least 6 characters." });
        return;
      }
      if (newPassword !== confirmPassword) {
        setSettingsMessage({ type: "error", text: "New password and confirm password do not match." });
        return;
      }
    }

    try {
      setSettingsSaving(true);
      const payload = {
        email,
        currentPassword: wantsPasswordChange ? currentPassword : "",
        newPassword: wantsPasswordChange ? newPassword : "",
      };

      const res = await axiosClient.put("/api/users/settings", payload);
      setProfile((prev) => ({ ...prev, email: res.data?.email ?? email }));
      setSettingsMessage({ type: "success", text: "Settings updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err?.response?.data || "Failed to update settings.";
      setSettingsMessage({ type: "error", text: String(msg) });
    } finally {
      setSettingsSaving(false);
    }
  };

  const fetchNotes = async () => {
  try {
    const res = await axiosClient.get("/api/notes");
    setNotes(res.data || []);
  } catch (e) {
    console.error("Failed to load notes", e);
  }
};


  const addTodo = async () => {
  const text = todoText.trim();
  if (!text) return;

  try {
    const res = await axiosClient.post("/api/todos", { text });
    setTodos((prev) => [res.data, ...prev]);
    setTodoText("");
  } catch {
    alert("Failed to add todo");
  }
};


const toggleTodo = async (todo) => {
  try {
    const res = await axiosClient.put(`/api/todos/${todo.id}`, {
      text: todo.text,
      done: !todo.done,
    });

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? res.data : t))
    );
  } catch {
    alert("Failed to update todo");
  }
};

  const deleteTodo = async (id) => {
  try {
    await axiosClient.delete(`/api/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  } catch {
    alert("Failed to delete todo");
  }
};


  const addReminder = async () => {
  const text = reminderText.trim();
  if (!text || !reminderAt) return;

  try {
    const res = await axiosClient.post("/api/reminders", {
      text,
      remindAt: new Date(reminderAt).toISOString(),
    });

    setReminders((prev) => [...prev, res.data]);
    setReminderText("");
    setReminderAt("");
  } catch {
    alert("Failed to add reminder");
  }
};


    

  const deleteReminder = async (id) => {
  try {
    await axiosClient.delete(`/api/reminders/${id}`);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  } catch {
    alert("Failed to delete reminder");
  }
};


  const resetNoteForm = () => {
    setNoteTitle("");
    setNoteBody("");
    setEditingNoteId(null);
  };

  const addNote = async () => {
  if (!noteTitle.trim() && !noteBody.trim()) return;

  try {
    const res = await axiosClient.post("/api/notes", {
      title: noteTitle,
      body: noteBody,
    });

    setNotes((prev) => [res.data, ...prev]);
    resetNoteForm();
  } catch (e) {
    alert("Failed to save note");
    console.error(e);
  }
};

  const startEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title || "");
    setNoteBody(note.body || "");
  };

 
const saveEditNote = async () => {
  try {
    const res = await axiosClient.put(`/api/notes/${editingNoteId}`, {
      title: noteTitle,
      body: noteBody,
    });

    setNotes((prev) =>
      prev.map((n) => (n.id === editingNoteId ? res.data : n))
    );

    resetNoteForm();
  } catch (e) {
    alert("Failed to update note");
  }
};
const deleteNote = async (id) => {
  try {
    await axiosClient.delete(`/api/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  } catch {
    alert("Failed to delete note");
  }
};


  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/courses");
      setCourses(res.data || []);
      setError(null);
    } catch (e) {
      setError("Failed to fetch courses.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      // Requires token (protected)
      const res = await axiosClient.get("/api/enrollments/my");
      setEnrollments(res.data || []);
    } catch (e) {
      // If not logged in, this will fail (401/403). Keep UI usable.
      console.log("Enrollments not loaded (login required).");
    }
  };
  const fetchTodos = async () => {
  try {
    const res = await axiosClient.get("/api/todos");
    setTodos(res.data || []);
  } catch (e) {
    console.error("Failed to load todos");
  }
};

const fetchReminders = async () => {
  try {
    const res = await axiosClient.get("/api/reminders");
    setReminders(res.data || []);
  } catch (e) {
    console.error("Failed to load reminders");
  }
};



  const openPayModal = (course) => {
    setSelectedCourse(course);
    setSelectedMonth("January 2026");
    setPaymentMethod("card");
    setShowPayModal(true);
  };

  const closePayModal = () => {
    setShowPayModal(false);
    setSelectedCourse(null);
    setPayLoading(false);
  };

  const handlePay = async () => {
    if (!selectedCourse) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setEnrollNotice({ type: "error", text: "Please login first.", redirectTo: "/login" });
      return;
    }

    try {
      setPayLoading(true);

      await axiosClient.post(
        `/api/enrollments?courseId=${selectedCourse.id}&month=${encodeURIComponent(selectedMonth)}`
      );

      setEnrollNotice({ type: "success", text: "Enrolled successfully!" });
      closePayModal();
      fetchMyEnrollments();
      setActiveMenu("enrolled");
    } catch (e) {
      setEnrollNotice({ type: "error", text: "You are already enrolled for this month." });
      setPayLoading(false);
    }
  };

  const closeEnrollNotice = () => {
    const redirectTo = enrollNotice?.redirectTo;
    setEnrollNotice(null);
    if (redirectTo) navigate(redirectTo);
  };

  const filteredCourses = courses.filter((course) =>
    course.classname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = (() => {
    const list = filteredCourses.slice();
    const safeText = (v) => String(v || "").toLowerCase();

    switch (sortOption) {
      case "price_asc":
        return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      case "price_desc":
        return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      case "month":
        return list.sort((a, b) => safeText(a.month).localeCompare(safeText(b.month)));
      case "teacher":
        return list.sort((a, b) => safeText(a.teachername).localeCompare(safeText(b.teachername)));
      default:
        return list;
    }
  })();

  const enrolledFiltered = (() => {
    const q = enrolledSearchTerm.trim().toLowerCase();
    if (!q) return enrollments;

    return enrollments.filter((e) => {
      const courseName = (e.course?.classname || "").toLowerCase();
      const teacherName = (e.course?.teachername || "").toLowerCase();
      const month = (e.month || "").toLowerCase();
      const status = (e.status || "").toLowerCase();
      return (
        courseName.includes(q) ||
        teacherName.includes(q) ||
        month.includes(q) ||
        status.includes(q)
      );
    });
  })();

  return (
    <div className="dashboard-layout">
      {enrollNotice && (
        <div className="enroll-popup-overlay" onClick={closeEnrollNotice}>
          <div
            className={`enroll-popup ${enrollNotice.type}`}
            role="dialog"
            aria-modal="true"
            aria-label="Enrollment message"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enroll-popup-text">{enrollNotice.text}</div>
            <button type="button" className="enroll-popup-btn" onClick={closeEnrollNotice}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="sidebar-title">Dashboard</div>

        <ul className="sidebar-menu">
          <li
            className={activeMenu === "all" ? "active" : ""}
            onClick={() => setActiveMenu("all")}
          >
            All Classes
          </li>

          <li
            className={activeMenu === "enrolled" ? "active" : ""}
            onClick={() => {
              setActiveMenu("enrolled");
              fetchMyEnrollments();
            }}
          >
            Enrolled Classes
          </li>

          <li
            className={activeMenu === "notes" ? "active" : ""}
            onClick={() => setActiveMenu("notes")}
          >
            Notes
          </li>

          <li
            className={activeMenu === "todos" ? "active" : ""}
            onClick={() => setActiveMenu("todos")}
          >
            To-Do
          </li>

          <li
            className={activeMenu === "settings" ? "active" : ""}
            onClick={() => setActiveMenu("settings")}
          >
            Settings
          </li>
        </ul>

        <button
          type="button"
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="dashboard-content">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Welcome to Your Classes Dashboard</h1>
            <p>Find your ideal classes and get ready to excel!</p>

            {activeMenu === "all" && (
              <div className="dashboard-controls">
                <input
                  type="search"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Search classes"
                />

                <div className="sort-wrap">
                  <label className="sort-label" htmlFor="sortAll">
                    Sort by
                  </label>
                  <select
                    id="sortAll"
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    aria-label="Sort all classes"
                  >
                    <option value="none">Default</option>
                    <option value="price_asc">Price (low to high)</option>
                    <option value="price_desc">Price (high to low)</option>
                    <option value="month">Month</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>
            )}
          </header>

          <main className="dashboard-main">
            {activeMenu === "all" && (
              <>
                {loading && <p>Loading classes...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                  <div className="classes-grid">
                    {sortedCourses.map((c, idx) => (
                      <div key={c.id} className="class-card">
                        <div className="card-image">
                          <div className="card-badge" aria-hidden="true">{idx + 1}</div>
                          <img
                            src={c.photourl || "/placeholder.svg"}
                            alt={c.classname}
                            loading="lazy"
                          />
                        </div>

                        <div className="card-content1">
                          <h3 className="card-title1">{c.classname}</h3>
                          <p className="card-month1">{c.month}</p>
                          <p className="card-price1">Price: {c.price}</p>
                          <p className="card-teacher1">
                            Teacher: {c.teachername}
                          </p>

                          <button
                            className="enroll-btn1"
                            onClick={() => openPayModal(c)}
                          >
                            ENROLL NOW
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}


            

            {activeMenu === "enrolled" && (
  <div className="enrolled-wrap">
    <h2 className="section-title">Your Enrolled Classes</h2>

    <input
      type="search"
      className="enrolled-search"
      placeholder="Search enrolled classes..."
      value={enrolledSearchTerm}
      onChange={(e) => setEnrolledSearchTerm(e.target.value)}
      aria-label="Search enrolled classes"
    />

    {enrolledFiltered.length === 0 ? (
      <p className="muted">No enrollments yet.</p>
    ) : (
      <div className="classes-grid">
        {enrolledFiltered.map((e, idx) => (
          <div key={e.id} className="class-card enrolled-card">
            
            {/* Course Image */}
            <div className="card-image">
              <div className="card-badge" aria-hidden="true">{idx + 1}</div>
              <img
                src={e.course?.photourl || "/placeholder.svg"}
                alt={e.course?.classname}
              />
            </div>

            <div className="card-content1">
              <h3 className="card-title1">
                {e.course?.classname}
              </h3>

              <p className="card-month1">
                Month: {e.month}
              </p>

              <p className="card-teacher1">
                Teacher: {e.course?.teachername}
              </p>

              <p className="card-price1">
                Price: {e.course?.price}
              </p>

              <p className="card-status">
                Status: {e.status}
              </p>

              <button
                className="enroll-btn1"
                onClick={() => navigate(`/class/${e.course?.id}`)}
              >
                VIEW CLASS
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


            {activeMenu === "notes" && (
              <div className="simple-box">
                <h2 className="section-title">Notes</h2>
                <p className="muted">Add, edit, and delete notes (saved securely to your account).</p>


                <form
                  className="notes-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingNoteId) saveEditNote();
                    else addNote();
                  }}
                >
                  <input
                    className="notes-title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Title"
                    aria-label="Note title"
                  />
                  <textarea
                    className="notes-body"
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                    placeholder="Write your note..."
                    rows={6}
                    aria-label="Note text"
                  />

                  <div className="notes-actions">
                    <button type="submit" className="notes-save">
                      {editingNoteId ? "Save" : "Add"}
                    </button>
                    {editingNoteId && (
                      <button
                        type="button"
                        className="notes-cancel"
                        onClick={resetNoteForm}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="divider" role="separator" />

                {notes.length === 0 ? (
                  <p className="muted">No notes yet.</p>
                ) : (
                  <ul className="notes-list">
                    {notes.map((n) => (
                      <li key={n.id} className="notes-item">
                        <div className="notes-item-main">
                          <div className="notes-item-title">{n.title}</div>
                          {n.body ? (
                            <div className="notes-item-body">{n.body}</div>
                          ) : (
                            <div className="notes-item-body notes-item-body--empty">
                              (empty)
                            </div>
                          )}
                          <div className="notes-item-time">
                            {new Date(n.updatedAt || n.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="notes-item-actions">
                          <button
                            type="button"
                            className="notes-edit"
                            onClick={() => startEditNote(n)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="notes-delete"
                            onClick={() => deleteNote(n.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeMenu === "todos" && (
              <div className="simple-box">
                <h2 className="section-title">To-Do</h2>
                <p className="muted">Saved on this device only.</p>

                <form
                  className="todo-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTodo();
                  }}
                >
                  <input
                    className="todo-input"
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    placeholder="Add a new task..."
                    aria-label="Add a new task"
                  />
                  <button type="submit" className="todo-add-btn">
                    Add
                  </button>
                </form>

                {todos.length === 0 ? (
                  <p className="muted">No tasks yet.</p>
                ) : (
                  <ul className="todo-list">
                    {todos.map((t) => (
                      <li
                        key={t.id}
                        className={t.done ? "todo-item todo-item--done" : "todo-item"}
                      >
                        <label className="todo-check">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggleTodo(t)}
                          />
                          <span className="todo-text">{t.text}</span>
                        </label>

                        <button
                          type="button"
                          className="todo-delete"
                          onClick={() => deleteTodo(t.id)}
                          aria-label={`Delete task: ${t.text}`}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="divider" role="separator" />

                <h3 className="sub-title">Reminders</h3>
                <p className="muted">Add a reminder with date & time.</p>

                <form
                  className="reminder-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addReminder();
                  }}
                >
                  <input
                    className="reminder-input"
                    value={reminderText}
                    onChange={(e) => setReminderText(e.target.value)}
                    placeholder="Reminder text..."
                    aria-label="Reminder text"
                  />
                  <input
                    className="reminder-dt"
                    type="datetime-local"
                    value={reminderAt}
                    onChange={(e) => setReminderAt(e.target.value)}
                    aria-label="Reminder date and time"
                  />
                  <button type="submit" className="reminder-add-btn">
                    Add
                  </button>
                </form>

                {reminders.length === 0 ? (
                  <p className="muted">No reminders yet.</p>
                ) : (
                  <ul className="reminder-list">
                    {reminders
                      .slice()
                     .sort(
                 (a, b) => new Date(a.remindAt) - new Date(b.remindAt))

                      .map((r) => (
                        <li key={r.id} className="reminder-item">
                          <div className="reminder-main">
                            <div className="reminder-text">{r.text}</div>
                            <div className="reminder-time">
                              {new Date(r.remindAt).toLocaleString()
}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="reminder-delete"
                            onClick={() => deleteReminder(r.id)}
                            aria-label={`Delete reminder: ${r.text}`}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            {activeMenu === "settings" && (
              <div className="simple-box">
                <h2 className="section-title">Settings</h2>
                <p className="muted">Update your email and password.</p>

                {profileLoading && <p>Loading profile...</p>}
                {profileError && <p className="error-message">{profileError}</p>}

                {settingsMessage && (
                  <p className={settingsMessage.type === "success" ? "success-message" : "error-message"}>
                    {settingsMessage.text}
                  </p>
                )}

                {!profileLoading && !profileError && (
                  <form className="settings-form" onSubmit={saveSettings}>
                    <div className="form-row">
                      <label className="form-label">Username</label>
                      <input
                        className="form-input"
                        value={profile?.username || ""}
                        readOnly
                        aria-label="Username"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Email</label>
                      <input
                        className="form-input"
                        type="email"
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        placeholder="Email"
                        aria-label="Email"
                      />
                    </div>

                    <div className="divider" role="separator" />

                    <div className="form-row">
                      <label className="form-label">Current Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        aria-label="Current password"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        aria-label="New password"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        aria-label="Confirm new password"
                      />
                    </div>

                    <button type="submit" className="save-btn" disabled={settingsSaving}>
                      {settingsSaving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                  </form>
                )}
              </div>
            )}

           
          </main>
        </div>
      </div>

      {/* ===== Payment Modal ===== */}
      {showPayModal && selectedCourse && (
        <div className="modal-overlay" onClick={closePayModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Payment</h2>

            <div className="modal-row">
              <span className="muted">Class:</span>
              <strong>{selectedCourse.classname}</strong>
            </div>

            <div className="modal-row">
              <span className="muted">Price:</span>
              <strong>{selectedCourse.price}</strong>
            </div>

            <label className="modal-label">Select Month</label>
            <select
              className="modal-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option>January 2026</option>
              <option>February 2026</option>
              <option>March 2026</option>
              <option>April 2026</option>
              <option>May 2026</option>
              <option>June 2026</option>
            </select>

            <label className="modal-label">Payment Method</label>
            <div className="payment-options">
              <label className="radio">
                <input
                  type="radio"
                  name="pay"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Card
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="pay"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash
              </label>
            </div>

            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={payLoading}
            >
              {payLoading ? "PROCESSING..." : "PAY & ENROLL"}
            </button>

            <button className="close-btn" onClick={closePayModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

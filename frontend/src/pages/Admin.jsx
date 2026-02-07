import React from "react";
import "./AdminPage.css";

const AdminPage = () => {
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>📚 Manage Classes</li>
            <li>👨‍🏫 Manage Teachers</li>
            <li>👨‍🎓 Manage Students</li>
            <li>📢 Announcements</li>
            <li>🏆 Results</li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <h1>Welcome, Admin!</h1>
        <p>Select an option from the sidebar to manage your institute.</p>

        {/* Future component placeholders */}
        <div className="admin-widgets">
          <div className="widget">
            <h3>Total Classes</h3>
            <p>12</p>
          </div>
          <div className="widget">
            <h3>Total Teachers</h3>
            <p>8</p>
          </div>
          <div className="widget">
            <h3>Total Students</h3>
            <p>250+</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

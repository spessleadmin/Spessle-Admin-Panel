import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import Sidebar from "./Sidebar"; // <-- MAKE SURE THIS IMPORT IS CORRECT
import "./AdminUsers.css";

const roles = ["Support Admin", "Vendor Admin"];
const statuses = ["Active", "Inactive"];
const sampleUsers = [
  { name: "Bentley Mooney", email: "mooney@gmail.com", phone: "+1-212-456-7890", business: "Cake Shop", role: "Support Admin", status: "Inactive" },
  { name: "Daniel Harrell", email: "Daniel@yopmail.com", phone: "+1-212-456-7890", business: "Cake Shop", role: "Support Admin", status: "Active" },
  { name: "Garrett Winters", email: "stella@yopmail.com", phone: "+1-212-456-7890", business: "Cake Shop", role: "Support Admin", status: "Inactive" },
  { name: "Jackson Bradshaw", email: "jacksonaus@gmail.com", phone: "+1-212-456-7890", business: "Cake Shop", role: "Vendor Admin", status: "Inactive" },
  { name: "Tiger Nixon", email: "tigernixon@gmail.com", phone: "+1-212-456-7890", business: "Cake Shop", role: "Vendor Admin", status: "Active" },
];

export default function AdminUsers() {
  // Local to this page (don't pass openSubmenu props so Sidebar manages its own state)
  const [filters, setFilters] = useState({
    business: "", name: "", email: "", phone: "", role: "Support Admin", status: ""
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">
            <img
              src="https://codingincloud.com/spessle/html/assets/images/logo-dark.png"
              alt="Spessle"
              className="logo-img-header"
              draggable="false"
            />
          </div>
          <button className="hamburger-btn" title="Toggle Menu">
            <i data-feather="menu"></i>
          </button>
        </div>
        <div className="header-right">
          <button className="icon-btn" title="Fullscreen">
            <i data-feather="maximize-2"></i>
          </button>
          <div className="icon-badge-btn" title="Notifications">
            <i data-feather="bell"></i>
            <span className="badge">9</span>
          </div>
          <div className="header-profile">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="avatar"
              draggable="false"
            />
            <span>
              Geneva
              <br />
              <b>Spessle</b>
            </span>
            <i data-feather="chevron-down" className="dropdown-arrow"></i>
          </div>
        </div>
      </div>
      <div className="dashboard-content-row">
        {/* Sidebar is the first item in the flex row! */}
        <Sidebar />
        <main className="admin-users-page dashboard-main">
          <h2>Admin Users</h2>
          {/* ...rest of your admin-page content... */}
          <div className="admin-card">
            <div className="admin-filter-title">Filter</div>
            <form className="admin-filter-form" onSubmit={e => e.preventDefault()}>
              <div className="admin-filter-row">
                <div className="admin-filter-col">
                  <label>Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Business Name"
                    value={filters.business}
                    onChange={e => setFilters(f => ({ ...f, business: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-col">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={filters.name}
                    onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-col">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={filters.email}
                    onChange={e => setFilters(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-col">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    value={filters.phone}
                    onChange={e => setFilters(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="admin-filter-row">
                <div className="admin-filter-col">
                  <label>User Role</label>
                  <select
                    value={filters.role}
                    onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
                  >
                    {roles.map(role => <option key={role}>{role}</option>)}
                  </select>
                </div>
                <div className="admin-filter-col">
                  <label>Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="">Select status</option>
                    {statuses.map(status => <option key={status}>{status}</option>)}
                  </select>
                </div>
                <div className="admin-filter-actions">
                  <button type="submit" className="btn btn-blue">Search</button>
                  <button type="button" className="btn" onClick={() => setFilters({
                    business: "", name: "", email: "", phone: "", role: "Support Admin", status: ""
                  })}>Reset</button>
                </div>
              </div>
            </form>
          </div>
          <div className="admin-card">
            {/* ...rest of the content (user table etc) ... */}
            {/* Copy your table and footer from the previous code */}
          </div>
        </main>
      </div>
    </div>
  );
}
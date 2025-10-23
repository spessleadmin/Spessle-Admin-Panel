import React, { useState } from "react";
import Sidebar from "./Sidebar";

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
  const [filters, setFilters] = useState({
    business: "", name: "", email: "", phone: "", role: "Support Admin", status: ""
  });
  const [search, setSearch] = useState("");

  return (
    <div className="admin-users-page">
      <h2>Admin Users</h2>
      {/* Filter Card */}
      <div className="admin-card">
        <div className="admin-filter-title">Filter</div>
        <form className="admin-filter-form" onSubmit={e => e.preventDefault()}>
          <div className="admin-filter-row">
            <div className="admin-filter-col">
              <label>Business Name</label>
              <input
                type="text"
                placeholder="Business Name"
                value={filters.business}
                onChange={e => setFilters(f => ({ ...f, business: e.target.value }))}
              />
            </div>
            <div className="admin-filter-col">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={filters.name}
                onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="admin-filter-col">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={filters.email}
                onChange={e => setFilters(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="admin-filter-col">
              <label>Phone</label>
              <input
                type="text"
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
              <button type="submit" className="admin-btn admin-btn-primary">Search</button>
              <button type="button" className="admin-btn" onClick={() => setFilters({
                business: "", name: "", email: "", phone: "", role: "Support Admin", status: ""
              })}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      {/* Users Table Card */}
      <div className="admin-card">
        <div className="admin-table-actions">
          <div>
            Show{" "}
            <select className="admin-table-show">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>{" "}
            entries
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontSize: ".97rem" }}>Search:</label>
            <input className="admin-table-search" value={search} onChange={e => setSearch(e.target.value)} />
            <button className="admin-btn admin-btn-primary add-user-btn">+ Add User</button>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Business Name</th>
                <th>User Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map((user, idx) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.business}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={"admin-status-badge " + (user.status === "Active" ? "active" : "inactive")}>
                      {user.status}
                    </span>
                    <button className="admin-tag-btn edit-btn"><span role="img" aria-label="Edit">✏️</span> Edit</button>
                    <button className="admin-tag-btn delete-btn"><span role="img" aria-label="Delete">🗑️</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>Showing 1 to 5 of 5 entries</span>
          <div className="admin-pagination">
            <span className="admin-pagination-btn active">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
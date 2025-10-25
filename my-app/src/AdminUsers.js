import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./AdminUsers.css";
import feather from "feather-icons";

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
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [users, setUsers] = useState(sampleUsers);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter card: preserves your filter functionality
  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = sampleUsers;
    if (filters.business)
      filtered = filtered.filter(u => u.business.toLowerCase().includes(filters.business.toLowerCase()));
    if (filters.name)
      filtered = filtered.filter(u => u.name.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.email)
      filtered = filtered.filter(u => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.phone)
      filtered = filtered.filter(u => u.phone.includes(filters.phone));
    if (filters.role)
      filtered = filtered.filter(u => u.role === filters.role);
    if (filters.status)
      filtered = filtered.filter(u => u.status === filters.status);

    setUsers(filtered);
    setCurrentPage(1);
  };
  const handleFilterReset = () => {
    setFilters({ business: "", name: "", email: "", phone: "", role: "Support Admin", status: "" });
    setUsers(sampleUsers);
    setSearch("");
    setCurrentPage(1);
  };

  // Table search
  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setUsers(sampleUsers);
      setCurrentPage(1);
      return;
    }
    const filtered = sampleUsers.filter(u =>
      u.name.toLowerCase().includes(value.toLowerCase()) ||
      u.email.toLowerCase().includes(value.toLowerCase()) ||
      u.phone.includes(value) ||
      u.business.toLowerCase().includes(value.toLowerCase()) ||
      u.role.toLowerCase().includes(value.toLowerCase())
    );
    setUsers(filtered);
    setCurrentPage(1);
  };

  const toggleUserStatus = (email) => {
    setUsers(users.map(u =>
      u.email === email
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    ));
  };

  const handleDelete = (email) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.email !== email));
    }
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = users.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(users.length / parseInt(entriesPerPage));

  useEffect(() => {
    // Initialize toggle buttons
    const toggleButtons = window.$('.toggle-btn');
    toggleButtons.bootstrapToggle();

    // Cleanup function to destroy toggle buttons
    return () => {
      toggleButtons.bootstrapToggle('destroy');
    };
  }, [currentEntries]); // Re-run when entries change to catch new buttons

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <Layout>
        <main className="admin-users-page dashboard-main width-100">
          {/* Page Title */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <h4 className="page-title">Admin Users</h4>
              </div>
            </div>
          </div>

          {/* Filter Card stays exactly as your version */}
          <div className="row">
            <div className="col-12">
              <div className="admin-card card">
                <div className="card-body">
                  <div className="admin-filter-title header-title">Filter</div>
                  <form className="admin-filter-form" onSubmit={handleFilterSearch}>
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
                      <div className="admin-filter-col filter-actions buttons-row">
                        <button type="submit" className="btn btn-blue admin-filter-button">
                           Search
                        </button>
                        <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleFilterReset}>
                           Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* User Table, actions, and pagination, using Layout sample styles */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="dataTables_length" id="basic-datatable_length">
                        <label className="form-label">
                          Show{" "}
                          <select
                            name="basic-datatable_length"
                            aria-controls="basic-datatable"
                            className="form-select form-select-sm"
                            value={entriesPerPage}
                            onChange={e => {
                              setEntriesPerPage(e.target.value);
                              setCurrentPage(1);
                            }}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>entries
                        </label>
                      </div>
                      <div className="d-flex">
                        <div id="basic-datatable_filter" className="dataTables_filter">
                          <label>
                                                          <input
                                                            type="search"
                                                            className="form-control form-control-sm search-input"
                                                            placeholder="Search..."
                                                            aria-controls="basic-datatable"
                                                            value={search}
                                                            onChange={e => handleTableSearch(e.target.value)}
                                                          />                          </label>
                        </div>
                        <a
                          href="#"
                          className="btn btn-sm btn-primary ms-2 add-user-btn"
                          onClick={e => e.preventDefault()}
                        >
                          <i data-feather="plus"></i>Add User
                        </a>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        <table
                          className="table dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                          aria-describedby="basic-datatable_info"
                        >
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
                            {currentEntries.map((user, idx) => (
                              <tr key={user.email} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.business}</td>
                                <td>{user.role}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="toggle-btn"
                                    data-toggle="toggle"
                                    data-on="Active"
                                    data-off="Inactive"
                                    data-onstyle="success"
                                    data-offstyle="danger"
                                    checked={user.status === "Active"}
                                    onChange={() => toggleUserStatus(user.email)}
                                  />
                                  <a
                                    href="#"
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                    onClick={e => e.preventDefault()}
                                  >
                                    <i data-feather="edit"></i>
                                    <span className="hidden-xs hidden-sm">Edit</span>
                                  </a>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={e => {
                                      e.preventDefault();
                                      handleDelete(user.email);
                                    }}
                                  >
                                    <i data-feather="trash-2"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12 col-md-5">
                        <div className="dataTables_info" id="basic-datatable_info" role="status" aria-live="polite">
                          Showing {users.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, users.length)} of {users.length} entries
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-7">
                        <div className="dataTables_paginate paging_simple_numbers" id="basic-datatable_paginate">
                          <ul className="pagination pagination-rounded">
                            <li className={`paginate_button page-item previous ${currentPage === 1 ? "disabled" : ""}`}>
                              <a
                                href="#"
                                className="page-link"
                                onClick={e => {
                                  e.preventDefault();
                                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                                }}
                              >
                                <i data-feather="chevron-left"></i>
                              </a>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                              <li key={i} className={`paginate_button page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                <a
                                  href="#"
                                  className="page-link"
                                  onClick={e => {
                                    e.preventDefault();
                                    setCurrentPage(i + 1);
                                  }}
                                >{i + 1}</a>
                              </li>
                            ))}
                            <li className={`paginate_button page-item next ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                              <a
                                href="#"
                                className="page-link"
                                onClick={e => {
                                  e.preventDefault();
                                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                }}
                              >
                                <i data-feather="chevron-right"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> {/* end card-body */}
              </div> {/* end card */}
            </div>
          </div>
        </main>
    </Layout>
  );
}
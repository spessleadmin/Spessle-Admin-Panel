import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./AdminUsers.css";
import feather from "feather-icons";

const roles = ["business", "customer", "Support Admin", "Vendor Admin"];
const statuses = ["Active", "Inactive"];

export default function AdminUsers() {
  const [filters, setFilters] = useState({
    name: "", email: "", phone: "", role: "", status: ""
  });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5050/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.users);
        setAllUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const sortUsers = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'role') {
        aValue = a.role ? a.role.roleName : '';
        bValue = b.role ? b.role.roleName : '';
      }

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = {
      name: params.get('name') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || '',
      role: params.get('role') || '',
      status: params.get('status') || '',
    };
    setFilters(initialFilters);
  }, []);

  // Filter card: preserves your filter functionality
  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = allUsers;
    if (filters.name)
      filtered = filtered.filter(u => u.username.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.email)
      filtered = filtered.filter(u => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.phone)
      filtered = filtered.filter(u => u.phonenum.includes(filters.phone));
    if (filters.role)
      filtered = filtered.filter(u => u.role && u.role.roleName === filters.role);
    if (filters.status)
      filtered = filtered.filter(u => u.status === filters.status);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

    setUsers(filtered);
    setCurrentPage(1);
  };
  const handleFilterReset = () => {
    setFilters({ name: "", email: "", phone: "", role: "", status: "" });
    setUsers(allUsers);
    setSearch("");
    setCurrentPage(1);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Table search
  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setUsers(allUsers);
      setCurrentPage(1);
      return;
    }
    const filtered = allUsers.filter(u =>
      u.username.toLowerCase().includes(value.toLowerCase()) ||
      u.email.toLowerCase().includes(value.toLowerCase()) ||
      u.phonenum.includes(value) ||
      (u.role && u.role.roleName.toLowerCase().includes(value.toLowerCase()))
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
    if (toggleButtons.length > 0) {
      toggleButtons.bootstrapToggle();
    }

    // Cleanup function to destroy toggle buttons
    return () => {
      if (toggleButtons.length > 0) {
        toggleButtons.bootstrapToggle('destroy');
      }
    };
  }, [currentEntries]); // Re-run when entries change to catch new buttons

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <Layout>
        <main className="admin-users-page dashboard-main" style={{ width: '100%' }}>
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
                          <option value="">Select Role</option>
                          {roles.map(role => <option key={role} value={role}>{role}</option>)}
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
                                                                                          className="form-control form-control-sm"
                                                                                          placeholder="Search..."
                                                                                          aria-controls="basic-datatable"
                                                                                          value={search}
                                                                                          onChange={e => handleTableSearch(e.target.value)}
                                                                                          style={{ width: '200px', height: '38px' }}
                                                                                        />                          </label>
                        </div>
                        <button
                          className="btn btn-blue btn-sm ms-2 add-user-table-btn"
                          onClick={e => e.preventDefault()}
                        >
                          <i data-feather="plus"></i>Add User
                        </button>
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
                              <th className="sortable-header" onClick={() => sortUsers('id')}>
                                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                              </th>
                              <th className="sortable-header" onClick={() => sortUsers('username')}>
                                Name {sortConfig.key === 'username' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                              </th>
                              <th className="sortable-header" onClick={() => sortUsers('email')}>
                                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                              </th>
                              <th className="sortable-header" onClick={() => sortUsers('phonenum')}>
                                Phone {sortConfig.key === 'phonenum' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                              </th>
                              <th className="sortable-header" onClick={() => sortUsers('role')}>
                                User Role {sortConfig.key === 'role' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                              </th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentEntries.map((user, idx) => (
                              <tr key={user.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phonenum}</td>
                                <td>{user.role ? user.role.roleName : ''}</td>
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
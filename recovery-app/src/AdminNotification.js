import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import "./Notification.css";
import feather from "feather-icons";

const placeholderNotifications = [
  { id: 1, name: 'Business A', dateTime: '2022-08-21 10:00', orderId: '12345', message: 'Your order has been shipped.' },
  { id: 2, name: 'Customer B', dateTime: '2022-08-22 11:30', orderId: '12346', message: 'Your appointment is confirmed.' },
  { id: 3, name: 'Business C', dateTime: '2022-08-23 14:00', orderId: '12347', message: 'New promotion available.' },
  { id: 4, name: 'Customer D', dateTime: '2022-08-24 16:45', orderId: '12348', message: 'Your invoice is ready.' },
  { id: 5, name: 'Business E', dateTime: '2022-08-25 09:00', orderId: '12349', message: 'Your table reservation is successful.' },
];

export default function Notification() {
  const [filters, setFilters] = useState({ filterBy: "", dateRange: "" });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [notifications, setNotifications] = useState(placeholderNotifications);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    feather.replace();
  }, [notifications, currentPage, entriesPerPage]);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = placeholderNotifications;
    if (filters.filterBy) {
        // This is a placeholder for actual filtering logic
        filtered = placeholderNotifications.filter(n => n.name.toLowerCase().includes(filters.filterBy.toLowerCase()));
    }
    if (filters.dateRange) {
        // This is a placeholder for actual date range filtering
    }
    setNotifications(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({ filterBy: "", dateRange: "" });
    setNotifications(placeholderNotifications);
    setSearch("");
    setCurrentPage(1);
  };

  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setNotifications(placeholderNotifications);
      setCurrentPage(1);
      return;
    }
    const filtered = placeholderNotifications.filter(n =>
      n.name.toLowerCase().includes(value.toLowerCase()) ||
      n.orderId.toLowerCase().includes(value.toLowerCase()) ||
      n.message.toLowerCase().includes(value.toLowerCase())
    );
    setNotifications(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
    }
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = notifications.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(notifications.length / parseInt(entriesPerPage));
  
  return (
    <Layout>
      <main className="notification-page dashboard-main" style={{ width: '100%' }}>
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Notifications</h4>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Filter</div>
                <form className="admin-filter-form" onSubmit={handleFilterSearch}>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Filter by</label>
                      <select
                        value={filters.filterBy}
                        onChange={e => setFilters(f => ({ ...f, filterBy: e.target.value }))}
                      >
                        <option value="">Select...</option>
                        <option value="Business Name">Business Name</option>
                        <option value="Customer Name">Customer Name</option>
                      </select>
                    </div>
                    <div className="admin-filter-col">
                      <label>Date Range</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="08-20-2022 to 08-26-2022"
                        value={filters.dateRange}
                        onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value }))}
                      />
                    </div>
                    <div className="admin-filter-col filter-actions buttons-row" style={{ alignSelf: 'flex-end' }}>
                      <button type="submit" className="btn btn-blue admin-filter-button">
                        Filter
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

        {/* Notifications Table */}
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
                          />
                        </label>
                      </div>
                      <button
                        className="btn btn-blue btn-sm ms-2 add-user-table-btn"
                        onClick={e => e.preventDefault()}
                      >
                        <i data-feather="plus"></i>Add
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
                            <th>Name</th>
                            <th>Date & Time</th>
                            <th>Order ID</th>
                            <th>Notification Message</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {currentEntries.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No notifications found.</td></tr>
                          ) : (
                            currentEntries.map((notification, idx) => (
                              <tr key={notification.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>{notification.name}</td>
                                <td>{notification.dateTime}</td>
                                <td>{notification.orderId}</td>
                                <td>{notification.message}</td>
                                <td>
                                  <Link
                                    to={`/edit-notification/${notification.id}`}
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                  >
                                    <i data-feather="edit"></i>
                                    <span className="hidden-xs hidden-sm">Edit</span>
                                  </Link>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={e => {
                                      e.preventDefault();
                                      handleDelete(notification.id);
                                    }}
                                  >
                                    <i data-feather="trash-2"></i>
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="row">
                    <div className="col-sm-12 col-md-5">
                      <div className="dataTables_info" id="basic-datatable_info" role="status" aria-live="polite">
                        Showing {notifications.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, notifications.length)} of {notifications.length} entries
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

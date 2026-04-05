import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Notification.css";
import feather from "feather-icons";

export default function UserNotification() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cachedUserInfo = localStorage.getItem("user-info");
    if (cachedUserInfo) {
      const userInfo = JSON.parse(cachedUserInfo);
      if (userInfo.user && userInfo.user.length > 0) {
        setUser(userInfo.user[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5050/users/${user.id}/notifications`)
        .then((response) => response.json())
        .then((data) => {
          setNotifications(data.notifications);
        })
        .catch((error) => console.error("Error fetching notifications:", error));
    }
  }, [user]);

  useEffect(() => {
    feather.replace();
  }, [notifications, currentPage, entriesPerPage]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      const updatedNotifications = notifications.filter((n) => n.id !== id);
      setNotifications(updatedNotifications);
    }
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = notifications.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(notifications.length / parseInt(entriesPerPage));

  return (
    <main
        className="notification-page dashboard-main"
        style={{ width: "100%" }}
      >
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">User Notifications</h4>
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
                    <div
                      className="dataTables_length"
                      id="basic-datatable_length"
                    >
                      <label className="form-label">
                        Show{" "}
                        <select
                          name="basic-datatable_length"
                          aria-controls="basic-datatable"
                          className="form-select form-select-sm"
                          value={entriesPerPage}
                          onChange={(e) => {
                            setEntriesPerPage(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        entries
                      </label>
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
                            <th>Notification Title</th>
                            <th>Type Name</th>
                            <th>Date & Time</th>
                            <th>Receiving User ID</th>
                            <th>Sender User ID</th>
                            <th>Username</th>
                            <th>Notification Message</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentEntries.length === 0 ? (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                No notifications found.
                              </td>
                            </tr>
                          ) : (
                            currentEntries.map((notification, idx) => (
                              <tr
                                key={notification.id}
                                className={idx % 2 === 0 ? "odd" : "even"}
                              >
                                <td>{notification.title}</td>
                                <td>{notification.type.type_name}</td>
                                <td>
                                  {new Date(
                                    notification.sentAt
                                  ).toLocaleString()}
                                </td>
                                <td>{notification.userId}</td>
                                <td>{notification.sentFromId}</td>
                                <td>{notification.sender_user.username}</td>
                                <td>{notification.message}</td>
                                <td>
                                  <Link
                                    to={`/notification/${notification.id}`}
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                  >
                                    <i data-feather="eye"></i>
                                    <span className="hidden-xs hidden-sm">
                                      View
                                    </span>
                                  </Link>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={(e) => {
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
                      <div
                        className="dataTables_info"
                        id="basic-datatable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing{" "}
                        {notifications.length > 0 ? indexOfFirstEntry + 1 : 0}{" "}
                        to {Math.min(indexOfLastEntry, notifications.length)} of{" "}
                        {notifications.length} entries
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-7">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="basic-datatable_paginate"
                      >
                        <ul className="pagination pagination-rounded">
                          <li
                            className={`paginate_button page-item previous ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <a
                              href="#"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                  setCurrentPage(currentPage - 1);
                              }}
                            >
                              <i data-feather="chevron-left"></i>
                            </a>
                          </li>
                          {[...Array(totalPages)].map((_, i) => (
                            <li
                              key={i}
                              className={`paginate_button page-item ${
                                currentPage === i + 1 ? "active" : ""
                              }`}
                            >
                              <a
                                href="#"
                                className="page-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(i + 1);
                                }}
                              >
                                {i + 1}
                              </a>
                            </li>
                          ))}
                          <li
                            className={`paginate_button page-item next ${
                              currentPage === totalPages || totalPages === 0
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <a
                              href="#"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages)
                                  setCurrentPage(currentPage + 1);
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
              </div>{" "}
              {/* end card-body */}
            </div>{" "}
            {/* end card */}
          </div>
        </div>
      </main>
  );
}

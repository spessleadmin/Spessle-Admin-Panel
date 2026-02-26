import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import feather from "feather-icons";
import { getNotifications } from "./utils/api";
import "./NotificationSidebar.css";

export default function NotificationSidebar({ isNotificationOpen, onClose, user }) {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && user.id) {
      getNotifications(user.id)
        .then(data => {
          setNotifications(data.notifications);
          setAllNotifications(data.notifications);
        })
        .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [user]);

  useEffect(() => {
    feather.replace();
  }, [notifications]);

  const handleSearch = (value) => {
    setSearch(value);
    if (!value.trim()) {
      setNotifications(allNotifications);
      return;
    }
    const filtered = allNotifications.filter(n =>
      n.title.toLowerCase().includes(value.toLowerCase()) ||
      n.message.toLowerCase().includes(value.toLowerCase())
    );
    setNotifications(filtered);
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
      setAllNotifications(updatedNotifications);
    }
  };

  return (
    <aside className={`notification-sidebar ${isNotificationOpen ? "open" : ""}`}>
      <div className="notification-sidebar-header">
        <h4 className="notification-sidebar-title">Notifications</h4>
        <button className="btn-close" onClick={onClose}>
            <i data-feather="x"></i>
        </button>
      </div>
      <div className="notification-sidebar-search">
        <input
          type="search"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className="notification-sidebar-body">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications found.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <div className="notification-item-header">
                <span className="notification-item-name">{notification.title}</span>
                <span className="notification-item-time">{new Date(notification.sentAt).toLocaleString()}</span>
              </div>
              <div className="notification-item-body">
                <p>{notification.message}</p>
              </div>
                <div className="notification-item-footer">
                    <Link
                        to={`/admin-notification/${notification.id}`}
                        title="View"
                        className="btn btn-xs btn-warning edit-btn"
                        >
                        <i data-feather="eye"></i>
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
                </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
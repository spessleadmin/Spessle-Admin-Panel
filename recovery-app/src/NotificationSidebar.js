import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import feather from "feather-icons";
import "./NotificationSidebar.css";

const placeholderNotifications = [
  { id: 1, name: 'Business A', dateTime: '2022-08-21 10:00', orderId: '12345', message: 'Your order has been shipped.' },
  { id: 2, name: 'Customer B', dateTime: '2022-08-22 11:30', orderId: '12346', message: 'Your appointment is confirmed.' },
  { id: 3, name: 'Business C', dateTime: '2022-08-23 14:00', orderId: '12347', message: 'New promotion available.' },
  { id: 4, name: 'Customer D', dateTime: '2022-08-24 16:45', orderId: '12348', message: 'Your invoice is ready.' },
  { id: 5, name: 'Business E', dateTime: '2022-08-25 09:00', orderId: '12349', message: 'Your table reservation is successful.' },
];

export default function NotificationSidebar({ isNotificationOpen, onClose }) {
  const [notifications, setNotifications] = useState(placeholderNotifications);
  const [search, setSearch] = useState("");

  useEffect(() => {
    feather.replace();
  }, [notifications]);

  const handleSearch = (value) => {
    setSearch(value);
    if (!value.trim()) {
      setNotifications(placeholderNotifications);
      return;
    }
    const filtered = placeholderNotifications.filter(n =>
      n.name.toLowerCase().includes(value.toLowerCase()) ||
      n.orderId.toLowerCase().includes(value.toLowerCase()) ||
      n.message.toLowerCase().includes(value.toLowerCase())
    );
    setNotifications(filtered);
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
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
                <span className="notification-item-name">{notification.name}</span>
                <span className="notification-item-time">{notification.dateTime}</span>
              </div>
              <div className="notification-item-body">
                <p>{notification.message}</p>
              </div>
                <div className="notification-item-footer">
                    <Link
                        to={`/edit-notification/${notification.id}`}
                        title="Edit"
                        className="btn btn-xs btn-warning edit-btn"
                        >
                        <i data-feather="edit"></i>
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
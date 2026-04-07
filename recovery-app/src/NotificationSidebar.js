import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import feather from "feather-icons";
import api, { markNotificationAsRead } from "./utils/api";
import { API_BASE_URL } from "./config";
import "./NotificationSidebar.css";

export default function NotificationSidebar({ isNotificationOpen, onClose, user, initialNotifications = [] }) {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setNotifications(initialNotifications);
    setAllNotifications(initialNotifications);
  }, [initialNotifications]);

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
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const response = await api(`${API_BASE_URL}/notifications/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete notification");
        const updatedNotifications = notifications.filter(n => n.id !== id);
        setNotifications(updatedNotifications);
        setAllNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Failed to delete notification.");
      }
    }
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId)
      .then(() => {
        const updatedNotifications = notifications.map(n =>
          n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
        );
        setNotifications(updatedNotifications);
        setAllNotifications(updatedNotifications);
      })
      .catch(err => console.error("Failed to mark notification as read", err));
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
            <div key={notification.id} className={`notification-item ${!notification.readAt ? 'notification-item-unread' : ''}`}>
              <div className="notification-item-header">
                <span className="notification-item-name">{notification.title}</span>
                <span className="notification-item-time">{new Date(notification.sentAt).toLocaleString()}</span>
              </div>
              <div className="notification-item-body">
                <p>{notification.message}</p>
              </div>
                <div className="notification-item-footer">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleMarkAsRead(notification.id);
                        }}
                        title="Mark as Read"
                        className="btn btn-xs btn-warning edit-btn"
                        >
                        <i data-feather="eye"></i>
                        </a>
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
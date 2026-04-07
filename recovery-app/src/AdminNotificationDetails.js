


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./AdminNotificationDetails.css";
import feather from "feather-icons";
import { API_BASE_URL } from "./config";
import api from "./utils/api";

export default function AdminNotificationDetails() {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    api(`${API_BASE_URL}/notifications/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setNotification(data.notification);
      })
      .catch((error) =>
        console.error("Error fetching notification details:", error)
      );
  }, [id]);

  useEffect(() => {
    if (notification) {
      feather.replace();
    }
  }, [notification]);

  if (!notification) {
    return (
      <main
          className="edit-notification-page dashboard-main"
          style={{ width: "100%" }}
        >
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <h4 className="page-title">Notification Details</h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="admin-card card">
                <div className="card-body">
                  <p>Loading notification details...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
    );
  }

  return (
    <main
        className="edit-notification-page dashboard-main"
        style={{ width: "100%" }}
      >
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Notification Details</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">
                  Notification Information
                </div>
                <div className="notification-details">
                  <p><strong>Title:</strong> {notification.title}</p>
                  <p><strong>Message:</strong> {notification.message}</p>
                  <p><strong>Sent At:</strong> {new Date(notification.sentAt).toLocaleString()}</p>
                  <p><strong>Read At:</strong> {notification.readAt ? new Date(notification.readAt).toLocaleString() : 'Not read yet'}</p>
                  <p><strong>Username:</strong> {notification.sender_user.username}</p>
                  <p><strong>Type:</strong> {notification.type.type_name}</p>
                  <p><strong>Type Description:</strong> {notification.type.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}



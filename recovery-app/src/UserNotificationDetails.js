import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";

import "./AdminNotificationDetails.css";
import feather from "feather-icons";

export default function UserNotificationDetails() {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
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
          const notif = data.notifications.find(n => n.id === id);
          setNotification(notif);
        })
        .catch((error) =>
          console.error("Error fetching notification details:", error)
        );
    }
  }, [id, user]);

  useEffect(() => {
    if (notification) {
      feather.replace();
    }
  }, [notification]);

  if (!notification) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
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
                  <p><strong>ID:</strong> {notification.id}</p>
                  <p><strong>Title:</strong> {notification.title}</p>
                  <p><strong>Message:</strong> {notification.message}</p>
                  <p><strong>Sent At:</strong> {new Date(notification.sentAt).toLocaleString()}</p>
                  <p><strong>Read At:</strong> {notification.readAt ? new Date(notification.readAt).toLocaleString() : 'Not read yet'}</p>
                  <p><strong>User ID:</strong> {notification.userId}</p>
                  <p><strong>Username:</strong> {notification.sender_user.username}</p>
                  <p><strong>Sender User ID:</strong> {notification.sentFromId}</p>
                  <p><strong>Type:</strong> {notification.type.type_name}</p>
                  <p><strong>Type Description:</strong> {notification.type.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import "./EditNotification.css";
import feather from "feather-icons";

const placeholderNotifications = [
  { id: 1, name: 'Business A', dateTime: '2022-08-21 10:00', medium: 'Email', message: 'Your order has been shipped.' },
  { id: 2, name: 'Customer B', dateTime: '2022-08-22 11:30', medium: 'SMS', message: 'Your appointment is confirmed.' },
  { id: 3, name: 'Business C', dateTime: '2022-08-23 14:00', medium: 'App', message: 'New promotion available.' },
  { id: 4, name: 'Customer D', dateTime: '2022-08-24 16:45', medium: 'Email', message: 'Your invoice is ready.' },
  { id: 5, name: 'Business E', dateTime: '2022-08-25 09:00', medium: 'SMS', message: 'Your table reservation is successful.' },
];

export default function EditNotification() {
  const { id } = useParams();
  const [initialNotificationState, setInitialNotificationState] = useState({});
  const [notificationInfo, setNotificationInfo] = useState({
    name: "",
    medium: "",
    message: "",
  });

  useEffect(() => {
    const notification = placeholderNotifications.find(n => n.id.toString() === id);
    if (notification) {
      setInitialNotificationState(notification);
      setNotificationInfo({
        name: notification.name,
        medium: notification.medium,
        message: notification.message,
      });
    }
  }, [id]);

  useEffect(() => {
    feather.replace();
  }, [notificationInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotificationInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving Notification:", notificationInfo);
    alert("Notification saved! (Check console for data)");
  };

  const handleReset = () => {
    setNotificationInfo({
        name: initialNotificationState.name,
        medium: initialNotificationState.medium,
        message: initialNotificationState.message,
    });
  };

  return (
    <Layout>
      <main className="edit-notification-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit Notification</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Notification Information</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={notificationInfo.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Notification Medium</label>
                      <select
                        className="form-control"
                        name="medium"
                        value={notificationInfo.medium}
                        onChange={handleChange}
                      >
                        <option value="">Select Medium</option>
                        <option value="App">App</option>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col" style={{ width: "100%" }}>
                      <label>Notification Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows="4"
                        value={notificationInfo.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleSave}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleReset}>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}



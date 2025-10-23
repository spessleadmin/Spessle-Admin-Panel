import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

const stats = [
  {
    icon: "users",
    iconColor: "#9178e3",
    value: "58,947",
    label: "Total Registered Customers",
  },
  {
    icon: "settings",
    iconColor: "#73c4b9",
    value: "5,145",
    label: "Totals Registered Business",
  },
  {
    icon: "calendar",
    iconColor: "#6ec2e4",
    value: "45%",
    label: "Newly Registered Business (1 m...",
  },
];

export default function Dashboard() {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="dashboard-root">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">
            <img
              src="https://codingincloud.com/spessle/html/assets/images/logo-dark.png"
              alt="Spessle"
              className="logo-img-header"
              draggable="false"
            />
          </div>
          <button className="hamburger-btn" title="Toggle Menu">
            <i data-feather="menu"></i>
          </button>
        </div>
        <div className="header-right">
          <button className="icon-btn" title="Fullscreen">
            <i data-feather="maximize-2"></i>
          </button>
          <div className="icon-badge-btn" title="Notifications">
            <i data-feather="bell"></i>
            <span className="badge">9</span>
          </div>
          <div className="header-profile">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="avatar"
              draggable="false"
            />
            <span>
              Geneva
              <br />
              <b>Spessle</b>
            </span>
            <i data-feather="chevron-down" className="dropdown-arrow"></i>
          </div>
        </div>
      </div>

      <div className="dashboard-content-row">
        {/* Sidebar as component */}
        <Sidebar openSubmenu={openSubmenu} setOpenSubmenu={setOpenSubmenu} />
        {/* Main */}
        <main className="dashboard-main">
          <h2>Dashboard</h2>
          <div className="dashboard-cards">
            {stats.map(({ icon, iconColor, value, label }, idx) => (
              <div className="dashboard-card" key={label}>
                <span
                  className="dashboard-card-icon"
                  style={{ borderColor: iconColor }}
                >
                  <i
                    data-feather={icon}
                    style={{ color: iconColor }}
                  ></i>
                </span>
                <div className="dashboard-card-content">
                  <div className="dashboard-card-value">{value}</div>
                  <div className="dashboard-card-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
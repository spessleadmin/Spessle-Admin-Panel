
import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    feather.replace();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`dashboard-root ${isCollapsed ? "sidebar-collapsed" : ""}`}>
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
          <button className="hamburger-btn" title="Toggle Menu" onClick={toggleSidebar}>
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
        <Sidebar isCollapsed={isCollapsed} />
        {/* Main */}
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}

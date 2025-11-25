
import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import Sidebar from "./Sidebar";
import api from "./utils/api";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    feather.replace();

    const fetchUserInfo = async () => {
      try {
        const response = await api("http://localhost:5050/user-info");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
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
              src={user ? user.profilepictureurl || "https://randomuser.me/api/portraits/women/44.jpg" : "https://randomuser.me/api/portraits/women/44.jpg"}
              alt="Profile"
              className="avatar"
              draggable="false"
            />
            <span>
              {user ? user.username : "Loading..."}
              <br />
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

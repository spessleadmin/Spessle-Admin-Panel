
import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import { Link } from "react-router-dom"; // Add this line
import Sidebar from "./Sidebar";
import NotificationSidebar from "./NotificationSidebar";
import api from "./utils/api";
import "./Layout.css"; // Add this line
import "./NotificationSidebar.css";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setisNotificationOpen] = useState(false);

  useEffect(() => {
    feather.replace();

    const fetchUserInfo = async () => {
      console.log("Fetching user info..."); // Log start
      try {
        const cachedUserInfo = localStorage.getItem("user-info");
        console.log("Cached user info:", cachedUserInfo); // Log cache
        if (cachedUserInfo) {
          const userInfo = JSON.parse(cachedUserInfo);
          if (userInfo.users && userInfo.users.length > 0) {
            setUser(userInfo.users[0]);
            console.log("User set from cache:", userInfo.users[0]); // Log user from cache
            return;
          }
        }

        console.log("Fetching from API..."); // Log API fetch
        const response = await api("http://localhost:5050/user-info");
        console.log("API response:", response); // Log response
        const data = await response.json();
        console.log("API data:", data); // Log data

        if (data.user && data.user.length > 0) {
          setUser(data.user);
          localStorage.setItem("user-info", JSON.stringify(data));
          console.log("User set from API:", data.user); // Log user from API
        } else if (data.user) { // Fallback for old structure
          setUser(data.user);
          localStorage.setItem("user-info", JSON.stringify({ user: [data.user] }));
          console.log("User set from API (fallback):"); // Log user from API fallback
        } else {
          console.log("No user data found in API response.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error); // Ensure this is logged
      }
    };

    fetchUserInfo();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleNotificationSidebar = () => {
    setisNotificationOpen(!isNotificationOpen);
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
          <button className="icon-badge-btn" title="Notifications" onClick={toggleNotificationSidebar}>
            <i data-feather="bell"></i>
            <span className="badge">9</span>
          </button>
          <div className="header-profile" onClick={toggleProfileDropdown}>
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
            {isProfileOpen && ( // Add dropdown
              <div className="profile-dropdown-menu">
                <Link to={user ? `/edit-user/${user.id}` : '#'} className={`dropdown-item ${!user ? 'disabled' : ''}`}>
                  Edit User
                </Link>
                <Link to="/logout" className="dropdown-item">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-content-row">
        {/* Sidebar as component */}
        <Sidebar isCollapsed={isCollapsed} />
        <NotificationSidebar 
            isNotificationOpen={isNotificationOpen}
            onClose={toggleNotificationSidebar}
        />
        {/* Main */}
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}

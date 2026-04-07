
import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import { Link, Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import NotificationSidebar from "./NotificationSidebar";
import { getNotifications } from "./utils/api";
import api from "./utils/api";
import "./Layout.css"; // Add this line
import "./NotificationSidebar.css";
import { API_BASE_URL } from "./config";

export default function Layout() {
  const hasToken = !!Cookies.get("token");

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    feather.replace();

  }, [isCollapsed]);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setisNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && user.id) {
      getNotifications(user.id)
        .then(data => {
          setUnreadCount(data.unread_count);
        })
        .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [user]);

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
        const response = await api(`${API_BASE_URL}/user-info`);
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

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

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
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <div className="header-profile" onClick={toggleProfileDropdown}>
            <img
              src={user ? user.profilepictureurl || "https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png" : "https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png"}
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
            user={user}
        />
        {/* Main */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

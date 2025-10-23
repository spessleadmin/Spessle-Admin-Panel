import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import "./Dashboard.css";

const sidebarLinks = [
  {
    label: "Dashboard",
    icon: "layout"
  },
  {
    label: "User Management",
    icon: "users",
    hasSub: true,
    subItems: [
      { label: "Manage Admin Users" },
      { label: "Customer Management" },
    ]
  },
  { label: "Manage Business", icon: "briefcase" },
  { label: "Manage Categories", icon: "grid" },
  { label: "Manage Attributes", icon: "file-text" },
  { label: "Manage Product", icon: "package" },
  { label: "Manage Orders", icon: "shopping-cart" },
  { label: "Manage Reviews & Ratings", icon: "star" },
  { label: "Transaction Management", icon: "repeat" },
  { label: "Revenue Management/Report", icon: "bar-chart-2" },
  { label: "Notification", icon: "bell" },
  { label: "Manage Coupons", icon: "percent" },
  { label: "Content Management", icon: "file" },
];

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

// Chevron SVG as React (instant toggle, allows custom color)
function ChevronIcon({ open }) {
  return open ? (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="#138783" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="#138783" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}>
      <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
  );
}

export default function Dashboard() {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="dashboard-root">
      {/* Header */}
      <div className="dashboard-header">
        {/* ... header unchanged ... */}
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
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-links">
            {sidebarLinks.map((item, idx) => {
              // Highlight "Dashboard" and "User Management" when open
              const isUserManagement = item.label === "User Management";
              const isActive = idx === 0 || openSubmenu === item.label;
              const submenuOpen = openSubmenu === item.label;
              return (
                <React.Fragment key={item.label}>
                  <div
                    className={
                      "sidebar-link" +
                      (isActive ? " active" : "") +
                      (item.hasSub ? " has-sub" : "")
                    }
                    onClick={() => {
                      if (item.hasSub) {
                        setOpenSubmenu(submenuOpen ? null : item.label);
                      }
                    }}
                    style={{
                      cursor: item.hasSub ? "pointer" : "default",
                      color: isActive ? "#138783" : "#7f91a9",
                      fontWeight: isActive ? 600 : 500,
                      background: submenuOpen ? "#F2FAFA" : ""
                    }}
                  >
                    <span className="sidebar-icon" style={{ color: isActive ? "#138783" : "#7f91a9" }}>
                      <i data-feather={item.icon}></i>
                    </span>
                    <span className="sidebar-label">{item.label}</span>
                    {item.hasSub && (
                      <span className="sidebar-chevron">
                        <ChevronIcon open={submenuOpen} />
                      </span>
                    )}
                  </div>
                  {/* Submenu */}
                  {item.hasSub && (
                    <div
                      className={
                        "sidebar-submenu" + (submenuOpen ? " open" : "")
                      }
                    >
                      {item.subItems.map((sub, subIdx) => (
                        <div
                          className={
                            "sidebar-submenu-item" +
                            (subIdx === 0 ? " selected" : "")
                          }
                          key={sub.label}
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <footer className="sidebar-footer">
            2025 © wesite design by{" "}
            <a href="https://ncrts.com" target="_blank" rel="noopener noreferrer">
              ncrts.com
            </a>
          </footer>
        </aside>

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
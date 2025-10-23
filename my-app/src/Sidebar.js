import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import "./Sidebar.css";

// Sidebar data (move this here for easy management)
const sidebarLinks = [
  { label: "Dashboard", icon: "layout" },
  {
    label: "User Management",
    icon: "users",
    hasSub: true,
    subItems: [
      { label: "Manage Admin Users", href: "/admin-users" },
      { label: "Customer Management", href: "/customer-management" }
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

function ChevronIcon({ open }) {
  return open ? (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="#138783" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="#138783" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
  );
}

export default function Sidebar({ activePage }) {
  const [openSubmenu, setOpenSubmenu] = useState("User Management");

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-links">
        {sidebarLinks.map((item, idx) => {
          const isActive =
            item.label === activePage ||
            (item.hasSub && item.subItems.some(sub => sub.href === activePage));
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
                  cursor: item.hasSub ? "pointer" : "default"
                }}
              >
                <span className="sidebar-icon">
                  <i data-feather={item.icon}></i>
                </span>
                <span className="sidebar-label">{item.label}</span>
                {item.hasSub && (
                  <span className="sidebar-chevron">
                    <ChevronIcon open={submenuOpen} />
                  </span>
                )}
              </div>
              {item.hasSub && (
                <div
                  className={
                    "sidebar-submenu" + (submenuOpen ? " open" : "")
                  }
                >
                  {item.subItems.map((sub, subIdx) => (
                    <a
                      href={sub.href}
                      key={sub.label}
                      className={
                        "sidebar-submenu-item" +
                        (activePage === sub.href ? " selected" : "")
                      }
                    >
                      {sub.label}
                    </a>
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
  );
}
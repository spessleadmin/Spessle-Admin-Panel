import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import feather from "feather-icons";
import "./Sidebar.css";

const initialSidebarLinks = [
  { label: "Dashboard", icon: "layout", href: "/dashboard" },
  {
    label: "User Management",
    icon: "users",
    hasSub: true,
    isOpen: false,
    subItems: [
      { label: "Manage Admin Users", href: "/admin-users" },
      { label: "Customer Management", href: "/customer-management" },
    ],
  },
  { label: "Manage Business", icon: "briefcase", href: "/manage-business" },
  { label: "Manage Categories", icon: "grid", href: "/manage-categories" },
  { label: "Manage Attributes", icon: "file-text", href: "/manage-attributes" },
  { label: "Manage Product", icon: "package", href: "/manage-product" },
  { label: "Manage Orders", icon: "shopping-cart", href: "/manage-orders" },
  { label: "Manage Reviews & Ratings", icon: "star", href: "/manage-reviews" },
  {
    label: "Transaction Management",
    icon: "repeat",
    href: "/transaction-management",
  },
  {
    label: "Revenue Management/Report",
    icon: "bar-chart-2",
    href: "/revenue-management",
  },
  { label: "Notification", icon: "bell", href: "/notification" },
  { label: "Manage Coupons", icon: "percent", href: "/manage-coupons" },
  { label: "Content Management", icon: "file", href: "/content-management" },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="#138783"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={open ? "6 9 12 15 18 9" : "9 6 15 12 9 18"}></polyline>
    </svg>
  );
}

export default function Sidebar({ isCollapsed }) {
  const location = useLocation();
  const [sidebarLinks, setSidebarLinks] = useState(initialSidebarLinks);

  useEffect(() => {
    feather.replace();
  }, [location.pathname, isCollapsed, sidebarLinks]);

  const handleLinkClick = (index) => {
    const newSidebarLinks = [...sidebarLinks];
    if (newSidebarLinks[index].hasSub) {
      newSidebarLinks[index].isOpen = !newSidebarLinks[index].isOpen;
      setSidebarLinks(newSidebarLinks);
    }
  };

  return (
    <aside className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-links">
        {sidebarLinks.map((item, idx) => {
          const isActive =
            item.href === location.pathname ||
            (item.hasSub &&
              item.subItems.some((sub) => sub.href === location.pathname));

          const LinkWrapper = item.hasSub ? "div" : Link;
          const linkProps = item.hasSub ? {} : { to: item.href };

          return (
            <React.Fragment key={item.label}>
              <LinkWrapper
                {...linkProps}
                className={`sidebar-link ${isActive ? "active" : ""} ${
                  item.hasSub ? "has-sub" : ""
                }`}
                onClick={() => handleLinkClick(idx)}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                title={isCollapsed ? item.label : ""}
              >
                <span className="sidebar-icon">
                  <i data-feather={item.icon}></i>
                </span>
                {!isCollapsed && (
                  <span className="sidebar-label">{item.label}</span>
                )}
                {item.hasSub && !isCollapsed && (
                  <span className="sidebar-chevron">
                    <ChevronIcon open={item.isOpen} />
                  </span>
                )}
              </LinkWrapper>
              {item.hasSub && item.isOpen && (
                <div className="sidebar-submenu open">
                  {item.subItems.map((sub, subIdx) => (
                    <Link
                      to={sub.href}
                      key={sub.label}
                      className={`sidebar-submenu-item ${
                        location.pathname === sub.href ? "selected" : ""
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {!isCollapsed && (
        <footer className="sidebar-footer">
          2025 © wesite design by{" "}
          <a
            href="https://ncrts.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            ncrts.com
          </a>
        </footer>
      )}
    </aside>
  );
}

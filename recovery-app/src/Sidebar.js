import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import feather from "feather-icons";
import api from "./utils/api";
import useFeatureFlags from "./hooks/useFeatureFlags";
import "./Sidebar.css";

const initialSidebarLinks = [
  {
    label: "Admin Dashboard",
    icon: "layout",
    href: "/admin-dashboard",
    featureFlag: "admin-dashboard",
  },
  {
    label: "Admin User Management",
    icon: "users",
    href: "/admin-users",
    featureFlag: "admin-user-management",
  },
  {
    label: "Admin Manage Business",
    icon: "briefcase",
    href: "/admin-manage-business",
    featureFlag: "admin-manage-business",
  },
  {
    label: "Manage Business",
    icon: "briefcase",
    href: "/business-details/:id",
    featureFlag: "manage-business"
  },
  {
    label: "Admin Manage Categories",
    icon: "grid",
    href: "/admin-manage-categories",
    featureFlag: "admin-manage-categories",
  },
  {
    label: "Admin Manage Tags",
    icon: "tag",
    href: "/admin-manage-tags",
    featureFlag: "admin-manage-tags",
  },
  {
    label: "Admin Manage Product",
    icon: "package",
    href: "/admin-manage-product",
    featureFlag: "admin-manage-product",
  },
    {
    label: "Manage Product",
    icon: "package",
    href: "/manage-product",
    featureFlag: "manage-product",
  },
  {
    label: "Admin Manage Orders",
    icon: "shopping-cart",
    href: "/admin-manage-orders",
    featureFlag: "admin-manage-orders",
  },
  {
    label: "Manage Orders",
    icon: "shopping-cart",
    href: "/manage-orders",
    featureFlag: "manage-orders",
  },
  {
    label: "Manage Reviews",
    icon: "star",
    href: "/manage-reviews",
    featureFlag: "manage-reviews",
  },
  {
    label: "Admin Manage Reviews",
    icon: "star",
    href: "/admin-manage-reviews",
    featureFlag: "admin-manage-reviews",
  },
  {
    label: "Transaction Management",
    icon: "repeat",
    href: "/transaction-management",
    featureFlag: "transaction-management",
  },
  {
    label: "Admin Transaction Management",
    icon: "repeat",
    href: "/admin-transaction-management",
    featureFlag: "admin-transaction-management",
  },
  {
    label: "Revenue Reports",
    icon: "bar-chart-2",
    href: "/revenue-management",
    featureFlag: "revenue-reports",
  },
  {
    label: "Admin Revenue Reports",
    icon: "bar-chart-2",
    href: "/admin-revenue-management",
    featureFlag: "admin-revenue-reports",
  },
  {
    label: "Notification",
    icon: "bell",
    href: "/notification",
    featureFlag: "notification",
  },
  {
    label: "Admin Notification",
    icon: "bell",
    href: "/admin-notification",
    featureFlag: "admin-notification",
  },
  {
    label: "Manage Coupons",
    icon: "percent",
    href: "/manage-coupons",
    featureFlag: "manage-coupons",
  },
  {
    label: "Admin Manage Coupons",
    icon: "percent",
    href: "/admin-manage-coupons",
    featureFlag: "admin-manage-coupons",
  }
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
  const featureFlags = useFeatureFlags();
  const [sidebarLinks, setSidebarLinks] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api("http://localhost:5050/user-info");
        const data = await response.json();
        const businessId = data.user.businesses_on_user[0]?.id;
        const updatedLinks = initialSidebarLinks.map((link) => {
          if (link.label === "Manage Business") {
            return { ...link, href: `/business-details/${businessId}` };
          }
          return link;
        });

        const filteredLinks = updatedLinks.filter(
          (link) => !link.featureFlag || featureFlags[link.featureFlag]
        );
        setSidebarLinks(filteredLinks);
      } catch (error) {
        console.error("Error fetching user info:", error);
        const filteredLinks = initialSidebarLinks.filter(
          (link) => !link.featureFlag || featureFlags[link.featureFlag]
        );
        setSidebarLinks(filteredLinks);
      }
    };

    fetchUserInfo();
  }, [featureFlags]);

  useEffect(() => {
    feather.replace();
  }, [location.pathname, isCollapsed, sidebarLinks]); // Removed isProfileOpen

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
    </aside>
  );
}
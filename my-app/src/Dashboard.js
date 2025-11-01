import React from "react";
import Layout from "./Layout";
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
  return (
    <Layout>
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
    </Layout>
  );
}
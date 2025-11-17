import React, { useEffect, useState } from "react"; // ✅ Added useState and useEffect
import Layout from "./Layout";
import "./Dashboard.css";

export default function Dashboard() {
  // ✅ State to store the API stats
  const [stats, setStats] = useState([
    {
      icon: "users",
      iconColor: "#9178e3",
      value: "—", // placeholder
      label: "Total Customers",
    },
    {
      icon: "users",
      iconColor: "#9178e3",
      value: "—", // placeholder
      label: "Total Registered Users",
    },
    {
      icon: "settings",
      iconColor: "#73c4b9",
      value: "—",
      label: "Total Registered Businesses",
    },
  ]);

  // ✅ Fetch real data from backend on component mount
  useEffect(() => {
    fetch("http://localhost:5050/stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // ✅ Update the stat values dynamically
        setStats([
          {
            icon: "users",
            iconColor: "#9178e3",
            value: data.total_customers.toLocaleString(),
            label: "Total Customers",
          },
          {
            icon: "users",
            iconColor: "#9178e3",
            value: data.total_users.toLocaleString(),
            label: "Total Registered Users",
          },
          {
            icon: "settings",
            iconColor: "#73c4b9",
            value: data.total_businesses.toLocaleString(),
            label: "Total Registered Businesseses",
          },
          {
            icon: "calendar",
            iconColor: "#6ec2e4",
            value: data.new_businesses_last_24h.toString(),
            label: "Newly Registered Businesses (24h)",
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  }, []);

  return (
    <Layout>
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        {stats.map(({ icon, iconColor, value, label }) => (
          <div className="dashboard-card" key={label}>
            <span
              className="dashboard-card-icon"
              style={{ borderColor: iconColor }}
            >
              <i data-feather={icon} style={{ color: iconColor }}></i>
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

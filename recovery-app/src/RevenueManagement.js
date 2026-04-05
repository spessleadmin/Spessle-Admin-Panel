import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./RevenueManagement.css";
import feather from "feather-icons";
import api from "./utils/api";

export default function RevenueManagement() {
  const [filters, setFilters] = useState({ businessName: "", dateRange: "" });
  const [activeTimeRange, setActiveTimeRange] = useState("1 Month");
  const [businessId, setBusinessId] = useState(null); // Add businessId state
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRefunds: 0,
  });
  const [allTimeRevenueMetrics, setAllTimeRevenueMetrics] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRefunds: 0,
  });
  const location = useLocation();

  useEffect(() => {
    const fetchAllTimeRevenueMetrics = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const businessIdFromQuery = params.get("business_id");

        let currentBusinessId = businessIdFromQuery;

        if (!currentBusinessId) {
          const userInfoResponse = await api("http://localhost:5050/user-info");
          if (!userInfoResponse.ok) {
            throw new Error(`HTTP error! status: ${userInfoResponse.status}`);
          }
          const userInfo = await userInfoResponse.json();
          currentBusinessId = userInfo.user.businesses_on_user[0]?.id;
        }

        setBusinessId(currentBusinessId);

        if (!currentBusinessId) {
          throw new Error("Business ID not found. Cannot fetch revenue metrics.");
        }

        const response = await fetch(
          `http://localhost:5050/businesses/${currentBusinessId}/revenue-metrics`
        );
        const data = await response.json();
        setAllTimeRevenueMetrics(data);
      } catch (error) {
        console.error("Error fetching all-time revenue metrics:", error);
      }
    };

    fetchAllTimeRevenueMetrics();
  }, [location.search]);

  useEffect(() => {
    const fetchRevenueMetrics = async () => {
      if (!businessId) return;

      let url = `http://localhost:5050/businesses/${businessId}/revenue-metrics`;
      if (activeTimeRange !== "All") {
        const month = activeTimeRange.split(" ")[0];
        url += `?month=${month}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setRevenueMetrics(data);
      } catch (error) {
        console.error("Error fetching revenue metrics:", error);
      }
    };

    fetchRevenueMetrics();
  }, [activeTimeRange, businessId]);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    // Placeholder for filter logic
    console.log("Filtering with:", filters);
  };

  const handleFilterReset = () => {
    setFilters({ businessName: "", dateRange: "" });
  };

  const calculatePercentage = (current, allTime) => {
    if (allTime === 0) return "N/A";
    const percentage = ((current / allTime) * 100).toFixed(2);
    return `${percentage}%`;
  };

  return (
    <main className="revenue-management-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Revenue Management</h4>
            </div>
          </div>
        </div>

        

        {/* Stats Card */}
        <div className="row stats-card-row">
          <div className="col-md-3">
            <div className="stat-box">
              <h5>TOTAL EARNINGS</h5>
              <div className="main-stat">${revenueMetrics.totalEarnings}</div>
              <div className="sub-stat">
                <span className="text-success">
                  {calculatePercentage(
                    revenueMetrics.totalEarnings,
                    allTimeRevenueMetrics.totalEarnings
                  )}
                </span>{" "}
                Total Earnings: ${allTimeRevenueMetrics.totalEarnings}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-box">
              <h5>ORDERS</h5>
              <div className="main-stat">{revenueMetrics.totalOrders}</div>
              <div className="sub-stat">
                <span className="text-success">
                  {calculatePercentage(
                    revenueMetrics.totalOrders,
                    allTimeRevenueMetrics.totalOrders
                  )}
                </span>{" "}
                Total Orders: {allTimeRevenueMetrics.totalOrders}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-box">
              <h5>CUSTOMERS</h5>
              <div className="main-stat">{revenueMetrics.totalCustomers}</div>
              <div className="sub-stat">
                <span className="text-success">
                  {calculatePercentage(
                    revenueMetrics.totalCustomers,
                    allTimeRevenueMetrics.totalCustomers
                  )}
                </span>{" "}
                Total Customers: {allTimeRevenueMetrics.totalCustomers}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card revenue-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title">Revenue</h4>
                  <div className="btn-group" role="group">
                    {["All", "1 Month", "6 months", "12 months"].map(range => (
                      <button
                        key={range}
                        type="button"
                        className={`btn ${activeTimeRange === range ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTimeRange(range)}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="revenue-stats-container">
                  <div className="revenue-stat-item orders">
                    <div className="stat-header">
                      <span className="stat-label">Orders</span>
                      <span dangerouslySetInnerHTML={{ __html: feather.icons['shopping-cart'].toSvg({ color: '#fff', width: 20, height: 20 }) }} />
                    </div>
                    <div className="stat-value">{revenueMetrics.totalOrders}</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="revenue-stat-item earnings">
                    <div className="stat-header">
                      <span className="stat-label">Earnings</span>
                      <span dangerouslySetInnerHTML={{ __html: feather.icons['dollar-sign'].toSvg({ color: '#fff', width: 20, height: 20 }) }} />
                    </div>
                    <div className="stat-value">${revenueMetrics.totalEarnings}</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="revenue-stat-item refunds">
                    <div className="stat-header">
                      <span className="stat-label">Refunds</span>
                      <span dangerouslySetInnerHTML={{ __html: feather.icons['refresh-cw'].toSvg({ color: '#fff', width: 20, height: 20 }) }} />
                    </div>
                    <div className="stat-value">{revenueMetrics.totalRefunds}</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}

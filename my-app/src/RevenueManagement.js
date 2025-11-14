import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./RevenueManagement.css";
import feather from "feather-icons";

export default function RevenueManagement() {
  const [filters, setFilters] = useState({ businessName: "", dateRange: "" });
  const [activeTimeRange, setActiveTimeRange] = useState("1 Month");

  useEffect(() => {
    feather.replace();
  }, []);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    // Placeholder for filter logic
    console.log("Filtering with:", filters);
  };

  const handleFilterReset = () => {
    setFilters({ businessName: "", dateRange: "" });
  };

  return (
    <Layout>
      <main className="revenue-management-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Revenue Management</h4>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Filter</div>
                <form className="admin-filter-form" onSubmit={handleFilterSearch}>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                        value={filters.businessName}
                        onChange={e => setFilters(f => ({ ...f, businessName: e.target.value }))}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Date Range</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select date range"
                        value={filters.dateRange}
                        onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value }))}
                      />
                    </div>
                    <div className="admin-filter-col filter-actions buttons-row" style={{ alignSelf: 'flex-end' }}>
                      <button type="submit" className="btn btn-blue admin-filter-button">
                        Filter
                      </button>
                      <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleFilterReset}>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="row stats-card-row">
          <div className="col-md-3">
            <div className="stat-box">
              <h5>TOTAL EARNINGS</h5>
              <div className="main-stat">$31,570</div>
              <div className="sub-stat">
                <span className="text-success">+10.25%</span> Total Earnings: $3157010.25%
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-box">
              <h5>ORDERS</h5>
              <div className="main-stat">683</div>
              <div className="sub-stat">
                <span className="text-success">+7.85%</span> Total Orders: 2398
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-box">
              <h5>CUSTOMERS</h5>
              <div className="main-stat">345</div>
              <div className="sub-stat">
                <span className="text-success">+3.64%</span> Total Customers: 345
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-box">
              <h5>TOTAL REVENUE</h5>
              <div className="main-stat">$68,541</div>
              <div className="sub-stat">
                <span className="text-success">+17.48%</span> Total revenue: $1.21
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card revenue-card">
              <div className="card-body">
                <h4 className="card-title">Revenue</h4>
                <div className="btn-group" role="group">
                  {["All", "1 Month", "6 months", "1 year"].map(range => (
                    <button
                      key={range}
                      type="button"
                      className={`btn ${activeTimeRange === range ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setActiveTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                
                <div className="revenue-stats-container">
                  <div className="revenue-stat">
                    <div className="icon bg-primary">
                      <i data-feather="shopping-cart"></i>
                    </div>
                    <div className="info">
                      <div className="stat-value">683</div>
                      <div className="stat-label">Orders</div>
                    </div>
                  </div>
                  <div className="revenue-stat">
                    <div className="icon bg-success">
                      <i data-feather="dollar-sign"></i>
                    </div>
                    <div className="info">
                      <div className="stat-value">$31,570</div>
                      <div className="stat-label">Earnings</div>
                    </div>
                  </div>
                  <div className="revenue-stat">
                    <div className="icon bg-danger">
                      <i data-feather="refresh-cw"></i>
                    </div>
                    <div className="info">
                      <div className="stat-value">367</div>
                      <div className="stat-label">Refunds</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

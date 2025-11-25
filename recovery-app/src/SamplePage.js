import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./SamplePage.css";
import feather from "feather-icons";

const categories = ["Food", "Gifts", "Beauty", "Clothing"];

export default function SamplePage() {
  const [filters, setFilters] = useState({
    productName: "", businessName: "", category: "", dateTime: ""
  });

  const handleFilterSearch = (e) => {
    e.preventDefault();
    console.log("Filter Search:", filters);
    // In a real application, you would use these filters to fetch data
  };

  const handleFilterReset = () => {
    setFilters({ productName: "", businessName: "", category: "", dateTime: "" });
    console.log("Filter Reset");
  };

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: '100%' }}>
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Sample Page - Filter Card</h4>
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
                      <label>Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Product Name"
                        value={filters.productName}
                        onChange={e => setFilters(f => ({ ...f, productName: e.target.value }))}
                      />
                    </div>
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
                      <label>Category</label>
                      <select
                        value={filters.category}
                        onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="admin-filter-col">
                      <label>Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={filters.dateTime}
                        onChange={e => setFilters(f => ({ ...f, dateTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="submit" className="btn btn-blue admin-filter-button">
                        Search
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
      </main>
    </Layout>
  );
}

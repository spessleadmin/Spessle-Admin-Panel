import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./ManageCoupons.css"; // Using the same CSS file
import feather from "feather-icons";

// New constants for coupons
const couponTypes = ["One Time"];

const initialCoupons = [
  {
    id: 'C12345',
    couponName: 'Summer Sale',
    couponCode: 'SUMMER25',
    couponType: 'One Time',
    couponAmount: 25,
    businessName: 'The Corner Cafe',
    expiryDate: '2024-12-31',
  },
  {
    id: 'C67890',
    couponName: 'New User Discount',
    couponCode: 'NEWBIE10',
    couponType: 'One Time',
    couponAmount: 10,
    businessName: 'Quick Eats',
    expiryDate: '2024-11-30',
  },
  {
    id: 'C24680',
    couponName: 'Holiday Special',
    couponCode: 'HOLIDAY50',
    couponType: 'One Time',
    couponAmount: 50,
    businessName: 'Gourmet Grill',
    expiryDate: '2025-01-15',
  },
];

export default function ManageCoupons() {
  const [filters, setFilters] = useState({
    businessName: "",
    couponName: "",
    couponType: "",
    expiryDate: "",
  });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  
  const [masterCouponList, setMasterCouponList] = useState(initialCoupons);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    feather.replace();
  }, [coupons, isLoading, error]);

  const sortCoupons = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCoupons = [...coupons].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setCoupons(sortedCoupons);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = {
      businessName: params.get('businessName') || '',
      couponName: params.get('couponName') || '',
      couponType: params.get('couponType') || '',
      expiryDate: params.get('expiryDate') || '',
    };
    setFilters(initialFilters);
  }, []);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterCouponList;
    if (filters.businessName)
      filtered = filtered.filter(c => c.businessName.toLowerCase().includes(filters.businessName.toLowerCase()));
    if (filters.couponName)
      filtered = filtered.filter(c => c.couponName.toLowerCase().includes(filters.couponName.toLowerCase()));
    if (filters.couponType)
      filtered = filtered.filter(c => c.couponType === filters.couponType);
    if (filters.expiryDate)
      filtered = filtered.filter(c => c.expiryDate.startsWith(filters.expiryDate));

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

    setCoupons(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({ businessName: "", couponName: "", couponType: "", expiryDate: "" });
    setCoupons(masterCouponList);
    setSearch("");
    setCurrentPage(1);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setCoupons(masterCouponList);
      setCurrentPage(1);
      return;
    }
    const filtered = masterCouponList.filter(c =>
      c.couponName.toLowerCase().includes(value.toLowerCase()) ||
      c.couponCode.toLowerCase().includes(value.toLowerCase()) ||
      c.businessName.toLowerCase().includes(value.toLowerCase()) ||
      c.couponAmount.toString().includes(value)
    );
    setCoupons(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const updatedCoupons = coupons.filter(c => c.id !== id);
      const updatedMasterList = masterCouponList.filter(c => c.id !== id);

      setCoupons(updatedCoupons);
      setMasterCouponList(updatedMasterList);
    }
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = coupons.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(coupons.length / parseInt(entriesPerPage));
  
  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Coupons</h4>
            </div>
          </div>
        </div>

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
                      <label>Coupon Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Coupon Name"
                        value={filters.couponName}
                        onChange={e => setFilters(f => ({ ...f, couponName: e.target.value }))}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Coupon Type</label>
                      <select
                        value={filters.couponType}
                        onChange={e => setFilters(f => ({ ...f, couponType: e.target.value }))}
                      >
                        <option value="">Select type</option>
                        {couponTypes.map(type => <option key={type}>{type}</option>)}
                      </select>
                    </div>
                    <div className="admin-filter-col">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={filters.expiryDate}
                        onChange={e => setFilters(f => ({ ...f, expiryDate: e.target.value }))}
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

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="dataTables_wrapper dt-bootstrap5 no-footer">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="dataTables_length" id="basic-datatable_length">
                      <label className="form-label">
                        Show{" "}
                        <select
                          name="basic-datatable_length"
                          aria-controls="basic-datatable"
                          className="form-select form-select-sm"
                          value={entriesPerPage}
                          onChange={e => {
                            setEntriesPerPage(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>entries
                      </label>
                    </div>
                    <div className="d-flex">
                      <div id="basic-datatable_filter" className="dataTables_filter">
                        <label>
                          <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            aria-controls="basic-datatable"
                            value={search}
                            onChange={e => handleTableSearch(e.target.value)}
                            style={{ width: '200px', height: '38px' }}
                          />
                        </label>
                      </div>
                      <button
                        className="btn btn-blue btn-sm ms-2 add-user-table-btn"
                        onClick={e => e.preventDefault()}
                      >
                        <i data-feather="plus"></i>Add Coupon
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <table
                        className="table dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        aria-describedby="basic-datatable_info"
                      >
                        <thead>
                          <tr>
                            <th className="sortable-header" onClick={() => sortCoupons('couponName')}>
                              Coupon Name {sortConfig.key === 'couponName' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCoupons('couponCode')}>
                              Coupon Code {sortConfig.key === 'couponCode' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCoupons('couponType')}>
                              Coupon Type {sortConfig.key === 'couponType' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCoupons('couponAmount')}>
                              Coupon Amount {sortConfig.key === 'couponAmount' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCoupons('businessName')}>
                              Business Name {sortConfig.key === 'businessName' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCoupons('expiryDate')}>
                              Expiry Date {sortConfig.key === 'expiryDate' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading coupons...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No coupons found.</td></tr>
                          ) : (
                            currentEntries.map((coupon, idx) => (
                              <tr key={coupon.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>
                                  <a href="#" onClick={e => e.preventDefault()}>{coupon.couponName}</a>
                                </td>
                                <td>{coupon.couponCode}</td>
                                <td>{coupon.couponType}</td>
                                <td>${coupon.couponAmount.toFixed(2)}</td>
                                <td>{coupon.businessName}</td>
                                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td>
                                  <a
                                    href="#"
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                    onClick={e => e.preventDefault()}
                                  >
                                    <i data-feather="edit"></i>
                                    <span className="hidden-xs hidden-sm">Edit</span>
                                  </a>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={e => {
                                      e.preventDefault();
                                      handleDelete(coupon.id);
                                    }}
                                  >
                                    <i data-feather="trash-2"></i>
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 col-md-5">
                      <div className="dataTables_info" id="basic-datatable_info" role="status" aria-live="polite">
                        Showing {coupons.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, coupons.length)} of {coupons.length} entries
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-7">
                      <div className="dataTables_paginate paging_simple_numbers" id="basic-datatable_paginate">
                        <ul className="pagination pagination-rounded">
                          <li className={`paginate_button page-item previous ${currentPage === 1 ? "disabled" : ""}`}>
                            <a
                              href="#"
                              className="page-link"
                              onClick={e => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }}
                            >
                              <i data-feather="chevron-left"></i>
                            </a>
                          </li>
                          {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`paginate_button page-item ${currentPage === i + 1 ? "active" : ""}`}>
                              <a
                                href="#"
                                className="page-link"
                                onClick={e => {
                                  e.preventDefault();
                                  setCurrentPage(i + 1);
                                }}
                              >{i + 1}</a>
                            </li>
                          ))}
                          <li className={`paginate_button page-item next ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                            <a
                              href="#"
                              className="page-link"
                              onClick={e => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }}
                            >
                              <i data-feather="chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
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

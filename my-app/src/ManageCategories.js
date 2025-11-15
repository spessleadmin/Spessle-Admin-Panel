import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import "./ManageCategories.css";
import feather from "feather-icons";

const placeholderCategories = [
  { id: 'CAT-01', category: 'Electronics', image: 'https://via.placeholder.com/40', active: true },
  { id: 'CAT-02', category: 'Books', image: 'https://via.placeholder.com/40', active: false },
  { id: 'CAT-03', category: 'Home Goods', image: 'https://via.placeholder.com/40', active: true },
  { id: 'CAT-04', category: 'Clothing', image: 'https://via.placeholder.com/40', active: true },
  { id: 'CAT-05', category: 'Toys', image: 'https://via.placeholder.com/40', active: false },
];

export default function ManageCategories() {
  const [filters, setFilters] = useState({ category: "" });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [categories, setCategories] = useState(placeholderCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    feather.replace();
  }, [categories, currentPage, entriesPerPage]);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = placeholderCategories;
    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    setCategories(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({ category: "" });
    setCategories(placeholderCategories);
    setSearch("");
    setCurrentPage(1);
  };

  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setCategories(placeholderCategories);
      setCurrentPage(1);
      return;
    }
    const filtered = placeholderCategories.filter(c =>
      c.category.toLowerCase().includes(value.toLowerCase()) ||
      c.id.toLowerCase().includes(value.toLowerCase())
    );
    setCategories(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter(c => c.id !== id);
      setCategories(updatedCategories);
    }
  };

  const toggleActive = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = categories.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(categories.length / parseInt(entriesPerPage));

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Categories</h4>
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
                      <label>Category</label>
                      <select
                        value={filters.category}
                        onChange={e => setFilters({ category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {placeholderCategories.map(cat => <option key={cat.id}>{cat.category}</option>)}
                      </select>
                    </div>
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
                    <div className="dataTables_length">
                      <label className="form-label">
                        Show{" "}
                        <select
                          className="form-select form-select-sm"
                          value={entriesPerPage}
                          onChange={e => { setEntriesPerPage(e.target.value); setCurrentPage(1); }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </select> entries
                      </label>
                    </div>
                    <div className="d-flex">
                      <div className="dataTables_filter">
                        <label>
                          <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={search}
                            onChange={e => handleTableSearch(e.target.value)}
                            style={{ width: '200px', height: '38px' }}
                          />
                        </label>
                      </div>
                      <button className="btn btn-blue btn-sm ms-2 add-user-table-btn">
                        <i data-feather="plus"></i>Add Category
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <table className="table dt-responsive nowrap w-100 dataTable no-footer dtr-inline">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentEntries.map((cat, idx) => (
                            <tr key={cat.id} className={idx % 2 === 0 ? "odd" : "even"}>
                              <td>{cat.id.replace('CAT-', '')}</td>
                              <td>{cat.category}</td>
                              <td><img src={cat.image} alt={cat.category} style={{ width: '40px', height: '40px', borderRadius: '4px' }} /></td>
                              <td className="d-flex align-items-center">
                                <button className="btn btn-blue btn-sm" style={{ marginRight: '5px' }}>
                                  <i data-feather="plus"></i>
                                </button>
                                <div className={`rectangular-slider ${cat.active ? 'active' : 'inactive'}`} onClick={() => toggleActive(cat.id)}>
                                  <div className="slider-text">{cat.active ? 'Active' : 'Inactive'}</div>
                                </div>
                                <a
                                  href="#"
                                  className="action-icon text-danger"
                                  onClick={(e) => { e.preventDefault(); handleDelete(cat.id); }}
                                  style={{ marginLeft: '10px' }}
                                >
                                  <i data-feather="trash-2"></i>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 col-md-5">
                      <div className="dataTables_info">
                        Showing {categories.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, categories.length)} of {categories.length} entries
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-7">
                      <div className="dataTables_paginate paging_simple_numbers">
                        <ul className="pagination pagination-rounded">
                          <li className={`paginate_button page-item previous ${currentPage === 1 ? "disabled" : ""}`}>
                            <a href="#" className="page-link" onClick={e => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}>
                              <i data-feather="chevron-left"></i>
                            </a>
                          </li>
                          {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`paginate_button page-item ${currentPage === i + 1 ? "active" : ""}`}>
                              <a href="#" className="page-link" onClick={e => { e.preventDefault(); setCurrentPage(i + 1); }}>{i + 1}</a>
                            </li>
                          ))}
                          <li className={`paginate_button page-item next ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                            <a href="#" className="page-link" onClick={e => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}>
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

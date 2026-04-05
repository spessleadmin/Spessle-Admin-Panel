import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ManageReviews.css";
import api from "./utils/api";
import feather from "feather-icons";

export default function ManageReviews() {
  const [filters, setFilters] = useState({
    reviewerName: "",
    productName: "",
    reviewDate: "",
  });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const [masterReviewList, setMasterReviewList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api("http://localhost:5050/reviews");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        const formattedReviews = data.reviews.map(review => ({
          id: review.id,
          reviewerUsername: review.username,
          productName: review.productname,
          comment: review.comment,
          rating: review.rating,
          createdDate: review.createddate,
        }));
        setMasterReviewList(formattedReviews);
        setReviews(formattedReviews);
      } catch (e) {
        console.error("Failed to load reviews:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const sortReviews = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedReviews = [...reviews].sort((a, b) => {
      // Handle potential undefined values for sorting
      const valA = a[key] !== undefined ? a[key] : '';
      const valB = b[key] !== undefined ? b[key] : '';

      if (valA < valB) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (valA > valB) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setReviews(sortedReviews);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = {
      reviewerName: params.get('reviewerName') || '',
      productName: params.get('productName') || '',
      reviewDate: params.get('reviewDate') || '',
    };
    setFilters(initialFilters);
  }, []);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterReviewList;
    if (filters.reviewerName)
      filtered = filtered.filter(r => r.reviewerUsername.toLowerCase().includes(filters.reviewerName.toLowerCase()));
    if (filters.productName)
      filtered = filtered.filter(r => r.productName.toLowerCase().includes(filters.productName.toLowerCase()));
    if (filters.reviewDate)
      filtered = filtered.filter(r => r.createdDate.startsWith(filters.reviewDate));

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

    setReviews(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({ reviewerName: "", productName: "", reviewDate: "" });
    setReviews(masterReviewList);
    setSearch("");
    setCurrentPage(1);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setReviews(masterReviewList);
      setCurrentPage(1);
      return;
    }
    const filtered = masterReviewList.filter(r =>
      r.reviewerUsername.toLowerCase().includes(value.toLowerCase()) ||
      r.productName.toLowerCase().includes(value.toLowerCase()) ||
      r.comment.toLowerCase().includes(value.toLowerCase()) ||
      r.rating.toString().includes(value)
    );
    setReviews(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const updatedReviews = reviews.filter(r => r.id !== id);
      const updatedMasterList = masterReviewList.filter(r => r.id !== id);

      setReviews(updatedReviews);
      setMasterReviewList(updatedMasterList);
    }
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = reviews.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(reviews.length / parseInt(entriesPerPage));
  
  useEffect(() => {
    feather.replace();
  }, [currentEntries, isLoading, error]);

  return (
    <main className="manage-reviews-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Reviews</h4>
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
                      <label>Reviewer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Reviewer Name"
                        value={filters.reviewerName}
                        onChange={e => setFilters(f => ({ ...f, reviewerName: e.target.value }))}
                      />
                    </div>
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
                      <label>Review Date</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={filters.reviewDate}
                        onChange={e => setFilters(f => ({ ...f, reviewDate: e.target.value }))}
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
                            <th className="sortable-header" onClick={() => sortReviews('reviewerUsername')}>
                              Reviewer Username {sortConfig.key === 'reviewerUsername' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortReviews('productName')}>
                              Product Name {sortConfig.key === 'productName' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th>Comment</th>
                            <th className="sortable-header" onClick={() => sortReviews('rating')}>
                              Rating {sortConfig.key === 'rating' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortReviews('createdDate')}>
                              Created Date {sortConfig.key === 'createdDate' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading reviews...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No reviews found.</td></tr>
                          ) : (
                            currentEntries.map((review, idx) => (
                              <tr key={review.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>{review.reviewerUsername}</td>
                                <td>{review.productName}</td>
                                <td>{review.comment}</td>
                                <td>⭐ {review.rating.toFixed(1)}</td>
                                <td>{review.createdDate ? new Date(review.createdDate).toLocaleString() : "N/A"}</td>
                                <td>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={e => {
                                      e.preventDefault();
                                      handleDelete(review.id);
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
                        Showing {reviews.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, reviews.length)} of {reviews.length} entries
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
              </div> {/* end card-body */}
            </div> {/* end card */}
          </div>
        </div>
      </main>
  );
}
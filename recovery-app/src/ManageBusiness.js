import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import api from "./utils/api";
import "./ManageBusiness.css"; // Using the same CSS file
import feather from "feather-icons";

// New constants for businesses
const categories = ["Food", "Gifts", "Beauty", "Clothing"];

// Helper function to transform complex API data into flat structure for the table
const transformApiBusiness = (apiBusiness) => ({
  id: apiBusiness.id,
  ownerName: apiBusiness.user?.username || "N/A", // Safely access username
  businessName: apiBusiness.businessname,
  rating: (apiBusiness.businessReviews_on_business?.length || 0) > 0
    ? apiBusiness.businessReviews_on_business.reduce((acc, review) => acc + review.rating, 0) / apiBusiness.businessReviews_on_business.length
    : 0.0, // Safely calculate average rating
  phoneNo: apiBusiness.phonenum,
  address: apiBusiness.address,
  category: apiBusiness.category?.categoryname || "N/A", // Safely access category name
});

export default function ManageBusiness() {
  // Updated filter state
  const [filters, setFilters] = useState({
    businessName: "",
    category: "",
    ownerName: "",
  });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  // State for API data
  const [masterBusinessList, setMasterBusinessList] = useState([]); // Holds all businesses from API
  const [businesses, setBusinesses] = useState([]); // Holds filtered/sorted businesses for display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First, fetch user info to get the business ID
        const userInfoResponse = await api("http://localhost:5050/user-info");
        if (!userInfoResponse.ok) {
          throw new Error(`HTTP error! status: ${userInfoResponse.status}`);
        }
        const userInfo = await userInfoResponse.json();
        const businessId = userInfo.businesses_on_user[0]?.id;
        console.log(businessId)
        if (!businessId) {
          throw new Error("Business ID not found in user info.");
        }

        // Now, fetch businesses using the dynamic ID
        const response = await api(
          `http://localhost:5050/businesses/${businessId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform the data to match the table structure
        const businessData = Array.isArray(data.businesses) ? data.businesses : [data.businesses];
        const transformedBusinesses = businessData.map(transformApiBusiness);

        setMasterBusinessList(transformedBusinesses); // Set the master list
        setBusinesses(transformedBusinesses); // Set the initial displayed list
      } catch (e) {
        console.error("Failed to fetch businesses:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []); // Empty dependency array ensures this runs once on mount

  // Sort function
  const sortBusinesses = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedBusinesses = [...businesses].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setBusinesses(sortedBusinesses);
  };

  // Get initial filters from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = {
      businessName: params.get("businessName") || "",
      category: params.get("category") || "",
      ownerName: params.get("ownerName") || "",
    };
    setFilters(initialFilters);
  }, []);

  // Filter card: updated to filter 'masterBusinessList'
  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterBusinessList; // Start from the master list
    if (filters.businessName)
      filtered = filtered.filter((b) =>
        b.businessName.toLowerCase().includes(filters.businessName.toLowerCase())
      );
    if (filters.category)
      filtered = filtered.filter((b) => b.category === filters.category);
    if (filters.ownerName)
      filtered = filtered.filter((b) =>
        b.ownerName.toLowerCase().includes(filters.ownerName.toLowerCase())
      );

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    setBusinesses(filtered); // Set the displayed businesses
    setCurrentPage(1);
  };

  // Updated to reset to 'masterBusinessList'
  const handleFilterReset = () => {
    setFilters({ businessName: "", category: "", ownerName: "" });
    setBusinesses(masterBusinessList); // Reset to full list
    setSearch("");
    setCurrentPage(1);
    window.history.pushState({}, "", window.location.pathname);
  };

  // Table search: updated to filter 'masterBusinessList'
  const handleTableSearch = (value) => {
    setSearch(value);
    if (!value.trim()) {
      setBusinesses(masterBusinessList); // Reset to full list
      setCurrentPage(1);
      return;
    }
    const filtered = masterBusinessList.filter(
      (b) => // Filter from master list
        b.businessName.toLowerCase().includes(value.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(value.toLowerCase()) ||
        b.category.toLowerCase().includes(value.toLowerCase()) ||
        b.phoneNo.includes(value) ||
        b.address.toLowerCase().includes(value.toLowerCase())
    );
    setBusinesses(filtered);
    setCurrentPage(1);
  };

  // Updated to delete from both master and displayed lists
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      // Here you would typically make an API call to delete the business
      // For now, we'll just update the state
      const updatedBusinesses = businesses.filter((b) => b.id !== id);
      const updatedMasterList = masterBusinessList.filter((b) => b.id !== id);

      setBusinesses(updatedBusinesses);
      setMasterBusinessList(updatedMasterList);
    }
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = businesses.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(businesses.length / parseInt(entriesPerPage));

  useEffect(() => {
    feather.replace();
  }, [currentEntries, isLoading, error]); // Re-run when entries, loading, or error change

  return (
    <Layout>
      <main
        className="manage-business-page dashboard-main"
        style={{ width: "100%" }}
      >
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Business</h4>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Filter</div>
                <form
                  className="admin-filter-form"
                  onSubmit={handleFilterSearch}
                >
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                        value={filters.businessName}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            businessName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Owner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Owner Name"
                        value={filters.ownerName}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            ownerName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, category: e.target.value }))
                        }
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button
                        type="submit"
                        className="btn btn-blue admin-filter-button"
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary admin-filter-button"
                        onClick={handleFilterReset}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Business Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="dataTables_wrapper dt-bootstrap5 no-footer">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div
                      className="dataTables_length"
                      id="basic-datatable_length"
                    >
                      <label className="form-label">
                        Show{" "}
                        <select
                          name="basic-datatable_length"
                          aria-controls="basic-datatable"
                          className="form-select form-select-sm"
                          value={entriesPerPage}
                          onChange={(e) => {
                            setEntriesPerPage(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        entries
                      </label>
                    </div>
                    <div className="d-flex">
                      <div
                        id="basic-datatable_filter"
                        className="dataTables_filter"
                      >
                        <label>
                          <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            aria-controls="basic-datatable"
                            value={search}
                            onChange={(e) => handleTableSearch(e.target.value)}
                            style={{ width: "200px", height: "38px" }}
                          />
                        </label>
                      </div>
                      <button
                        className="btn btn-blue btn-sm ms-2 add-user-table-btn"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i data-feather="plus"></i>Add Business
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
                            <th
                              className="sortable-header"
                              onClick={() => sortBusinesses("id")}
                            >
                              ID{" "}
                              {sortConfig.key === "id"
                                ? sortConfig.direction === "ascending"
                                  ? "🔼"
                                  : "🔽"
                                : ""}
                            </th>
                            <th
                              className="sortable-header"
                              onClick={() => sortBusinesses("ownerName")}
                            >
                              Owner Name{" "}
                              {sortConfig.key === "ownerName"
                                ? sortConfig.direction === "ascending"
                                  ? "🔼"
                                  : "🔽"
                                : ""}
                            </th>
                            <th
                              className="sortable-header"
                              onClick={() => sortBusinesses("businessName")}
                            >
                              Business Name{" "}
                              {sortConfig.key === "businessName"
                                ? sortConfig.direction === "ascending"
                                  ? "🔼"
                                  : "🔽"
                                : ""}
                            </th>
                            <th
                              className="sortable-header"
                              onClick={() => sortBusinesses("rating")}
                            >
                              Ratings{" "}
                              {sortConfig.key === "rating"
                                ? sortConfig.direction === "ascending"
                                  ? "🔼"
                                  : "🔽"
                                : ""}
                            </th>
                            <th>Phone No.</th>
                            <th>Address</th>
                            <th
                              className="sortable-header"
                              onClick={() => sortBusinesses("category")}
                            >
                              Category{" "}
                              {sortConfig.key === "category"
                                ? sortConfig.direction === "ascending"
                                  ? "🔼"
                                  : "🔽"
                                : ""}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                Loading businesses...
                              </td>
                            </tr>
                          ) : error ? (
                            <tr>
                              <td
                                colSpan="8"
                                style={{ textAlign: "center", color: "red" }}
                              >
                                Error: {error}
                              </td>
                            </tr>
                          ) : currentEntries.length === 0 ? (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                No businesses found.
                              </td>
                            </tr>
                          ) : (
                            currentEntries.map((business, idx) => (
                              <tr
                                key={business.id}
                                className={idx % 2 === 0 ? "odd" : "even"}
                              >
                                <td>{business.id.substring(0, 8)}...</td>
                                <td>{business.ownerName}</td>
                                <td>{business.businessName}</td>
                                <td>⭐ {business.rating.toFixed(1)}</td>
                                <td>{business.phoneNo}</td>
                                <td>{business.address}</td>
                                <td>{business.category}</td>
                                <td>
                                  <Link
                                    to={`/business-details/${business.id}`} // Assuming an edit route
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                  >
                                    <i data-feather="edit"></i>
                                    <span className="hidden-xs hidden-sm">
                                      Edit
                                    </span>
                                  </Link>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDelete(business.id);
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

                  {/* Pagination */}
                  <div className="row">
                    <div className="col-sm-12 col-md-5">
                      <div
                        className="dataTables_info"
                        id="basic-datatable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {businesses.length > 0 ? indexOfFirstEntry + 1 : 0}{" "}
                        to {Math.min(indexOfLastEntry, businesses.length)} of{" "}
                        {businesses.length} entries
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-7">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="basic-datatable_paginate"
                      >
                        <ul className="pagination pagination-rounded">
                          <li
                            className={`paginate_button page-item previous ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <a
                              href="#"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                  setCurrentPage(currentPage - 1);
                              }}
                            >
                              <i data-feather="chevron-left"></i>
                            </a>
                          </li>
                          {[...Array(totalPages)].map((_, i) => (
                            <li
                              key={i}
                              className={`paginate_button page-item ${
                                currentPage === i + 1 ? "active" : ""
                              }`}
                            >
                              <a
                                href="#"
                                className="page-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(i + 1);
                                }}
                              >
                                {i + 1}
                              </a>
                            </li>
                          ))}
                          <li
                            className={`paginate_button page-item next ${
                              currentPage === totalPages || totalPages === 0
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <a
                              href="#"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages)
                                  setCurrentPage(currentPage + 1);
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
              </div>{" "}
              {/* end card-body */}
            </div>{" "}
            {/* end card */}
          </div>
        </div>
      </main>
    </Layout>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./utils/api";
import ProductDetailsModal from "./components/ProductDetailsModal";
import "./ManageProduct.css"; // Using the same CSS file
import feather from "feather-icons";
import { API_BASE_URL } from "./config";

// New constants for products
const categories = ["Food", "Gifts", "Beauty", "Clothing"];

// Helper function to transform complex API data into flat structure for the table
const transformApiProduct = (apiProduct) => ({
  id: apiProduct.id,
  // Use the first image URL if it exists, otherwise null
  imageUrl: apiProduct.productimages_on_product[0]?.imageurl || null, 
  businessName: apiProduct.business.businessname,
  category: apiProduct.business.category.categoryname,
  productName: apiProduct.productname,
  cost: apiProduct.price,
  dateTime: apiProduct.createddate, // Using createddate from API
  rating: apiProduct.averageRating // Defaulting rating as it's not in the API response
});

export default function ManageProduct() {
  // Updated filter state
  const [filters, setFilters] = useState({
    productName: "", businessName: "", category: "", dateTime: ""
  });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  
  // State for API data
  const [masterProductList, setMasterProductList] = useState([]); // Holds all products from API
  const [products, setProducts] = useState([]); // Holds filtered/sorted products for display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [businessId, setBusinessId] = useState(null);
  const [detailsProductId, setDetailsProductId] = useState(null);


  // Fetch data from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First, fetch user info to get the business ID
        const userInfoResponse = await api(`${API_BASE_URL}/user-info`);
        if (!userInfoResponse.ok) {
          throw new Error(`HTTP error! status: ${userInfoResponse.status}`);
        }
        const userInfo = await userInfoResponse.json();
        const businessId = userInfo.user.businesses_on_user[0]?.id;
        setBusinessId(businessId);
        if (!businessId) {
          throw new Error("Business ID not found in user info.");
        }

        // Now, fetch products using the dynamic business ID
        const response = await api(
          `${API_BASE_URL}/businesses/${businessId}/products`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform the data to match the table structure
        const transformedProducts = data.products.map(transformApiProduct);

        setMasterProductList(transformedProducts); // Set the master list
        setProducts(transformedProducts); // Set the initial displayed list
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs once on mount

  // Sort function (operates on the currently displayed 'products' state)
  const sortProducts = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedProducts = [...products].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setProducts(sortedProducts);
  };

  // Get initial filters from URL (no change needed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = {
      productName: params.get('productName') || '',
      businessName: params.get('businessName') || '',
      category: params.get('category') || '',
      dateTime: params.get('dateTime') || '',
    };
    setFilters(initialFilters);
  }, []);

  // Filter card: updated to filter 'masterProductList'
  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterProductList; // Start from the master list
    if (filters.productName)
      filtered = filtered.filter(p => p.productName.toLowerCase().includes(filters.productName.toLowerCase()));
    if (filters.businessName)
      filtered = filtered.filter(p => p.businessName.toLowerCase().includes(filters.businessName.toLowerCase()));
    if (filters.category)
      filtered = filtered.filter(p => p.category === filters.category);
    if (filters.dateTime)
      filtered = filtered.filter(p => p.dateTime.startsWith(filters.dateTime));

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

    setProducts(filtered); // Set the displayed products
    setCurrentPage(1);
  };

  // Updated to reset to 'masterProductList'
  const handleFilterReset = () => {
    setFilters({ productName: "", businessName: "", category: "", dateTime: "" });
    setProducts(masterProductList); // Reset to full list
    setSearch("");
    setCurrentPage(1);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Table search: updated to filter 'masterProductList'
  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setProducts(masterProductList); // Reset to full list
      setCurrentPage(1);
      return;
    }
    const filtered = masterProductList.filter(p => // Filter from master list
      p.productName.toLowerCase().includes(value.toLowerCase()) ||
      p.businessName.toLowerCase().includes(value.toLowerCase()) ||
      p.category.toLowerCase().includes(value.toLowerCase()) ||
      p.cost.toString().includes(value) ||
      (p.rating || "").toString().includes(value)
    );
    setProducts(filtered);
    setCurrentPage(1);
  };

  // Updated to delete from both master and displayed lists
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== id);
      const updatedMasterList = masterProductList.filter(p => p.id !== id);

      setProducts(updatedProducts);
      setMasterProductList(updatedMasterList);
    }
  };

  // Pagination logic (no change needed, uses 'products' state)
  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = products.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(products.length / parseInt(entriesPerPage));
  
  useEffect(() => {
    feather.replace();
  }, [currentEntries, isLoading, error]); // Re-run when entries, loading, or error change

  return (
    <main className="manage-product-page dashboard-main" style={{ width: '100%' }}>
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Products</h4>
            </div>
          </div>
        </div>

        {/* Filter Card (no change needed in JSX) */}
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

        {/* Product Table (Top controls no change) */}
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
                      <Link
                        to={`/business/${businessId}/add-product`}
                        className="btn btn-blue btn-sm ms-2 add-user-table-btn"
                      >
                        <i data-feather="plus"></i>Add Product
                      </Link>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <table
                        className="table dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        aria-describedby="basic-datatable_info"
                      >
                        {/* Headers (no change) */}
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th className="sortable-header" onClick={() => sortProducts('businessName')}>
                              Business Name {sortConfig.key === 'businessName' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortProducts('category')}>
                              Category {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortProducts('productName')}>
                              Product Name {sortConfig.key === 'productName' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortProducts('cost')}>
                              Cost {sortConfig.key === 'cost' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortProducts('dateTime')}>
                              Date & Time {sortConfig.key === 'dateTime' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortProducts('rating')}>
                              Rating {sortConfig.key === 'rating' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        
                        {/* === UPDATED TABLE BODY === */}
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading products...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}>No products found.</td></tr>
                          ) : (
                            currentEntries.map((product, idx) => (
                              <tr key={product.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>
                                  {/* VERY SMALL ICON/IMAGE */}
                                  {product.imageUrl ? (
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.productName} 
                                      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                                    />
                                  ) : (
                                    // Fallback placeholder
                                    <span style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '32px', 
                                      height: '32px', 
                                      backgroundColor: '#eee', 
                                      borderRadius: '4px'
                                    }}>
                                      <i data-feather="image" style={{ width: '16px', height: '16px', color: '#aaa' }}></i>
                                    </span>
                                  )}
                                </td>
                                <td>{product.businessName}</td>
                                <td>{product.category}</td>
                                <td>
                                  <a
                                    href="#"
                                    className="product-name-link"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setDetailsProductId(product.id);
                                    }}
                                  >
                                    {product.productName}
                                  </a>
                                </td>
                                <td>${product.cost.toFixed(2)}</td>
                                <td>{new Date(product.dateTime).toLocaleString()}</td>
                                <td>⭐ {product.rating ? product.rating.toFixed(1) : "N/A"}</td>
                                <td>
                                  <Link
                                    to={`/edit-product/${product.id}`}
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                  >
                                    <i data-feather="edit"></i>
                                    <span className="hidden-xs hidden-sm">Edit</span>
                                  </Link>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    onClick={e => {
                                      e.preventDefault();
                                      handleDelete(product.id);
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

                  {/* Pagination (uses 'products' length, no change needed) */}
                  <div className="row">
                    <div className="col-sm-12 col-md-5">
                      <div className="dataTables_info" id="basic-datatable_info" role="status" aria-live="polite">
                        Showing {products.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, products.length)} of {products.length} entries
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

        <ProductDetailsModal
          productId={detailsProductId}
          isOpen={detailsProductId != null}
          onClose={() => setDetailsProductId(null)}
        />
      </main>
  );
}
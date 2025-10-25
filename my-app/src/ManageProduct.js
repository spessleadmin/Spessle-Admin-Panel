import React, { useState, useEffect } from "react";
// Imports for Layout, CSS, and feather-icons are removed as they are now bundled.

// --- BUNDLED CSS ---
// All CSS is included in the Layout component via a <style> tag.
const BundledCss = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    :root {
      --ct-card-spacer-y: 1.5rem;
      --ct-card-spacer-x: 1.5rem;
      --ct-card-border-color: #f7f7f7;
      --ct-card-bg: #fff;
      --ct-card-title-spacer-y: 1.005rem;
      --ct-card-box-shadow: 0 0.75rem 6rem rgba(56,65,74,.03);
      --ct-card-border-radius: 0.25rem;
      --ct-body-font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      --ct-body-font-size: 1rem;
      --ct-body-font-weight: 400;
      --ct-body-line-height: 1.5;
      --ct-body-color: #23272f;
      --ct-body-text-align: left;
      --ct-body-bg: #f6f7fa;
    }

    body,
    #root,
    .dashboard-root {
      font-family: var(--ct-body-font-family);
      background: var(--ct-body-bg);
      color: var(--ct-body-color);
      margin: 0;
      padding: 0;
    }

    .dashboard-root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #15adad;
      height: 68px;
      padding: 0 34px;
      min-width: 0;
      position: relative;
      z-index: 100;
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .dashboard-header-brand {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .dashboard-content-row {
      display: flex;
      flex: 1 1 auto;
      min-height: 0;
      height: calc(100vh - 68px);
    }

    /* --- SIDEBAR --- */
    .dashboard-sidebar {
      width: 258px;
      background: var(--ct-card-bg);
      box-shadow: 4px 0 24px 0 rgba(52,103,153,0.03);
      display: flex;
      flex-direction: column;
      border-bottom-left-radius: 16px;
      position: sticky;
      top: 68px;
      left: 0;
      height: calc(100vh - 68px);
      min-height: 0;
      z-index: 11;
      border-right: 1px solid #f0f1f7;
    }
    .sidebar-links {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 26px 0 0 0;
      overflow-y: auto;
      flex: 1 1 auto;
      min-height: 0;
    }
    .sidebar-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 1.13rem;
      color: #7f91a9;
      padding: 10px 28px 10px 34px;
      font-weight: 500;
      border-radius: 8px 0 0 8px;
      position: relative;
      background: transparent;
      transition: background 0.16s, color 0.16s;
    }
    .sidebar-link.active {
      background: #e8f7f8;
      color: #15adad;
    }
    .sidebar-link.has-sub.active {
      background: #f2fafa;
      color: #138783;
      font-weight: 600;
    }
    .sidebar-link .sidebar-icon {
      min-width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* --- RENAMED CLASS --- */
    .manage-product-page {
      padding: 24px 30px 38px 30px;
      flex: 1;
      overflow-y: auto;
    }

    .manage-product-page h2 {
      font-size: 2rem;
      font-weight: 600;
      margin: 30px 0 24px 0;
      letter-spacing: 0.01em;
    }

    /* Make filter card and form left-aligned and tighter */
    .admin-card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: var(--ct-card-bg);
      background-clip: border-box;
      border: 0 solid var(--ct-card-border-color);
      border-radius: var(--ct-card-border-radius);
      box-shadow: var(--ct-card-box-shadow);
      color: var(--ct-card-color, #23272f);
      padding: var(--ct-card-spacer-y) var(--ct-card-spacer-x);
      margin-bottom: 26px;
    }

    .admin-filter-form {
      display: flex;
      flex-direction: column;
    }

    .admin-filter-title {
      font-size: 1.16rem;
      font-weight: 600;
      color: #222;
      margin-bottom: 18px;
    }
    .admin-filter-row {
      display: flex;
      gap: 18px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .admin-filter-col {
      flex: 1 1 0px;
      min-width: 180px;
      display: flex;
      flex-direction: column;
    }
    .admin-filter-col label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
    }
    .admin-filter-col input,
    .admin-filter-col select {
        display: block;
        width: 100%;
        padding: .45rem .9rem;
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.5;
        color: #6c757d;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #adb5bd;
        border-radius: .2rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    .admin-filter-col input:focus,
    .admin-filter-col select:focus {
      border-color: #15adad;
      outline: 0;
      box-shadow: 0 0 0 0.1rem rgba(21, 173, 173, 0.25);
    }

    .buttons-row {
        flex-direction: row;
        align-items: flex-end;
        gap: 8px;
    }

    .admin-filter-button {
        flex: 1;
        max-width: 120px;
        padding: 10px 12px;
        font-size: 1.05rem;
        border: 1px solid;
    }
    .btn {
        display: inline-block;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        background-color: transparent;
        border: 1px solid transparent;
        padding: .45rem .9rem;
        font-size: .875rem;
        border-radius: .15rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    
    .btn-blue {
        color: #fff;
        background-color: #15adad;
        border-color: #15adad;
    }
    .btn-blue:hover {
        background-color: #129393;
        border-color: #118888;
    }
    
    .btn-secondary {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    }
    .btn-secondary:hover {
        background-color: #5c636a;
        border-color: #565e64;
    }
    
    .btn-warning {
        color: #000;
        background-color: #ffc107;
        border-color: #ffc107;
    }
    
    .edit-btn {
        background: #feeddb;
        color: #8c6623;
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
        margin-right: 0.5rem;
        border: none;
        font-weight: 600;
    }
    .edit-btn:hover {
      background: #f6e3b0;
    }
    
    .action-icon {
      color: #eb4762;
      cursor: pointer;
    }
    .action-icon:hover {
      color: #c72d46;
    }

    .card {
        margin-bottom: 24px;
        box-shadow: var(--ct-card-box-shadow);
    }
    .card-body {
        flex: 1 1 auto;
        padding: 1.5rem 1.5rem;
    }
    
    .dataTables_wrapper {
      width: 100%;
    }
    
    .dataTables_length label {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-select-sm {
      font-size: .76563rem;
      padding: .25rem .5rem;
      font-weight: 400;
      line-height: 1.5;
      color: #6c757d;
      background-color: #fff;
      border: 1px solid #dee2e6;
      border-radius: .2rem;
    }
    .dataTables_filter label {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-control-sm {
      min-height: calc(1.5em + .5rem + 2px);
      padding: .25rem .5rem;
      font-size: .76563rem;
      border-radius: .2rem;
      border: 1px solid #dee2e6;
    }
    
    .add-user-table-btn {
        height: 38px;
        font-size: 0.875rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }
    .ms-2 {
      margin-left: 0.5rem !important;
    }
    .mb-3 {
      margin-bottom: 1rem !important;
    }
    .d-flex {
      display: flex !important;
    }
    .justify-content-between {
      justify-content: space-between !important;
    }
    .align-items-center {
      align-items: center !important;
    }

    .table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        vertical-align: top;
        border-color: #dee2e6;
        border-collapse: collapse;
        font-size: 0.9rem;
    }
    .table th {
      padding: .75rem .75rem;
      vertical-align: bottom;
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
    }
    .table td {
      padding: .75rem .75rem;
      border-bottom: 1px solid #dee2e6;
      vertical-align: middle;
    }
    .table tbody tr:nth-of-type(odd) {
      background-color: rgba(0,0,0,.03);
    }
    .table a {
      color: #15adad;
      text-decoration: none;
    }
    .table a:hover {
      text-decoration: underline;
    }
    
    .sortable-header {
      cursor: pointer;
    }
    
    .pagination {
      display: flex;
      padding-left: 0;
      list-style: none;
      justify-content: flex-end;
    }
    .page-item .page-link {
      position: relative;
      display: block;
      padding: .375rem .75rem;
      margin-left: -1px;
      line-height: 1.25;
      color: #15adad;
      background-color: #fff;
      border: 1px solid #dee2e6;
      cursor: pointer;
    }
    .page-item.active .page-link {
      z-index: 3;
      color: #fff;
      background-color: #15adad;
      border-color: #15adad;
    }
    .page-item.disabled .page-link {
      color: #6c757d;
      pointer-events: none;
      background-color: #fff;
      border-color: #dee2e6;
    }
    .page-item:first-child .page-link {
      border-top-left-radius: .25rem;
      border-bottom-left-radius: .25rem;
    }
    .page-item:last-child .page-link {
      border-top-right-radius: .25rem;
      border-bottom-right-radius: .25rem;
    }
    
    .dataTables_info {
      padding-top: .85em;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .feather {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }

    /* === MODAL STYLES === */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }

    .modal-content {
      background: #fff;
      padding: 1.5rem 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 550px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      opacity: 0;
      transform: scale(0.95);
      animation: modal-fade-in 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }

    @keyframes modal-fade-in {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #23272f;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 5px;
      line-height: 1;
      color: #888;
    }

    .modal-close-btn:hover {
      color: #222;
    }
    
    .modal-close-btn .feather {
      width: 24px;
      height: 24px;
    }

    .modal-body {
      font-size: 1rem;
    }

    .modal-body .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.8rem 0.5rem;
      border-bottom: 1px solid #f7f7f7;
      word-break: break-all; /* Prevents long IDs from overflowing */
    }

    .modal-body .detail-row:last-child {
      border-bottom: none;
    }

    .modal-body .detail-label {
      font-weight: 600;
      color: #555;
      margin-right: 1.5rem;
      white-space: nowrap;
    }

    .modal-body .detail-value {
      color: #222;
      text-align: right;
    }
  `}
  </style>
);

// --- BUNDLED LAYOUT COMPONENT ---

// Basic Header component
const Header = () => (
  <header className="dashboard-header">
    <div className="dashboard-header-brand">Admin Dashboard</div>
    <div>
      {/* Placeholder for user info/logout */}
      <i data-feather="user"></i>
    </div>
  </header>
);

// Basic Sidebar component
const Sidebar = () => (
  <nav className="dashboard-sidebar">
    <div className="sidebar-links">
      <div className="sidebar-link">
        <span className="sidebar-icon"><i data-feather="home"></i></span>
        <span>Dashboard</span>
      </div>
      <div className="sidebar-link active">
        <span className="sidebar-icon"><i data-feather="package"></i></span>
        <span>Products</span>
      </div>
      <div className="sidebar-link">
        <span className="sidebar-icon"><i data-feather="users"></i></span>
        <span>Users</span>
      </div>
      <div className="sidebar-link">
        <span className="sidebar-icon"><i data-feather="settings"></i></span>
        <span>Settings</span>
      </div>
    </div>
  </nav>
);

// Basic Layout component
const Layout = ({ children }) => {
  // Effect to load Feather Icons script
  useEffect(() => {
    const existingScript = document.getElementById('feather-icons-script');
    if (existingScript) {
      if (window.feather) {
        window.feather.replace();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'feather-icons-script';
    script.src = "https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js";
    script.async = true;
    script.onload = () => {
      if (window.feather) {
        window.feather.replace();
      }
    };
    document.body.appendChild(script);
    
    // No cleanup function, script stays loaded
  }, []);

  return (
    <div className="dashboard-root">
      <BundledCss />
      <Header />
      <div className="dashboard-content-row">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

// --- END BUNDLED COMPONENTS ---


// New constants for products
const categories = ["Food", "Gifts", "Beauty", "Clothing"];

// Helper function to transform complex API data into flat structure for the table
const transformApiProduct = (apiProduct) => ({
  id: apiProduct.id,
  imageUrl: apiProduct.productimages_on_product[0]?.imageurl || null, 
  businessName: apiProduct.business.businessname, // This is Vendor Name
  category: apiProduct.business.category.categoryname,
  productName: apiProduct.productname,
  cost: apiProduct.price,
  quantity: apiProduct.quantity, // Added quantity
  dateTime: apiProduct.createddate,
  rating: 0.0 
});

export default function ManageProduct() {
  // Updated filter state
  const [filters, setFilters] = useState({
    productName: "", businessName: "", category: "", dateTime: ""
  });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  
  // State for API data
  const [masterProductList, setMasterProductList] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // State for modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5050/products/state/California');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const transformedProducts = data.products.map(transformApiProduct);
        
        setMasterProductList(transformedProducts);
        setProducts(transformedProducts);
        
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    let filtered = masterProductList;
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

    setProducts(filtered);
    setCurrentPage(1);
  };

  // Updated to reset to 'masterProductList'
  const handleFilterReset = () => {
    setFilters({ productName: "", businessName: "", category: "", dateTime: "" });
    setProducts(masterProductList);
    setSearch("");
    setCurrentPage(1);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Table search: updated to filter 'masterProductList'
  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setProducts(masterProductList);
      setCurrentPage(1);
      return;
    }
    const filtered = masterProductList.filter(p =>
      p.productName.toLowerCase().includes(value.toLowerCase()) ||
      p.businessName.toLowerCase().includes(value.toLowerCase()) ||
      p.category.toLowerCase().includes(value.toLowerCase()) ||
      p.cost.toString().includes(value) ||
      p.rating.toString().includes(value)
    );
    setProducts(filtered);
    setCurrentPage(1);
  };

  // Updated to delete from both master and displayed lists
  const handleDelete = (id) => {
    // Replaced window.confirm with a simple true
    if (true) { // Directly proceed as if confirmed
      console.log("Deleting product:", id);
      const updatedProducts = products.filter(p => p.id !== id);
      const updatedMasterList = masterProductList.filter(p => p.id !== id);

      setProducts(updatedProducts);
      setMasterProductList(updatedMasterList);
    }
  };

  // Modal handler functions
  const handleShowDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = products.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(products.length / parseInt(entriesPerPage));
  
  // Effect to call feather.replace() on updates
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentEntries, isLoading, error, selectedProduct]); 

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: '100%' }}>
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title" style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem'}}>Manage Products</h4>
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
                        className="form-control"
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

        {/* Product Table */}
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
                        <i data-feather="plus" style={{width: '16px', height: '16px'}}></i>Add Product
                      </button>
                    </div>
                  </div>

                  <div className="row" style={{width: '100%', overflowX: 'auto'}}>
                    <div className="col-sm-12" style={{minWidth: '800px'}}>
                      <table
                        className="table dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        aria-describedby="basic-datatable_info"
                      >
                        <thead>
                          <tr>
                            <th className="sortable-header" onClick={() => sortProducts('id')}>
                              ID {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
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
                        
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading products...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center' }}>No products found.</td></tr>
                          ) : (
                            currentEntries.map((product, idx) => (
                              <tr key={product.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td title={product.id}>{product.id.substring(0, 8)}...</td>
                                <td>
                                  {product.imageUrl ? (
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.productName} 
                                      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-flex'; }}
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
                                  {/* Hidden fallback for image error */}
                                  <span style={{ 
                                      display: 'none', 
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '32px', 
                                      height: '32px', 
                                      backgroundColor: '#eee', 
                                      borderRadius: '4px'
                                    }}>
                                      <i data-feather="image" style={{ width: '16px', height: '16px', color: '#aaa' }}></i>
                                  </span>
                                </td>
                                <td>{product.businessName}</td>
                                <td>{product.category}</td>
                                <td>
                                  <a href="#" onClick={e => {
                                    e.preventDefault();
                                    handleShowDetails(product);
                                  }}>
                                    {product.productName}
                                  </a>
                                </td>
                                <td>${product.cost.toFixed(2)}</td>
                                <td>{new Date(product.dateTime).toLocaleString()}</td>
                                <td>⭐ {product.rating.toFixed(1)}</td>
                                <td>
                                  <a
                                    href="#"
                                    title="Edit"
                                    className="btn btn-xs btn-warning edit-btn"
                                    style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}
                                    onClick={e => e.preventDefault()}
                                  >
                                    <i data-feather="edit" style={{width: '14px', height: '14px'}}></i>
                                    <span className="hidden-xs hidden-sm">Edit</span>
                                  </a>
                                  <a
                                    href="#"
                                    className="action-icon text-danger"
                                    title="Delete"
                                    style={{marginLeft: '0.5rem'}}
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

                  {/* Pagination */}
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
                                <i data-feather="chevron-left" style={{width: '16px', height: '16px'}}></i>
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
                                <i data-feather="chevron-right" style={{width: '16px', height: '16px'}}></i>
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
        
        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Product Details</h5>
                <button type="button" className="modal-close-btn" onClick={handleCloseModal}>
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                
                <div className="detail-row">
                  <span className="detail-label">Product ID</span>
                  <span className="detail-value">{selectedProduct.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vendor Name</span>
                  <span className="detail-value">{selectedProduct.businessName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedProduct.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Product Name</span>
                  <span className="detail-value">{selectedProduct.productName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cost</span>
                  <span className="detail-value">${selectedProduct.cost.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantity</span>
                  <span className="detail-value">{selectedProduct.quantity}</span>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </Layout>
  );
}


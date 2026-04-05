import React, { useState, useEffect } from "react";
import api from "./utils/api";
import "./ManageCategories.css";
import feather from "feather-icons";

const transformApiCategory = (apiCategory) => ({
  id: apiCategory.id,
  categoryname: apiCategory.categoryname,
  createddate: apiCategory.createddate,
  updateddate: apiCategory.updateddate,
});

export default function ManageCategories() {
  const [filters, setFilters] = useState({ categoryname: "", dateRange: "" });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [isAddCategoryPopupOpen, setIsAddCategoryPopupOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [masterCategoryList, setMasterCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api('http://localhost:5050/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const transformedCategories = data.categories.map(transformApiCategory);
      
      setMasterCategoryList(transformedCategories);
      setCategories(transformedCategories);
      
    } catch (e) {
      console.error("Failed to fetch categories:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      feather.replace();
    }
  }, [isLoading, categories, currentPage, entriesPerPage]);

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.categoryname);
  };

  const handleCancelClick = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleConfirmClick = async (categoryId) => {
    try {
      const response = await api(`http://localhost:5050/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "categoryname": editingCategoryName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchCategories(); // Re-fetch to get the latest data
      setEditingCategoryId(null);
      setEditingCategoryName("");

    } catch (error) {
      console.error("Failed to update category name:", error);
      // Optionally, show an error message to the user
    }
  };

  const sortCategories = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCategories = [...categories].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setCategories(sortedCategories);
  };

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterCategoryList;
    if (filters.categoryname) {
      filtered = filtered.filter(c => c.categoryname.toLowerCase().includes(filters.categoryname.toLowerCase()));
    }
    if (filters.dateRange) {
      // This is a placeholder for date range filtering logic
    }
    setCategories(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({ categoryname: "", dateRange: "" });
    setCategories(masterCategoryList);
    setSearch("");
    setCurrentPage(1);
  };

  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setCategories(masterCategoryList);
      setCurrentPage(1);
      return;
    }
    const filtered = masterCategoryList.filter(c =>
      c.categoryname.toLowerCase().includes(value.toLowerCase())
    );
    setCategories(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await api(`http://localhost:5050/categories/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchCategories(); // Re-fetch to get the latest data
      } catch (error) {
        console.error("Failed to delete category:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleAddCategory = () => {
    setIsAddCategoryPopupOpen(true);
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api('http://localhost:5050/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryname: newCategoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      await fetchCategories();
      setIsAddCategoryPopupOpen(false);
      setNewCategoryName("");
    } catch (error) {
      console.error("Failed to add category:", error);
      alert(error.message);
    }
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = categories.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(categories.length / parseInt(entriesPerPage));
  
  return (
    <main className="manage-categories-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Categories</h4>
            </div>
          </div>
        </div>

        {isAddCategoryPopupOpen && (
          <div className="add-tag-popup">
            <div className="popup-content">
              <h2>Add Category</h2>
              <form onSubmit={handlePopupSubmit}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddCategoryPopupOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Filter</div>
                <form className="admin-filter-form" onSubmit={handleFilterSearch}>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Category Name"
                        value={filters.categoryname}
                        onChange={e => setFilters(f => ({ ...f, categoryname: e.target.value }))}
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
                        onClick={handleAddCategory}
                      >
                        <span dangerouslySetInnerHTML={{ __html: feather.icons.plus.toSvg({ width: 16, height: 16 }) }} />
                        Add Category
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
                            <th className="sortable-header" onClick={() => sortCategories('categoryname')}>
                              Category Name {sortConfig.key === 'categoryname' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCategories('createddate')}>
                              Created Date {sortConfig.key === 'createddate' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortCategories('updateddate')}>
                              Updated Date {sortConfig.key === 'updateddate' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading categories...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No categories found.</td></tr>
                          ) : (
                            currentEntries.map((category, idx) => (
                              <tr key={category.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>
                                  {editingCategoryId === category.id ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editingCategoryName}
                                      onChange={(e) => setEditingCategoryName(e.target.value)}
                                    />
                                  ) : (
                                    category.categoryname
                                  )}
                                </td>
                                <td>{new Date(category.createddate).toLocaleString()}</td>
                                <td>{new Date(category.updateddate).toLocaleString()}</td>
                                <td>
                                  {editingCategoryId === category.id ? (
                                    <>
                                      <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => handleConfirmClick(category.id)}
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        className="btn btn-xs btn-secondary"
                                        onClick={handleCancelClick}
                                        style={{ marginLeft: '5px' }}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        title="Edit"
                                        className="btn btn-xs btn-warning edit-btn"
                                        onClick={() => handleEditClick(category)}
                                      >
                                        <span dangerouslySetInnerHTML={{ __html: feather.icons.edit.toSvg({ width: 16, height: 16 }) }} />
                                        <span className="hidden-xs hidden-sm">Edit</span>
                                      </button>
                                      <a
                                        href="#"
                                        className="action-icon text-danger"
                                        onClick={e => {
                                          e.preventDefault();
                                          handleDelete(category.id);
                                        }}
                                      >
                                        <span dangerouslySetInnerHTML={{ __html: feather.icons['trash-2'].toSvg({ width: 16, height: 16 }) }} />
                                      </a>
                                    </>
                                  )}
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
                        Showing {categories.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, categories.length)} of {categories.length} entries
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
                              <span dangerouslySetInnerHTML={{ __html: feather.icons['chevron-left'].toSvg({ width: 16, height: 16 }) }} />
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
                              <span dangerouslySetInnerHTML={{ __html: feather.icons['chevron-right'].toSvg({ width: 16, height: 16 }) }} />
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
  );
}
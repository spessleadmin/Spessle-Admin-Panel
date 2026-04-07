import React, { useState, useEffect } from "react";
import api from "./utils/api";
import "./ManageTags.css";
import feather from "feather-icons";
import { API_BASE_URL } from "./config";

const transformApiTag = (apiTag) => ({
  id: apiTag.id,
  tagname: apiTag.tagname,
  createddate: apiTag.createddate,
  updateddate: apiTag.updateddate,
});

export default function ManageTags() {
  const [filters, setFilters] = useState({ tagname: "", dateRange: "" });
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [isAddTagPopupOpen, setIsAddTagPopupOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  
  const [masterTagList, setMasterTagList] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState("");

  const fetchTags = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api(`${API_BASE_URL}/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const transformedTags = data.tags.map(transformApiTag);
      
      setMasterTagList(transformedTags);
      setTags(transformedTags);
      
    } catch (e) {
      console.error("Failed to fetch tags:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEditClick = (tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.tagname);
  };

  const handleCancelClick = () => {
    setEditingTagId(null);
    setEditingTagName("");
  };

  const handleConfirmClick = async (tagId) => {
    try {
      const response = await api(`${API_BASE_URL}/tags/${tagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "tagname": editingTagName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchTags(); // Re-fetch to get the latest data
      setEditingTagId(null);
      setEditingTagName("");

    } catch (error) {
      console.error("Failed to update tag name:", error);
      // Optionally, show an error message to the user
    }
  };

  const sortTags = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedTags = [...tags].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setTags(sortedTags);
  };

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterTagList;
    if (filters.tagname) {
      filtered = filtered.filter(t => t.tagname.toLowerCase().includes(filters.tagname.toLowerCase()));
    }
    if (filters.dateRange) {
      // This is a placeholder for date range filtering logic
    }
    setTags(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({ tagname: "", dateRange: "" });
    setTags(masterTagList);
    setSearch("");
    setCurrentPage(1);
  };

  const handleTableSearch = value => {
    setSearch(value);
    if (!value.trim()) {
      setTags(masterTagList);
      setCurrentPage(1);
      return;
    }
    const filtered = masterTagList.filter(t =>
      t.tagname.toLowerCase().includes(value.toLowerCase())
    );
    setTags(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        const response = await api(`${API_BASE_URL}/tags/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchTags(); // Re-fetch to get the latest data
      } catch (error) {
        console.error("Failed to delete tag:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleAddTag = () => {
    setIsAddTagPopupOpen(true);
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagname: newTagName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      await fetchTags(); // Re-fetch to get the latest data
      setIsAddTagPopupOpen(false);
      setNewTagName("");
    } catch (error) {
      console.error("Failed to add tag:", error);
      alert(error.message);
      // Optionally, show an error message to the user
    }
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = tags.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(tags.length / parseInt(entriesPerPage));
  
  return (
    <main className="manage-tags-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Tags</h4>
            </div>
          </div>
        </div>

        {isAddTagPopupOpen && (
          <div className="add-tag-popup">
            <div className="popup-content">
              <h2>Add Tag</h2>
              <form onSubmit={handlePopupSubmit}>
                <div className="form-group">
                  <label>Tag Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddTagPopupOpen(false)}>Cancel</button>
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
                      <label>Tag Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tag Name"
                        value={filters.tagname}
                        onChange={e => setFilters(f => ({ ...f, tagname: e.target.value }))}
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
                        onClick={handleAddTag}
                      >
                        <span dangerouslySetInnerHTML={{ __html: feather.icons.plus.toSvg({ width: 16, height: 16 }) }} />
                        Add Tag
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
                            <th className="sortable-header" onClick={() => sortTags('tagname')}>
                              Tag Name {sortConfig.key === 'tagname' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortTags('createddate')}>
                              Created Date {sortConfig.key === 'createddate' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th className="sortable-header" onClick={() => sortTags('updateddate')}>
                              Updated Date {sortConfig.key === 'updateddate' ? (sortConfig.direction === 'ascending' ? '🔼' : '🔽') : ''}
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading tags...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No tags found.</td></tr>
                          ) : (
                            currentEntries.map((tag, idx) => (
                              <tr key={tag.id} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>
                                  {editingTagId === tag.id ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editingTagName}
                                      onChange={(e) => setEditingTagName(e.target.value)}
                                    />
                                  ) : (
                                    tag.tagname
                                  )}
                                </td>
                                <td>{new Date(tag.createddate).toLocaleString()}</td>
                                <td>{new Date(tag.updateddate).toLocaleString()}</td>
                                <td>
                                  {editingTagId === tag.id ? (
                                    <>
                                      <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => handleConfirmClick(tag.id)}
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
                                        onClick={() => handleEditClick(tag)}
                                      >
                                        <span dangerouslySetInnerHTML={{ __html: feather.icons.edit.toSvg({ width: 16, height: 16 }) }} />
                                        <span className="hidden-xs hidden-sm">Edit</span>
                                      </button>
                                      <a
                                        href="#"
                                        className="action-icon text-danger"
                                        onClick={e => {
                                          e.preventDefault();
                                          handleDelete(tag.id);
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
                        Showing {tags.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, tags.length)} of {tags.length} entries
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

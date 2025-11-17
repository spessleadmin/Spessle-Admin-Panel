
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "./Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BusinessOrders.css"; 
import feather from "feather-icons";

const transformApiOrder = (apiOrder) => ({
  orderNo: apiOrder.id,
  customerName: apiOrder.user.username,
  businessName: apiOrder.business.businessname,
  orderDate: new Date(apiOrder.createddate).toLocaleString(),
  totalAmount: `$${apiOrder.totalamount}`,
  orderStatus: apiOrder.status || "Processing",
});

const BusinessOrders = () => {
  const { businessID } = useParams();
  const [masterOrderList, setMasterOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    orderNo: "",
    username: "",
    businessName: "",
    orderDate: [null, null],
    status: "",
  });
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5050/businesses/${businessID}/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const transformedOrders = data.orders.map(transformApiOrder);
      setMasterOrderList(transformedOrders);
      setFilteredOrders(transformedOrders);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [businessID]);

  useEffect(() => {
    if (!isLoading) {
      feather.replace();
    }
  }, [isLoading, filteredOrders, currentPage, entriesPerPage]);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    let filtered = masterOrderList.filter(order => {
      const orderDate = new Date(order.orderDate);
      const [startDate, endDate] = filters.orderDate;

      return (
        (filters.orderNo ? order.orderNo.includes(filters.orderNo) : true) &&
        (filters.username ? order.customerName.toLowerCase().includes(filters.username.toLowerCase()) : true) &&
        (filters.businessName ? order.businessName.toLowerCase().includes(filters.businessName.toLowerCase()) : true) &&
        (filters.status ? order.orderStatus === filters.status : true) &&
        (startDate && endDate ? orderDate >= startDate && orderDate <= endDate : true)
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({
      orderNo: "",
      username: "",
      businessName: "",
      orderDate: [null, null],
      status: "",
    });
    setFilteredOrders(masterOrderList);
    setCurrentPage(1);
  };

  const handleTableSearch = (value) => {
    setSearch(value);
    if (!value.trim()) {
      setFilteredOrders(masterOrderList);
      setCurrentPage(1);
      return;
    }
    const filtered = masterOrderList.filter(order =>
      order.customerName.toLowerCase().includes(value.toLowerCase()) ||
      order.businessName.toLowerCase().includes(value.toLowerCase()) ||
      order.orderNo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const indexOfLastEntry = currentPage * parseInt(entriesPerPage);
  const indexOfFirstEntry = indexOfLastEntry - parseInt(entriesPerPage);
  const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredOrders.length / parseInt(entriesPerPage));

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Manage Orders</h4>
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
                      <label>Order No</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Order No"
                        value={filters.orderNo}
                        onChange={(e) =>
                          setFilters({ ...filters, orderNo: e.target.value })
                        }
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={filters.username}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                        value={filters.businessName}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            businessName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Order Date</label>
                      <DatePicker
                        selectsRange={true}
                        startDate={filters.orderDate[0]}
                        endDate={filters.orderDate[1]}
                        onChange={(update) => {
                          setFilters({ ...filters, orderDate: update });
                        }}
                        isClearable={true}
                        className="form-control"
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Order Status</label>
                      <select
                        className="form-control form-select form-select-sm"
                        value={filters.status || "Processing"}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                      >
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="New">New</option>
                      </select>
                    </div>
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="submit" className="btn btn-blue admin-filter-button">
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
                      <div id="basic-datatable_filter" className="dataTables_filter">
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
                            <th>ID</th>
                            <th>Username</th>
                            <th>Business Name</th>
                            <th>Order Date</th>
                            <th>Total Amount</th>
                            <th>Order Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading orders...</td></tr>
                          ) : error ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</td></tr>
                          ) : currentEntries.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No orders found.</td></tr>
                          ) : (
                            currentEntries.map((order, idx) => (
                              <tr key={order.orderNo} className={idx % 2 === 0 ? "odd" : "even"}>
                                <td>{order.orderNo.substring(0, 8)}...</td>
                                <td>{order.customerName}</td>
                                <td>{order.businessName}</td>
                                <td>{order.orderDate}</td>
                                <td>{order.totalAmount}</td>
                                <td>
                                  <select className="form-control form-select form-select-sm" defaultValue={order.orderStatus}>
                                    <option>Processing</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                    <option>New</option>
                                  </select>
                                </td>
                                <td className="action-cell">
                                  <Link to={`/edit-order/${order.orderNo}`} className="tooltip-wrapper blue-square-icon">
                                    <i data-feather="eye" className="blue-eye"></i>
                                    <span className="tooltip-text">View Order Detail</span>
                                  </Link>
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
                      <div
                        className="dataTables_info"
                        id="basic-datatable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {filteredOrders.length > 0 ? indexOfFirstEntry + 1 : 0} to{" "}
                        {Math.min(indexOfLastEntry, filteredOrders.length)} of {filteredOrders.length} entries
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
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default BusinessOrders;

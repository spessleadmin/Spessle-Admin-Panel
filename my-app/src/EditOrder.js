
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "./Layout";
import "./EditOrder.css";
import feather from "feather-icons";

const EditOrder = () => {
  const { id } = useParams(); // If you plan to use dynamic order IDs
  const [orderInfo, setOrderInfo] = useState({
    orderNumber: "124",
    orderPrice: "$150",
    orderDate: "09/05/2025 12:25 PM",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1234567890",
    businessName: "Business A",
    businessAddress: "123 Main St, Anytown, USA",
    businessPhone: "+1987654321",
    orderStatus: "Processing",
    notes: "Order confirmed by the business.",
  });

  const [itemDetails, setItemDetails] = useState([
    { itemName: "Item 1", price: 50, quantity: 2, amount: 100 },
    { itemName: "Item 2", price: 50, quantity: 1, amount: 50 },
  ]);

  useEffect(() => {
    feather.replace();
  }, []);

  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSaveOrderInfo = () => {
    console.log("Saving Order Information:", orderInfo);
    // API call to save order info
  };

  const handleResetOrderInfo = () => {
    // Reset to initial state or fetched state
    console.log("Resetting Order Information");
  };

  const handleAddNote = () => {
    console.log("Adding note:", orderInfo.notes);
    // API call to add note
  };

  const calculateSubTotal = () => {
    return itemDetails.reduce((sum, item) => sum + item.amount, 0);
  };

  const subTotal = calculateSubTotal();
  const serviceCharge = subTotal * 0.10;
  const tax = subTotal * 0.064;
  const deliveryCharge = 7.00;
  const netAmount = subTotal + serviceCharge + tax + deliveryCharge;

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit Order</h4>
            </div>
          </div>
        </div>

        {/* Order Status Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Order Status</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Status</label>
                      <select
                        className="form-control form-select form-select-sm"
                        name="orderStatus"
                        value={orderInfo.orderStatus}
                        onChange={handleOrderInfoChange}
                      >
                        <option>Processing</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                        <option>New</option>
                      </select>
                    </div>
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleSaveOrderInfo}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleResetOrderInfo}>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* General Information Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">General Information</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Order Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="orderNumber"
                        value={orderInfo.orderNumber}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Order Price</label>
                      <input
                        type="text"
                        className="form-control"
                        name="orderPrice"
                        value={orderInfo.orderPrice}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Order Date</label>
                      <input
                        type="text"
                        className="form-control"
                        name="orderDate"
                        value={orderInfo.orderDate}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Customer Information</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerName"
                        value={orderInfo.customerName}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Customer Email</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerEmail"
                        value={orderInfo.customerEmail}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Customer Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerPhone"
                        value={orderInfo.customerPhone}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Business Information</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessName"
                        value={orderInfo.businessName}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Business Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessAddress"
                        value={orderInfo.businessAddress}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Business Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessPhone"
                        value={orderInfo.businessPhone}
                        onChange={handleOrderInfoChange}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Notes</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col" style={{ flex: '1 1 100%' }}>
                      <label>Add New Note</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        rows="3"
                        value={orderInfo.notes}
                        onChange={handleOrderInfoChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleAddNote}>
                        Add Note
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Item Details Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Item Details</div>
                <div className="table-responsive">
                  <table className="table item-details-table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemDetails.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.itemName}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Sub Total:</strong></td>
                        <td>${subTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Service Charge:</strong></td>
                        <td>${serviceCharge.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Tax:</strong></td>
                        <td>${tax.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Delivery Charge:</strong></td>
                        <td>${deliveryCharge.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Net Amount:</strong></td>
                        <td>${netAmount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default EditOrder;

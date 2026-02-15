
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import api from "./utils/api";
import "./EditOrder.css";
import feather from "feather-icons";

const EditOrder = () => {
  const { orderID } = useParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [amountRefundable, setAmountRefundable] = useState(0);

  const fetchOrderDetails = async () => {
    try {
      const response = await api(`http://localhost:5050/orders/${orderID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOrderInfo(data.order);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchAmountRefundable = async () => {
    try {
      const response = await api(`http://localhost:5050/admin/orders/${orderID}/amount-refundable`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAmountRefundable(data.amountRefundable);
    } catch (error) {
      console.error("Failed to fetch amount refundable:", error);
    }
  };

  useEffect(() => {
    if (orderInfo) {
      setStatus(orderInfo.status);
      setTotalRefunded(orderInfo.totalrefunded || 0);
    }
  }, [orderInfo]);

  useEffect(() => {
    fetchOrderDetails();
    fetchAmountRefundable();
  }, [orderID]);

  useEffect(() => {
    if (!loading) {
      feather.replace();
    }
  }, [loading]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveStatus = async () => {
    try {
      const response = await api(
        `http://localhost:5050/orders/${orderID}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Optionally, you can handle the success response here
      console.log("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleRefund = async () => {
    try {
      const response = await api(
        `http://localhost:5050/admin/orders/${orderID}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: orderInfo.stripe_payment_intent_id,
            refundAmount: parseFloat(refundAmount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Refund processed successfully");
      setRefundAmount("");
      fetchOrderDetails();
      fetchAmountRefundable();
      // Optionally, refresh order details or show a success message
    } catch (error) {
      console.error("Failed to process refund:", error);
      // Optionally, show an error message to the user
    }
  };

  if (loading) {
    return (
      <Layout>
        <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
          <div>Loading...</div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
          <div>Error: {error.message}</div>
        </main>
      </Layout>
    );
  }

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
                        value={status}
                        onChange={handleStatusChange}
                      >
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleSaveStatus}>
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Refund</div>
                <div className="mb-3">
                  <div>Total Amount: ${orderInfo.totalamount}</div>
                  <div>Total Refunded: ${totalRefunded.toFixed(2)}</div>
                  <div>
                    Remaining Refundable: ${amountRefundable.toFixed(2)}
                  </div>
                </div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Refund Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="refundAmount"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="Enter amount to refund"
                      />
                    </div>
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button
                        type="button"
                        className="btn admin-filter-button"
                        style={{ backgroundColor: '#6c757d', color: '#fff' }}
                        onClick={() => setRefundAmount(amountRefundable.toFixed(2))}
                      >
                        Full Refund
                      </button>
                      <button
                        type="button"
                        className="btn admin-filter-button"
                        style={{ backgroundColor: '#15adad', color: '#fff' }}
                        onClick={handleRefund}
                        disabled={
                          !refundAmount ||
                          parseFloat(refundAmount) <= 0 ||
                          parseFloat(refundAmount) >
                            parseFloat(amountRefundable.toFixed(2))
                        }
                      >
                        Submit Refund
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
                        value={orderInfo.id}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Order Price</label>
                      <input
                        type="text"
                        className="form-control"
                        name="orderPrice"
                        value={`$${orderInfo.totalamount}`}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Order Date</label>
                      <input
                        type="text"
                        className="form-control"
                        name="orderDate"
                        value={new Date(orderInfo.createddate).toLocaleString()}
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
                        value={orderInfo.user.username}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Customer Email</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerEmail"
                        value={orderInfo.user.email}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Customer Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerPhone"
                        value={orderInfo.user.phonenum || "N/A"}
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
                        value={orderInfo.business.businessname}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Business Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessAddress"
                        value={`${orderInfo.business.address}, ${orderInfo.business.city}, ${orderInfo.business.state} ${orderInfo.business.zipcode}`}
                        readOnly
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Business Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessPhone"
                        value={orderInfo.business.phonenum}
                        readOnly
                      />
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
                <div className="admin-filter-row">
                  <div className="admin-filter-col">
                    <label>Net Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      name="netAmount"
                      value={`$${orderInfo.totalamount}`}
                      readOnly
                    />
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

export default EditOrder;

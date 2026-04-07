import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./utils/api";
import SuccessMessage from "./components/SuccessMessage";
import { ORDER_STATUS_VALUES } from "./constants/orderStatuses";
import "./EditOrder.css";
import feather from "feather-icons";
import { API_BASE_URL } from "./config";

const EditOrder = () => {
  const { orderID } = useParams();

  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [amountRefundable, setAmountRefundable] = useState(0);

  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // ✅ Success Toast State
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Helper
  const triggerSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccessToast(true);
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await api(`${API_BASE_URL}/orders/${orderID}`);
      if (!response.ok) throw new Error("Network response was not ok");

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
      const response = await api(
        `${API_BASE_URL}/admin/orders/${orderID}/amount-refundable`
      );
      if (!response.ok) throw new Error("Network response was not ok");

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
      setDeliveryMethod(orderInfo.delivery_method || "");
      setDeliveryAddress(orderInfo.delivery_address || "");
    }
  }, [orderInfo]);

  useEffect(() => {
    fetchOrderDetails();
    fetchAmountRefundable();
  }, [orderID]);

  useEffect(() => {
    if (!loading) feather.replace();
  }, [loading]);

  // ✅ Auto-hide toast
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveStatus = async () => {
    try {
      const response = await api(
        `${API_BASE_URL}/orders/${orderID}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      triggerSuccess("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    }
  };

  const handleSaveDeliveryInfo = async () => {
    try {
      const response = await api(`${API_BASE_URL}/orders/${orderID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delivery_address: deliveryAddress,
          delivery_method: deliveryMethod,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      triggerSuccess("Delivery information updated successfully!");
    } catch (error) {
      console.error("Failed to update delivery info:", error);
      alert("Failed to update delivery info.");
    }
  };

  const handleRefund = async () => {
    try {
      const response = await api(
        `${API_BASE_URL}/admin/orders/${orderID}/refund`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: orderInfo.stripe_payment_intent_id,
            refundAmount: parseFloat(refundAmount),
          }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      triggerSuccess("Refund processed successfully!");
      setRefundAmount("");

      fetchOrderDetails();
      fetchAmountRefundable();
    } catch (error) {
      console.error("Failed to process refund:", error);
      alert("Failed to process refund.");
    }
  };

  if (loading) {
    return (
      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
          <div>Loading...</div>
        </main>
    );
  }

  if (error) {
    return (
      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
          <div>Error: {error.message}</div>
        </main>
    );
  }

  return (
    <>
      {/* ✅ Success Toast */}
      <SuccessMessage
        message={successMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit Order</h4>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="header-title">Order Status</div>
                <select
                  className="form-control"
                  value={status}
                  onChange={handleStatusChange}
                >
                  {ORDER_STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button className="btn btn-blue mt-2" onClick={handleSaveStatus}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="header-title">Delivery Info</div>
                <input
                  className="form-control mb-2"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
                <select
                  className="form-control"
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  <option value="Pickup">Pickup</option>
                  <option value="Delivery">Delivery</option>
                </select>
                <button className="btn btn-blue mt-2" onClick={handleSaveDeliveryInfo}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Refund */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div>Total: ${orderInfo.totalamount}</div>
                <div>Refunded: ${totalRefunded.toFixed(2)}</div>
                <div>Remaining: ${amountRefundable.toFixed(2)}</div>

                <input
                  type="number"
                  className="form-control mt-2"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />

                <button
                  className="btn mt-2"
                  onClick={() => setRefundAmount(amountRefundable.toFixed(2))}
                >
                  Full Refund
                </button>

                <button className="btn btn-success mt-2" onClick={handleRefund}>
                  Submit Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditOrder;
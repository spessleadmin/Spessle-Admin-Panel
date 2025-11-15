import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import TestPage from "./TestPage";
import Dashboard from "./Dashboard";
import AdminUsers from "./AdminUsers";
import EditProduct from "./EditProduct";
import ManageProduct from "./ManageProduct";
import ManageBusiness from "./ManageBusiness";
import ManageCoupons from "./ManageCoupons";
import ManageCategories from "./ManageCategories";
import Notification from "./Notification";
import EditNotification from "./EditNotification";
import BusinessDetails from "./BusinessDetails"
import EditBusiness from "./EditBusiness"
import BusinessProducts from "./BusinessProducts"
import ManageOrders from "./ManageOrders";
import EditOrder from "./EditOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/manage-business" element={<ManageBusiness />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/manage-product" element={<ManageProduct />} />
        <Route path="/manage-orders" element={<ManageOrders />} />
        <Route path="/edit-order" element={<EditOrder />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
        <Route path="/manage-coupons" element={<ManageCoupons />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/edit-notification/:id" element={<EditNotification />} />
        <Route path="/business-details/:id" element={<BusinessDetails />} />
        <Route path="/edit-business/:id" element={<EditBusiness />} />
        <Route path="/business-products/:id" element={<BusinessProducts />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/manage-tags" element={<ManageTags />} />
        <Route path="/revenue-management" element={<RevenueManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

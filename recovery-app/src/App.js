import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import TestPage from "./TestPage";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import EditProduct from "./EditProduct";
import ManageProduct from "./ManageProduct";
import AdminManageProduct from "./AdminManageProduct";
import ManageBusiness from "./ManageBusiness";
import AdminManageBusiness from "./AdminManageBusiness";
import ManageCoupons from "./ManageCoupons";
import AdminManageCoupons from "./AdminManageCoupons";
import ManageOrders from "./ManageOrders";
import AdminManageOrders from "./AdminManageOrders";
import EditOrder from "./EditOrder";
import Notification from "./Notification";
import AdminNotification from "./AdminNotification";
import EditNotification from "./EditNotification";
import BusinessDetails from "./BusinessDetails"
import EditBusiness from "./EditBusiness"
import BusinessProducts from "./BusinessProducts"
import EditUser from "./EditUser";
import ManageTags from "./ManageTags";
import RevenueManagement from "./RevenueManagement";
import AdminRevenueManagement from "./AdminRevenueManagement";
import ManageCategories from "./ManageCategories";
import BusinessOrders from "./BusinessOrders";
import ManageReviews from "./ManageReviews";
import AdminManageReviews from "./AdminManageReviews";
import Logout from "./Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/manage-product" element={<ManageProduct />} />
        <Route path="/admin-manage-product" element={<AdminManageProduct />} />
        <Route path="/manage-reviews" element={<ManageReviews />} />
        <Route path="/admin-manage-reviews" element={<AdminManageReviews />} />
        <Route path="/manage-orders" element={<ManageOrders />} />
        <Route path="/admin-manage-orders" element={<AdminManageOrders />} />
        <Route path="/admin-manage-categories" element={<ManageCategories />} />
        <Route path="/manage-coupons" element={<ManageCoupons />} />
        <Route path="/admin-manage-coupons" element={<AdminManageCoupons />} />
        <Route path="/manage-business" element={<ManageBusiness />} />
        <Route path="/admin-manage-business" element={<AdminManageBusiness />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/admin-notification" element={<AdminNotification />} />
        <Route path="/edit-notification/:id" element={<EditNotification />} />
        <Route path="/business-details/:id" element={<BusinessDetails />} />
        <Route path="/edit-business/:id" element={<EditBusiness />} />
        <Route path="/edit-order/:orderID" element={<EditOrder />} />
        <Route path="/business-products/:id" element={<BusinessProducts />} />
        <Route path="/business-orders/:businessID" element={<BusinessOrders />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/admin-manage-tags" element={<ManageTags />} />
        <Route path="/revenue-management" element={<RevenueManagement />} />
        <Route path="/admin-revenue-management" element={<AdminRevenueManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

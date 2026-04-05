import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
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
import BusinessAddProduct from "./BusinessAddProduct";
import AdminManageOrders from "./AdminManageOrders";
import EditOrder from "./EditOrder";
import Notification from "./Notification";
import AdminNotification from "./AdminNotification";
import AdminNotificationDetails from "./AdminNotificationDetails";
import UserNotification from "./UserNotification";
import BusinessNotification from "./BusinessNotification";
import BusinessDetails from "./BusinessDetails";
import EditBusiness from "./EditBusiness";
import BusinessProducts from "./BusinessProducts";
import EditUser from "./EditUser";
import ManageTags from "./ManageTags";
import RevenueManagement from "./RevenueManagement";
import AdminRevenueManagement from "./AdminRevenueManagement";
import ManageCategories from "./ManageCategories";
import BusinessOrders from "./BusinessOrders";
import ManageReviews from "./ManageReviews";
import AdminManageReviews from "./AdminManageReviews";
import AddProduct from "./AddProduct";
import Logout from "./Logout";
import "./NotificationSidebar.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="test-page" element={<TestPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="business/:id/add-product" element={<BusinessAddProduct />} />
          <Route path="admin-users" element={<AdminUsers />} />
          <Route path="manage-product" element={<ManageProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="admin-manage-product" element={<AdminManageProduct />} />
          <Route path="manage-reviews" element={<ManageReviews />} />
          <Route path="admin-manage-reviews" element={<AdminManageReviews />} />
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="admin-manage-orders" element={<AdminManageOrders />} />
          <Route path="admin-manage-categories" element={<ManageCategories />} />
          <Route path="manage-coupons" element={<ManageCoupons />} />
          <Route path="admin-manage-coupons" element={<AdminManageCoupons />} />
          <Route path="manage-business" element={<ManageBusiness />} />
          <Route path="admin-manage-business" element={<AdminManageBusiness />} />
          <Route path="notification" element={<Notification />} />
          <Route path="admin-notifications" element={<AdminNotification />} />
          <Route path="admin-notification/:id" element={<AdminNotificationDetails />} />
          <Route path="notification/:id" element={<AdminNotificationDetails />} />
          <Route path="user-notification" element={<UserNotification />} />
          <Route path="business-notification" element={<BusinessNotification />} />
          <Route path="business-details/:id" element={<BusinessDetails />} />
          <Route path="edit-business/:id" element={<EditBusiness />} />
          <Route path="edit-order/:orderID" element={<EditOrder />} />
          <Route path="business-products/:id" element={<BusinessProducts />} />
          <Route path="business-orders/:businessID" element={<BusinessOrders />} />
          <Route path="edit-user/:id" element={<EditUser />} />
          <Route path="admin-manage-tags" element={<ManageTags />} />
          <Route path="revenue-management" element={<RevenueManagement />} />
          <Route path="admin-revenue-management" element={<AdminRevenueManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

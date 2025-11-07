import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import TestPage from "./TestPage";
import Dashboard from "./Dashboard";
import AdminUsers from "./AdminUsers";
import EditProduct from "./EditProduct";
import ManageProduct from "./ManageProduct";
import ManageCoupons from "./ManageCoupons";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/manage-product" element={<ManageProduct />} />
        <Route path="/manage-coupons" element={<ManageCoupons />} />
      </Routes>
    </Router>
  );
}

export default App;

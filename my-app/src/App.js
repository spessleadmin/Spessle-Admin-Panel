import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import TestPage from "./TestPage";
import Dashboard from "./Dashboard";
import AdminUsers from "./AdminUsers";
import ManageProduct from "./ManageProduct";
import EditProduct from "./EditProduct";
import SamplePage from "./SamplePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/manage-product" element={<ManageProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/sample-page" element={<SamplePage />} />
      </Routes>
    </Router>
  );
}

export default App;

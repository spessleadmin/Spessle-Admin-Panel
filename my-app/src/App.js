import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import TestPage from "./TestPage";
import Dashboard from "./Dashboard";
import AdminUsers from "./AdminUsers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import Layout from "./Layout";

function TestPage() {
  return (
    <Layout>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome to the Test Page!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </Layout>
  );
}

export default TestPage;

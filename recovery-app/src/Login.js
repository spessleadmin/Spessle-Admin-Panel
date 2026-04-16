import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import feather from "feather-icons";
import Cookies from "js-cookie";
import "./Login.css";
import { API_BASE_URL } from "./config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      Cookies.set("token", data.idToken);

      try {
        const userInfoResponse = await fetch(
          `${API_BASE_URL}/user-info`,
          {
            headers: {
              Authorization: `Bearer ${data.idToken}`,
            },
          }
        );
        const userInfoData = await userInfoResponse.json();
        if (userInfoResponse.ok) {
          localStorage.setItem("user-info", JSON.stringify(userInfoData));
        } else {
          throw new Error(
            userInfoData.error || "Failed to fetch user information."
          );
        }
      } catch (err) {
        setError("Failed to fetch user details after login.");
        return;
      }

      // Route based on role
      const cached = JSON.parse(localStorage.getItem("user-info") || "{}");
      const user = cached.users?.[0] || cached.user?.[0] || cached.user;
      const roleName = (user?.role?.roleName || "").toLowerCase();

      if (roleName === "admin") {
        navigate("/dashboard");
      } else {
        const businessId = user?.businesses_on_user?.[0]?.id;
        navigate(businessId ? `/business-details/${businessId}` : "/dashboard");
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="authentication-bg">
      <div className="login-center-card">
        <div className="card-body p-4">
          <div className="auth-logo mb-3">
            <div className="logo-bg">
              <img
                src="https://codingincloud.com/spessle/html/assets/images/logo-dark.png"
                alt="Spessle"
                className="logo-img"
                draggable="false"
              />
            </div>
          </div>
          <p className="text-muted mb-4 mt-3">
            Enter your email address and password to access<br />admin panel.
          </p>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailaddress" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="emailaddress"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group input-group-merge">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-group-text bg-transparent border-start-0"
                  onClick={handleTogglePassword}
                  style={{ cursor: "pointer" }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  dangerouslySetInnerHTML={{
                    __html: feather.icons[showPassword ? "eye" : "eye-off"].toSvg({ class: "icon-sm" }),
                  }}
                />
              </div>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="checkbox-signin"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="checkbox-signin">
                Remember me
              </label>
            </div>

            <div className="text-center d-grid">
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
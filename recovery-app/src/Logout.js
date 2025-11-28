import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "./utils/api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await api.get("/logout");
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        Cookies.remove("token");
        navigate("/login");
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;

import Cookies from "js-cookie";

const api = async (url, options = {}) => {
  const token = Cookies.get("token");

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    window.location.href = "/login";
  }

  return response;
};

export default api;

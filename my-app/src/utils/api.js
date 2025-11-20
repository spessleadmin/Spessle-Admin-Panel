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

  return response;
};

export default api;

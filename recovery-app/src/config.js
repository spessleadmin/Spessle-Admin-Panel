/** API origin without trailing slash (from REACT_APP_API_URL). */
export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5050"
).replace(/\/$/, "");

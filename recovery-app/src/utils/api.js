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

export const getNotifications = async (userId) => {
  const response = await api(`http://localhost:5050/users/${userId}/notifications`);
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api(`http://localhost:5050/notifications/${notificationId}/read`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
  return response.json();
};

export default api;

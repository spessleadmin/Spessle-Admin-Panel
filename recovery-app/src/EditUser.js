import React, { useState, useEffect, useCallback } from "react"; // useCallback used by fetchUser
import { useParams } from "react-router-dom";
import api from "./utils/api";
import SuccessMessage from "./components/SuccessMessage";
import "./EditUser.css";
import feather from "feather-icons";
import { API_BASE_URL } from "./config";

export default function EditUser() {
  const { id } = useParams();
  const [initialUserState, setInitialUserState] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    phonenum: "",
  });
  const [userImage, setUserImage] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const triggerSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccessToast(true);
  };

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const user = data.user || (data.users && data.users[0]);
      if (!user) throw new Error("User data not found in response");
      const initialState = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        phonenum: user.phonenum,
        profilepictureurl: user.profilepictureurl,
      };
      setInitialUserState(initialState);
      setUserInfo({
        email: initialState.email,
        firstname: initialState.firstname,
        lastname: initialState.lastname,
        username: initialState.username,
        phonenum: initialState.phonenum,
      });
      setUserImage(initialState.profilepictureurl);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchUser();
  }, [id, fetchUser]);

  useEffect(() => {
    feather.replace();
  }, [userInfo, userImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const haveDetailsChanged = () => {
    if (!initialUserState) return false;
    const current = { email: userInfo.email, firstname: userInfo.firstname, lastname: userInfo.lastname, username: userInfo.username, phonenum: userInfo.phonenum };
    const initial = { email: initialUserState.email, firstname: initialUserState.firstname, lastname: initialUserState.lastname, username: initialUserState.username, phonenum: initialUserState.phonenum };
    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const handleDeleteImage = async () => {
    try {
      const response = await api(`${API_BASE_URL}/users/${id}/image`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete image");
      setUserImage(null);
      triggerSuccess("Image deleted successfully!");
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image.");
    }
  };

  const handleEditUser = async () => {
    if (!haveDetailsChanged()) return;
    try {
      const response = await api(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      triggerSuccess("User details updated successfully!");
      fetchUser();
    } catch (error) {
      console.error("Failed to update user details:", error);
      alert("Failed to update user.");
    }
  };

  const handleReset = () => {
    if (initialUserState) {
      setUserInfo({
        email: initialUserState.email,
        firstname: initialUserState.firstname,
        lastname: initialUserState.lastname,
        username: initialUserState.username,
        phonenum: initialUserState.phonenum,
      });
    }
  };

  return (
    <>
      <SuccessMessage
        message={successMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit User</h4>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">User Information</div>

                {/* Compact Profile Photo */}
                <div className="edit-user-avatar-section">
                  <div className="edit-user-avatar-wrapper">
                    {userImage ? (
                      <img src={userImage} alt="User profile" className="edit-user-avatar" />
                    ) : (
                      <div className="edit-user-avatar-placeholder">
                        <i data-feather="user"></i>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="edit-user-avatar-input"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const formData = new FormData();
                          formData.append("image", file);
                          api(`${API_BASE_URL}/users/${id}/image`, { method: "POST", body: formData })
                            .then((res) => {
                              if (!res.ok) throw new Error("Upload failed");
                              fetchUser();
                              triggerSuccess("Profile photo updated!");
                            })
                            .catch(() => alert("Failed to upload image."));
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                  <div className="edit-user-avatar-actions">
                    <label htmlFor="avatar-upload" className="btn btn-sm btn-blue">
                      {userImage ? "Change Photo" : "Upload Photo"}
                    </label>
                    {userImage && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={handleDeleteImage}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row" style={{ marginTop: "20px" }}>
                    <div className="admin-filter-col">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstname"
                        value={userInfo.firstname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={userInfo.lastname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={userInfo.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phonenum"
                        value={userInfo.phonenum}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleEditUser}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleReset}>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

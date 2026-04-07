import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import api from "./utils/api";
import SuccessMessage from "./components/SuccessMessage";
import "./EditUser.css";
import "./Dropify.css";
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
  const [files, setFiles] = useState([]);
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

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await api(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const user = data.user || (data.users && data.users[0]);
      if (!user) {
        throw new Error("User data not found in response");
      }
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
      throw new Error("Failed to fetch user:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
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

    const currentDetails = {
      email: userInfo.email,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      username: userInfo.username,
      phonenum: userInfo.phonenum,
    };

    const initialDetails = {
      email: initialUserState.email,
      firstname: initialUserState.firstname,
      lastname: initialUserState.lastname,
      username: initialUserState.username,
      phonenum: initialUserState.phonenum,
    };

    return JSON.stringify(currentDetails) !== JSON.stringify(initialDetails);
  };

  const handleImageUpload = async () => {
    if (files.length === 0) {
      alert("Please select an image to upload.");
      return;
    }
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await api(`${API_BASE_URL}/users/${id}/image`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      setFiles([]); // Clear the selected file
      triggerSuccess("Image uploaded successfully!");
    } catch (error) {
      throw new Error("Failed to upload image:", error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await api(
        `${API_BASE_URL}/users/${id}/image`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      setUserImage(null);
      triggerSuccess("Image deleted successfully!");
    } catch (error) {
      throw new Error("Failed to delete image:", error);
    }
  };

  const handleEditUser = async () => {
    const detailsChanged = haveDetailsChanged();

    if (detailsChanged) {
      const payload = {
        email: userInfo.email,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        username: userInfo.username,
        phonenum: userInfo.phonenum,
      };

      try {
        const response = await api(`${API_BASE_URL}/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        triggerSuccess("User details updated successfully!");
      } catch (error) {
        throw new Error("Failed to update user details:", error);
      }
    }

    if (!detailsChanged) {
      console.log("No changes to save.");
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
      setFiles([]);
    }
  };

  return (
    <>
      <SuccessMessage
        message={successMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
      <div className="edit-user-page">
        <h2>Edit User</h2>
        <div className="logged-in-user-profile">
          {userImage && (
            <img src={userImage} alt="User profile" />
          )}
        </div>
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <h4 className="header-title">User Image</h4>
                <div className="row mb-3">
                  <div className="col-md-9">
  <div {...getRootProps({ className: 'dropify-wrapper' })}>
    <input {...getInputProps()} />
    {files.length > 0 ? (
      <div className="dropify-preview">
        <span className="dropify-render">
          <img src={files[0].preview} alt={files[0].name} />
        </span>
        <div className="dropify-infos">
          <div className="dropify-infos-inner">
            <p className="dropify-filename">
              <span className="file-icon"></span> {files[0].name}
            </p>
            <p className="dropify-infos-message">Drag and drop or click to replace</p>
          </div>
        </div>
      </div>
    ) : userImage ? (
      <div className="dropify-preview">
        <span className="dropify-render">
          <img src={userImage} alt="User" />
        </span>
        <div className="dropify-infos">
          <div className="dropify-infos-inner">
            <p className="dropify-filename">
              <span className="file-icon"></span> Current Image
            </p>
            <p className="dropify-infos-message">Drag and drop or click to replace</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent opening file dialog
            handleDeleteImage();
          }}
          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
          style={{ zIndex: 10 }}
        >
          <i className="d-block" data-feather="trash-2"></i>
        </button>
      </div>
    ) : (
      <div className="dropify-message">
        <span className="file-icon"></span>
        <p>Drag and drop a file here or click</p>
      </div>
    )}
  </div>
</div>
<div className="col-md-3">
  <button type="button" className="btn btn-primary" onClick={handleImageUpload}>Upload</button>
</div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-user-card">
          <form className="edit-user-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={userInfo.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={userInfo.firstname}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                value={userInfo.lastname}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phonenum"
                value={userInfo.phonenum}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn-submit" onClick={handleEditUser}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Layout from "./Layout";
import api from "./utils/api";
import "./EditUser.css";
import "./Dropify.css";
import feather from "feather-icons";

export default function EditUser() {
  const { id } = useParams();
  const [initialUserState, setInitialUserState] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    phonenumber: "",
  });
  const [files, setFiles] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api(`http://localhost:5050/users/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const user = data.users[0];
        const initialState = {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          phonenumber: user.phonenum,
          profilepictureurl: user.profilepictureurl,
        };
        setInitialUserState(initialState);
        setUserInfo({
          email: initialState.email,
          firstname: initialState.firstname,
          lastname: initialState.lastname,
          username: initialState.username,
          phonenumber: initialState.phonenumber,
        });
        setProfilePictureUrl(initialState.profilepictureurl);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  useEffect(() => {
    feather.replace();
  }, [userInfo]);

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
      phonenum: userInfo.phonenumber,
    };

    const initialDetails = {
      email: initialUserState.email,
      firstname: initialUserState.firstname,
      lastname: initialUserState.lastname,
      username: initialUserState.username,
      phonenum: initialUserState.phonenumber,
    };

    return JSON.stringify(currentDetails) !== JSON.stringify(initialDetails);
  };

  const handleEditUser = async () => {
    const imageChanged = files.length > 0;
    const detailsChanged = haveDetailsChanged();

    if (imageChanged) {
      const formData = new FormData();
      formData.append("image", files[0]);

      try {
        const response = await api(`http://localhost:5050/users/${id}/image`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    if (detailsChanged) {
      const payload = {
        email: userInfo.email,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        username: userInfo.username,
        phonenum: userInfo.phonenumber,
      };

      try {
        const response = await api(`http://localhost:5050/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("User details updated successfully");
      } catch (error) {
        console.error("Failed to update user details:", error);
      }
    }

    if (!imageChanged && !detailsChanged) {
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
        phonenumber: initialUserState.phonenumber,
      });
      setFiles([]);
    }
  };

  const imagePreview = files.length > 0 ? files[0].preview : profilePictureUrl;

  return (
    <Layout>
      <main className="manage-user-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit User</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div {...getRootProps({ className: 'dropify-wrapper' })}>
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <div className="dropify-preview">
                      <span className="dropify-render">
                        <img src={imagePreview} alt="Profile" />
                      </span>
                      <div className="dropify-infos">
                        <div className="dropify-infos-inner">
                          <p className="dropify-filename">
                            {files.length > 0 && <span className="file-icon"></span>}
                            {files.length > 0 ? files[0].name : ''}
                          </p>
                          <p className="dropify-infos-message">Drag and drop or click to replace</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="dropify-message">
                      <span className="file-icon"></span>
                      <p>Drag and drop a file here or click</p>
                    </div>
                  )}
                </div>

                <form className="admin-filter-form" style={{ marginTop: "20px" }}>
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
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phonenumber"
                        value={userInfo.phonenumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleEditUser}>
                        Edit User
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
    </Layout>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Layout from "./Layout";
import "./EditBusiness.css";
import "./Dropify.css";
import feather from "feather-icons";

export default function EditBusiness() {
  const { id } = useParams();
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
    category: "",
    tags: "",
  });
  const [files, setFiles] = useState([]);

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
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`http://localhost:5050/businesses/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const business = data.business;
        setBusinessInfo({
          businessName: business.businessname,
          email: business.email,
          phone: business.phonenum,
          state: business.state,
          city: business.city,
          zipCode: business.zipcode,
          address: business.address,
          category: business.category.categoryname,
          tags: business.businesstagss_on_business.map(tag => tag.tag.name).join(', '),
        });
      } catch (error) {
        console.error("Failed to fetch business:", error);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  useEffect(() => {
    feather.replace();
  }, [businessInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleEditBusiness = () => {
    console.log("Editing Business:", businessInfo);
    // Placeholder for API call
  };

  const handleReset = () => {
    // Implement reset logic
  };

  return (
    <Layout>
      <main className="manage-business-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit Business</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
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
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessName"
                        value={businessInfo.businessName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={businessInfo.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={businessInfo.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={businessInfo.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={businessInfo.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={businessInfo.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col" style={{ width: "100%" }}>
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={businessInfo.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={businessInfo.category}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Tags</label>
                      <input
                        type="text"
                        className="form-control"
                        name="tags"
                        value={businessInfo.tags}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleEditBusiness}>
                        Edit Business
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

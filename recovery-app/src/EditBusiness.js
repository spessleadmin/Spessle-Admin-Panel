import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import api from "./utils/api";
import SuccessMessage from "./components/SuccessMessage";
import "./EditBusiness.css";
import "./Dropify.css";
import feather from "feather-icons";
import { API_BASE_URL } from "./config";

export default function EditBusiness() {
  const { id } = useParams();
  const [initialBusinessState, setInitialBusinessState] = useState(null);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api(`${API_BASE_URL}/businesses/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const business = data.business;
        const initialState = {
          businessName: business.businessname,
          email: business.email,
          phone: business.phonenum,
          state: business.state,
          city: business.city,
          zipCode: business.zipcode,
          address: business.address,
          description: business.description,
          category: {
            value: business.category.id,
            label: business.category.categoryname,
          },
          tags: business.businesstagss_on_business.map(tag => ({
            value: tag.tag.id,
            label: tag.tag.tagname,
          })),
        };
        setInitialBusinessState(initialState);
        setBusinessInfo({
          businessName: initialState.businessName,
          email: initialState.email,
          phone: initialState.phone,
          state: initialState.state,
          city: initialState.city,
          zipCode: initialState.zipCode,
          address: initialState.address,
          description: initialState.description,
        });
        setSelectedCategory(initialState.category);
        setSelectedTags(initialState.tags);
      } catch (error) {
        console.error("Failed to fetch business:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await api(`${API_BASE_URL}/tags`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTagOptions(
          data.tags.map((tag) => ({
            value: tag.id,
            label: tag.tagname,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api(`${API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategoryOptions(
          data.categories.map((category) => ({
            value: category.id,
            label: category.categoryname,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (id) {
      fetchBusiness();
    }
    fetchTags();
    fetchCategories();
  }, [id]);

  useEffect(() => {
    feather.replace();
  }, [businessInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const haveDetailsChanged = () => {
    if (!initialBusinessState) return false;

    const currentDetails = {
      businessname: businessInfo.businessName,
      email: businessInfo.email,
      phonenum: businessInfo.phone,
      state: businessInfo.state,
      city: businessInfo.city,
      zipcode: businessInfo.zipCode,
      address: businessInfo.address,
      description: businessInfo.description,
      category_id: selectedCategory ? selectedCategory.value : null,
      tags: selectedTags.map(tag => tag.value),
    };

    const initialDetails = {
      businessname: initialBusinessState.businessName,
      email: initialBusinessState.email,
      phonenum: initialBusinessState.phone,
      state: initialBusinessState.state,
      city: initialBusinessState.city,
      zipcode: initialBusinessState.zipCode,
      address: initialBusinessState.address,
      description: initialBusinessState.description,
      category_id: initialBusinessState.category.value,
      tags: initialBusinessState.tags.map(tag => tag.value),
    };

    return JSON.stringify(currentDetails) !== JSON.stringify(initialDetails);
  };

  const handleEditBusiness = async () => {
    const imageChanged = files.length > 0;
    const detailsChanged = haveDetailsChanged();

    if (imageChanged) {
      const formData = new FormData();
      formData.append("image", files[0]);

      try {
        const response = await api(`${API_BASE_URL}/businesses/${id}/image`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        triggerSuccess("Image uploaded successfully!");
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    if (detailsChanged) {
      const payload = {
        businessname: businessInfo.businessName,
        email: businessInfo.email,
        phonenum: businessInfo.phone,
        state: businessInfo.state,
        city: businessInfo.city,
        zipcode: businessInfo.zipCode,
        address: businessInfo.address,
        description: businessInfo.description,
        category_id: selectedCategory.value,
        tags: selectedTags.map(tag => tag.value),
      };

      try {
        const response = await api(`${API_BASE_URL}/businesses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        triggerSuccess("Business details updated successfully!");
      } catch (error) {
        console.error("Failed to update business details:", error);
      }
    }

    if (!imageChanged && !detailsChanged) {
      console.log("No changes to save.");
    }
  };

  const handleReset = () => {
    if (initialBusinessState) {
      setBusinessInfo({
        businessName: initialBusinessState.businessName,
        email: initialBusinessState.email,
        phone: initialBusinessState.phone,
        state: initialBusinessState.state,
        city: initialBusinessState.city,
        zipCode: initialBusinessState.zipCode,
        address: initialBusinessState.address,
        description: initialBusinessState.description,
      });
      setSelectedCategory(initialBusinessState.category);
      setSelectedTags(initialBusinessState.tags);
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
                    <div className="admin-filter-col" style={{ width: "100%" }}>
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        value={businessInfo.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Category</label>
                      <Select
                        name="category"
                        options={categoryOptions}
                        className="basic-single"
                        classNamePrefix="select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Tags</label>
                      <Select
                        isMulti
                        name="tags"
                        options={tagOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={selectedTags}
                        onChange={handleTagsChange}
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
    </>
  );
}

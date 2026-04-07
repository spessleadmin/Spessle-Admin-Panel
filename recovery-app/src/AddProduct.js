import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import OptionManager from "./components/OptionManager";
import "./AddProduct.css";
import "./Dropify.css";
import feather from "feather-icons";
import { API_BASE_URL } from "./config";
import api from "./utils/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState({
    productName: "",
    cost: "",
    description: "",
    quantity: "",
  });
  const [files, setFiles] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api(`${API_BASE_URL}/tags`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    fetchTags();
  }, []);

  useEffect(() => {
    feather.replace();
  }, [productInfo]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleProductInfoSave = async () => {
    const payload = {
      productname: productInfo.productName,
      description: productInfo.description,
      price: parseFloat(productInfo.cost),
      quantity: parseInt(productInfo.quantity, 10),
    };
    try {
      const response = await api(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log("Product added successfully:", result);
      setShowSuccessToast(true);
      // redirect to edit product page
      navigate(`/edit-product/${result.product.id}`);
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  const handleProductInfoReset = () => {
    setProductInfo({
      productName: "",
      cost: "",
      description: "",
      quantity: "",
    });
    setSelectedTags([]);
    setFiles([]);
  };

  return (
    <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div id="liveToast" className={`toast ${showSuccessToast ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button type="button" className="btn-close" onClick={() => setShowSuccessToast(false)} aria-label="Close"></button>
            </div>
            <div className="toast-body">
              Product added successfully!
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Add Product</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Product Information</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row" style={{ marginTop: "20px" }}>
                    <div className="admin-filter-col">
                      <label>Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="productName"
                        value={productInfo.productName}
                        onChange={handleProductInfoChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Cost</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cost"
                        value={productInfo.cost}
                        onChange={handleProductInfoChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Quantity</label>
                      <input
                        type="text"
                        className="form-control"
                        name="quantity"
                        value={productInfo.quantity}
                        onChange={handleProductInfoChange}
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
                        value={productInfo.description}
                        onChange={handleProductInfoChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="admin-filter-row">
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
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleProductInfoSave}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleProductInfoReset}>
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
  );
}
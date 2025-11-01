

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Layout from "./Layout";
import "./EditProduct.css";
import "./Dropify.css";
import feather from "feather-icons";

const transformApiProduct = (apiProduct) => ({
  businessName: apiProduct.business.businessname,
  category: apiProduct.business.category.categoryname,
  productName: apiProduct.productname,
  cost: apiProduct.price,
  availabilityDateTime: apiProduct.createddate,
  description: apiProduct.description,
  size: "", // Placeholder
  filling: "", // Placeholder
  leadTime: "", // Placeholder
  stock: apiProduct.quantity > 0 ? "In Stock" : "Out of Stock",
  totalQuantity: apiProduct.quantity,
});

export default function EditProduct() {
  const { id } = useParams();
  const [initialProductState, setInitialProductState] = useState({});
  const [productInfo, setProductInfo] = useState({
    businessName: "",
    category: "",
    productName: "",
    cost: "",
    availabilityDateTime: "",
    description: "",
  });

  const [productAttributes, setProductAttributes] = useState({
    size: "",
    filling: "",
    leadTime: "",
    stock: "In Stock",
    totalQuantity: "",
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

  const handleImageUpload = async () => {
    if (files.length === 0) {
      alert("Please select an image to upload.");
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`http://localhost:5050/products/${id}/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Image uploaded successfully:", result);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5050/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const transformed = transformApiProduct(data.product);
        setInitialProductState(transformed);
        setProductInfo({
          businessName: transformed.businessName,
          category: transformed.category,
          productName: transformed.productName,
          cost: transformed.cost,
          availabilityDateTime: new Date(transformed.availabilityDateTime).toISOString().slice(0, 16),
          description: transformed.description,
        });
        setProductAttributes({
          size: transformed.size,
          filling: transformed.filling,
          leadTime: transformed.leadTime,
          stock: transformed.stock,
          totalQuantity: transformed.totalQuantity,
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    feather.replace();
  }, [productInfo, productAttributes]);

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleProductAttributesChange = (e) => {
    const { name, value } = e.target;
    setProductAttributes((prevAttributes) => ({ ...prevAttributes, [name]: value }));
  };

  const handleProductInfoSave = () => {
    console.log("Saving Product Info:", productInfo);
    // Placeholder for API call
  };

  const handleProductInfoReset = () => {
    setProductInfo({
      businessName: initialProductState.businessName,
      category: initialProductState.category,
      productName: initialProductState.productName,
      cost: initialProductState.cost,
      availabilityDateTime: initialProductState.availabilityDateTime,
      description: initialProductState.description,
    });
  };

  const handleProductAttributesSave = () => {
    console.log("Saving Product Attributes:", productAttributes);
    // Placeholder for API call
  };

  const handleProductAttributesReset = () => {
    setProductAttributes({
      size: initialProductState.size,
      filling: initialProductState.filling,
      leadTime: initialProductState.leadTime,
      stock: initialProductState.stock,
      totalQuantity: initialProductState.totalQuantity,
    });
  };
  
  const handleEditProduct = () => {
    console.log("Editing Product:", { ...productInfo, ...productAttributes });
    // Placeholder for API call
  };

  const handleImageUploadReset = () => {
    console.log("Resetting Image Upload");
    // Implement image upload reset logic
  };

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Edit Product</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Product Information</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="businessName"
                        value={productInfo.businessName}
                        onChange={handleProductInfoChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={productInfo.category}
                        onChange={handleProductInfoChange}
                      />
                    </div>
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
                      <label>Availability Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="availabilityDateTime"
                        value={productInfo.availabilityDateTime}
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

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <div className="admin-filter-title header-title">Product Attributes</div>
                <form className="admin-filter-form">
                  <div className="admin-filter-row">
                    <div className="admin-filter-col">
                      <label>Size</label>
                      <input
                        type="text"
                        className="form-control"
                        name="size"
                        value={productAttributes.size}
                        onChange={handleProductAttributesChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Filling</label>
                      <input
                        type="text"
                        className="form-control"
                        name="filling"
                        value={productAttributes.filling}
                        onChange={handleProductAttributesChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Lead time, days</label>
                      <input
                        type="text"
                        className="form-control"
                        name="leadTime"
                        value={productAttributes.leadTime}
                        onChange={handleProductAttributesChange}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Stock</label>
                      <select
                        className="form-control"
                        name="stock"
                        value={productAttributes.stock}
                        onChange={handleProductAttributesChange}
                      >
                        <option>In Stock</option>
                        <option>Out of Stock</option>
                      </select>
                    </div>
                    <div className="admin-filter-col">
                      <label>Total quantity</label>
                      <input
                        type="text"
                        className="form-control"
                        name="totalQuantity"
                        value={productAttributes.totalQuantity}
                        onChange={handleProductAttributesChange}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col filter-actions buttons-row">
                      <button type="button" className="btn btn-blue admin-filter-button" onClick={handleProductAttributesSave}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary admin-filter-button" onClick={handleProductAttributesReset}>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <h4 className="header-title">Product Image Upload</h4>
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
                <div className="buttons-row" style={{ marginTop: "20px", justifyContent: "end" }}>
                  <button type="button" className="btn btn-blue" style={{ marginRight: "10px" }} onClick={handleImageUpload}>
                    Edit Product
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setFiles([])}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

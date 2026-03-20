import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import Layout from "./Layout";
import OptionManager from "./components/OptionManager";
import "./EditProduct.css";
import "./Dropify.css";
import feather from "feather-icons";

export default function EditProduct() {
  const { id } = useParams();
  const [initialProductState, setInitialProductState] = useState({});
  const [productInfo, setProductInfo] = useState({
    productName: "",
    cost: "",
    description: "",
    quantity: "",
    leadTimeDays: "",
  });
  const [files, setFiles] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showOptionAddedToast, setShowOptionAddedToast] = useState(false);
  const [productImages, setProductImages] = useState([]);

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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      fetchProduct(); // Re-fetch product data
      setFiles([]); // Clear the selected file
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image.");
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5050/products/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const productData = data.product;
      const initial = {
        productName: productData.productname,
        cost: productData.price,
        description: productData.description,
        quantity: productData.quantity,
        lead_time_days: productData.lead_time_days,
        tags: productData.producttags_on_product.map(tag => ({
          value: tag.tag.id,
          label: tag.tag.tagname,
        })),
      };
      setInitialProductState(initial);
      setProductInfo({
        productName: initial.productName,
        cost: initial.cost,
        description: initial.description,
        quantity: initial.quantity,
        leadTimeDays: initial.lead_time_days,
      });
      setSelectedTags(initial.tags);
      setProductOptions(
        productData.productoptionss_on_product.map(option => ({
          productoptionsid: option.id,
          option_name: option.optionName,
          option_type: option.optionType,
          option_value: option.optionValue,
        })) || []
      );
      setProductImages(productData.productimages_on_product || []);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`http://localhost:5050/tags`);
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

    if (id) fetchProduct();
    fetchTags();
  }, [id, fetchProduct]);

  useEffect(() => {
    feather.replace();
  }, [productInfo, productOptions, productImages]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  useEffect(() => {
    if (showOptionAddedToast) {
      const timer = setTimeout(() => {
        setShowOptionAddedToast(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showOptionAddedToast]);

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleProductInfoSave = async () => {
    const initialTags = initialProductState.tags.map(t => t.value);
    const currentTags = selectedTags.map(t => t.value);
    const tagsToAdd = selectedTags.filter(t => !initialTags.includes(t.value));
    const tagsToRemove = initialProductState.tags.filter(t => !currentTags.includes(t.value));
    for (const tag of tagsToAdd) {
      try {
        const response = await fetch(`http://localhost:5050/product-tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id, tag_id: tag.value }),
        });
        if (!response.ok) throw new Error("Failed to add tag");
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }
    for (const tag of tagsToRemove) {
      try {
        const response = await fetch(`http://localhost:5050/products/${id}/tags/${tag.value}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove tag");
      } catch (error) {
        console.error("Error removing tag:", error);
      }
    }
    const payload = {
      productname: productInfo.productName,
      description: productInfo.description,
      price: parseFloat(productInfo.cost),
      quantity: parseInt(productInfo.quantity, 10),
      lead_time_days: parseInt(productInfo.leadTimeDays, 10),
    };
    try {
      const response = await fetch(`http://localhost:5050/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log("Product updated successfully:", result);
      setShowSuccessToast(true);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product.");
    }
  };

  const handleProductInfoReset = () => {
    setProductInfo({
      productName: initialProductState.productName,
      cost: initialProductState.cost,
      description: initialProductState.description,
      quantity: initialProductState.quantity,
      leadTimeDays: initialProductState.lead_time_days,
    });
    setSelectedTags(initialProductState.tags);
    setFiles([]);
  };

  const handleAddOption = async (optionName, optionType, optionValue) => {
    const payload = {
      optionName: optionName,
      optionType: optionType,
      optionValue: optionValue,
    };

    try {
      const response = await fetch(`http://localhost:5050/products/${id}/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      fetchProduct(); // Re-fetch product data
      setShowOptionAddedToast(true);
    } catch (error) {
      console.error("Failed to add product option:", error);
      alert("Failed to add product option.");
    }
  };


  const handleDeleteOption = async (optionId) => {
    try {
      const response = await fetch(
        `http://localhost:5050/products/${id}/options/${optionId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setProductOptions(
        productOptions.filter((option) => option.productoptionsid !== optionId)
      );
      alert("Product option deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product option:", error);
      alert("Failed to delete product option.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(
        `http://localhost:5050/product-images/${imageId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      setProductImages(productImages.filter((image) => image.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image.");
    }
  };

  return (
    <Layout>
      <main className="manage-product-page dashboard-main" style={{ width: "100%" }}>
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <div id="liveToast" className={`toast ${showSuccessToast ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button type="button" className="btn-close" onClick={() => setShowSuccessToast(false)} aria-label="Close"></button>
            </div>
            <div className="toast-body">
              Product updated successfully!
            </div>
          </div>
          <div id="optionAddedToast" className={`toast ${showOptionAddedToast ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button type="button" className="btn-close" onClick={() => setShowOptionAddedToast(false)} aria-label="Close"></button>
            </div>
            <div className="toast-body">
              Product option added successfully!
            </div>
          </div>
        </div>
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
                    <div className="admin-filter-col">
                      <label>Lead Time (Days)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="leadTimeDays"
                        value={productInfo.leadTimeDays}
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
        <div className="row">
          <div className="col-12">
            <OptionManager
              productOptions={productOptions}
              onAdd={handleAddOption}
              onDelete={handleDeleteOption}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-body">
                <h4 className="header-title">Product Images</h4>
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
                <div className="row">
                  {productImages.map(image => (
                    <div key={image.id} className="col-md-3">
                      <div className="card position-relative">
                        <img src={image.imageurl} className="card-img-top" alt="Product" style={{ height: '150px', objectFit: 'cover' }} />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          style={{ zIndex: 10 }}
                        >
                          <i className="d-block" data-feather="trash-2"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
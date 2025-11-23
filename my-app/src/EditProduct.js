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
  });
  const [files, setFiles] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const productData = data.product;
        const initial = {
          productName: productData.productname,
          cost: productData.price,
          description: productData.description,
          quantity: productData.quantity,
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
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

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
  }, [id]);

  useEffect(() => {
    feather.replace();
  }, [productInfo, productOptions]);

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleProductInfoSave = async () => {
    if (files.length > 0) await handleImageUpload();
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
      alert("Product updated successfully!");
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

      const result = await response.json();
      const newOptionData = result.productOption;

      const newOptionForState = {
        productoptionsid: newOptionData.id,
        option_name: newOptionData.optionName,
        option_type: newOptionData.optionType,
        option_value: newOptionData.optionValue,
      };

      setProductOptions(prevOptions => [...prevOptions, newOptionForState]);

      alert("Product option added successfully!");
    } catch (error) {
      console.error("Failed to add product option:", error);
      alert("Failed to add product option.");
    }
  };


  const handleDeleteOption = async (optionId) => {
    try {
      const response = await fetch(
        `http://localhost:5050/product-options/${optionId}`,
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
        <div className="row">
          <div className="col-12">
            <OptionManager
              productOptions={productOptions}
              onAdd={handleAddOption}
              onDelete={handleDeleteOption}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
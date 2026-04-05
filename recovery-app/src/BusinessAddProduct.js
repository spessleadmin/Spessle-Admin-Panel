import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import OptionManager from "./components/OptionManager";
import "./BusinessAddProduct.css";
import "./Dropify.css";
import feather from "feather-icons";

export default function BusinessAddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("");
  const [files, setFiles] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [isProductInfoFilled, setIsProductInfoFilled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setIsProductInfoFilled(
      productName.trim() !== "" &&
      description.trim() !== "" &&
      price.trim() !== "" &&
      quantity.trim() !== "" &&
      leadTimeDays.trim() !== ""
    );
  }, [productName, description, price, quantity, leadTimeDays]);

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
    disabled: !isProductInfoFilled
  });

  useEffect(() => {
    feather.replace();
  }, [files, productOptions]);

  const handleAddOption = (optionName, optionType, optionValue) => {
    const newOption = {
      option_name: optionName,
      option_type: optionType,
      option_value: optionValue,
      productoptionsid: Date.now(), // Temporary unique ID
    };
    setProductOptions([...productOptions, newOption]);
  };

  const handleDeleteOption = (optionId) => {
    setProductOptions(
      productOptions.filter((option) => option.productoptionsid !== optionId)
    );
  };

  const handleSave = async () => {
    const payload = {
      business_id: id,
      productname: productName,
      description: description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      lead_time_days: parseInt(leadTimeDays, 10),
    };

    try {
      const response = await fetch(`http://localhost:5050/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const productId = result.product.id;
      console.log("Product added successfully:", result);

      if (files.length > 0) {
        const formData = new FormData();
        formData.append("image", files[0]);

        const imageResponse = await fetch(`http://localhost:5050/products/${productId}/image`, {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error(`HTTP error! status: ${imageResponse.status}`);
        }
        await imageResponse.json();
      }

      for (const option of productOptions) {
        const optionPayload = {
          optionName: option.option_name,
          optionType: option.option_type,
          optionValue: option.option_value,
        };
        const optionResponse = await fetch(`http://localhost:5050/products/${productId}/options`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(optionPayload),
        });

        if (!optionResponse.ok) {
          throw new Error(`HTTP error! status: ${optionResponse.status}`);
        }
      }
      
      alert("Product added successfully!");
      navigate(`/business-products/${id}`);
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <main className="add-product-page dashboard-main" style={{ width: "100%" }}>
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
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Price</label>
                      <input
                        type="text"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Quantity</label>
                      <input
                        type="text"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="admin-filter-col">
                      <label>Lead Time (Days)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={leadTimeDays}
                        onChange={(e) => setLeadTimeDays(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="admin-filter-row">
                    <div className="admin-filter-col" style={{ width: "100%" }}>
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={`row ${!isProductInfoFilled ? 'disabled-section' : ''}`}>
          <div className="col-12">
            <OptionManager
              productOptions={productOptions}
              onAdd={handleAddOption}
              onDelete={handleDeleteOption}
              disabled={!isProductInfoFilled}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className={`admin-card card ${!isProductInfoFilled ? 'disabled-section' : ''}`}>
              <div className="card-body">
                <h4 className="header-title">Product Images</h4>
                <div className="row mb-3">
                  <div className="col-md-12">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="admin-filter-col filter-actions buttons-row">
                    <button type="button" className={`btn btn-blue admin-filter-button ${!isProductInfoFilled ? 'disabled-button' : ''}`} onClick={handleSave} disabled={!isProductInfoFilled}>
                    Add Product
                    </button>
                </div>
            </div>
        </div>
      </main>
  );
}
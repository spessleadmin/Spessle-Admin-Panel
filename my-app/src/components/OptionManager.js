import React, { useState, useEffect } from "react";
import feather from "feather-icons";

const OptionManager = ({ productOptions, onAdd, onDelete }) => {
  const [newOption, setNewOption] = useState({ name: "", type: "", value: "" });
  const [newValue, setNewValue] = useState({}); // State for new values for existing options

  useEffect(() => {
    feather.replace();
  }, [productOptions]);

  const handleNewOptionChange = (e) => {
    const { name, value } = e.target;
    setNewOption((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewOption = () => {
    if (newOption.name && newOption.type && newOption.value) {
      onAdd(newOption.name, newOption.type, newOption.value);
      setNewOption({ name: "", type: "", value: "" });
    } else {
      alert("Please fill in all fields for the new option.");
    }
  };

  const handleNewValueChange = (optionName, value) => {
    setNewValue((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddNewValue = (optionName, optionType) => {
    const value = newValue[optionName];
    if (value) {
      onAdd(optionName, optionType, value);
      setNewValue((prev) => ({ ...prev, [optionName]: "" }));
    } else {
      alert("Please enter a value to add.");
    }
  };

  const groupedOptions = productOptions.reduce((acc, option) => {
    const { option_name, option_type, option_value, productoptionsid } = option;
    if (option_name) {
      if (!acc[option_name]) {
        acc[option_name] = { type: option_type, values: [] };
      }
      acc[option_name].values.push({ id: productoptionsid, value: option_value });
    }
    return acc;
  }, {});

  return (
    <div className="admin-card card">
      <div className="card-body">
        <h4 className="header-title">Product Options</h4>
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Option Name (e.g., Color)"
              value={newOption.name}
              onChange={handleNewOptionChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="type"
              className="form-control"
              placeholder="Option Type (e.g., Swatch)"
              value={newOption.type}
              onChange={handleNewOptionChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="value"
              className="form-control"
              placeholder="Option Value (e.g., Red)"
              value={newOption.value}
              onChange={handleNewOptionChange}
            />
          </div>
          <div className="col-md-1">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddNewOption}
            >
              <i data-feather="plus"></i>
            </button>
          </div>
        </div>
        <hr />
        {Object.entries(groupedOptions).map(([name, { type, values }]) => (
          <div key={name} className="mb-3">
            <h5>
              {name} <small className="text-muted">({type})</small>
            </h5>
            <div>
              {values.map(({ id, value }) => (
                <span key={id} className="badge bg-secondary me-2 mb-2">
                  {value}
                  <a
                    href="#!"
                    className="ms-1 text-light"
                    onClick={() => onDelete(id)}
                  >
                    <i
                      data-feather="x"
                      style={{ width: "12px", height: "12px" }}
                    ></i>
                  </a>
                </span>
              ))}
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add new value..."
                  value={newValue[name] || ""}
                  onChange={(e) => handleNewValueChange(name, e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleAddNewValue(name, type)}
                >
                  <i
                    data-feather="plus"
                    style={{ width: "12px", height: "12px" }}
                  ></i>{" "}
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionManager;





import React, { useState, useEffect, useCallback } from "react";


import { useParams } from "react-router-dom";


import { useDropzone } from "react-dropzone";


import Select from "react-select";


import Layout from "./Layout";


import "./EditProduct.css";


import "./Dropify.css";


import feather from "feather-icons";





const transformApiProduct = (apiProduct) => {


  const options = {};


  if (apiProduct.productoptionss_on_product) {


    apiProduct.productoptionss_on_product.forEach(option => {


      if (!options[option.optionType]) {


        options[option.optionType] = { values: [], selectedValue: '' };


      }


      options[option.optionType].values.push(option.optionValue);


    });


    // Set the initial selected value


    for (const optionType in options) {


      if (options[optionType].values.length > 0) {


        options[optionType].selectedValue = options[optionType].values[0];


      }


    }


  }





  return {


    category: apiProduct.business.category.categoryname,


    productName: apiProduct.productname,


    cost: apiProduct.price,


    description: apiProduct.description,


    options: options, // Grouped options


    quantity: apiProduct.quantity,


    tags: apiProduct.producttags_on_product.map(tag => ({


      value: tag.tag.id,


      label: tag.tag.name,


    })),


  };


};





export default function EditProduct() {


  const { id } = useParams();


  const [initialProductState, setInitialProductState] = useState({});


  const [productInfo, setProductInfo] = useState({


    category: "",


    productName: "",


    cost: "",


    description: "",


    quantity: "",


  });





    const [files, setFiles] = useState([]);





    const [productOptions, setProductOptions] = useState([]);





    const [newOption, setNewOption] = useState({





      optionName: "",





      optionType: "",





      optionValue: "",





    });





    const [tagOptions, setTagOptions] = useState([]);





    const [selectedTags, setSelectedTags] = useState([]);





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


                  category: transformed.category,


                  productName: transformed.productName,


                  cost: transformed.cost,


                  description: transformed.description,


                  quantity: transformed.quantity,


                });


                setSelectedTags(transformed.tags);


                setProductOptions(data.product.productoptionss_on_product || []);


      } catch (error) {


        console.error("Failed to fetch product:", error);


      }


    };





    const fetchTags = async () => {


      try {


        const response = await fetch(`http://localhost:5050/tags`);


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





    if (id) {


      fetchProduct();


    }


    fetchTags();


  }, [id]);





    useEffect(() => {





      feather.replace();





    }, [productInfo]);





  const handleProductInfoChange = (e) => {


    const { name, value } = e.target;


    setProductInfo((prevInfo) => ({ ...prevInfo, [name]: value }));


  };





  





    const handleTagsChange = (selectedOptions) => {





      setSelectedTags(selectedOptions);





    };





    const handleProductInfoSave = async () => {





      if (files.length > 0) {





        await handleImageUpload();





      }





  





      const initialTags = initialProductState.tags.map(t => t.value);





      const currentTags = selectedTags.map(t => t.value);





      const tagsToAdd = selectedTags.filter(t => !initialTags.includes(t.value));





      const tagsToRemove = initialProductState.tags.filter(t => !currentTags.includes(t.value));





    





      // Add new tags





      for (const tag of tagsToAdd) {





        try {





          const response = await fetch(`http://localhost:5050/product-tags`, {





            method: "POST",





            headers: {





              "Content-Type": "application/json",





            },





            body: JSON.stringify({ product_id: id, tag_id: tag.value }),





          });





          if (!response.ok) throw new Error("Failed to add tag");





        } catch (error) {





          console.error("Error adding tag:", error);





        }





      }





    





      // Remove old tags





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





          headers: {





            "Content-Type": "application/json",





          },





          body: JSON.stringify(payload),





        });





    





        if (!response.ok) {





          throw new Error(`HTTP error! status: ${response.status}`);





        }





    





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





          category: initialProductState.category,





          productName: initialProductState.productName,





          cost: initialProductState.cost,





          description: initialProductState.description,





          quantity: initialProductState.quantity,





        });





        setSelectedTags(initialProductState.tags);





        setFiles([]);





      };





    





    const handleNewOptionChange = (e) => {





      const { name, value } = e.target;





      setNewOption((prev) => ({ ...prev, [name]: value }));





    };





  const handleAddOption = async () => {


    try {


      const response = await fetch(`http://localhost:5050/products/${id}/options`, {


        method: "POST",


        headers: {


          "Content-Type": "application/json",


        },


        body: JSON.stringify(newOption),


      });





      if (!response.ok) {


        throw new Error(`HTTP error! status: ${response.status}`);


      }





      const result = await response.json();


      const newOptionData = result.productOption;


      const newOptionForState = {


          id: newOptionData.productoptionsid,


          optionName: newOptionData.option_name,


          optionType: newOptionData.option_type,


          optionValue: newOptionData.option_value


      };


  


      setProductOptions([...productOptions, newOptionForState]);


      setNewOption({ optionName: "", optionType: "", optionValue: "" }); // Reset form


      alert("Product option added successfully!");


    } catch (error) {


      console.error("Failed to add product option:", error);


      alert("Failed to add product option.");


    }


  };





  const handleDeleteOption = async (optionId) => {


    // Waiting for user to provide DELETE endpoint


    alert("Delete functionality not yet implemented.");


  };





        const handleEditProduct = () => {





          console.log("Editing Product:", { ...productInfo });





          // Placeholder for API call





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





                                    <div className="admin-card card">





                                      <div className="card-body">





                                        <h4 className="header-title">Product Options</h4>





                                        <div className="row">





                                          <div className="col-md-4">





                                            <div className="mb-3">





                                              <label htmlFor="newOptionName" className="form-label">Option Name</label>





                                              <input type="text" id="newOptionName" name="optionName" className="form-control" value={newOption.optionName} onChange={handleNewOptionChange} />





                                            </div>





                                          </div>





                                          <div className="col-md-4">





                                            <div className="mb-3">





                                              <label htmlFor="newOptionType" className="form-label">Option Type</label>





                                              <input type="text" id="newOptionType" name="optionType" className="form-control" value={newOption.optionType} onChange={handleNewOptionChange} />





                                            </div>





                                          </div>





                                          <div className="col-md-4">





                                            <div className="mb-3">





                                              <label htmlFor="newOptionValue" className="form-label">Option Value</label>





                                              <input type="text" id="newOptionValue" name="optionValue" className="form-control" value={newOption.optionValue} onChange={handleNewOptionChange} />





                                            </div>





                                          </div>





                                        </div>





                                        <button type="button" className="btn btn-blue mb-3" onClick={handleAddOption}>Add Option</button>





                                        <hr />





                                        <h5 className="header-title">Existing Options</h5>





                                        <table className="table table-centered mb-0">





                                          <thead>





                                            <tr>





                                              <th>Option Name</th>





                                              <th>Option Type</th>





                                              <th>Option Value</th>





                                              <th>Action</th>





                                            </tr>





                                          </thead>





                                          <tbody>





                                            {productOptions.map((option) => (





                                              <tr key={option.id || option.productoptionsid}>





                                                <td>{option.optionName || option.option_name}</td>





                                                <td>{option.optionType || option.option_type}</td>





                                                <td>{option.optionValue || option.option_value}</td>





                                                <td>





                                                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteOption(option.id)}>Delete</button>





                                                </td>





                                              </tr>





                                            ))}





                                          </tbody>





                                        </table>





                                      </div>





                                    </div>





                                  </div>





                                </div>


      </main>


    </Layout>


  );


}




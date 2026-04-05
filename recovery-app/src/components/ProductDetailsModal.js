import React, { useEffect, useState } from "react";
import api from "../utils/api";
import feather from "feather-icons";

export default function ProductDetailsModal({ productId, isOpen, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !productId) {
      setProduct(null);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api(`http://localhost:5050/products/${productId}`);
        if (!res.ok) {
          throw new Error(`Failed to load product (${res.status})`);
        }
        const data = await res.json();
        if (!cancelled) setProduct(data.product);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, productId]);

  useEffect(() => {
    if (product && isOpen) {
      feather.replace();
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const options = product?.productoptionss_on_product || product?.productoptions_on_product || [];
  const tags = product?.producttags_on_product || [];
  const images = product?.productimages_on_product || [];

  return (
    <div
      className="product-details-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
      onClick={onClose}
    >
      <div
        className="product-details-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="product-details-title">Product details</h2>

        {loading && <p style={{ color: "#6c757d" }}>Loading…</p>}
        {error && <p style={{ color: "#c0392b" }}>Error: {error}</p>}

        {!loading && !error && product && (
          <div className="product-details-body">
            <div className="detail-row">
              <span className="detail-label">Product name</span>
              <span className="detail-value">{product.productname}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Price</span>
              <span className="detail-value">
                {product.price != null ? `$${Number(product.price).toFixed(2)}` : "—"}
              </span>
            </div>
            <div className="detail-row detail-row-block">
              <span className="detail-label">Description</span>
              <span className="detail-value detail-multiline">
                {product.description || "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Quantity</span>
              <span className="detail-value">
                {product.quantity != null ? product.quantity : "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lead time (days)</span>
              <span className="detail-value">
                {product.lead_time_days != null ? product.lead_time_days : "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Business</span>
              <span className="detail-value">
                {product.business?.businessname || "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category</span>
              <span className="detail-value">
                {product.business?.category?.categoryname || "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Average rating</span>
              <span className="detail-value">
                {product.averageRating != null
                  ? `⭐ ${Number(product.averageRating).toFixed(1)}`
                  : "—"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {product.createddate
                  ? new Date(product.createddate).toLocaleString()
                  : "—"}
              </span>
            </div>
            <div className="detail-row detail-row-block">
              <span className="detail-label">Tags</span>
              <span className="detail-value">
                {tags.length > 0
                  ? tags.map((t) => t.tag?.tagname).filter(Boolean).join(", ")
                  : "—"}
              </span>
            </div>
            {options.length > 0 && (
              <div className="detail-row detail-row-block">
                <span className="detail-label">Options</span>
                <ul className="detail-options-list">
                  {options.map((opt, idx) => (
                    <li key={opt.id ?? `opt-${idx}`}>
                      <strong>{opt.optionName}</strong> ({opt.optionType}):{" "}
                      {String(opt.optionValue)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {images.length > 0 && (
              <div className="detail-row detail-row-block">
                <span className="detail-label">Images</span>
                <div className="product-details-images">
                  {images.map((img, idx) => (
                    <a
                      key={img.id ?? `img-${idx}`}
                      href={img.imageurl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={img.imageurl}
                        alt=""
                        className="product-details-thumb"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-buttons">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

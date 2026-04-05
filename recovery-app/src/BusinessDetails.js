import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './utils/api';
import './BusinessDetails.css';
import feather from 'feather-icons';

export default function BusinessDetails() {
  const { id } = useParams();
  const [businessDetails, setBusinessDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await api(`http://localhost:5050/businesses/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBusinessDetails(data.business);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  useEffect(() => {
    if (businessDetails) {
      feather.replace();
    }
  }, [businessDetails]);

  const detailsToShow = businessDetails ? {
    'Owner Name': `${businessDetails.user.firstname} ${businessDetails.user.lastname}`,
    'Business Name': businessDetails.businessname,
    Email: businessDetails.email,
    Phone: businessDetails.phonenum,
    Ratings: businessDetails.businessreviews_on_business.length > 0 ? `${businessDetails.businessreviews_on_business.reduce((acc, review) => acc + review.rating, 0) / businessDetails.businessreviews_on_business.length}/5` : 'No ratings yet',
    Address: `${businessDetails.address}, ${businessDetails.city}, ${businessDetails.state} ${businessDetails.zipcode}`,
    Category: businessDetails.category.categoryname,
    Tags: businessDetails.businesstagss_on_business.map(tag => tag.tag.tagname).join(', ') || 'None',
    //Status: 'Unknown', // Status is not in the provided response
  } : {};

  return (
    <main className="business-details-page dashboard-main" style={{ width: '100%' }}>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <h4 className="page-title">Business Details</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="admin-card card">
              <div className="card-header">
                <div className="header-buttons">
                  <Link to={`/business-products/${id}`} className="btn btn-blue">Products</Link>
                  <Link to={`/manage-reviews?business_id=${id}`} className="btn btn-blue">Reviews</Link>
                  <Link to={`/business-orders/${id}`} className="btn btn-blue">Orders</Link>
                  <Link to={`/revenue-management?business_id=${id}`} className="btn btn-blue">Revenue</Link>
                </div>
                <Link to={`/edit-business/${id}`} className="btn btn-red">
                  <i data-feather="edit-2" className="feather"></i>
                  Edit
                </Link>
              </div>
              <div className="card-body">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {businessDetails && (
                  <>
                    <div className="profile-picture-section">
                      <h5>Profile Picture</h5>
                      {businessDetails.businessPictureUrl ? (
                        <img
                          src={businessDetails.businessPictureUrl}
                          alt="Business"
                          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <p>No picture available</p>
                      )}
                    </div>
                    <table className="details-table">
                      <tbody>
                        {Object.entries(detailsToShow).map(([key, value]) => (
                          <tr key={key}>
                            <td className="label">{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import './BusinessDetails.css';
import feather from 'feather-icons';

export default function BusinessDetails() {
  const { id } = useParams();

  useEffect(() => {
    feather.replace();
  }, []);

  const businessDetails = {
    'Owner Name': 'John Doe',
    'Business Name': 'Doe Donuts',
    Email: 'john.doe@example.com',
    Phone: '+1234567890',
    Ratings: '4.5/5',
    Address: '123 Main St, Anytown, USA',
    Category: 'Food & Beverage',
    Tags: 'Donuts, Coffee, Bakery',
    Status: 'Active',
  };

  return (
    <Layout>
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
                  <button className="btn btn-blue">Products</button>
                  <button className="btn btn-blue">Users</button>
                  <button className="btn btn-blue">Orders</button>
                  <button className="btn btn-blue">Financies</button>
                </div>
                <button className="btn btn-red">
                  <i data-feather="edit-2" className="feather"></i>
                  Edit
                </button>
              </div>
              <div className="card-body">
                <table className="details-table">
                  <tbody>
                    {Object.entries(businessDetails).map(([key, value]) => (
                      <tr key={key}>
                        <td className="label">{key}</td>
                        <td>{value}</td>
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

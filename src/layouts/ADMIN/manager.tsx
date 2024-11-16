import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/CustomerManagement.css";

const Management: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="main-content">
        <div className="employee-management">
          <h2>Manage Customers</h2>
          <div className="search-filter">
            <div className="search-wrapper">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search for customers..."
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <select className="form-select filter-select">
              <option value="">Filter</option>
            </select>
            <button className="btn add-employee-btn text-white">
              Add Customer
            </button>
          </div>

          {/* Customer Table */}
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>CustomerID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Registration Date</th>
                  <th>Loyalty Points</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;

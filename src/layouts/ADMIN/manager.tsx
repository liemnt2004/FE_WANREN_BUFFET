import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/CustomerManagement.css";
import { fetchAdminList } from "../../api/apiAdmin/managerApi";
import { Button } from "antd";

const Management: React.FC = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gọi API để lấy danh sách admin
    const fetchData = async () => {
      try {
        const data = await fetchAdminList();
        setAdmins(data); // Cập nhật danh sách admin
      } catch (err) {
        setError("Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="main-content">
        <div className="employee-management">
          <h2>Manage Admin</h2>
          <div className="search-filter">
            <div className="search-wrapper">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search for admins..."
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <select className="form-select filter-select">
              <option value="">Filter</option>
            </select>
            <button className="btn add-employee-btn text-white">
              Add Admin
            </button>
          </div>

          {/* Admin Table */}
          <div className="table-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : admins.length === 0 ? (
              <p style={{ textAlign: "center" }}>No data available</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
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
                  {admins.map((admin: any) => (
                    <tr key={admin.customerId}>
                      <td>{admin.username}</td>
                      <td>{admin.fullName}</td>
                      <td>{admin.email}</td>
                      <td>{admin.phoneNumber}</td>
                      <td>{admin.address}</td>
                      <td>{admin.registrationDate}</td>
                      <td>{admin.loyaltyPoints}</td>
                      <td>{admin.accountStatus}</td>
                      <td>
                        <Button
                          className="icon-button-edit"
                          icon={<i className="fas fa-edit"></i>}
                        />
                        <Button
                          className="icon-button-remove"
                          icon={<i className="fas fa-trash"></i>}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;

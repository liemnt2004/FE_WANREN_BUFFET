import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/CustomerManagement.css";
import { Switch, message } from "antd";
import CustomUpdateStatusModal from "../CustomComponent/CustomStatusModal";

const CustomerManagement: React.FC = () => {
  //Modal hiển thị thông báo chuyển trạng thái của switch
  const [switchChecked, setSwitchChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSwitchState, setPendingSwitchState] = useState<boolean>(false);
  const handleSwitchChange = (checked: boolean) => {
    // Open the confirmation modal
    setPendingSwitchState(checked);
    setIsModalOpen(true);
  };
  const handleModalConfirm = () => {
    // Update the switch state and show a success message
    setSwitchChecked(pendingSwitchState);
    setIsModalOpen(false);
    message.success(
      `Status ${pendingSwitchState ? "enabled" : "disabled"} successfully.`
    );
  };

  const handleModalClose = () => {
    // Close the modal without changing the switch state
    setIsModalOpen(false);
    message.info("Status change canceled.");
  };
  return (
    <div className="container-fluid">
      {/* Main Content */}
      <div className="main-content">
        <div className="employee-management">
          <h2>Manage Customers</h2>

          {/* Search and Filter Bar */}
          <div className="search-filter">
            <div className="search-wrapper">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search customers..."
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <select className="form-select filter-select">
              <option value="">Filter</option>
            </select>
            <button
              className="btn add-employee-btn"
              data-bs-toggle="modal"
              data-bs-target="#customerModal"
            >
              Add Customer
            </button>
          </div>

          {/* Add Customer Modal */}
          <div
            className="modal fade"
            id="customerModal"
            tabIndex={-1}
            aria-labelledby="customerModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-sm rounded">
                <div className="modal-header">
                  <h5 className="modal-title" id="customerModalLabel">
                    Add New Customer
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form id="customerForm">
                    {/* First Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="customerID"
                          className="form-label fw-bold"
                        >
                          Customer ID
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-id-card"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="customerID"
                            placeholder="Customer ID"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="username"
                          className="form-label fw-bold"
                        >
                          Username
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="password"
                          className="form-label fw-bold"
                        >
                          Password
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-lock"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="fullName"
                          className="form-label fw-bold"
                        >
                          Full Name
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user-tag"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Third Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label fw-bold">
                          Email
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="phoneNumber"
                          className="form-label fw-bold"
                        >
                          Phone Number
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-phone"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fourth Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="address" className="form-label fw-bold">
                          Address
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-map-marker-alt"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="Address"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="registrationDate"
                          className="form-label fw-bold"
                        >
                          Registration Date
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-calendar-alt"></i>
                          </span>
                          <input
                            type="date"
                            className="form-control"
                            id="registrationDate"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fifth Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="accountStatus"
                          className="form-label fw-bold"
                        >
                          Account Status
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user-check"></i>
                          </span>
                          <select id="accountStatus" className="form-control">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="loyaltyPoints"
                          className="form-label fw-bold"
                        >
                          Loyalty Points
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-coins"></i>
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            id="loyaltyPoints"
                            placeholder="Loyalty Points"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>CustomerID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Registration Date</th>
                  <th>Position</th>
                  <th>Loyalty Points</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>user1</td>
                  <td>********</td>
                  <td>John Doe</td>
                  <td>johndoe@example.com</td>
                  <td>123456789</td>
                  <td>123 Main St</td>
                  <td>2023-10-01</td>
                  <td>Admin</td>
                  <td>1000</td>
                  <td>
                    <Switch
                      checked={switchChecked}
                      onChange={handleSwitchChange}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-button-edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editCustomerModal"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      className="icon-button-remove"
                      data-bs-toggle="tooltip"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Customer Modal */}
      <div
        className="modal fade"
        id="editCustomerModal"
        tabIndex={-1}
        aria-labelledby="editCustomerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-sm rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="editCustomerModalLabel">
                Edit Customer Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="editCustomerForm">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="editUsername"
                      className="form-label fw-bold"
                    >
                      Username
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="editUsername"
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="editPassword"
                      className="form-label fw-bold"
                    >
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="editPassword"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="editFullName"
                      className="form-label fw-bold"
                    >
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-user-tag"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="editFullName"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="editEmail" className="form-label fw-bold">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="editEmail"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="editPhoneNumber"
                      className="form-label fw-bold"
                    >
                      Phone Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-phone"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="editPhoneNumber"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="editAddress" className="form-label fw-bold">
                      Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="editAddress"
                        placeholder="Address"
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="editRegistrationDate"
                      className="form-label fw-bold"
                    >
                      Registration Date
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-calendar-alt"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        id="editRegistrationDate"
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="editAccountStatus"
                      className="form-label fw-bold"
                    >
                      Account Status
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-user-check"></i>
                      </span>
                      <select id="editAccountStatus" className="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="editLoyaltyPoints"
                      className="form-label fw-bold"
                    >
                      Loyalty Points
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-coins"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        id="editLoyaltyPoints"
                        placeholder="Loyalty Points"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="editPosition"
                      className="form-label fw-bold"
                    >
                      Position
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-briefcase"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="editPosition"
                        placeholder="Position"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <CustomUpdateStatusModal
        custom={pendingSwitchState ? "blue" : "red"}
        isOpen={isModalOpen}
        title="Confirm Status Change"
        subTitle={[
          `Are you sure you want to ${
            pendingSwitchState ? "enable" : "disable"
          } the status?`,
        ]}
        textClose="Cancel"
        textConfirm={pendingSwitchState ? "Enable" : "Disable"}
        handleClose={handleModalClose}
        handleConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default CustomerManagement;

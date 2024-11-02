import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import kichi from "./assets/img/warenbuffet.png";
import CustomUpdateStatusModal from "../CustomComponent/CustomStatusModal";
import { message, Switch } from "antd";

const EmployeeManagement: React.FC = () => {
  // Modal to confirm switch state change
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
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <div className="employee-management">
            <h2>Employee Management</h2>
            <div className="search-filter">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search for employees..."
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <select className="form-select filter-select">
                <option value="">Filter</option>
              </select>
              <button
                className="btn add-employee-btn"
                data-bs-toggle="modal"
                data-bs-target="#employeeModal"
              >
                Add Employee
              </button>
            </div>

            {/* Employee Modal */}
            <div
              className="modal fade"
              id="employeeModal"
              tabIndex={-1}
              aria-labelledby="employeeModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-sm rounded">
                  <div className="modal-header">
                    <h5 className="modal-title" id="employeeModalLabel">
                      Add New Employee
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form id="employeeForm">
                      <div className="row mb-3">
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
                      </div>
                      {/* Additional form fields... */}
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

            <div className="table-container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>UserType</th>
                    <th>Sign-up Date</th>
                    <th>Account Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Nguyen Van A</td>
                    <td>nguyenvana@example.com</td>
                    <td>0987654321</td>
                    <td>123 ABC Street, District 1</td>
                    <td>Manager</td>
                    <td>01/01/2021</td>
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
                        data-bs-target="#editEmployeeModal"
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
                  {/* Additional employee rows... */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      <div
        className="modal fade"
        id="editEmployeeModal"
        tabIndex={-1}
        aria-labelledby="editEmployeeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-sm rounded">
            <div className="modal-header">
              <h5 className="modal-title" id="editEmployeeModalLabel">
                Edit Employee Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="editEmployeeForm">
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
    </React.Fragment>
  );
};

export default EmployeeManagement;

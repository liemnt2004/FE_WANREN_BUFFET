import React, { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/CustomerManagement.css";
import {
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Button,
  Row,
  Col,
  notification,
} from "antd";
import CustomerModelAdmin from "../../models/AdminModels/CustomerModel";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateAccountStatus,
  fetchCustomerList,
} from "../../api/apiAdmin/customerApi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
function getEmployeeToken(): string {
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    notification.error({
      message: "Authentication Error",
      description: "Please log in to continue.",
    });
    throw new Error("Employee token is missing.");
  }
  return employeeToken;
}
const CustomerManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<boolean>(false);
  const [editCustomer, setEditCustomer] =
    useState<Partial<CustomerModelAdmin> | null>(null);
  const [customers, setCustomers] = useState<CustomerModelAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [confirmDeleteCustomerId, setConfirmDeleteCustomerId] = useState<
    number | null
  >(null);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);
  const openEditModal = (customer: CustomerModelAdmin) => {
    setEditCustomer(customer);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      ...customer,
      accountStatus: !!customer.accountStatus,
    });
  };

  const openAddModal = () => {
    setEditCustomer(null);
    addForm.resetFields();
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
    setCustomers([]);
    setTotalPages(null);
    loadMoreCustomers();
  }, [searchQuery]);
  const loadMoreCustomers = useCallback(async () => {
    if (loading || (totalPages !== null && page >= totalPages)) return;
    setLoading(true);
    try {
      const token = getEmployeeToken();
      const response = await fetchCustomerList(page, searchQuery);
      const { data: newCustomers, totalPages: newTotalPages } = response;

      setCustomers((prevCustomers) => {
        const existingCustomerIds = new Set(
          prevCustomers.map((c) => c.customerId)
        );
        const newUniqueCustomers = newCustomers.filter(
          (customer) => !existingCustomerIds.has(customer.customerId)
        );
        return page === 0
          ? newCustomers
          : [...prevCustomers, ...newUniqueCustomers];
      });
      setPage((prevPage) => prevPage + 1);
      setTotalPages(newTotalPages);
    } catch (error) {
      notification.error({
        message: "Fetch Failed",
        description: "Unable to fetch customer data.",
      });
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, page, totalPages, searchQuery]);

  useEffect(() => {
    loadMoreCustomers();
  }, [loadMoreCustomers]);
  const handleScroll = useCallback(() => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) loadMoreCustomers();
    }
  }, [loadMoreCustomers]);

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    tableContainer?.addEventListener("scroll", handleScroll);
    return () => tableContainer?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSaveNewCustomer = async () => {
    try {
      const newCustomerData = await addForm.validateFields();
      await createCustomer(newCustomerData);
      notification.success({
        message: "Customer Created",
        description: "The new customer has been created successfully!",
      });
      setIsModalOpen(false);
      addForm.resetFields();
      setPage(0);
      setCustomers([]);
      loadMoreCustomers();
    } catch (error) {
      console.error("Failed to save new customer:", error);
      notification.error({
        message: "Creation Failed",
        description: "An error occurred while creating the customer.",
      });
    }
  };

  const handleSaveEditCustomer = async () => {
    try {
      const updatedCustomerData = await editForm.validateFields();
      if (editCustomer?.customerId) {
        await updateCustomer(editCustomer.customerId, updatedCustomerData); // `getEmployeeToken` sẽ được gọi bên trong hàm API
        notification.success({
          message: "Customer Updated",
          description: "The customer has been updated successfully!",
        });
        setIsEditModalOpen(false);
        setPage(0);
        setCustomers([]);
        loadMoreCustomers();
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      notification.error({
        message: "Update Failed",
        description: "An error occurred while updating the customer.",
      });
    }
  };

  const handleDeleteCustomer = (customerId: number) => {
    setConfirmDeleteCustomerId(customerId);
    setConfirmDeleteModalVisible(true);
  };
  const handleConfirmDeleteCustomer = async () => {
    if (confirmDeleteCustomerId !== null) {
      try {
        await deleteCustomer(confirmDeleteCustomerId);
        notification.success({
          message: "Customer Deleted",
          description: "The customer has been deleted successfully!",
        });
        setPage(0);
        setCustomers([]);
        loadMoreCustomers();
      } catch (error) {
        console.error("Failed to delete customer:", error);
        notification.error({
          message: "Deletion Failed",
          description: "An error occurred while deleting the customer.",
        });
      } finally {
        setConfirmDeleteModalVisible(false);
        setConfirmDeleteCustomerId(null);
      }
    }
  };

  const handleUpdateAccountStatus = (
    customerId: number,
    newStatus: boolean
  ) => {
    setCurrentCustomerId(customerId);
    setCurrentStatus(newStatus);
    setConfirmModalVisible(true);
  };

  const handleConfirmStatusChange = async () => {
    if (currentCustomerId !== null) {
      try {
        await updateAccountStatus(currentCustomerId, currentStatus);
        notification.success({
          message: "Account Status Updated",
          description: `The account status has been successfully ${
            currentStatus ? "activated" : "deactivated"
          }!`,
        });
        setPage(0);
        setCustomers([]);
        loadMoreCustomers();
      } catch (error) {
        console.error("Failed to update account status:", error);
        notification.error({
          message: "Update Failed",
          description: "An error occurred while updating the account status.",
        });
      } finally {
        setConfirmModalVisible(false);
        setCurrentCustomerId(null);
        setCurrentStatus(false);
      }
    }
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            <Button
              onClick={openAddModal}
              className="btn add-employee-btn text-white"
            >
              Add Customer
            </Button>
          </div>

          {/* Add Customer Modal */}
          <Modal
            title="Add New Customer"
            visible={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              addForm.resetFields();
            }}
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>,
              <Button key="save" type="primary" onClick={handleSaveNewCustomer}>
                Save
              </Button>,
            ]}
          >
            <Form form={addForm} layout="vertical" initialValues={{}}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      { required: true, message: "Please enter a username!" },
                    ]}
                  >
                    <Input placeholder="Enter username" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Please enter a password!" },
                    ]}
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      { required: true, message: "Please enter full name!" },
                    ]}
                  >
                    <Input placeholder="Enter full name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter an email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a phone number!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      { required: true, message: "Please enter an address!" },
                    ]}
                  >
                    <Input placeholder="Enter address" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Loyalty Points" name="loyaltyPoints">
                    <Input type="number" placeholder="Enter points" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Account Status" name="accountStatus">
                    <Select placeholder="Select account status">
                      <Select.Option value={true}>Active</Select.Option>
                      <Select.Option value={false}>Inactive</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>

          {/* Edit Customer Modal */}
          <Modal
            title="Edit Customer"
            visible={isEditModalOpen}
            onCancel={() => {
              setIsEditModalOpen(false);
              editForm.resetFields();
            }}
            footer={[
              <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
                Close
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSaveEditCustomer}
              >
                Save Changes
              </Button>,
            ]}
          >
            <Form
              form={editForm}
              layout="vertical"
              initialValues={editCustomer || {}}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      { required: true, message: "Please enter a username!" },
                    ]}
                  >
                    <Input placeholder="Enter username" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      { required: true, message: "Please enter full name!" },
                    ]}
                  >
                    <Input placeholder="Enter full name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter an email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a phone number!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Address" name="address">
                    <Input placeholder="Enter address" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Loyalty Points" name="loyaltyPoints">
                    <Input type="number" placeholder="Enter loyalty points" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            visible={confirmModalVisible}
            onCancel={() => setConfirmModalVisible(false)}
            footer={null}
            centered
            width={400}
          >
            <div style={{ textAlign: "center" }}>
              <ExclamationCircleOutlined
                style={{ fontSize: "48px", color: "#ff4d4f" }}
              />
              <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>
                Confirm Status Change
              </h3>
              <p style={{ fontSize: "16px" }}>
                Are you sure you want to{" "}
                {currentStatus ? "activate" : "deactivate"} this account?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={() => setConfirmModalVisible(false)}
                  style={{ backgroundColor: "#f0f0f0", color: "#000" }}
                >
                  Go Back
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirmStatusChange}
                  style={{
                    backgroundColor: "rgb(252, 71, 10)",
                    borderColor: "rgb(252, 71, 10)",
                  }}
                >
                  {currentStatus ? "Activate" : "Deactivate"}
                </Button>
              </div>
            </div>
          </Modal>

          {/* modal xóa */}
          <Modal
            visible={confirmDeleteModalVisible}
            onCancel={() => setConfirmDeleteModalVisible(false)}
            footer={null}
            centered
            width={400}
          >
            <div style={{ textAlign: "center" }}>
              <ExclamationCircleOutlined
                style={{ fontSize: "48px", color: "#ff4d4f" }}
              />
              <h3 style={{ fontWeight: "bold", marginTop: "16px" }}>
                Confirm Delete
              </h3>
              <p style={{ fontSize: "16px" }}>
                Are you sure you want to delete this customer?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={() => setConfirmDeleteModalVisible(false)}
                  style={{ backgroundColor: "#f0f0f0", color: "#000" }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirmDeleteCustomer}
                  style={{
                    backgroundColor: "rgb(252, 71, 10)",
                    borderColor: "rgb(252, 71, 10)",
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Modal>

          {/* Customer Table */}
          <div className="table-container" ref={tableContainerRef}>
            <table className="table-admin table-striped">
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
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td>{customer.customerId}</td>
                    <td>{customer.username}</td>
                    <td>{customer.fullName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{customer.address}</td>
                    <td>
                      {new Date(customer.createdDate).toLocaleDateString()}
                    </td>
                    <td>{customer.loyaltyPoints}</td>
                    <td>
                      <td>
                        <Switch
                          checked={customer.accountStatus}
                          onClick={() =>
                            handleUpdateAccountStatus(
                              customer.customerId,
                              !customer.accountStatus
                            )
                          }
                        />
                      </td>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-button-edit"
                        onClick={() => openEditModal(customer)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        className="icon-button-remove"
                        onClick={() =>
                          handleDeleteCustomer(customer.customerId)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;

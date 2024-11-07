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
  getCustomerList,
  createCustomer,
  updateCustomer,
  updateCustomerAccountStatus,
  searchCustomers,
} from "../../api/apiAdmin/customerApi";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const openEditModal = (customer: CustomerModelAdmin) => {
    setEditCustomer(customer);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      ...customer,
      accountStatus: customer.accountStatus ? true : false,
    });
  };

  const openAddModal = () => {
    setEditCustomer(null);
    addForm.resetFields();
    setIsModalOpen(true);
  };

  const loadMoreCustomers = useCallback(async () => {
    if (loading || (totalPages !== null && page >= totalPages)) return;
    setLoading(true);
    try {
      const response = await getCustomerList(page);
      const { data: newCustomers, totalPages: newTotalPages } = response;
      setCustomers((prevCustomers) => {
        const existingCustomerIds = new Set(
          prevCustomers.map((c) => c.customerId)
        );
        const newUniqueCustomers = newCustomers.filter(
          (customer) => !existingCustomerIds.has(customer.customerId)
        );
        return [...prevCustomers, ...newUniqueCustomers];
      });
      setPage((prevPage) => prevPage + 1);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, page, totalPages]);

  useEffect(() => {
    loadMoreCustomers();
  }, [loadMoreCustomers]);

  const handleScroll = useCallback(() => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMoreCustomers();
      }
    }
  }, [loadMoreCustomers]);

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScroll);
      }
    };
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
      if (editCustomer && editCustomer.customerId) {
        await updateCustomer(editCustomer.customerId, updatedCustomerData);
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

  // Show confirmation modal
  const showConfirmModal = (customerId: number, newStatus: boolean) => {
    setCurrentCustomerId(customerId);
    setCurrentStatus(newStatus);
    setConfirmModalVisible(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (currentCustomerId !== null) {
      try {
        await updateCustomerAccountStatus(currentCustomerId, currentStatus);
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.customerId === currentCustomerId
              ? { ...customer, accountStatus: currentStatus }
              : customer
          )
        );
        notification.success({
          message: "Account Status Updated",
          description: `Account status has been ${
            currentStatus ? "activated" : "deactivated"
          }.`,
        });
      } catch (error) {
        console.error("Failed to update account status:", error);
        notification.error({
          message: "Update Failed",
          description: "An error occurred while updating account status.",
        });
      } finally {
        setConfirmModalVisible(false);
      }
    }
  };
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const data = await searchCustomers(searchQuery);
      setCustomers(data);
      setPage(0);
    } catch (error) {
      console.error("Failed to search customers:", error);
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
                placeholder="Search for employees..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <i
                className="fas fa-search search-icon"
                onClick={handleSearch}
              ></i>
              {/* Trigger search on click */}
            </div>
            <select className="form-select filter-select">
              <option value="">Filter</option>
            </select>
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
              <Form.Item
                label="Account Status"
                name="accountStatus"
                valuePropName="checked"
              >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Custom Confirmation Modal */}
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
                  style={{
                    backgroundColor: "rgb(252, 71, 10)",
                    borderColor: "rgb(252, 71, 10)",
                  }}
                  onClick={handleConfirmToggleStatus}
                >
                  {currentStatus ? "Activate" : "Deactivate"}
                </Button>
              </div>
            </div>
          </Modal>

          {/* Customer Table */}
          <div className="table-container" ref={tableContainerRef}>
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
                      <Switch
                        checked={customer.accountStatus}
                        onChange={(newStatus) =>
                          showConfirmModal(customer.customerId, newStatus)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-button-edit"
                        onClick={() => openEditModal(customer)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button type="button" className="icon-button-remove">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;

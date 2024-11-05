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
  message,
  Button,
  Row,
  Col,
} from "antd";
import CustomerModelAdmin from "../../models/AdminModels/CustomerModel";

import {
  createCustomer,
  deleteCustomer,
  getCustomerList,
  updateCustomer,
} from "../../api/apiAdmin/customerApi";
import form from "antd/es/form";

const CustomerManagement: React.FC = () => {
  // State cho quản lý modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] =
    useState<Partial<CustomerModelAdmin> | null>(null);

  const [form] = Form.useForm();
  const openEditModal = (customer: CustomerModelAdmin) => {
    setEditCustomer(customer);
    setIsEditModalOpen(true);
    form.setFieldsValue(customer); // Populate form with selected customer data
  };
  // State cho quản lý khách hàng
  const [customers, setCustomers] = useState<CustomerModelAdmin[]>([]);

  const [newCustomer, setNewCustomer] = useState<Partial<CustomerModelAdmin>>({
    username: "",
    password: "",
    fullname: "",
    email: "",
    phonenumber: "",
    address: "",
    loyaltyPoints: 0,
    customerType: "normal",
    accountStatus: true,
  });

  // State cho quản lý tải dữ liệu và phân trang
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Tham chiếu tới table container để xử lý sự kiện scroll
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Hàm load thêm khách hàng khi scroll
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

  // Hàm xử lý trạng thái switch của khách hàng
  const handleSwitchChange = async (checked: boolean, customerId: number) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customerId === customerId
          ? { ...customer, accountStatus: checked }
          : customer
      )
    );
  };

  // Xử lý thay đổi dữ liệu khách hàng mới
  const handleNewCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setNewCustomer((prevCustomer) => ({ ...prevCustomer, [id]: value }));
  };

  // Thêm khách hàng mới
  const handleAddCustomer = async () => {
    try {
      const values = await form.validateFields(); // Validate fields
      const createdCustomer = await createCustomer(values); // Use form values here
      if (createdCustomer) {
        message.success("Customer added successfully.");
        form.resetFields();
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("Please fill in all required fields.");
    }
  };

  // Save changes for the edited customer
  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      if (editCustomer && editCustomer.customerId) {
        const success = await updateCustomer(editCustomer.customerId, values);
        if (success) {
          setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
              customer.customerId === editCustomer.customerId
                ? { ...customer, ...values }
                : customer
            )
          );
          message.success("Customer updated successfully.");
          setIsEditModalOpen(false);
          setEditCustomer(null);
          form.resetFields();
        } else {
          message.error("Failed to update customer.");
        }
      }
    } catch (error) {
      message.error("Validation failed.");
    }
  };

  //xóa
  const handleDeleteCustomer = async (customerId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const success = await deleteCustomer(customerId);
          if (success) {
            setCustomers((prevCustomers) =>
              prevCustomers.filter(
                (customer) => customer.customerId !== customerId
              )
            );
            message.success("Customer deleted successfully.");
          } else {
            message.error("Failed to delete customer.");
          }
        } catch (error) {
          console.error("Error deleting customer:", error);
          message.error("Failed to delete customer.");
        }
      },
    });
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

            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn add-employee-btn text-white "
            >
              Add Customer
            </Button>
          </div>
          {/* Add Customer Modal */}
          <Modal
            title="Add New Customer"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>,
              <Button key="save" type="primary" onClick={handleAddCustomer}>
                Save
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical" initialValues={newCustomer}>
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
                    <Input.Password
                      style={{ height: 33 }}
                      placeholder="Enter password"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Full Name"
                    name="fullname"
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
                    name="phonenumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a phone number!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter phone number"
                      onChange={(e) =>
                        setNewCustomer((prevCustomer) => ({
                          ...prevCustomer,
                          phonenumber: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
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
              form.resetFields();
            }}
            onOk={handleSaveChanges}
            okText="Save Changes"
            cancelText="Close"
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={editCustomer || {}}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input the username!" },
                ]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="fullname"
                rules={[
                  { required: true, message: "Please input the full name!" },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input the email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phonenumber"
                rules={[
                  { required: true, message: "Please input the phone number!" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input placeholder="Enter address" />
              </Form.Item>

              <Form.Item label="Loyalty Points" name="loyaltyPoints">
                <Input type="number" placeholder="Enter loyalty points" />
              </Form.Item>
              <Form.Item label="Loyalty Points" name="createdDate">
                <Input type="Date" placeholder="Enter loyalty points" />
              </Form.Item>

              <Form.Item label="Account Status" name="accountStatus">
                <Select placeholder="Select account status">
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
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
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td>{customer.customerId}</td>
                    <td>{customer.username}</td>
                    <td className="password-column">{customer.password}</td>
                    <td>{customer.fullname}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phonenumber}</td>
                    <td>{customer.address}</td>
                    <td>{customer.createdDate}</td>
                    <td>{customer.loyaltyPoints}</td>
                    <td>{customer.customerType}</td>
                    <td>
                      <Switch
                        checked={customer.accountStatus}
                        onChange={(checked) =>
                          handleSwitchChange(checked, customer.customerId)
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
                      <button
                        type="button"
                        className="icon-button-remove"
                        onClick={() =>
                          handleDeleteCustomer(customer.customerId)
                        }
                      >
                        <i className="fas fa-trash"></i>
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

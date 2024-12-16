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

// Importing libraries for exporting data
import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import dayjs from "dayjs";

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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  const loadMoreCustomers = useCallback(async () => {
    if (loading || (totalPages !== null && page >= totalPages)) return;
    setLoading(true);
    try {
      const response = await fetchCustomerList(page);
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
  }, [loading, page, totalPages]);

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

  // Export functions

  // Export customers to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      customers.map((customer) => ({
        CustomerID: customer.customerId,
        Username: customer.username,
        FullName: customer.fullName,
        Email: customer.email,
        PhoneNumber: customer.phoneNumber,
        Address: customer.address,
        RegistrationDate: dayjs(customer.createdDate).format("YYYY-MM-DD"),
        LoyaltyPoints: customer.loyaltyPoints,
        AccountStatus: customer.accountStatus ? "Active" : "Inactive",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Create buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save file
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  // Export customers to CSV
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "CustomerID",
          "Username",
          "Full Name",
          "Email",
          "Phone Number",
          "Address",
          "Registration Date",
          "Loyalty Points",
          "Account Status",
        ],
        ...customers.map((customer) => [
          customer.customerId,
          customer.username,
          customer.fullName,
          customer.email,
          customer.phoneNumber,
          customer.address,
          dayjs(customer.createdDate).format("YYYY-MM-DD"),
          customer.loyaltyPoints,
          customer.accountStatus ? "Active" : "Inactive",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Export customers to PDF
  const exportToPDF = async () => {
    const fontUrl = "/fonts/Roboto-Black.ttf"; // Adjust the font path if necessary
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      // You can use StandardFonts.Helvetica if you don't have a custom font
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
      const customFont = await pdfDoc.embedFont(fontBytes);

      let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { width, height } = page.getSize();
      const margin = 50;

      // Title
      page.drawText("Customer List", {
        x: margin,
        y: height - margin,
        size: 18,
        font: customFont,
        color: rgb(0, 0.53, 0.71),
      });

      // Table headers
      const tableHeader = [
        "ID",
        "Username",
        "Full Name",
        "Email",
        "Phone",
        "Loyalty Points",
        "Status",
      ];
      let yPosition = height - margin - 40;
      const cellWidths = [30, 80, 100, 120, 80, 60, 60];

      // Draw headers
      tableHeader.forEach((header, i) => {
        page.drawText(header, {
          x: margin + cellWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y: yPosition,
          size: 10,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      yPosition -= 20;

      // Draw data rows
      for (const customer of customers) {
        const rowData = [
          customer.customerId.toString(),
          customer.username || "",
          customer.fullName || "",
          customer.email || "",
          customer.phoneNumber || "",
          customer.loyaltyPoints?.toString() || "0",
          customer.accountStatus ? "Active" : "Inactive",
        ];

        rowData.forEach((data, i) => {
          page.drawText(data, {
            x: margin + cellWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y: yPosition,
            size: 10,
            font: customFont,
            color: rgb(0, 0, 0),
          });
        });

        yPosition -= 20;
        if (yPosition < 50) {
          yPosition = height - margin - 40;
          page = pdfDoc.addPage([595.28, 841.89]);
        }
      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "customers.pdf";
      link.click();

      notification.success({
        message: "PDF Exported",
        description: "Customers have been exported to PDF successfully!",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      notification.error({
        message: "PDF Export Failed",
        description: "An error occurred while exporting to PDF.",
      });
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value || "");
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const username = customer.username.toLowerCase() || "";
    const fullname = customer.fullName.toLowerCase() || "";
    const email = customer.email.toLowerCase() || "";
    return (
      username.includes(searchQuery.toLowerCase() || "") ||
      email.includes(searchQuery.toLowerCase() || "") ||
      fullname.includes(searchQuery.toLowerCase() || "")
    );
  });
  return (
    <div className="container">
      <div className="main-content">
        <div className="employee-management">
          <h2>Manage Customers</h2>
          <div className="search-filter">
            <div className="search-wrapper">
              <input
                type="text"
                className=" search-input"
                placeholder="Search for customers..."
                onChange={handleSearchChange}
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
                    <Input placeholder="Enter username" disabled />
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

          {/* Delete Confirmation Modal */}
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
                {filteredCustomers.map((customer) => (
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
                        onClick={() =>
                          handleUpdateAccountStatus(
                            customer.customerId,
                            !customer.accountStatus
                          )
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

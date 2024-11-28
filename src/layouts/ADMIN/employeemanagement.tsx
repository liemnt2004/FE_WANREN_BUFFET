import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  message,
  Switch,
  Modal,
  Input,
  Form,
  Button,
  Row,
  Col,
  Select,
  Flex,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import EmployeeAdmin from "../../models/AdminModels/EmployeeModel";
import {
  getListUser,
  createUser,
  updateUser,
  updateAccountStatus,
  deleteUser,
} from "../../api/apiAdmin/employeemanagementApi";

// Importing libraries for exporting data
import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeAdmin[]>([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [form] = Form.useForm();
  const [isUpdateEmployeeModalOpen, setIsUpdateEmployeeModalOpen] =
    useState(false);
  const [updateForm] = Form.useForm();
  const [currentEmployee, setCurrentEmployee] =
    useState<Partial<EmployeeAdmin> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const fetchEmployees = async (page: number, searchTerm: string = "") => {
    try {
      setLoading(true);
      let response;
      let newEmployees: EmployeeAdmin[] = [];

      if (searchTerm.trim() === "") {
        response = await getListUser(page);
      }
      if (
        response &&
        response._embedded &&
        Array.isArray(response._embedded.users)
      ) {
        newEmployees = response._embedded.users;
      } else {
        console.error("API response format is incorrect:", response);
      }

      if (page === 0) {
        // Reset the employees array when on the first page (search results)
        setEmployees(newEmployees);
        setHasMore(newEmployees.length > 0);
      } else if (newEmployees.length === 0) {
        setHasMore(false);
      } else {
        setEmployees((prev) => [
          ...prev,
          ...newEmployees.filter(
            (emp) =>
              !prev.some((existingEmp) => existingEmp.userId === emp.userId)
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
      message.error("Failed to load employee list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmployees([]);
    setPage(0);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (hasMore) fetchEmployees(page, debouncedSearchTerm);
  }, [page, hasMore, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 1 && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSwitchChange = async (checked: boolean, userId: number) => {
    try {
      const updatedEmployee = await updateAccountStatus(userId, checked);
      if (updatedEmployee) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.userId === updatedEmployee.userId ? updatedEmployee : emp
          )
        );
        message.success(
          `Account status updated to ${checked ? "Active" : "Inactive"}`
        );
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      message.error("Failed to update account status.");
    }
  };

  const confirmStatusChange = (checked: boolean, userId: number) => {
    Modal.confirm({
      icon: null,
      title: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ExclamationCircleOutlined
            style={{ color: "#faad14", fontSize: 48 }}
          />
          <span
            style={{ marginTop: 16, fontWeight: "bold", textAlign: "center" }}
          >
            Are you sure you want to change the account status?
          </span>
        </div>
      ),
      content: (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          This will set the account status to{" "}
          <strong>{checked ? "Active" : "Inactive"}</strong>.
        </div>
      ),
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleSwitchChange(checked, userId),
    });
  };

  const handleAddEmployee = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleAddEmployeeModalOk = async () => {
    try {
      const newEmployee = await form.validateFields();
      const createdEmployee = await createUser(newEmployee);

      if (createdEmployee) {
        setEmployees((prev) => [createdEmployee, ...prev]);
        message.success("Employee added successfully.");
        setIsAddEmployeeModalOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        message.error(error.response.data);
      } else {
        console.error("Error adding employee:", error);
        message.error("Failed to add employee.");
      }
    }
  };

  const handleAddEmployeeModalCancel = () => {
    setIsAddEmployeeModalOpen(false);
    form.resetFields();
  };

  const openUpdateModal = (employee: EmployeeAdmin) => {
    setCurrentEmployee(employee);
    updateForm.setFieldsValue(employee);
    setIsUpdateEmployeeModalOpen(true);
  };

  const handleUpdateEmployeeModalOk = async () => {
    try {
      const updatedFields = await updateForm.validateFields();
      if (currentEmployee?.userId) {
        const updatedEmployee = await updateUser(
          currentEmployee.userId,
          updatedFields
        );
        if (updatedEmployee) {
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.userId === updatedEmployee.userId ? updatedEmployee : emp
            )
          );
          message.success("Employee updated successfully.");
          setIsUpdateEmployeeModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error updating employee:", error);
      message.error("Failed to update employee.");
    }
  };

  const handleUpdateEmployeeModalCancel = () => {
    setIsUpdateEmployeeModalOpen(false);
    updateForm.resetFields();
  };

  const confirmDeleteUser = (userId: number) => {
    Modal.confirm({
      title: null,
      icon: null,
      content: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ExclamationCircleOutlined
            style={{ color: "#faad14", fontSize: 48 }}
          />
          <h3
            style={{ marginTop: 16, textAlign: "center", fontWeight: "bold" }}
          >
            Confirm Delete
          </h3>
          <p style={{ textAlign: "center", marginTop: 8 }}>
            Are you sure you want to delete this employee?
          </p>
        </div>
      ),
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUser(userId);
          setEmployees((prev) => prev.filter((emp) => emp.userId !== userId));
          message.success("Employee deleted successfully.");
        } catch (error) {
          console.error("Error deleting employee:", error);
          message.error("Failed to delete employee.");
        }
      },
    });
  };

  // Export employees to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      employees.map((emp) => ({
        ID: emp.userId,
        Username: emp.username,
        FullName: emp.fullName,
        Email: emp.email,
        PhoneNumber: emp.phoneNumber,
        Address: emp.address,
        UserType: emp.userType,
        AccountStatus: emp.accountStatus ? "Active" : "Inactive",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

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
    link.setAttribute("download", "employees.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  // Export employees to CSV
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Username",
          "Full Name",
          "Email",
          "Phone Number",
          "Address",
          "User Type",
          "Account Status",
        ],
        ...employees.map((emp) => [
          emp.userId,
          emp.username,
          emp.fullName,
          emp.email,
          emp.phoneNumber,
          emp.address,
          emp.userType,
          emp.accountStatus ? "Active" : "Inactive",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Export employees to PDF
  const exportToPDF = async () => {
    const fontUrl = "/fonts/Roboto-Black.ttf";
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
      page.drawText("Employee List", {
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
        "User Type",
        "Status",
      ];
      let yPosition = height - margin - 40;
      const cellWidths = [30, 80, 100, 120, 80, 80, 60];

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
      for (const emp of employees) {
        const rowData = [
          emp.userId.toString(),
          emp.username || "",
          emp.fullName || "",
          emp.email || "",
          emp.phoneNumber || "",
          emp.userType || "",
          emp.accountStatus ? "Active" : "Inactive",
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
      link.download = "employees.pdf";
      link.click();

      message.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      message.error("Failed to export to PDF.");
    }
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <div className="employee-management">
            <h2>Employee Management</h2>
            <div
              className="search-filter"
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="search-wrapper">
                  <Input
                    className="search-input"
                    placeholder="Search for employees..."
                  />
                  <i className="fas fa-search search-icon"></i>
                </div>
              </div>
              <div
                className="btn-export-excel"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
                  Export Excel
                </Button>
                <Button onClick={exportToPDF} style={{ marginRight: 8 }}>
                  Export PDF
                </Button>
                <Button onClick={exportToCSV} style={{ marginRight: 8 }}>
                  Export CSV
                </Button>
                <Button
                  onClick={handleAddEmployee}
                  className="btn add-employee-btn"
                >
                  Add Employee
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="table-container" onScroll={handleScroll}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th style={{ width: 150 }}>Phone Number</th>
                    <th>Address</th>
                    <th>UserType</th>
                    <th style={{ width: 150 }}>Account Status</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.userId}>
                      <td>{employee.userId}</td>
                      <td>{employee.username}</td>
                      <td>{employee.fullName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phoneNumber}</td>
                      <td>{employee.address}</td>
                      <td>{employee.userType}</td>
                      <td className="text-center align-middle">
                        <Switch
                          checked={Boolean(employee.accountStatus)}
                          onChange={(checked) =>
                            confirmStatusChange(checked, employee.userId)
                          }
                        />
                      </td>

                      <td>
                        <Button
                          className="icon-button-edit"
                          icon={<i className="fas fa-edit"></i>}
                          onClick={() => openUpdateModal(employee)}
                        />
                        <Button
                          className="icon-button-remove"
                          icon={<i className="fas fa-trash"></i>}
                          onClick={() => confirmDeleteUser(employee.userId)}
                        />
                      </td>
                    </tr>
                  ))}
                  {loading && (
                    <tr>
                      <td colSpan={9} className="text-center">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loading && employees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        title="Add Employee"
        visible={isAddEmployeeModalOpen}
        onOk={handleAddEmployeeModalOk}
        onCancel={handleAddEmployeeModalCancel}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Address" name="address">
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="User Type"
                name="userType"
                rules={[{ required: true, message: "Please enter user type" }]}
              >
                <Select placeholder="Select UserType">
                  <Select.Option value="Bếp trưởng">Bếp trưởng</Select.Option>
                  <Select.Option value="Bếp phó">Bếp phó</Select.Option>
                  <Select.Option value="Thu ngân">Thu ngân</Select.Option>
                  <Select.Option value="Phục vụ">Phục vụ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Account Status"
                name="accountStatus"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select placeholder="Select account status">
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Update Employee Modal */}
      <Modal
        title="Update Employee"
        visible={isUpdateEmployeeModalOpen}
        onOk={handleUpdateEmployeeModalOk}
        onCancel={handleUpdateEmployeeModalCancel}
      >
        <Form form={updateForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username" name="username">
                <Input placeholder="Enter username" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Password" name="password">
                <Input.Password placeholder="Enter new password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Full Name" name="fullName">
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Enter email" type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone Number" name="phoneNumber">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Address" name="address">
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="User Type" name="userType">
                <Input placeholder="Enter user type" />
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
    </React.Fragment>
  );
};

export default EmployeeManagement;

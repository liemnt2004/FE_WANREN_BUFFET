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
} from "antd";
import EmployeeAdmin from "../../models/AdminModels/EmployeeModel";
import {
  getListUser,
  createUser,
  updateUser,
  updateAccountStatus,
  deleteUser,
  searchUsers,
} from "../../api/apiAdmin/employeemanagementApi";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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
      } else {
        response = await searchUsers({ fullName: searchTerm, page });
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
  console.log(employees);
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <div className="employee-management">
            <h2>Employee Management</h2>
            <div className="search-filter">
              <div className="search-wrapper">
                <Input
                  className="search-input"
                  placeholder="Search for employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <select className="form-select filter-select">
                <option value="">Filter</option>
              </select>
              <Button
                onClick={handleAddEmployee}
                className="btn add-employee-btn"
              >
                Add Employee
              </Button>
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
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>UserType</th>
                    <th>Account Status</th>
                    <th>Actions</th>
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
                      <td>
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

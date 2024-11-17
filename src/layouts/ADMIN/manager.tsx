import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/CustomerManagement.css";
import {
  fetchAdminList,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../api/apiAdmin/managerApi";
import { Button, Col, Form, Input, message, Modal, Row, Switch } from "antd";
import AdminModel from "../../models/AdminModels/AdminModal";

const Management: React.FC = () => {
  const [admins, setAdmins] = useState<AdminModel[]>([]); // Danh sách admin
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal
  const [form] = Form.useForm(); // Form quản lý thông tin admin
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminModel | null>(null);
  // Lấy danh sách admin từ API
  useEffect(() => {
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

  // Hàm hiển thị modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // Hàm xử lý thêm admin
  const handleAddAdmin = async (values: Partial<AdminModel>) => {
    try {
      const token = localStorage.getItem("employeeToken");
      if (!token) {
        throw new Error("Employee token is missing. Please log in.");
      }

      const newAdmin = await createAdmin(values); // Gửi API tạo admin mới
      setAdmins((prevAdmins) => [...prevAdmins, newAdmin]); // Cập nhật danh sách admin
      message.success("Admin added successfully!");
      form.resetFields();
      setIsModalVisible(false); // Ẩn modal
    } catch (error: any) {
      if (error.message.includes("token")) {
        message.error("Authentication failed. Please log in.");
        // Chuyển hướng tới trang đăng nhập nếu cần
        // window.location.href = "/login";
      } else {
        message.error("Failed to add admin. Please try again.");
      }
      console.error("Error adding admin:", error);
    }
  };
  const showEditModal = (admin: AdminModel) => {
    setCurrentAdmin(admin);
    form.setFieldsValue(admin); // Đổ dữ liệu admin vào form
    setIsEditModalVisible(true);
  };

  const handleUpdateAdmin = async (values: Partial<AdminModel>) => {
    if (!currentAdmin) return;

    try {
      const updatedAdmin = await updateAdmin(currentAdmin.userId, values);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.userId === currentAdmin.userId ? updatedAdmin : admin
        )
      );
      message.success("Admin updated successfully!");
      form.resetFields();
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      message.error("Failed to update admin. Please try again.");
    }
  };
  const handleDeleteAdmin = async (adminId: number) => {
    try {
      // Gọi API xóa admin
      await deleteAdmin(adminId);

      // Cập nhật danh sách admin sau khi xóa
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.userId !== adminId)
      );

      message.success("Admin deleted successfully!");
    } catch (error: any) {
      message.error(
        error.message || "Failed to delete admin. Please try again."
      );
      console.error("Error deleting admin:", error);
    }
  };
  const confirmDelete = (adminId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: () => handleDeleteAdmin(adminId),
    });
  };
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
            <button
              className="btn add-employee-btn text-white"
              onClick={showModal}
            >
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
                    <th>Admin ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Registration Date</th>
                    <th>Account Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.userId}>
                      <td>{admin.userId}</td>
                      <td>{admin.username}</td>
                      <td>{admin.fullName}</td>
                      <td>{admin.email}</td>
                      <td>{admin.phoneNumber}</td>
                      <td>{admin.address}</td>
                      <td>
                        {new Date(admin.createdDate).toLocaleDateString()}
                      </td>
                      <td>
                        <Switch checked={admin.accountStatus} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="icon-button-edit"
                          onClick={() => showEditModal(admin)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          className="icon-button-remove"
                          onClick={() => confirmDelete(admin.userId)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal thêm Admin */}
      <Modal
        title="Add New Admin"
        visible={isModalVisible}
        onCancel={handleCancel} // Đóng modal
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAdmin}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please enter the Username!" },
                ]}
              >
                <Input placeholder="Enter Username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter the Password!" },
                ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter the Full Name!" },
                ]}
              >
                <Input placeholder="Enter Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter the Email!" },
                  { type: "email", message: "Please enter a valid Email!" },
                ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter the Phone Number!" },
                ]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter the Address!" },
                ]}
              >
                <Input placeholder="Enter Address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountStatus"
                label="Account Status"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right" }}>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Admin
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Edit Admin"
        visible={isEditModalVisible}
        onCancel={() => {
          form.resetFields();
          setIsEditModalVisible(false);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateAdmin}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please enter the Username!" },
                ]}
              >
                <Input placeholder="Enter Username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter the Password!" },
                ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter the Full Name!" },
                ]}
              >
                <Input placeholder="Enter Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter the Email!" },
                  { type: "email", message: "Please enter a valid Email!" },
                ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter the Phone Number!" },
                ]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter the Address!" },
                ]}
              >
                <Input placeholder="Enter Address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountStatus"
                label="Account Status"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right" }}>
            <Button
              type="default"
              onClick={() => {
                form.resetFields();
                setIsEditModalVisible(false);
              }}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update Admin
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Management;

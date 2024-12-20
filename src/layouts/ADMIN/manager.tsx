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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Lấy danh sách admin từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdminList();
        setAdmins(data);
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value || "");
  };
  // Filter customers based on search query
  const filteredAdmins = admins.filter((admin) => {
    const username = admin.username?.toLowerCase() || "";
    const fullname = admin.fullName?.toLowerCase() || "";
    const email = admin.email?.toLowerCase() || "";

    return (
      username.includes(searchQuery.toLowerCase() || "") ||
      email.includes(searchQuery.toLowerCase() || "") ||
      fullname.includes(searchQuery.toLowerCase() || "")
    );
  });
  return (
    <div className="container-fluid">
      <div className="main-content">
        <div className="employee-management">
          <h2>Quản lý Admin</h2>
          <div
            className="search-filter"
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm admin..."
                onChange={handleSearchChange}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <button
              className="btn add-employee-btn text-white"
              onClick={showModal}
            >
              Thêm Admin
            </button>
          </div>

          {/* Bảng Admin */}
          <div className="table-container">
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : filteredAdmins.length === 0 ? (
              <p style={{ textAlign: "center" }}>Không có dữ liệu</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Admin ID</th>
                    <th>Tên đăng nhập</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th style={{ width: 150 }}>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th style={{ width: 170 }}>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
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
                        if (admin.accountStatus) {
                          <p>Hoạt Động</p>
                        }


                        
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

      {/* Modal Thêm Admin */}
      <Modal
        title="Thêm Admin Mới"
        visible={isModalVisible}
        onCancel={handleCancel} // Đóng modal
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAdmin}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và Tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountStatus"
                label="Trạng thái tài khoản"
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
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm Admin
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa Admin"
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
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và Tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountStatus"
                label="Trạng thái tài khoản"
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
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật Admin
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Management;

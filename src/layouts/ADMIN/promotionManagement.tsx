import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Switch,
  Input,
  Button,
  Form,
  Row,
  Col,
  InputNumber,
  DatePicker,
  message,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PromotionAdmin from "../../models/AdminModels/Promotion";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion, searchPromotionByName,
} from "../../api/apiAdmin/promotionApi";
import useDebounce from "../customer/component/useDebounce";
const { confirm } = Modal;
const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<PromotionAdmin | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      handleSearch();
    } else {
      fetchPromotions(); // If search query is empty, fetch all promotions
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchPromotionByName(debouncedSearchQuery);
      setPromotions(results);
    } catch (error) {
      console.error("Search failed:", error);
      message.error("Failed to search promotions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const promotionsData = await getAllPromotions();
      if (promotionsData.length > 0) {
        setPromotions(promotionsData);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async (values: Partial<PromotionAdmin>) => {
    try {
      await createPromotion(values);
      setPromotions((prevPromotions) => [
        ...prevPromotions,
        values as PromotionAdmin,
      ]);
      message.success("Promotion created successfully!");
      handleCancel();
    } catch (error) {
      console.error("Failed to create promotion:", error);
      message.error("Failed to create promotion.");
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setEditingPromotion(null);
    form.resetFields();
  };
  const showUpdateModal = (promotion: PromotionAdmin) => {
    setEditingPromotion(promotion);
    setIsUpdateModalVisible(true);
    form.setFieldsValue({
      ...promotion,
      startDate: dayjs(promotion.startDate),
      endDate: dayjs(promotion.endDate),
    });
  };

  const handleUpdatePromotion = async (values: Partial<PromotionAdmin>) => {
    if (!editingPromotion) return;

    try {
      const updatedPromotion = await updatePromotion(
        editingPromotion.promotion,
        values
      );
      setPromotions((prevPromotions) =>
        prevPromotions.map((promo) =>
          promo.promotion === editingPromotion.promotion
            ? updatedPromotion
            : promo
        )
      );
      message.success("Promotion updated successfully!");
      handleUpdateCancel();
    } catch (error) {
      console.error("Failed to update promotion:", error);
      message.error("Failed to update promotion.");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleDeletePromotion = async (id: number) => {
    try {
      await deletePromotion(id); // Gọi API xóa promotion
      setPromotions((prevPromotions) =>
        prevPromotions.filter((promo) => promo.promotion !== id)
      ); // Cập nhật danh sách promotion
      message.success("Promotion deleted successfully!");
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      message.error("Failed to delete promotion.");
    }
  };

  const confirmDelete = (id: number) => {
    confirm({
      icon: null,
      title: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ExclamationCircleOutlined
            style={{ fontSize: "48px", color: "red", marginBottom: "16px" }}
          />
          <span>Are you sure you want to delete this promotion?</span>
        </div>
      ),
      content: (
        <div>Once deleted, you will not be able to recover this promotion.</div>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDeletePromotion(id),
    });
  };

  useEffect(() => {
    fetchPromotions();
  }, []);
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <div className="promotion-management">
            <h2>Promotion Management</h2>
            <div className="search-filter">
              <div className="search-wrapper">
                <Input
                  className="search-input"
                  placeholder="Search for promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <select className="form-select filter-select">
                <option value="">Filter</option>
              </select>
              <Button className="btn add-employee-btn" onClick={showModal}>
                Add Promotion
              </Button>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Promotion ID</th>
                    <th>Promotion Name</th>
                    <th>Description</th>
                    <th>Promotion Type</th>
                    <th>Promotion Value</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.length > 0 ? (
                    promotions.map((promotion) => (
                      <tr key={promotion.promotion}>
                        <td>{promotion.promotion}</td>
                        <td>{promotion.promotionName}</td>
                        <td>{promotion.description}</td>
                        <td>{promotion.promotionType}</td>
                        <td>{promotion.promotionValue}</td>
                        <td>
                          {dayjs(promotion.startDate).format(
                            "YYYY-MM-DD HH:mm"
                          )}
                        </td>
                        <td>
                          {dayjs(promotion.endDate).format("YYYY-MM-DD HH:mm")}
                        </td>
                        <td>
                          <Switch checked={promotion.promotionStatus} />
                        </td>
                        <td>
                          <Button
                            className="icon-button-edit"
                            icon={<i className="fas fa-edit"></i>}
                            onClick={() => showUpdateModal(promotion)}
                          />
                          <Button
                            className="icon-button-remove"
                            icon={<i className="fas fa-trash"></i>}
                            onClick={() => confirmDelete(promotion.promotion)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No promotions found
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={9} className="text-center">
                        Loading promotions...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Add New Promotion"
        visible={isModalVisible}
        onCancel={handleCancel}
        okText="Add"
        cancelText="Cancel"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPromotion}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="promotionName"
                label="Promotion Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the promotion name",
                  },
                ]}
              >
                <Input placeholder="Enter promotion name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="promotionType"
                label="Promotion Type"
                rules={[
                  { required: true, message: "Please select promotion type" },
                ]}
              >
                <Input placeholder="Enter promotion type" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="promotionValue"
                label="Promotion Value"
                rules={[
                  { required: true, message: "Please enter promotion value" },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder="Enter promotion value"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date" },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="promotionStatus"
                label="Status"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Update Modal */}
      <Modal
        title="Update Promotion"
        visible={isUpdateModalVisible}
        onCancel={handleUpdateCancel}
        okText="Update"
        cancelText="Cancel"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdatePromotion}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="promotionName"
                label="Promotion Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the promotion name",
                  },
                ]}
              >
                <Input placeholder="Enter promotion name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="promotionType"
                label="Promotion Type"
                rules={[
                  { required: true, message: "Please select promotion type" },
                ]}
              >
                <Input placeholder="Enter promotion type" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="promotionValue"
                label="Promotion Value"
                rules={[
                  { required: true, message: "Please enter promotion value" },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder="Enter promotion value"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date" },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="promotionStatus"
                label="Status"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default PromotionManagement;

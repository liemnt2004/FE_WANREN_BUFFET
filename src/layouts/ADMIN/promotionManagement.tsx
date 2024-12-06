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
  deletePromotion,
} from "../../api/apiAdmin/promotionApi";
// Importing libraries for exporting data
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const { confirm } = Modal;

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<PromotionAdmin | null>(null);

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchPromotions();
  });

  const fetchPromotions = async () => {
    setLoading(true);
  
    try {
      const promotionsData = await getAllPromotions();
      console.log("Total promotions fetched:", promotionsData.length);
      setPromotions(promotionsData);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      message.error("Đã xảy ra lỗi khi tải dữ liệu khuyến mãi.");
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

  const handleDeletePromotion = async (id: number) => {
    try {
      await deletePromotion(id); // Call API to delete promotion
      setPromotions((prevPromotions) =>
        prevPromotions.filter((promo) => promo.promotion !== id)
      ); // Update promotions list
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

  // Export functions

  // Export promotions to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      promotions.map((promo) => ({
        PromotionID: promo.promotion,
        PromotionName: promo.promotionName,
        Description: promo.description,
        PromotionType: promo.promotionType,
        PromotionValue: promo.promotionValue,
        StartDate: dayjs(promo.startDate).format("YYYY-MM-DD HH:mm"),
        EndDate: dayjs(promo.endDate).format("YYYY-MM-DD HH:mm"),
        Status: promo.promotionStatus ? "Active" : "Inactive",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Promotions");

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
    link.setAttribute("download", "promotions.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  // Export promotions to CSV
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Promotion ID",
          "Promotion Name",
          "Description",
          "Promotion Type",
          "Promotion Value",
          "Start Date",
          "End Date",
          "Status",
        ],
        ...promotions.map((item) => [
          item.promotion,
          item.promotionName,
          item.description,
          item.promotionType,
          item.promotionValue,
          dayjs(item.startDate).format("YYYY-MM-DD HH:mm"),
          dayjs(item.endDate).format("YYYY-MM-DD HH:mm"),
          item.promotionStatus ? "Active" : "Inactive",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "promotions.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Export promotions to PDF
  const exportToPDF = async () => {
    const fontUrl = "/fonts/Roboto-Black.ttf"; // Adjust the font path if necessary
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      // You can use StandardFonts.Helvetica if you don't have a custom font
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
      const customFont = await pdfDoc.embedFont(fontBytes);

      let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { height } = page.getSize();
      const margin = 50;

      // Title
      page.drawText("Promotion List", {
        x: margin,
        y: height - margin,
        size: 18,
        font: customFont,
        color: rgb(0, 0.53, 0.71),
      });

      // Table headers
      const tableHeader = [
        "Promotion ID",
        "Name",
        "Type",
        "Value",
        "Start Date",
        "End Date",
        "Status",
      ];
      let yPosition = height - margin - 40;
      const cellWidths = [80, 100, 80, 60, 80, 80, 50];

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
      // for (const promo of promotions) {
      //   const rowData = [
      //     promo.promotion.toString(),
      //     promo.promotionName || "",
      //     promo.promotionType || "",
      //     promo.promotionValue?.toString() || "",
      //     dayjs(promo.startDate).format("YYYY-MM-DD HH:mm"),
      //     dayjs(promo.endDate).format("YYYY-MM-DD HH:mm"),
      //     promo.promotionStatus ? "Active" : "Inactive",
      //   ];

      //   rowData.forEach((data, i) => {
      //     page.drawText(data, {
      //       x: margin + cellWidths.slice(0, i).reduce((a, b) => a + b, 0),
      //       y: yPosition,
      //       size: 10,
      //       font: customFont,
      //       color: rgb(0, 0, 0),
      //     });
      //   });

      //   yPosition -= 20;
      //   if (yPosition < 50) {
      //     yPosition = height - margin - 40;
      //     page = pdfDoc.addPage([595.28, 841.89]);
      //   }
      // }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "promotions.pdf";
      link.click();

      message.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      message.error("Failed to export to PDF.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value || "");
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <div className="promotion-management">
            <h2>Promotion Management</h2>
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
                    placeholder="Search for promotions..."
                    onChange={handleSearchChange}
                    style={{ width: 300 }}
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
                <Button className="btn add-employee-btn" onClick={showModal}>
                  Add Promotion
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th style={{ width: 200 }}>Promotion Name</th>
                    <th>Description</th>
                    <th>Promotion Type</th>
                    <th style={{ width: 170 }}>Promotion Value</th>
                    <th style={{ width: 150 }}>Start Date</th>
                    <th style={{ width: 150 }}>End Date</th>
                    <th>Status</th>
                    <th style={{ width: 110 }}>Actions</th>
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
                            {dayjs(promotion.startDate).format("YYYY-MM-DD HH:mm")}
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
              </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Promotion Modal */}
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

      {/* Update Promotion Modal */}
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

import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Spin,
  message,
  DatePicker,
  Table,
  Button,
  notification,
} from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

dayjs.extend(customParseFormat);
dayjs.locale("vi");

const { Content, Footer } = Layout;
const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho Review
interface Review {
  reviewId: number;
  content: string;
  createdDate: string;
}

const Review: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [orders, setOrders] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm lấy dữ liệu đơn hàng từ API
  const fetchOrders = async (date: string) => {
    setLoading(true);
    try {
      const employeeToken = localStorage.getItem("employeeToken");
      const response = await axios.get(
        "https://wanrenbuffet.online/api-data/Review",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
        }
      );

      const reviews: Review[] = response.data._embedded.reviews;
      const filteredReviews = reviews.filter((review) =>
        dayjs(review.createdDate).isSame(date, "day")
      );
      setOrders(filteredReviews);
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount và khi chọn ngày thay đổi
  useEffect(() => {
    fetchOrders(selectedDate.format("YYYY-MM-DD"));
  }, [selectedDate]);

  // Cấu hình cột cho bảng đơn hàng
  const columns = [
    {
      title: "Mã",
      dataIndex: "reviewId",
      key: "reviewId",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Ngày comment",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  // Xuất Excel
  const exportToExcel = () => {
    const data = orders.map((order) => ({
      "Mã đơn hàng": order.reviewId,
      "Nội dung": order.content,
      "Ngày tạo": order.createdDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reviews.xlsx";
    link.click();
  };

  // Xuất CSV
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Mã", "Nội dung", "Ngày tạo"],
        ...orders.map((order) => [
          order.reviewId,
          order.content,
          dayjs(order.createdDate).format("YYYY-MM-DD HH:mm:ss"),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "reviews.csv";
    link.click();
  };

  // Xuất PDF
  const exportToPDF = async () => {
    const fontUrl = "/fonts/Roboto-Black.ttf"; // Đảm bảo đường dẫn font đúng
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
      const customFont = await pdfDoc.embedFont(fontBytes);

      let page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();
      const margin = 50;

      // Tiêu đề
      page.drawText("Danh Sách Đánh Giá", {
        x: margin,
        y: height - margin,
        size: 18,
        font: customFont,
        color: rgb(0, 0.53, 0.71),
      });

      // Bảng dữ liệu
      const tableHeader = ["Mã", "Nội dung", "Ngày tạo"];
      let yPosition = height - margin - 40;
      const cellWidth = [100, 150, 150];

      // Header row
      tableHeader.forEach((header, i) => {
        page.drawText(header, {
          x: margin + cellWidth.slice(0, i).reduce((a, b) => a + b, 0),
          y: yPosition,
          size: 10,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      yPosition -= 20;

      // Data rows
      for (const review of orders) {
        const rowData = [
          review.reviewId?.toString() || "N/A",
          review.content || "N/A",
          dayjs(review.createdDate).format("YYYY-MM-DD HH:mm:ss"),
        ];

        rowData.forEach((data, i) => {
          page.drawText(data, {
            x: margin + cellWidth.slice(0, i).reduce((a, b) => a + b, 0),
            y: yPosition,
            size: 10,
            font: customFont,
            color: rgb(0, 0, 0),
          });
        });

        yPosition -= 20;
        if (yPosition < 50) {
          page = pdfDoc.addPage([595.28, 841.89]);
          yPosition = height - margin - 40;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "DanhSachDanhGia.pdf";
      link.click();

      notification.success({
        message: "Xuất PDF thành công",
        description: "File PDF đã được tải xuống.",
      });
    } catch (error) {
      console.error("Error during PDF generation:", error);
      notification.error({
        message: "Lỗi xuất PDF",
        description: "Đã xảy ra lỗi khi tạo file PDF.",
      });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" ,backgroundColor:'var(--body-color)'}} className="container-fluid">
      <Content style={{ padding: "20px 50px" ,backgroundColor:'var(--body-color)'}} className="main-content">
        <DatePicker
          value={selectedDate}
          onChange={(date) => {
            if (date) setSelectedDate(date);
          }}
          format="YYYY-MM-DD"
          style={{ width: "200px", marginBottom: "20px" }}
        />
        <div>
          <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
            Xuất Excel
          </Button>
          <Button onClick={exportToPDF} style={{ marginRight: 8 }}>
            Xuất PDF
          </Button>
          <Button onClick={exportToCSV}>Xuất CSV</Button>
        </div>

        <div style={{ marginTop: "20px" }}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="reviewId"
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </Content>
     
    </Layout>
  );
};

export default Review;
  
// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, message, DatePicker, Table, Card, Row, Col } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi'; // Import locale tiếng Việt nếu cần
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as XLSX from 'xlsx';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import '@ant-design/icons';
import {

  Button,
  notification
} from "antd";

dayjs.extend(customParseFormat); // Sử dụng plugin nếu cần
dayjs.locale('vi'); // Thiết lập locale nếu cần

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
    orderId: number;
  orderStatus: string;
  totalAmount: number;
  discountPointUsed: string;
  numberPeople:string;
  address:string;
  notes:string,
  updatedDate:string,
  createdDate:string
}

const RevenueReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  
  // Hàm để lấy dữ liệu đơn hàng từ API
  const fetchOrders = async (date: string) => {
    setLoading(true);
    try {
      const employeeToken = localStorage.getItem("employeeToken");
      const response = await axios.get(`https://wanrenbuffet.online/api-data/Orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employeeToken}`,
        },
      });
  
      const fetchedOrders: Order[] = response.data._embedded.orders;
      const filteredOrders = fetchedOrders.filter(order => dayjs(order.createdDate).isSame(date, 'day'));
      setOrders(filteredOrders);
  
      // Tính tổng doanh thu dựa trên đơn hàng đã lọc
      const total = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
      setTotalRevenue(total);
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu đơn hàng.');
    } finally {
      setLoading(false);
    }
  };
  
  // Gọi API khi component mount và khi chọn ngày thay đổi
  useEffect(() => {
    const dateString = selectedDate.format('YYYY-MM-DD');
    fetchOrders(dateString);
  }, [selectedDate]);
  
  // Cấu hình cột cho bảng đơn hàng
  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text: number) => `${text.toLocaleString()} ₫`,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    },
  ];
  
  const exportToExcel = () => {
    const dataToExport = orders.map(order => ({
      "Mã đơn hàng": order.orderId,
      "Địa chỉ": order.address,
      "Ngày tạo": order.createdDate,
      "Tổng tiền": order.totalAmount,
      "Trạng thái": order.orderStatus,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.xlsx');
    document.body.appendChild(link);
    link.click();
  };
  
  const exportToCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['Mã đơn hàng', 'Địa chỉ', 'Ngày tạo', 'Tổng tiền', 'Trạng thái'],
        ...orders.map(order => [
          order.orderId,
          order.address,
          dayjs(order.createdDate).format('YYYY-MM-DD HH:mm:ss'),
          order.totalAmount,
          order.orderStatus,
        ]),
      ]
        .map(e => e.join(','))
        .join('\n');
  
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
  };
  
  const exportToPDF = async () => {
    const fontUrl = '/fonts/Roboto-Black.ttf'; // Đảm bảo đường dẫn font đúng
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
      const customFont = await pdfDoc.embedFont(fontBytes);
  
      let page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();
      const margin = 50;
  
      // Tiêu đề
      page.drawText('Danh Sách Đơn Hàng', {
        x: margin,
        y: height - margin,
        size: 18,
        font: customFont,
        color: rgb(0, 0.53, 0.71),
      });
  
      // Bảng dữ liệu
      const tableHeader = ['Mã ĐH', 'Địa chỉ', 'Ngày tạo', 'Tổng tiền', 'Trạng thái'];
      let yPosition = height - margin - 40;
      const cellWidth = [100, 150, 150, 100, 100];
  
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
      for (const order of orders) {
        const rowData = [
          order.orderId?.toString() || 'N/A',
          order.address || 'N/A',
          dayjs(order.createdDate).format('YYYY-MM-DD HH:mm:ss'),
          order.totalAmount.toLocaleString() + ' ₫',
          order.orderStatus || 'N/A',
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'DanhSachDonHang.pdf';
      link.click();
  
      notification.success({
        message: 'Xuất PDF thành công',
        description: 'File PDF đã được tải xuống.',
      });
    } catch (error) {
      console.error('Error during PDF generation:', error);
      notification.error({
        message: 'Lỗi xuất PDF',
        description: 'Đã xảy ra lỗi khi tạo file PDF.',
      });
    }
  };
  
  return (
    <Layout style={{ minHeight: '100vh' ,backgroundColor:'var(--body-color)'}} className='container-fluid'>
      
      <Content style={{ padding: '20px 50px', backgroundColor:'var(--body-color)'}} className='main-content'>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <DatePicker
              value={selectedDate}
              onChange={(date: Dayjs | null, dateString: string | string[]) => {
                if (dayjs.isDayjs(date)) {
                  setSelectedDate(date);
                }
              }}
              format='YYYY-MM-DD'
              style={{ width: '100%' }}
            />
          </Col>
          <div className="btn-export-excel" style={{ display: 'flex', alignItems: "center" }}>
          <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
                                Xuất Excel
                            </Button>
                            <Button onClick={exportToPDF} style={{ marginRight: 8 }}>
                                Xuất PDF
                            </Button>
                            <Button onClick={exportToCSV}>
                                Xuất CSV
                            </Button>
                        </div>
          <Col xs={24} sm={12} md={8}>
            <Card title="Tổng Doanh Thu" style={{ width: '100%' }}>
              <p style={{ fontSize: '24px', textAlign: 'center' }}>{totalRevenue.toLocaleString()} ₫</p>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: '20px' }}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="order_id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default RevenueReport;

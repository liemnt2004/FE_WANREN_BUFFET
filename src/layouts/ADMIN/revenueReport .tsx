// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, message, DatePicker, Table, Card, Row, Col } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi'; // Import locale tiếng Việt nếu cần
import customParseFormat from 'dayjs/plugin/customParseFormat';
import '@ant-design/icons';

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
      const response = await axios.get(`https://wanrenbuffet.online/api-data/Orders` , {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
      });

        
      const fetchedOrders: Order[] = response.data._embedded.orders;
      const exam: Order[] = [];
      fetchedOrders.forEach(element => {
        if (String(element.createdDate).includes(date)) {
            exam.push(element)
        }
      });
      setOrders(exam);
      
      // Tính tổng doanh thu
      if(exam.length > 0){
        const total = fetchedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        setTotalRevenue(total);
      }else{
        setTotalRevenue(0)
      }
      
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

  return (
    <Layout style={{ minHeight: '100vh' }} className='container-fluid'>
      
      <Content style={{ padding: '20px 50px' }} className='main-content'>
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
      <Footer style={{ textAlign: 'center' }}>WANREN BUFFET ©2024 Created by Your Name</Footer>
    </Layout>
  );
};

export default RevenueReport;

import { useEffect, useState } from "react";
import CardOrdersOnlCashier from "./component/cardOrdersOnlCashier";
import styled from "styled-components";
import axios from "axios";

// Định nghĩa kiểu Order với thêm thuộc tính `username` và `tableId`
type Order = {
  orderId?: number;
  orderStatus?: string;
  totalAmount?: number;
  notes?: string;
  address?: string;
  username?: string;
  customerLink?: string; // Link tới customer
  tableLink?: string;    // Link tới tablee
  tableId?: number;      // ID của table nếu có
};

const ManagementOrdersOnlCashier = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Orders');
        const ordersData = response.data._embedded.orders;

        // Thêm customerLink và tableLink vào mỗi order để lấy thông tin sau
        const ordersWithLinks = ordersData.map((order: any) => ({
          orderId: order.orderId,
          orderStatus: order.orderStatus,
          totalAmount: order.totalAmount,
          notes: order.notes,
          address: order.address,
          customerLink: order._links.customer.href,
          tableLink: order._links?.tablee?.href,  // Thêm link tablee nếu có
        }));

        setOrders(ordersWithLinks);

        // Lấy thông tin username từ customer và tableId từ tablee
        await fetchUsernamesAndTableIds(ordersWithLinks);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    const fetchUsernamesAndTableIds = async (orders: Order[]) => {
      const updatedOrders = await Promise.all(
        orders.map(async (order) => {
          let username, tableId;

          // Lấy thông tin customer
          if (order.customerLink) {
            try {
              const customerResponse = await axios.get(order.customerLink);
              username = customerResponse.data.username;
            } catch (error) {
            //   console.error(`Lỗi khi lấy customer cho order ${order.orderId}:`, error);
              username = '';
            }
          }

          // Lấy thông tin tableId từ tablee nếu có
          if (order.tableLink) {
            try {
              const tableResponse = await axios.get(order.tableLink);
              tableId = tableResponse.data.tableId;
            } catch (error) {
                tableId = null;
            }
          }

          // Trả về order với thông tin bổ sung
          return { ...order, username, tableId };
        })
      );
      setOrders(updatedOrders);
    };

    fetchOrders();
  }, []);

  return (
    <CardGrid>
{orders.map((order) => (
  order.tableId === null && (
    <CardOrdersOnlCashier
      key={order.orderId}
      orderId={order.orderId}
      orderStatus={order.orderStatus}
      totalAmount={order.totalAmount}
      notes={order.notes}
      address={order.address}
      username={order.username}
    />
  )
))}
    </CardGrid>
  );
};

export default ManagementOrdersOnlCashier;

// Styled components
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }`
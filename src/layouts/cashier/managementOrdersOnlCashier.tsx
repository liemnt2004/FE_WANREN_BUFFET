import { useEffect, useState } from "react";
import CardOrdersOnlCashier from "./component/cardOrdersOnlCashier";
import styled from "styled-components";
import {
  fetchOrders,
  fetchCustomerUsername,
  fetchTableId,
  Order,
  OrderDetail,
  fetchOrderDetails,
} from "../../api/apiCashier/ordersOnl";
import CardFoodOrderCashier from "./component/cardFoodOrderCashier";

const ManagementOrdersOnlCashier = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Trạng thái lưu order được chọn

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersWithLinks = await fetchOrders();

        const updatedOrders = await Promise.all(
          ordersWithLinks.map(async (order) => {
            const username = order.customerLink
              ? await fetchCustomerUsername(order.customerLink)
              : "";
            const tableId = order.tableLink
              ? await fetchTableId(order.tableLink)
              : null;

            return { ...order, username, tableId };
          })
        );

        setOrders(updatedOrders);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    loadOrders();
  }, []);

  // Hàm mở popup và lưu order được chọn
  const handleCardClick = (order: Order) => {
    setSelectedOrder(order);
  };

  // Hàm đóng popup
  const closePopup = () => {
    setSelectedOrder(null);
  };

  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (selectedOrder && selectedOrder.orderDetailsLink) {
        const details = await fetchOrderDetails(selectedOrder.orderDetailsLink);
        setOrderDetails(details);
      }
    };
    loadOrderDetails();
  }, [selectedOrder]);

  return (
    <div>
      <CardGrid>
        {orders.map(
          (order) =>
            order.tableId === null && (
              <CardOrdersOnlCashier
                key={order.orderId}
                orderId={order.orderId}
                orderStatus={order.orderStatus}
                totalAmount={order.totalAmount}
                notes={order.notes}
                address={order.address}
                username={order.username}
                onClick={() => handleCardClick(order)} // Thêm sự kiện onClick
              />
            )
        )}
      </CardGrid>

      {/* Popup hiển thị khi có selectedOrder */}
      {selectedOrder && (
        <PopupOverlay onClick={closePopup}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            <div className="row">
              <div
                className="col-6 border rounded p-2"
                style={{
                  height: "75vh",
                  overflowY: "auto", // Enables vertical scrolling if content overflows
                }}
              >
                {orderDetails.map((detail) => (
                  <CardSpacing>
                    <CardFoodOrderCashier
                      // key={1}
                      imageUrl={detail.productImage}
                      productName={detail.productName}
                      price={detail.unitPrice}
                      quantity={detail.quantity}
                    />
                  </CardSpacing>
                ))}
              </div>
              <OrderContainer className="col-6">
                <OrderTitle>Chi Tiết Đơn Hàng</OrderTitle>

                <OrderDetailRow>
                  <OrderLabel>Mã Đơn Hàng:</OrderLabel>{" "}
                  <span>{selectedOrder.orderId}</span>
                </OrderDetailRow>

                <OrderDetailRow>
                  <OrderLabel>Trạng Thái:</OrderLabel>{" "}
                  <OrderBadge>{selectedOrder.orderStatus}</OrderBadge>
                </OrderDetailRow>

                <OrderDetailRow>
                  <OrderLabel>Tổng Số Tiền:</OrderLabel>{" "}
                  <PriceText>{selectedOrder.totalAmount}đ</PriceText>
                </OrderDetailRow>

                <OrderDetailRow>
                  <OrderLabel>Địa Chỉ:</OrderLabel>{" "}
                  <span>{selectedOrder.address}</span>
                </OrderDetailRow>

                <OrderDetailRow>
                  <OrderLabel>Tên Người Dùng:</OrderLabel>{" "}
                  <span>{selectedOrder.username}</span>
                </OrderDetailRow>

                <OrderDetailRow>
                  <OrderLabel>Ghi Chú:</OrderLabel>{" "}
                  <NotesText>
                    {selectedOrder.notes || "Không có ghi chú thêm"}
                  </NotesText>
                </OrderDetailRow>
              </OrderContainer>
            </div>
          </PopupCard>
        </PopupOverlay>
      )}
    </div>
  );
};

export default ManagementOrdersOnlCashier;

const CardSpacing = styled.div`
  margin-bottom: 15px;
`;

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
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupCard = styled.div`
  background-color: #f7f7f1;
  padding: 20px;
  border-radius: 8px;
  width: 70%;
  height: 80vh;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const OrderContainer = styled.div`
  height: 75vh;
  overflow-y: auto;
  padding: 2rem;
`;

const OrderTitle = styled.h4`
  color: #007bff;
  margin-bottom: 1.5rem;
`;

const OrderDetailRow = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const OrderLabel = styled.strong`
  display: inline-block;
  margin-right: 0.5rem;
`;

const OrderBadge = styled.span`
  background-color: #17a2b8;
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
`;

const PriceText = styled.span`
  font-weight: bold;
`;

const NotesText = styled.span`
  font-style: italic;
  color: #666;
`;

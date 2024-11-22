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
    setOrderDetails([]); // Đảm bảo xóa thông tin chi tiết đơn hàng
  };

  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [orderStatus, setOrderStatus] = useState(
    selectedOrder?.orderStatus || ""
  ); // Trạng thái được chọn

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (selectedOrder && selectedOrder.orderDetailsLink) {
        setIsLoading(true);
        try {
          const details = await fetchOrderDetails(
            selectedOrder.orderDetailsLink
          );
          setOrderDetails(details);
        } catch (error) {
          console.error("Lỗi khi tải chi tiết đơn hàng:", error);
        } finally {
          setIsLoading(false); // Kết thúc trạng thái tải
        }
      } else {
        setOrderDetails([]);
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
              <div
                className="d-flex justify-content-center"
                key={order.orderId}
              >
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
              </div>
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
                style={{ height: "75vh", overflowY: "auto" }}
              >
                {isLoading ? (
                  <p>Đang tải chi tiết đơn hàng...</p>
                ) : orderDetails.length > 0 ? (
                  orderDetails.map((detail) => (
                    <CardSpacing key={detail.orderDetailId}>
                      <CardFoodOrderCashier
                        imageUrl={detail.productImage}
                        productName={detail.productName}
                        price={detail.unitPrice}
                        quantity={detail.quantity}
                      />
                    </CardSpacing>
                  ))
                ) : (
                  <p>Không có chi tiết đơn hàng.</p>
                )}
              </div>

              <OrderContainer className="col-6">
                <OrderTitle>Chi Tiết Đơn Hàng</OrderTitle>
                <OrderDetailRow>
                  <OrderLabel>Mã Đơn Hàng:</OrderLabel>{" "}
                  <span>{selectedOrder.orderId}</span>
                </OrderDetailRow>
                <OrderDetailRow>
                  <OrderLabel>Trạng Thái:</OrderLabel>
                  <SelectStatus
                    value={selectedOrder.orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)} // Cập nhật trạng thái được chọn
                  >
                    <option value="WAITING">Đang đợi</option>
                    <option value="PREPARING_ORDER">Đang chuẩn bị</option>
                    <option value="DELIVERED">Đã hoàn thành</option>
                  </SelectStatus>
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
                {/* Nút Lưu */}
                <SaveButton onClick={() => console.log("Lưu đơn hàng")}>
                  Lưu
                </SaveButton>
                &emsp;
                <SaveButton onClick={closePopup}>Thoát</SaveButton>
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

const SaveButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const SelectStatus = styled.select`
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

import { useEffect, useState } from "react";
import CardOrdersOnlCashier from "./component/cardOrdersOnlCashier";
import styled from "styled-components";
import { v4 as uuidv4_2 } from "uuid";
import {
  fetchOrders,
  fetchCustomerUsername,
  fetchTableId,
  Order,
  OrderDetail,
  fetchOrderDetails,
  updateOrderStatus,
  updateOrderDetails,
} from "../../api/apiCashier/ordersOnl";
import CardFoodOrderCashier from "./component/cardFoodOrderCashier";
import CardFoodEditCashier from "./component/cardFoodEditCashier";
import {
  Product,
  fetchProducts,
  fetchProductsInStock,
} from "../../api/apiCashier/foodApi";
import CardFoodOrderCashierEdit from "./component/cardFoodOrderCashierEdit";
import AlertSuccess from "./component/alertSuccess";

const ManagementOrdersOnlCashier = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Trạng thái lưu order được chọn

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // Quản lý trạng thái popup sửa

  const [products, setProducts] = useState<Product[]>([]);

  const [orderDetailsTemp, setOrderDetailsTemp] = useState<OrderDetail[]>([]);

  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsInStock();
      setProducts(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadProducts();
  }, []);

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
  useEffect(() => {
    loadOrders();
  }, []);

  // Hàm mở popup và lưu order được chọn

  const handleCardClick = (order: Order) => {
    setOrderStatus(order.orderStatus || "");
    setSelectedOrder(order);
  };

  // Hàm đóng popup
  const closePopup = () => {
    setSelectedOrder(null);
    setOrderDetails([]); // Đảm bảo xóa thông tin chi tiết đơn hàng
    setOrderStatus("");
  };

  const openEditPopup = (orderDetails: OrderDetail[]) => {
    setOrderDetailsTemp(orderDetails);
    setIsEditPopupOpen(true);
  };
  const closeEditPopup = () => {
    setOrderDetailsTemp([]);
    setIsEditPopupOpen(false);
  };

  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [orderStatus, setOrderStatus] = useState(
    selectedOrder?.orderStatus || ""
  ); // Trạng thái được chọn

  const loadOrderDetails = async () => {
    if (selectedOrder && selectedOrder.orderDetailsLink) {
      setIsLoading(true);
      try {
        const details = await fetchOrderDetails(selectedOrder.orderDetailsLink);
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
  useEffect(() => {
    loadOrderDetails();
  }, [selectedOrder]);

  const handleSave = async (orderId: number) => {
    const newStatus = orderStatus;

    try {
      // Gọi API để cập nhật trạng thái
      await updateOrderStatus(orderId, newStatus);

      // alert v
      const newAlert = {
        id: uuidv4_2(), // Tạo ID duy nhất cho mỗi alert
        message: "Cập nhật trạng thái thành công",
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== newAlert.id)
        );
      }, 3000);
      // alert ^
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    }
    loadOrders();
    closePopup();
  };

  const handleQuantityChange = (orderDetailId: number, newQuantity: number) => {
    setOrderDetailsTemp((prevDetails) =>
      prevDetails.map((detail) =>
        detail.orderDetailId === orderDetailId
          ? { ...detail, quantity: newQuantity }
          : detail
      )
    );
  };

  const handleDeleteDetail = (orderDetailId: number) => {
    setOrderDetailsTemp((prevDetails) =>
      prevDetails.filter((detail) => detail.orderDetailId !== orderDetailId)
    );
  };

  const addDetail = (product: Product) => {
    setOrderDetailsTemp((prevDetails) => {
      // Kiểm tra xem sản phẩm đã tồn tại trong danh sách chưa
      const isProductExisting = prevDetails.some(
        (detail) => detail.productId === product.productId
      );

      if (isProductExisting) {
        // Nếu sản phẩm đã tồn tại, tăng quantity
        return prevDetails.map((detail) =>
          detail.productId === product.productId
            ? { ...detail, quantity: (detail.quantity || 0) + 1 }
            : detail
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        return [
          ...prevDetails,
          {
            orderDetailId: Math.random(), // ID tạm, tùy chỉnh nếu cần
            productId: product.productId,
            productName: product.productName,
            productImage: product.image,
            unitPrice: product.price,
            quantity: 1, // Số lượng mặc định là 1
          },
        ];
      }
    });
  };

  const saveEditDetail = async (orderId: number) => {
    try {
      const updatedDetails = orderDetailsTemp.map((detail) => ({
        orderDetailId: detail.orderDetailId, // ID của chi tiết đơn hàng
        productId: detail.productId, // ID sản phẩm
        quantity: detail.quantity, // Số lượng sản phẩm
        unitPrice: detail.unitPrice, // Giá sản phẩm
        itemNotes: detail.itemNotes || "", // Ghi chú (nếu không có thì để trống)
        createdDate: detail.createdDate || new Date().toISOString(), // Dữ liệu ngày tạo
        updatedDate: new Date().toISOString(), // Cập nhật lại ngày sửa
      }));

      console.table(updatedDetails);

      // Gọi API để cập nhật trạng thái
      await updateOrderDetails(orderId, updatedDetails);

      // alert v
      const newAlert = {
        id: uuidv4_2(), // Tạo ID duy nhất cho mỗi alert
        message: "Cập nhật món ăn thành công",
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== newAlert.id)
        );
      }, 3000);
      // alert ^
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    }
    loadOrderDetails();
    loadOrders();
    closeEditPopup();
  };

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
            <PopupCardGrid>
              <div className="grid-container">
                <div className="box">
                  <div
                    className="border rounded p-2 h-100"
                    style={{ overflowY: "auto" }}
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
                </div>

                <div className="box">
                  <OrderContainer className="h-100">
                    <OrderTitle>Chi Tiết Đơn Hàng</OrderTitle>
                    <OrderDetailRow>
                      <OrderLabel>Mã Đơn Hàng:</OrderLabel>{" "}
                      <span>{selectedOrder.orderId}</span>
                    </OrderDetailRow>
                    <OrderDetailRow>
                      <OrderLabel>Trạng Thái:</OrderLabel>
                      <SelectStatus
                        value={orderStatus}
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
                  </OrderContainer>
                </div>
                <div className="box d-flex align-items-center justify-content-center">
                  <StyledWrapperButton>
                    <button onClick={() => openEditPopup(orderDetails)}>
                      Sửa
                    </button>
                  </StyledWrapperButton>
                </div>
                <div className="box d-flex align-items-center justify-content-center">
                  <StyledWrapperButton>
                    <button
                      onClick={() => handleSave(selectedOrder.orderId || 0)}
                    >
                      Lưu
                    </button>
                  </StyledWrapperButton>
                  &emsp;
                  <StyledWrapperButton>
                    <button onClick={closePopup}>Đóng</button>
                  </StyledWrapperButton>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {/* popup edit order */}
      {isEditPopupOpen && (
        <PopupOverlay>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            <PopupCardGrid>
              <div className="grid-container-edit">
                <div className="box d-flex align-items-center">
                  <StyledWrapperSearchEdit>
                    <input
                      className="input"
                      name="text"
                      type="text"
                      placeholder="Search..."
                    />
                  </StyledWrapperSearchEdit>
                </div>
                <div className="box d-flex align-items-center justify-content-center">
                  <OrderLabel>Mã Đơn Hàng:</OrderLabel>{" "}
                  <span>{selectedOrder?.orderId}</span>
                </div>
                <div className="box-food" key={selectedOrder?.orderId}>
                  {products.map((product) => (
                    <div className="d-flex justify-content-center">
                      <CardFoodEditCashier
                        img={product.image}
                        price={product.price}
                        name={product.productName}
                        onToggleCart={() => addDetail(product)}
                      />
                    </div>
                  ))}
                </div>
                <div className="box">
                  <div
                    className="border rounded p-2 h-100"
                    style={{ overflowY: "auto" }}
                  >
                    {isLoading ? (
                      <p>Đang tải chi tiết đơn hàng...</p>
                    ) : orderDetailsTemp.length > 0 ? (
                      orderDetailsTemp.map((detail) => (
                        <CardSpacing key={detail.orderDetailId}>
                          <CardFoodOrderCashierEdit
                            imageUrl={detail.productImage}
                            productName={detail.productName}
                            price={detail.unitPrice}
                            quantity={detail.quantity}
                            onchangeQuantity={(e) =>
                              handleQuantityChange(
                                detail.orderDetailId,
                                Number(e.target.value)
                              )
                            }
                            deleteDetail={() =>
                              handleDeleteDetail(detail.orderDetailId)
                            }
                          />
                        </CardSpacing>
                      ))
                    ) : (
                      <p>Không có chi tiết đơn hàng.</p>
                    )}
                  </div>
                </div>
                <div className="box d-flex align-items-center justify-content-center">
                  <OrderLabel>Tổng Số Tiền:</OrderLabel>{" "}
                  <PriceText>{selectedOrder?.totalAmount}đ</PriceText>
                </div>
                <div className="box d-flex align-items-center justify-content-end">
                  <StyledWrapperButton>
                    <button
                      onClick={() =>
                        saveEditDetail(selectedOrder?.orderId || 0)
                      }
                    >
                      Lưu
                    </button>
                  </StyledWrapperButton>
                  &emsp;
                  <StyledWrapperButton>
                    <button onClick={closeEditPopup}>Đóng</button>
                  </StyledWrapperButton>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {/* Container hiển thị thông báo */}
      <div className="fixed top-4 right-4 flex flex-col items-end space-y-2">
        {alerts.map((alert) => (
          <AlertSuccess key={alert.id} message={alert.message} />
        ))}
      </div>
    </div>
  );
};

export default ManagementOrdersOnlCashier;

const CardSpacing = styled.div`
  margin-bottom: 15px;
`;

const PopupCardGrid = styled.div`
  .grid-container {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 72.5vh 7.5vh;
  }
  .grid-container-edit {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 7.5vh 65vh 7.5vh;
  }
  .box-food {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    row-gap: 20px;
    overflow-y: auto;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
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
  width: 75%;
  height: 85vh;
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

const StyledWrapperButton = styled.div`
  button {
    font-size: 17px;
    padding: 0.5em 2em;
    border: transparent;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    background: dodgerblue;
    color: white;
    border-radius: 4px;
  }

  button:hover {
    background: rgb(2, 0, 36);
    background: linear-gradient(
      90deg,
      rgba(30, 144, 255, 1) 0%,
      rgba(0, 212, 255, 1) 100%
    );
  }

  button:active {
    transform: translate(0em, 0.2em);
  }
`;

const StyledWrapperSearchEdit = styled.div`
  .input {
    width: 100%;
    max-width: 220px;
    height: 45px;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid lightgrey;
    outline: none;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0px 0px 20px -18px;
  }

  .input:hover {
    border: 2px solid lightgrey;
    box-shadow: 0px 0px 20px -17px;
  }

  .input:active {
    transform: scale(0.95);
  }

  .input:focus {
    border: 2px solid grey;
  }
`;
function uuidv4() {
  throw new Error("Function not implemented.");
}

import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4_2 } from "uuid";
import { Product, fetchProductsInStock } from "../../api/apiCashier/foodApi";
import {
  Order,
  OrderDetail,
  fetchOrderDetailsByOrderId,
  fetchOrders,
  updateOrderDetails,
  updateOrderStatus,
  updateOrderUpdateDate,
  updateUserIdForOrder,
} from "../../api/apiCashier/ordersOnl";
import { AuthContext } from "../customer/component/AuthContext";
import AlertSuccess from "./component/alertSuccess";
import CardFoodEditCashier from "./component/cardFoodEditCashier";
import CardFoodOrderCashier from "./component/cardFoodOrderCashier";
import CardFoodOrderCashierEdit from "./component/cardFoodOrderCashierEdit";
import CardOrdersOnlCashier from "./component/cardOrdersOnlCashier";

const ManagementOrdersOnlCashier = () => {
  // useState v

  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Trạng thái lưu order được chọn

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // Quản lý trạng thái popup sửa

  const [products, setProducts] = useState<Product[]>([]);

  const [orderDetailsTemp, setOrderDetailsTemp] = useState<OrderDetail[]>([]);

  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [orderStatus, setOrderStatus] = useState(
    selectedOrder?.orderStatus || ""
  ); // Trạng thái được chọn

  const [totalAmount, setTotalAmount] = useState<number | 0>(0);

  const [showAllOrder, setShowAllOrder] = useState(false); // Trạng thái để kiểm soát

  const { employeeUserId } = useContext(AuthContext);

  // useState ^

  // Lấy api v

  const loadProducts = async () => {
    const data = await fetchProductsInStock();
    setProducts(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadOrders = async (limit = 1000) => {
    try {
      const data = await fetchOrders(limit); // Gửi `limit` để giới hạn số lượng
      setOrders(data); // Đảo ngược nếu cần thiết
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    loadOrders(20);
  }, []);
  // const loadOrders = async () => {
  //   try {
  //     const ordersWithLinks = await fetchOrders();

  //     const updatedOrders = await Promise.all(
  //       ordersWithLinks.map(async (order) => {
  //         const username = order.customerLink
  //           ? await fetchCustomerUsername(order.customerLink)
  //           : "";
  //         const tableId = order.tableLink
  //           ? await fetchTableId(order.tableLink)
  //           : null;

  //         return { ...order, username, tableId };
  //       })
  //     );

  //     setOrders(updatedOrders);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy dữ liệu:", error);
  //   }
  // };
  // useEffect(() => {
  //   loadOrders();
  // }, []);

  const loadOrderDetails = async () => {
    if (selectedOrder) {
      setIsLoading(true);
      try {
        const details = await fetchOrderDetailsByOrderId(selectedOrder.orderId);
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

  // Lấy api ^

  // function v

  const handleSave = async (orderId: number) => {
    const newStatus = orderStatus;

    try {
      // Gọi API để cập nhật trạng thái
      await updateOrderStatus(orderId, newStatus);

      await updateUserIdForOrder(orderId, Number(employeeUserId));

      await updateOrderUpdateDate(orderId);

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
    loadOrders(20);
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

      // console.table(updatedDetails);

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
    loadOrders(20);
    closeEditPopup();
  };

  useEffect(() => {
    const takeTotalAmount = () => {
      let total = 0;
      orderDetailsTemp.map((detail) => {
        total += (detail.unitPrice || 0) * (detail.quantity || 0);
      });
      setTotalAmount(total);
    };
    takeTotalAmount();
  }, [orderDetailsTemp]);

  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products); // Cập nhật lại danh sách khi `products` thay đổi
  }, [products]);

  const handleSearchChange = (event: { target: { value: string } }) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  // filter

  // Step 1: Declare a state for the selected filter value
  const [filter, setFilter] = useState("all"); // Default to 'Tất cả'

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Khởi tạo với mảng rỗng

  // Step 2: Update `filteredOrders` whenever `filter` or `orders` changes
  useEffect(() => {
    const applyFilter = () => {
      const result = orders.filter((order) => {
        if (filter === "all") return order.orderStatus === "PREPARING_ORDER"; // Show preparing orders
        if (filter === "intransit") return order.orderStatus === "IN_TRANSIT"; // Show in-transit orders
        if (filter === "delivered") return order.orderStatus === "DELIVERED"; // Show delivered orders
        if (filter === "canceled") return order.orderStatus === "CANCELED"; // Show delivered orders
        if (filter === "all2") return true; // Show all orders
        return true; // Default case (shouldn't happen)
      });
      setFilteredOrders(result);
    };

    applyFilter();
  }, [filter, orders]);

  // Step 3: Handle radio button change
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value); // Update filter based on the selected radio button
  };

  const handleShowAllOrder = () => {
    setShowAllOrder(true);
    loadOrders(); // Gọi mà không giới hạn `limit` để load toàn bộ
  };

  // function ^

  // popup v

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
    // loadProducts();
    setOrderDetailsTemp(orderDetails);
    setIsEditPopupOpen(true);
  };
  const closeEditPopup = () => {
    setOrderDetailsTemp([]);
    setIsEditPopupOpen(false);
    setSearchTerm("");
    loadProducts();
  };

  // popup ^

  return (
    <div>
      <StyledWrapperTab
        style={{ marginBottom: "25px", marginTop: "-25px" }}
        className="d-flex justify-content-between"
      >
        <div className="radio-inputs">
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="all"
              checked={filter === "all"}
              onChange={handleRadioChange}
            />
            <span className="name">Chờ xác nhận</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="intransit"
              checked={filter === "intransit"}
              onChange={handleRadioChange}
            />
            <span className="name">Đã xác nhận</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="delivered"
              checked={filter === "delivered"}
              onChange={handleRadioChange}
            />
            <span className="name">Hoàn thành</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="canceled"
              checked={filter === "canceled"}
              onChange={handleRadioChange}
            />
            <span className="name">Hủy</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="all2"
              checked={filter === "all2"}
              onChange={handleRadioChange}
            />
            <span className="name">Tất cả</span>
          </label>
        </div>
        <button onClick={handleShowAllOrder}>Hiện tất cả</button>
      </StyledWrapperTab>
      <CardGrid>
        {filteredOrders.map((order) => (
          <div className="d-flex justify-content-center" key={order.orderId}>
            <CardOrdersOnlCashier
              key={order.orderId}
              orderId={order.orderId}
              orderStatus={order.orderStatus}
              totalAmount={order.totalAmount}
              notes={order.notes || "Không có ghi chú"}
              address={order.address || "Không có địa chỉ"}
              username={order.fullName || "Vô danh"}
              date={order.createdDate}
              phoneNumber={order.phoneNumber || "Không có SĐT"}
              onClick={() => handleCardClick(order)} // Thêm sự kiện onClick
            />
          </div>
        ))}
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
                        <option value="WAITING">Chờ thanh toán</option>
                        <option value="PREPARING_ORDER">Chờ xác nhận</option>
                        <option value="IN_TRANSIT">Xác nhận</option>
                        <option value="DELIVERED">Hoàn thành</option>
                        <option value="CANCELED">Hủy</option>
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
                      <span>{selectedOrder.fullName}</span>
                    </OrderDetailRow>
                    <OrderDetailRow>
                      <OrderLabel>Số Điện Thoại:</OrderLabel>{" "}
                      <span>
                        {selectedOrder.phoneNumber || "Không có số điện thoại"}
                      </span>
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
                    <button
                      onClick={() => openEditPopup(orderDetails)}
                      disabled={selectedOrder.orderStatus === "DELIVERED"}
                    >
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
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </StyledWrapperSearchEdit>
                </div>
                <div className="box d-flex align-items-center justify-content-center">
                  <OrderLabel>Mã Đơn Hàng:</OrderLabel>{" "}
                  <span>{selectedOrder?.orderId}</span>
                </div>
                <div className="box-food" key={selectedOrder?.orderId}>
                  {filteredProducts.map((product) => (
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
                  <PriceText>{totalAmount}đ</PriceText>
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

const StyledWrapperTab = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 40%;
    font-size: 14px;
  }

  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
  }

  .radio-inputs .radio input {
    display: none;
  }

  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all 0.15s ease-in-out;
    height: 30px;
  }

  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
  }

  button {
    background-color: #f3f7fe;
    color: black;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    width: 100px;
    height: 35px;
    transition: 0.3s;
    text-align: center;
  }

  button:hover {
    background-color: #aaaaaa;
    box-shadow: 0 0 0 5px #cccccc;
    color: #fff;
  }
`;
function uuidv4() {
  throw new Error("Function not implemented.");
}

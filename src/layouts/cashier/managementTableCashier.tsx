import React, { useEffect, useState } from "react";
import CardTableCashier from "./component/cardTableCashier";
import styled from "styled-components";
import axios from "axios";
import {
  fetchOrderbyTableId,
  fetchTables,
  Table,
} from "../../api/apiCashier/tableApi";
import {
  Order,
  OrderDetail,
  fetchOrderDetails,
  updateOrderDetails,
} from "../../api/apiCashier/ordersOnl";
import CardFoodEditCashier from "./component/cardFoodEditCashier";
import CardFoodOrderCashierEdit from "./component/cardFoodOrderCashierEdit";
import { Product, fetchProductsInStock } from "../../api/apiCashier/foodApi";
import { v4 as uuidv4_3 } from "uuid";

const ManagementTableCashier: React.FC = () => {
  const defaultOrder: Order = {
    orderId: 0,
    orderStatus: "EMPTY", // hoặc giá trị mặc định phù hợp
    totalAmount: 0,
    notes: "",
    address: "",
    customerLink: undefined,
    tableLink: undefined,
    orderDetailsLink: undefined,
  };

  // useState v
  const [tables, setTables] = useState<Table[]>([]);

  const [foodTable, setFoodTable] = useState<Table | null>(null);

  const [swapTable, setSwapTable] = useState<Table | null>(null);

  const [splitTable, setSplitTable] = useState<Table | null>(null);

  const [combineTable, setCombineTable] = useState<Table | null>(null);

  const [detailTable, setDetailTable] = useState<Table | null>(null);

  const [selectOrderbyTableId, setSelectOrderbyTableId] =
    useState<Order | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [orderDetailsTemp, setOrderDetailsTemp] = useState<OrderDetail[]>([]);

  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  // useState ^

  // lấy dữ liệu từ api v

  const loadOrderDetails = async () => {
    if (
      selectOrderbyTableId &&
      selectOrderbyTableId?._links?.orderDetails?.href
    ) {
      setIsLoading(true);
      try {
        const details = await fetchOrderDetails(
          selectOrderbyTableId?._links?.orderDetails?.href
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
  useEffect(() => {
    console.log(selectOrderbyTableId);
    loadOrderDetails();
  }, [selectOrderbyTableId]);

  const getOrderbyTableId = async (tableId: number) => {
    const data: Order[] = await fetchOrderbyTableId(tableId);
    const latestOrder = data.reduce<Order | null>((latest, current) => {
      const latestDate = new Date(latest?.createdDate || 0).getTime();
      const currentDate = new Date(current?.createdDate || 0).getTime();
      return currentDate > latestDate ? current : latest;
    }, null); // Giá trị khởi tạo là null

    // setSelectOrderbyTableId(latestOrder); // Lưu order mới nhất.
    console.log(latestOrder);
    console.log(latestOrder?._links?.orderDetails?.href);
    return latestOrder;
  };

  useEffect(() => {
    const loadTables = async () => {
      const data = await fetchTables();
      setTables(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadTables();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsInStock();
      setProducts(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadProducts();
  }, []);

  // lấy dữ liệu từ api ^

  // các hành động function v

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
        id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
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
    closeFoodTable();
  };

  // các hành động function ^

  // các popup v

  const openFoodTable = (table: Table, order: Order) => {
    setSelectOrderbyTableId(order);
    setFoodTable(table); // Mở popup sau khi có đủ dữ liệu
  };

  const closeFoodTable = () => {
    setSelectOrderbyTableId(null);
    setOrderDetailsTemp([]);
    setFoodTable(null);
  };

  const openSwapTable = (table: Table) => {
    getOrderbyTableId(table.tableId);
    setSwapTable(table);
  };
  const closeSwapTable = () => {
    setSelectOrderbyTableId(null);
    setSwapTable(null);
  };

  const openSplitTable = (table: Table) => {
    getOrderbyTableId(table.tableId);
    setSplitTable(table);
  };
  const closeSplitTable = () => {
    setSelectOrderbyTableId(null);
    setSplitTable(null);
  };

  const openCombineTable = (table: Table) => {
    getOrderbyTableId(table.tableId);
    setSwapTable(table);
  };
  const closeCombineTable = () => {
    setSelectOrderbyTableId(null);
    setCombineTable(null);
  };

  const openDetailTable = (table: Table) => {
    getOrderbyTableId(table.tableId);
    setDetailTable(table);
  };
  const closeDetailTable = () => {
    setSelectOrderbyTableId(null);
    setDetailTable(null);
  };

  // các popup ^

  useEffect(() => {
    setOrderDetailsTemp(orderDetails);
  }, [orderDetails]);

  return (
    <div>
      <StyledWrapper>
        {tables.map((table) => (
          <div className="d-flex justify-content-center" key={table.tableId}>
            <CardTableCashier
              key={table.tableId}
              tableId={table.tableId}
              tableNumber={table.tableNumber}
              status={
                table.tableStatus === "EMPTY_TABLE"
                  ? "Trống"
                  : table.tableStatus === "OCCUPIED_TABLE"
                  ? "Có Khách"
                  : table.tableStatus === "RESERVED_TABLE"
                  ? "Đặt Trước"
                  : "Không xác định"
              }
              location={table.location}
              foodTable={async () => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openFoodTable(
                        table,
                        (await getOrderbyTableId(table.tableId)) || defaultOrder
                      )
                    : alert("Bàn này trống");
                }
              }}
              swapTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openSwapTable(table)
                    : alert("Bàn này trống");
                }
              }}
              splitTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openSplitTable(table)
                    : alert("Bàn này trống");
                }
              }}
              combineTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openCombineTable(table)
                    : alert("Bàn này trống");
                }
              }}
              detailTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openDetailTable(table)
                    : alert("Bàn này trống");
                }
              }}
            />
          </div>
        ))}
      </StyledWrapper>

      {foodTable && (
        <PopupOverlay onClick={closeFoodTable}>
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
                  <span>{selectOrderbyTableId?.orderId}</span>
                </div>
                <div className="box-food" key={selectOrderbyTableId?.orderId}>
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
                  <PriceText>{selectOrderbyTableId?.totalAmount}đ</PriceText>
                </div>
                <div className="box d-flex align-items-center justify-content-end">
                  <StyledWrapperButton>
                    <button
                      onClick={() =>
                        saveEditDetail(selectOrderbyTableId?.orderId || 0)
                      }
                    >
                      Lưu
                    </button>
                  </StyledWrapperButton>
                  &emsp;
                  <StyledWrapperButton>
                    <button onClick={closeFoodTable}>Đóng</button>
                  </StyledWrapperButton>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {swapTable && (
        <PopupOverlay onClick={closeSwapTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup swap table
            {selectOrderbyTableId?.totalAmount}
          </PopupCard>
        </PopupOverlay>
      )}

      {splitTable && (
        <PopupOverlay onClick={closeSplitTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup split table
            {selectOrderbyTableId?.totalAmount}
          </PopupCard>
        </PopupOverlay>
      )}

      {combineTable && (
        <PopupOverlay onClick={closeCombineTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup combine table
            {selectOrderbyTableId?.totalAmount}
          </PopupCard>
        </PopupOverlay>
      )}

      {detailTable && (
        <PopupOverlay onClick={closeDetailTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup detail table
            {selectOrderbyTableId?.createdDate}
          </PopupCard>
        </PopupOverlay>
      )}
    </div>
  );
};

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

const PriceText = styled.span`
  font-weight: bold;
`;

const CardSpacing = styled.div`
  margin-bottom: 15px;
`;

const OrderLabel = styled.strong`
  display: inline-block;
  margin-right: 0.5rem;
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
  z-index: 3;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
`;

export default ManagementTableCashier;

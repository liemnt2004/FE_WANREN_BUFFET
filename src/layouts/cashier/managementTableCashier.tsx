import React, { useContext, useEffect, useState } from "react";
import CardTableCashier from "./component/cardTableCashier";
import styled from "styled-components";
import axios from "axios";
import {
  fetchOrderbyTableId,
  fetchTables,
  Table,
  updateTableStatus,
} from "../../api/apiCashier/tableApi";
import {
  Order,
  OrderDetail,
  fetchOrderDetails,
  updateOrderDetails,
  updateOrderStatus,
  updateTableIdOrder,
} from "../../api/apiCashier/ordersOnl";
import CardFoodEditCashier from "./component/cardFoodEditCashier";
import CardFoodOrderCashierEdit from "./component/cardFoodOrderCashierEdit";
import {
  Product,
  fetchProductsInStock,
  findProductById,
} from "../../api/apiCashier/foodApi";
import { v4 as uuidv4_3 } from "uuid";
import { table } from "console";
import AlertSuccess from "./component/alertSuccess";
import { CreateNewOrder } from "../../api/apiStaff/orderForStaffApi";
import { AuthContext } from "../customer/component/AuthContext";
import { useNavigate } from "react-router-dom";
import CardFoodOrderCashier from "./component/cardFoodOrderCashier";
import { Input } from "antd";
import { createPayment } from "../../api/apiCashier/payApt";

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
  const defaultTable: Table = {
    createdDate: "",
    updatedDate: "",
    tableId: 0,
    tableNumber: 0,
    tableStatus: "",
    location: "",
  };

  // useState v
  const [tables, setTables] = useState<Table[]>([]);

  const [foodTable, setFoodTable] = useState<Table | null>(null);

  const [swapTable, setSwapTable] = useState<Table | null>(null);

  const [splitTable, setSplitTable] = useState<Table | null>(null);

  const [combineTable, setCombineTable] = useState<Table | null>(null);

  const [deleteTable, setDeleteTable] = useState<Table | null>(null);

  const [detailTable, setDetailTable] = useState<Table | null>(null);

  const [emptyTable, setEmptyTable] = useState<Table | null>(null);

  const [popupSplitFood, setPopupSplitFood] = useState<Table | null>(null);

  const [payTable, setPayTable] = useState<Table | null>(null);

  const [selectOrderbyTableId, setSelectOrderbyTableId] =
    useState<Order | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [orderDetailsTemp, setOrderDetailsTemp] = useState<OrderDetail[]>([]);

  const [orderDetailsTemp2, setOrderDetailsTemp2] = useState<OrderDetail[]>([]);

  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const [orderWithEmptyDetails, setOrderWithEmptyDetails] = useState<
    OrderDetail[]
  >([]);

  const [tablesEmpty, setTablesEmpty] = useState<Table[]>([]);

  const [tablesOccupied, setTablesOccupied] = useState<Table[]>([]);

  const [selectTable, setSelectTable] = useState<Table | null>(null);

  const [moneyBack, setMoneyBack] = useState<number | 0>(0);

  const { employeeUserId } = useContext(AuthContext);

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
    loadOrderDetails();
  }, [selectOrderbyTableId]);

  const loadOrderDetails2 = async (order: Order) => {
    const details = await fetchOrderDetails(
      order?._links?.orderDetails?.href || ""
    );
    return details;
  };

  const getOrderbyTableId = async (tableId: number) => {
    const data: Order[] = await fetchOrderbyTableId(tableId);
    const latestOrder = data.reduce<Order | null>((latest, current) => {
      const latestDate = new Date(latest?.createdDate || 0).getTime();
      const currentDate = new Date(current?.createdDate || 0).getTime();
      return currentDate > latestDate ? current : latest;
    }, null); // Giá trị khởi tạo là null

    setSelectOrderbyTableId(latestOrder); // Lưu order mới nhất.
    return latestOrder;
  };

  const loadTables = async () => {
    const data = await fetchTables();
    setTables(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
  };

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsInStock();
      setProducts(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadProducts();
  }, []);

  const loadTablesEmpty = async () => {
    try {
      const data = await fetchTables(); // Giả sử fetchTables trả về danh sách các bảng
      const emptyTables = data.filter(
        (table: Table) => table.tableStatus === "EMPTY_TABLE"
      );
      setTablesEmpty(emptyTables);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

  useEffect(() => {
    loadTablesEmpty();
  }, []);

  const loadTablesOccupied = async () => {
    try {
      const data = await fetchTables(); // Giả sử fetchTables trả về danh sách các bảng
      const emptyTables = data.filter(
        (table: Table) => table.tableStatus === "OCCUPIED_TABLE"
      );
      setTablesOccupied(emptyTables);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

  useEffect(() => {
    loadTablesOccupied();
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

  const addDetail2 = (product: Product) => {
    setOrderDetailsTemp2((prevDetails) => {
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

  const handleQuantityChange2 = (
    orderDetailId: number,
    newQuantity: number
  ) => {
    setOrderDetailsTemp2((prevDetails) =>
      prevDetails.map((detail) =>
        detail.orderDetailId === orderDetailId
          ? { ...detail, quantity: newQuantity }
          : detail
      )
    );
  };

  const handleDeleteDetail2 = (orderDetailId: number) => {
    setOrderDetailsTemp2((prevDetails) =>
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

  const saveSwapTable = async (
    orderId: number,
    selectTable: number,
    currentTable: number
  ) => {
    if (selectTable !== 0) {
      await updateTableIdOrder(orderId, selectTable);
      loadTablesEmpty();
      loadTablesOccupied();
      setTables([]);
      loadTables();
      closeSwapTable();

      // alert v
      const newAlert = {
        id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
        message: "Cập nhật bàn thành công",
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== newAlert.id)
        );
      }, 3000);
      // alert ^
    } else {
      alert("Bạn chưa chọn bàn");
    }
  };

  const saveSplitTable = (
    orderId: number,
    selectTableId: number,
    selectTable: Table,
    currentTable: number
  ) => {
    if (selectTableId !== 0) {
      // closeSplitTable();
      openPopupSplitFood(selectTable);
      //   // alert v
      //   const newAlert = {
      //     id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
      //     message: "Cập nhật bàn thành công",
      //   };
      //   setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
      //   // Tự động xóa thông báo sau 3 giây
      //   setTimeout(() => {
      //     setAlerts((prevAlerts) =>
      //       prevAlerts.filter((alert) => alert.id !== newAlert.id)
      //     );
      //   }, 3000);
      //   // alert ^
    } else {
      alert("Bạn chưa chọn bàn");
    }
  };

  const saveCombineTable = async (
    orderId: number,
    selectTable: number,
    selectOrder: Order,
    currentTable: number
  ) => {
    if (selectTable !== 0) {
      closeCombineTable();
      const order1: OrderDetail[] = orderDetailsTemp;
      const order2: OrderDetail[] = await loadOrderDetails2(selectOrder);

      // Kết hợp order1 và order2
      const combinedOrders = [...order1, ...order2];

      // Tính tổng quantity cho các sản phẩm có productId giống nhau
      const order3 = combinedOrders.reduce<OrderDetail[]>((acc, curr) => {
        // Tìm sản phẩm có productId trùng với sản phẩm hiện tại trong acc
        const existingProduct = acc.find(
          (item) => item.productId === curr.productId
        );

        if (existingProduct) {
          // Nếu sản phẩm đã tồn tại trong acc, cộng thêm quantity
          existingProduct.quantity =
            (existingProduct.quantity ?? 0) + (curr.quantity ?? 0);
        } else {
          // Nếu chưa có, thêm sản phẩm vào acc
          acc.push({ ...curr });
        }

        return acc;
      }, []);

      console.log(order3);

      await updateOrderDetails(selectOrder.orderId || 0, orderWithEmptyDetails);
      await updateOrderStatus(selectOrder.orderId || 0, "DELIVERED");
      await updateOrderDetails(orderId, order3);
      await updateTableStatus(selectTable, "EMPTY_TABLE");
      loadTablesEmpty();
      loadTablesOccupied();
      loadTables();

      // alert v
      const newAlert = {
        id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
        message: "Gộp bàn thành công",
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== newAlert.id)
        );
      }, 3000);
      // alert ^
    } else {
      alert("Bạn chưa chọn bàn");
    }
  };

  const saveEmptyTable = async (tableId: number) => {
    updateTableStatus(tableId, "OCCUPIED_TABLE");
    const newOrderId = await CreateNewOrder(Number(employeeUserId), tableId);
    updateOrderDetails(newOrderId.id, orderDetailsTemp);
    loadTablesEmpty();
    loadTablesOccupied();
    setTables([]);
    loadTables();
    closeEmptyTable();
    // alert v
    const newAlert = {
      id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
      message: "Mở bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    //   // alert ^
  };

  const saveDeleteTable = async (orderId: number, currentTable: number) => {
    closeDeleteTable();
    await updateTableStatus(currentTable, "EMPTY_TABLE");
    await updateOrderDetails(orderId, orderWithEmptyDetails);
    await updateOrderStatus(orderId, "DELIVERED");
    loadTablesEmpty();
    loadTablesOccupied();
    loadTables();
    // alert v
    const newAlert = {
      id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
      message: "Hủy bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  const savePopupSplitFood = async (
    order: Order,
    selectTableId: number,
    currentOrderDetail: OrderDetail[],
    selectOrderDetail: OrderDetail[]
  ) => {
    closeSplitTable();
    closePopupSplitFood();

    await updateOrderDetails(order.orderId || 0, currentOrderDetail);
    const newOrderId = (
      await CreateNewOrder(Number(employeeUserId), selectTableId)
    ).id;
    await updateOrderDetails(newOrderId, selectOrderDetail);
    await updateTableStatus(selectTableId, "OCCUPIED_TABLE");

    loadTablesEmpty();
    loadTablesOccupied();
    setTables([]);
    setOrderDetailsTemp2([]);
    loadTables();
    // alert v
    const newAlert = {
      id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
      message: "Tách bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  const unlockTable = async (table: Table, order: Order) => {
    await updateTableStatus(table.tableId, "OCCUPIED_TABLE");
    await updateOrderStatus(order.orderId || 0, "IN_TRANSIT");
    loadTables();
    closeDetailTable();

    // alert v
    const newAlert = {
      id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
      message: "Mở khóa thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  const changeMoneyBack = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoneyBack(Number(event.target.value));
  };

  const confirmPay = async (tableId: number, order: Order) => {
    await createPayment(
      "CASH",
      true,
      order.totalAmount || 0,
      order.orderId || 0,
      Number(employeeUserId)
    );
    await updateOrderStatus(order.orderId || 0, "DELIVERED");
    await updateTableStatus(tableId, "EMPTY_TABLE");
    loadTablesEmpty();
    loadTablesOccupied();
    loadTables();

    closePayTable();

    // alert v
    const newAlert = {
      id: uuidv4_3(), // Tạo ID duy nhất cho mỗi alert
      message: "Đóng giao dịch thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  // các hành động function ^

  // các popup v

  const openFoodTable = (table: Table, order: Order) => {
    setFoodTable(table); // Mở popup sau khi có đủ dữ liệu
    setSelectOrderbyTableId(order);
  };

  const closeFoodTable = () => {
    setFoodTable(null);
    setSelectOrderbyTableId(null);
    setOrderDetailsTemp([]);
  };

  const openSwapTable = (table: Table) => {
    setSwapTable(table);
    getOrderbyTableId(table.tableId);
  };
  const closeSwapTable = () => {
    setSwapTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };

  const openSplitTable = (table: Table) => {
    setSplitTable(table);
    getOrderbyTableId(table.tableId);
  };
  const closeSplitTable = () => {
    setSplitTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
    setOrderDetailsTemp2([]);
  };

  const openCombineTable = (table: Table) => {
    setCombineTable(table);
    getOrderbyTableId(table.tableId);
  };
  const closeCombineTable = () => {
    setCombineTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };

  const openDeleteTable = (table: Table) => {
    setDeleteTable(table);
    getOrderbyTableId(table.tableId);
  };
  const closeDeleteTable = () => {
    setDeleteTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };

  const openDetailTable = (table: Table) => {
    setDetailTable(table);
    getOrderbyTableId(table.tableId);
  };
  const closeDetailTable = () => {
    setDetailTable(null);
    setSelectOrderbyTableId(null);
  };

  const openEmptyTable = (table: Table) => {
    setEmptyTable(table);
    // getOrderbyTableId(table.tableId);
  };
  const closeEmptyTable = () => {
    setEmptyTable(null);
    setSelectOrderbyTableId(null);
    setOrderDetailsTemp([]);
  };

  const openPopupSplitFood = (table: Table) => {
    setPopupSplitFood(table);
    // getOrderbyTableId(table.tableId);
  };
  const closePopupSplitFood = () => {
    setPopupSplitFood(null);
    // setSelectOrderbyTableId(null);
  };

  const openPayTable = (table: Table) => {
    setPayTable(table);
    getOrderbyTableId(table.tableId);
  };
  const closePayTable = () => {
    setPayTable(null);
    setSelectOrderbyTableId(null);
  };

  const hehe = () => {};

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
                  : table.tableStatus === "LOCKED_TABLE"
                  ? "Thanh Toán"
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
                    : void null;
                }
              }}
              swapTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openSwapTable(table)
                    : void null;
                }
              }}
              splitTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openSplitTable(table)
                    : void null;
                }
              }}
              combineTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openCombineTable(table)
                    : void null;
                }
              }}
              deleteTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openDeleteTable(table)
                    : void null;
                }
              }}
              detailTable={() => {
                {
                  table.tableStatus === "EMPTY_TABLE"
                    ? openEmptyTable(table)
                    : table.tableStatus === "LOCKED_TABLE"
                    ? openDetailTable(table)
                    : hehe();
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
                  &ensp;
                  <OrderLabel>Món ăn</OrderLabel>
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
            <PopupCardGrid>
              <div
                className="w-100"
                style={{ overflow: "auto", height: "80vh" }}
              >
                <div className="grid-container-swapTable">
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Đổi bàn</OrderLabel>
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Bàn hiện tại</OrderLabel>
                  </div>
                  <div className="box box-table">
                    {tablesEmpty.map((table) => (
                      <div
                        className="d-flex justify-content-center"
                        key={table.tableId}
                      >
                        <CardTableCashier
                          key={table.tableId}
                          tableId={table.tableId}
                          tableNumber={table.tableNumber}
                          status={
                            table.tableStatus === "EMPTY_TABLE"
                              ? "Trống"
                              : table.tableStatus === "OCCUPIED_TABLE"
                              ? "Có Khách"
                              : table.tableStatus === "LOCKED_TABLE"
                              ? "Thanh Toán"
                              : "Không xác định"
                          }
                          detailTable={() => setSelectTable(table)}
                          location={table.location}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <CardTableCashier
                      tableId={swapTable.tableId}
                      tableNumber={swapTable.tableNumber}
                      status={
                        swapTable.tableStatus === "EMPTY_TABLE"
                          ? "Trống"
                          : swapTable.tableStatus === "OCCUPIED_TABLE"
                          ? "Có Khách"
                          : swapTable.tableStatus === "LOCKED_TABLE"
                          ? "Thanh Toán"
                          : "Không xác định"
                      }
                      location={swapTable.location}
                    />
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Bàn đang chọn:</OrderLabel>{" "}
                    <span>{selectTable?.tableNumber}</span>
                  </div>
                  <div className="box d-flex align-items-center justify-content-end">
                    <StyledWrapperButton>
                      <button
                        onClick={() =>
                          saveSwapTable(
                            selectOrderbyTableId?.orderId || 0,
                            selectTable?.tableId || 0,
                            swapTable.tableId
                          )
                        }
                      >
                        Lưu
                      </button>
                    </StyledWrapperButton>
                    &emsp;
                    <StyledWrapperButton>
                      <button onClick={closeSwapTable}>Đóng</button>
                    </StyledWrapperButton>
                  </div>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {splitTable && (
        <PopupOverlay onClick={closeSplitTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            <PopupCardGrid>
              <div
                className="w-100"
                style={{ overflow: "auto", height: "80vh" }}
              >
                <div className="grid-container-swapTable">
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Tách bàn</OrderLabel>
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Bàn hiện tại</OrderLabel>
                  </div>
                  <div className="box box-table">
                    {tablesEmpty.map((table) => (
                      <div
                        className="d-flex justify-content-center"
                        key={table.tableId}
                      >
                        <CardTableCashier
                          key={table.tableId}
                          tableId={table.tableId}
                          tableNumber={table.tableNumber}
                          status={
                            table.tableStatus === "EMPTY_TABLE"
                              ? "Trống"
                              : table.tableStatus === "OCCUPIED_TABLE"
                              ? "Có Khách"
                              : table.tableStatus === "LOCKED_TABLE"
                              ? "Thanh Toán"
                              : "Không xác định"
                          }
                          detailTable={() => setSelectTable(table)}
                          location={table.location}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <CardTableCashier
                      tableId={splitTable.tableId}
                      tableNumber={splitTable.tableNumber}
                      status={
                        splitTable.tableStatus === "EMPTY_TABLE"
                          ? "Trống"
                          : splitTable.tableStatus === "OCCUPIED_TABLE"
                          ? "Có Khách"
                          : splitTable.tableStatus === "LOCKED_TABLE"
                          ? "Thanh Toán"
                          : "Không xác định"
                      }
                      location={splitTable.location}
                    />
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Bàn đang chọn:</OrderLabel>{" "}
                    <span>{selectTable?.tableNumber}</span>
                  </div>
                  <div className="box d-flex align-items-center justify-content-end">
                    <StyledWrapperButton>
                      <button
                        onClick={() =>
                          saveSplitTable(
                            selectOrderbyTableId?.orderId || 0,
                            selectTable?.tableId || 0,
                            selectTable || defaultTable,
                            splitTable.tableId
                          )
                        }
                      >
                        Chọn món
                      </button>
                    </StyledWrapperButton>
                    &emsp;
                    <StyledWrapperButton>
                      <button onClick={closeSplitTable}>Đóng</button>
                    </StyledWrapperButton>
                  </div>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {combineTable && (
        <PopupOverlay onClick={closeCombineTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            <PopupCardGrid>
              <div
                className="w-100"
                style={{ overflow: "auto", height: "80vh" }}
              >
                <div className="grid-container-swapTable">
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Gộp bàn</OrderLabel>
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Bàn hiện tại</OrderLabel>
                  </div>
                  <div className="box box-table">
                    {tablesOccupied
                      .filter(
                        (table) =>
                          table.tableId !== combineTable.tableId &&
                          table.location !== "GDeli"
                      )
                      .map((table) => (
                        <div
                          className="d-flex justify-content-center"
                          key={table.tableId}
                        >
                          <CardTableCashier
                            key={table.tableId}
                            tableId={table.tableId}
                            tableNumber={table.tableNumber}
                            status={
                              table.tableStatus === "EMPTY_TABLE"
                                ? "Trống"
                                : table.tableStatus === "OCCUPIED_TABLE"
                                ? "Có Khách"
                                : table.tableStatus === "LOCKED_TABLE"
                                ? "Thanh Toán"
                                : "Không xác định"
                            }
                            detailTable={() => setSelectTable(table)}
                            location={table.location}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <CardTableCashier
                      tableId={combineTable.tableId}
                      tableNumber={combineTable.tableNumber}
                      status={
                        combineTable.tableStatus === "EMPTY_TABLE"
                          ? "Trống"
                          : combineTable.tableStatus === "OCCUPIED_TABLE"
                          ? "Có Khách"
                          : combineTable.tableStatus === "LOCKED_TABLE"
                          ? "Thanh Toán"
                          : "Không xác định"
                      }
                      location={combineTable.location}
                    />
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Bàn đang chọn:</OrderLabel>{" "}
                    <span>{selectTable?.tableNumber}</span>
                  </div>
                  <div className="box d-flex align-items-center justify-content-end">
                    <StyledWrapperButton>
                      <button
                        onClick={async () =>
                          saveCombineTable(
                            selectOrderbyTableId?.orderId || 0,
                            selectTable?.tableId || 0,
                            (await getOrderbyTableId(
                              selectTable?.tableId || 0
                            )) || defaultOrder,
                            combineTable.tableId
                          )
                        }
                      >
                        Lưu
                      </button>
                    </StyledWrapperButton>
                    &emsp;
                    <StyledWrapperButton>
                      <button onClick={closeCombineTable}>Đóng</button>
                    </StyledWrapperButton>
                  </div>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {deleteTable && (
        <PopupOverlay onClick={closeDeleteTable}>
          <PopupCardDeleteTable onClick={(e) => e.stopPropagation()}>
            <div className="header">
              <div className="image">
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="content">
                <span className="title">Hủy bàn?</span>
                <p className="message">
                  Bạn có chắc chắn hủy bàn? Mọi thứ liên quan tới order của bàn
                  sẽ bị ẩn và không thể khôi phục.
                </p>
              </div>
              <div className="actions">
                <button
                  onClick={() =>
                    saveDeleteTable(
                      selectOrderbyTableId?.orderId || 0,
                      deleteTable.tableId
                    )
                  }
                  className="desactivate"
                  type="button"
                >
                  Hủy bàn
                </button>
                <button
                  onClick={closeDeleteTable}
                  className="cancel"
                  type="button"
                >
                  Thoát
                </button>
              </div>
            </div>
          </PopupCardDeleteTable>
        </PopupOverlay>
      )}

      {detailTable && (
        <PopupOverlay onClick={closeDetailTable}>
          <PopupCard
            onClick={(e) => e.stopPropagation()}
            className="d-flex align-items-center justify-content-center"
          >
            <StyledWrapperButton>
              <button
                onClick={() => {
                  openPayTable(detailTable);
                }}
              >
                Thanh Toán
              </button>
            </StyledWrapperButton>
            &emsp;
            <StyledWrapperButton>
              <button onClick={() => {}}>Voucher</button>
            </StyledWrapperButton>
            &emsp;
            <StyledWrapperButton>
              <button
                onClick={async () => {
                  unlockTable(
                    detailTable,
                    (await getOrderbyTableId(detailTable.tableId || 0)) ||
                      defaultOrder
                  );
                }}
              >
                Mở bàn
              </button>
            </StyledWrapperButton>
          </PopupCard>
        </PopupOverlay>
      )}

      {emptyTable && (
        <PopupOverlay onClick={closeEmptyTable}>
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
                  &ensp;
                  <OrderLabel>Bàn mới</OrderLabel>
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
                    <button onClick={() => saveEmptyTable(emptyTable.tableId)}>
                      Lưu
                    </button>
                  </StyledWrapperButton>
                  &emsp;
                  <StyledWrapperButton>
                    <button
                      onClick={() => {
                        closeEmptyTable();
                      }}
                    >
                      Đóng
                    </button>
                  </StyledWrapperButton>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {popupSplitFood && (
        <PopupOverlay onClick={closePopupSplitFood}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            <PopupCardGrid>
              <div className="grid-container-edit">
                <div className="box d-flex align-items-center justify-content-center">
                  <OrderLabel>Bàn hiện tại:</OrderLabel>{" "}
                  <span>{splitTable?.tableId}</span>
                </div>
                <div className="box d-flex align-items-center justify-content-center">
                  <OrderLabel>Bàn đã chọn:</OrderLabel>{" "}
                  <span>{popupSplitFood?.tableId}</span>
                </div>
                <div className="box">
                  <div
                    className="border rounded p-1 h-100"
                    style={{ overflowY: "auto" }}
                  >
                    {isLoading ? (
                      <p>Đang tải chi tiết đơn hàng...</p>
                    ) : orderDetailsTemp.length > 0 ? (
                      orderDetailsTemp.map((detail) => (
                        <CardSpacing
                          key={detail.orderDetailId}
                          onClick={async () => {
                            if ((detail.quantity || 0) > 1) {
                              handleQuantityChange(
                                detail.orderDetailId,
                                (detail.quantity || 0) - 1
                              );
                              let check = false;
                              orderDetailsTemp2.map((detail2) => {
                                if (detail.productId === detail2.productId) {
                                  handleQuantityChange2(
                                    detail2.orderDetailId,
                                    (detail2.quantity || 0) + 1
                                  );
                                  check = true;
                                  return;
                                }
                              });
                              if (check === false) {
                                addDetail2(
                                  await findProductById(detail.productId || 0)
                                );
                              }
                            } else if ((detail.quantity || 0) === 1) {
                              handleDeleteDetail(detail.orderDetailId);
                              let check = false;
                              orderDetailsTemp2.map((detail2) => {
                                if (detail.productId === detail2.productId) {
                                  handleQuantityChange2(
                                    detail2.orderDetailId,
                                    (detail2.quantity || 0) + 1
                                  );
                                  check = true;
                                  return;
                                }
                              });
                              if (check === false) {
                                addDetail2(
                                  await findProductById(detail.productId || 0)
                                );
                              }
                            }
                          }}
                        >
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
                  <div
                    className="border rounded p-1 h-100"
                    style={{ overflowY: "auto" }}
                  >
                    {isLoading ? (
                      <p>Đang tải chi tiết đơn hàng...</p>
                    ) : orderDetailsTemp2.length > 0 ? (
                      orderDetailsTemp2.map((detail) => (
                        <CardSpacing
                          key={detail.orderDetailId}
                          onClick={async () => {
                            if ((detail.quantity || 0) > 1) {
                              handleQuantityChange2(
                                detail.orderDetailId,
                                (detail.quantity || 0) - 1
                              );
                              let check = false;
                              orderDetailsTemp.map((detail2) => {
                                if (detail.productId === detail2.productId) {
                                  handleQuantityChange(
                                    detail2.orderDetailId,
                                    (detail2.quantity || 0) + 1
                                  );
                                  check = true;
                                  return;
                                }
                              });
                              if (check === false) {
                                addDetail(
                                  await findProductById(detail.productId || 0)
                                );
                              }
                            } else if ((detail.quantity || 0) === 1) {
                              handleDeleteDetail2(detail.orderDetailId);
                              let check = false;
                              orderDetailsTemp.map((detail2) => {
                                if (detail.productId === detail2.productId) {
                                  handleQuantityChange(
                                    detail2.orderDetailId,
                                    (detail2.quantity || 0) + 1
                                  );
                                  check = true;
                                  return;
                                }
                              });
                              if (check === false) {
                                addDetail(
                                  await findProductById(detail.productId || 0)
                                );
                              }
                            }
                          }}
                        >
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
                <div className="box"></div>
                <div className="box d-flex align-items-center justify-content-end">
                  <StyledWrapperButton>
                    <button
                      onClick={async () =>
                        savePopupSplitFood(
                          (await getOrderbyTableId(splitTable?.tableId || 0)) ||
                            defaultOrder,
                          popupSplitFood.tableId,
                          orderDetailsTemp,
                          orderDetailsTemp2
                        )
                      }
                    >
                      Lưu
                    </button>
                  </StyledWrapperButton>
                  &emsp;
                  <StyledWrapperButton>
                    <button
                      onClick={() => {
                        closePopupSplitFood();
                      }}
                    >
                      Đóng
                    </button>
                  </StyledWrapperButton>
                </div>
              </div>
            </PopupCardGrid>
          </PopupCard>
        </PopupOverlay>
      )}

      {payTable && (
        <PopupOverlay onClick={closePayTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            <OrderLabel>Tiền khách trả:</OrderLabel>{" "}
            <Input
              onChange={changeMoneyBack}
              value={moneyBack}
              type="number"
              style={{ width: "100px" }}
            ></Input>
            <br />
            <OrderLabel>Tổng hóa đơn:</OrderLabel>{" "}
            <span>{selectOrderbyTableId?.totalAmount}</span>
            <br />
            <OrderLabel>Tiền trả lại:</OrderLabel> <span>{moneyBack}</span>
            <br />
            <StyledWrapperButton>
              <button
                onClick={async () => {
                  confirmPay(
                    payTable.tableId,
                    (await getOrderbyTableId(payTable.tableId || 0)) ||
                      defaultOrder
                  );
                }}
              >
                Xác nhận thanh toán
              </button>
            </StyledWrapperButton>
            <br />
            <StyledWrapperButton>
              <button onClick={closePayTable}>Đóng</button>
            </StyledWrapperButton>
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
  .grid-container-swapTable {
    display: grid;
    grid-template-columns: 65% 35%;
    grid-template-rows: 7.5vh 65vh 7.5vh;
  }
  /* Media query for smaller screens */
  @media (max-width: 1146px) {
    .grid-container-swapTable {
      grid-template-columns: 100%; /* Chỉ còn 1 cột */
      grid-template-rows: auto; /* Các hàng tự động chiếm không gian */
      overflow-y: auto;
    }
    .grid-container-swapTable > .box:nth-child(1) {
      grid-column: 1; /* Cột đầu tiên */
      grid-row: 3; /* Hàng đầu tiên */
    }

    .grid-container-swapTable > .box:nth-child(3) {
      grid-column: 1; /* Cột đầu tiên */
      grid-row: 4; /* Hàng thứ hai */
      height: 600px;
    }

    .grid-container-swapTable > .box:nth-child(5) {
      grid-column: 1; /* Cột đầu tiên */
      grid-row: 5; /* Hàng thứ ba */
      justify-content: center !important;
    }

    .grid-container-swapTable > .box:nth-child(2) {
      grid-column: 1; /* Cột thứ hai */
      grid-row: 1; /* Hàng đầu tiên */
    }

    .grid-container-swapTable > .box:nth-child(4) {
      grid-column: 1; /* Cột thứ hai */
      grid-row: 2; /* Hàng thứ hai */
    }

    .grid-container-swapTable > .box:nth-child(6) {
      grid-column: 1; /* Cột thứ hai */
      grid-row: 6; /* Hàng thứ ba */
      justify-content: center !important;
    }
  }
  .box-food {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    row-gap: 20px;
    overflow-y: auto;
  }
  .box-table {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    row-gap: 20px;
    overflow-y: auto;
  }
  // .box {
  //   border: solid 1px black;
  // }
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

const PopupCardDeleteTable = styled.div`
  .header {
    padding: 1.25rem 1rem 1rem 1rem;
    background-color: #ffffff;
    width: 30%;
    top: 50%; /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */

    transform: translate(-50%, -50%);
  }
  @media (max-width: 1146px) {
    .header {
      padding: 1.25rem 1rem 1rem 1rem;
      background-color: #ffffff;
      width: 70%;
      top: 50%; /* position the top  edge of the element at the middle of the parent */
      left: 50%; /* position the left edge of the element at the middle of the parent */

      transform: translate(-50%, -50%);
    }
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #fee2e2;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
  }

  .image svg {
    color: #dc2626;
    width: 1.5rem;
    height: 1.5rem;
  }

  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .message {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    margin: 0.75rem 1rem;
    background-color: #f9fafb;
  }

  .desactivate {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #dc2626;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 92.5%;
    border-radius: 0.375rem;
    border-width: 1px;
    border-color: transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .cancel {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #374151;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 92.5%;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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
  z-index: 3;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
`;

export default ManagementTableCashier;

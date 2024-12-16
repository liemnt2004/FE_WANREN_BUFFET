import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4_3 } from "uuid";
import {
  Product,
  fetchProductsInStock,
  findProductById,
} from "../../api/apiCashier/foodApi";
import {
  Order,
  OrderDetail,
  fetchOrderDetailsByOrderId,
  updateOrderDetails,
  updateOrderStatus,
  updateTableIdOrder,
} from "../../api/apiCashier/ordersOnl";
import { createPayment } from "../../api/apiCashier/payApt";
import {
  Table,
  fetchOrderbyTableId,
  fetchTables,
  updateTableStatus,
} from "../../api/apiCashier/tableApi";
import {
  Voucher2,
  createPromotionOrder,
  fetchPromotionById,
  fetchVoucherByCode,
  fetchVoucherByCode2,
  updateVoucherStatus,
} from "../../api/apiCashier/voucherApi";
import { CreateNewOrder } from "../../api/apiStaff/orderForStaffApi";
import { AuthContext } from "../customer/component/AuthContext";
import AlertSuccess from "./component/alertSuccess";
import CardFoodEditCashier from "./component/cardFoodEditCashier";
import CardFoodOrderCashier from "./component/cardFoodOrderCashier";
import CardFoodOrderCashierEdit from "./component/cardFoodOrderCashierEdit";
import CardTableCashier from "./component/cardTableCashier";

const ManagementTableCashier: React.FC = () => {
  // const defaultOrder: Order = {
  //   orderId: 0,
  //   orderStatus: "EMPTY", // hoặc giá trị mặc định phù hợp
  //   totalAmount: 0,
  //   notes: "",
  //   address: "",
  //   customerLink: undefined,
  //   tableLink: undefined,
  //   orderDetailsLink: undefined,
  // };

  const defaultOrder: Order = {
    createdDate: "", // Thời gian tạo đơn hàng (ISO 8601 string)
    orderId: 0, // ID của đơn hàng
    orderStatus: "", // Trạng thái đơn hàng (tùy thuộc vào enum OrderStatus)
    totalAmount: 0, // Tổng tiền
    notes: "", // Ghi chú đơn hàng
    address: "", // Địa chỉ giao hàng
    discountPointUsed: 0, // Điểm khuyến mãi đã sử dụng
    numberPeople: 0, // Số người
    phoneNumber: "", // Số điện thoại khách hàng
    fullName: "", // Tên đầy đủ của khách hàng
    tableId: 0, // ID của bàn
    tableLink: "",
    customerLink: "",
    orderDetailsLink: "",
    _links: {
      orderDetails: { href: "" },
    },
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

  const [lockTable, setLockTable] = useState<Table | null>(null);

  const [saleTable, setSaleTable] = useState<Table | null>(null);

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

  const [totalAmount, setTotalAmount] = useState<number | 0>(0);

  const [inputValue, setInputValue] = useState(""); // Khởi tạo state

  const [showCheckVoucher, setShowCheckVoucher] = useState(false);

  const [checkVoucher2, setCheckVoucher2] = useState<Voucher2 | null>(null);

  const { employeeUserId } = useContext(AuthContext);

  // useState ^

  // lấy dữ liệu từ api v

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    message: string,
    description: string,
    icon: React.ReactNode,
    pauseOnHover: boolean = true
  ) => {
    api.open({
      message,
      description,
      showProgress: true,
      pauseOnHover,
      placement: "topRight",
      duration: 3,
      icon,
    });
  };

  const loadOrderDetails = async () => {
    if (selectOrderbyTableId) {
      setIsLoading(true);
      try {
        const details = await fetchOrderDetailsByOrderId(
          selectOrderbyTableId.orderId
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
    const details = await fetchOrderDetailsByOrderId(order.orderId);
    return details;
  };

  const getOrderbyTableId = async (tableId: number) => {
    const data: Order[] = await fetchOrderbyTableId(tableId);
    const latestOrder = data.reduce<Order | null>((latest, current) => {
      const latestDate = new Date(latest?.createdDate || 0).getTime();
      const currentDate = new Date(current?.createdDate || 0).getTime();
      return currentDate > latestDate ? current : latest;
    }, null); // Giá trị khởi tạo là null

    // setSelectOrderbyTableId(latestOrder); // Lưu order mới nhất.
    return latestOrder;
  };

  const loadTables = async () => {
    const data = await fetchTables();
    setTables(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
  };

  useEffect(() => {
    loadTables();
  }, []);

  // useEffect(() => {
  const loadProducts = async (table: Table) => {
    const data = await fetchProductsInStock();

    // Kiểm tra điều kiện table.location và chỉnh sửa giá sản phẩm
    const updatedProducts = data.map((product: Product) => {
      if (table.location !== "GDeli") {
        // Nếu table.location khác "GDeli", giá món ăn = 0 trừ các món có type_food là buffet_tickets, soft_drinks, mixers
        if (
          ![
            "buffet_tickets",
            "soft_drinks",
            "mixers",
            "wine",
            "beer",
            "dessert",
            "cold_towel",
          ].includes(product.typeFood || "")
        ) {
          return {
            ...product,
            price: 0,
          };
        }
      }
      return product;
    });

    // Cập nhật state với danh sách sản phẩm đã chỉnh sửa
    setProducts(updatedProducts);
  };

  //   loadProducts();
  // }, []);

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

  const checkVoucher = async (code: string, orderId: number) => {
    if (code.length === 0) {
      openNotification(
        "Kiểm tra Voucher",
        "Vui lòng nhập Voucher!",
        <InfoCircleOutlined style={{ color: "#1890ff" }} />
      );
    } else {
      const data = await fetchVoucherByCode(code);
      if (data.promotionId === null) {
        openNotification(
          "Kiểm tra Voucher",
          "Không tìm thấy Voucher!",
          <InfoCircleOutlined style={{ color: "#1890ff" }} />
        );
      } else {
        if (!data.status) {
          const promotion = await fetchPromotionById(data.promotionId);
          if (!isDateTimeValid(promotion.promotionEndDate)) {
            const data2 = await fetchVoucherByCode2(inputValue);
            setCheckVoucher2(data2);
            setShowCheckVoucher(true);
          } else {
            openNotification(
              "Kiểm tra Voucher",
              "Voucher đã quá hạn!",
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            );
          }
        } else {
          openNotification(
            "Kiểm tra Voucher",
            "Voucher đã được sử dụng!",
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          );
        }
      }
    }
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
  const addDetail3 = (product: Product, productPrice: number) => {
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
            unitPrice: productPrice,
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

  const addDetail2 = (product: Product, productPrice: number) => {
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
            unitPrice: productPrice,
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

  const saveEditDetail = async (orderId: number, table: Table) => {
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
    closeFoodTable(table);
  };

  const saveSwapTable = async (
    orderId: number,
    selectTable: number,
    currentTable: Table
  ) => {
    if (selectTable !== 0) {
      await updateTableIdOrder(orderId, selectTable);
      loadTablesEmpty();
      loadTablesOccupied();
      setTables([]);
      loadTables();
      closeSwapTable2();

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
    currentTable: Table
  ) => {
    if (selectTable !== 0) {
      closeCombineTable(currentTable);
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

      await updateOrderDetails(selectOrder.orderId || 0, orderWithEmptyDetails);
      await updateOrderStatus(selectOrder.orderId || 0, "CANCELED");
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
    const newOrderId = await CreateNewOrder(Number(employeeUserId), tableId, 2);
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
    await updateOrderStatus(orderId, "CANCELED");
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
    selectOrderDetail: OrderDetail[],
    table: Table
  ) => {
    closeSplitTable(table);
    closePopupSplitFood();

    await updateOrderDetails(order.orderId || 0, currentOrderDetail);
    const newOrderId = (
      await CreateNewOrder(Number(employeeUserId), selectTableId, 2)
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
    closeDetailTable();

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

  const getTimeOrderByTableId = async (tableId: number) => {
    const time = await getOrderbyTableId(tableId);
    return time?.createdDate || "";
  };

  const [times, setTimes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchTimes = async () => {
      const newTimes: { [key: number]: string } = {};
      for (const table of tables) {
        if (
          table.tableStatus === "OCCUPIED_TABLE" ||
          table.tableStatus === "PAYING_TABLE" ||
          table.tableStatus === "LOCKED_TABLE"
        ) {
          const time = await getTimeOrderByTableId(table.tableId);
          newTimes[table.tableId] = time.toString();
        } else {
          newTimes[table.tableId] = ""; // Gán giá trị rỗng nếu không thỏa điều kiện
        }
      }
      setTimes(newTimes);
    };
    fetchTimes();
  }, [tables]);

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

  // Step 2: Filter tables based on selected radio button
  const filteredTables = tables.filter((table) => {
    if (filter === "all") return table.location !== "GDeli"; // Show all tables
    if (filter === "paying") return table.tableStatus === "PAYING_TABLE"; // Show all tables
    if (filter === "empty")
      return table.tableStatus === "EMPTY_TABLE" && table.location !== "GDeli"; // Only empty tables
    if (filter === "gdeli") return table.location === "GDeli"; // Only GDeli tables
    return true; // Default case (shouldn't happen)
  });

  // Step 3: Handle radio button change
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value); // Update filter based on the selected radio button
  };

  const unlockTableWhenAction = async (table: Table) => {
    await updateTableStatus(table.tableId, "OCCUPIED_TABLE");
    console.log("đã unlock");
  };

  const lockTableWhenAction = async (table: Table) => {
    await updateTableStatus(table.tableId, "LOCKED_TABLE");
    console.log("đã lock");
  };

  const takeTotalAmount = () => {
    let total = 0;
    orderDetailsTemp.map((detail) => {
      total += (detail.unitPrice || 0) * (detail.quantity || 0);
    });
    setTotalAmount(total);
  };
  useEffect(() => {
    takeTotalAmount();
  }, [orderDetailsTemp]);

  // thanh toán của cashier
  const [customerPayment, setCustomerPayment] = useState(0);
  const [change, setChange] = useState(0);

  // Hàm xử lý khi khách nhập số tiền
  const handleCustomerPaymentChange = (value: string, totalAmount: number) => {
    const payment = Number(value); // Chuyển đổi giá trị nhập thành số
    setCustomerPayment(payment);

    // Tính số tiền trả lại
    const calculatedChange = payment - totalAmount;
    setChange(calculatedChange > 0 ? calculatedChange : 0);
  };

  const handleChange = (event: any) => {
    setInputValue(event.target.value); // Cập nhật state khi nhập liệu
  };

  const isDateTimeValid = (endDate: Date) => {
    const now = new Date();
    const reservationDateTime = new Date(endDate);

    // Kiểm tra xem ngày giờ đến có trước hiện tại không
    return reservationDateTime < now;
  };

  const checkVoucherCode = async (code: string, orderId: number) => {
    if (code.length === 0) {
      openNotification(
        "Áp dụng Voucher",
        "Vui lòng nhập Voucher!",
        <InfoCircleOutlined style={{ color: "#1890ff" }} />
      );
    } else {
      const data = await fetchVoucherByCode(code);
      if (data.promotionId === null) {
        openNotification(
          "Áp dụng Voucher",
          "Không tìm thấy Voucher!",
          <InfoCircleOutlined style={{ color: "#1890ff" }} />
        );
      } else {
        if (!data.status) {
          const promotion = await fetchPromotionById(data.promotionId);
          console.log(promotion.promotionEndDate);
          if (!isDateTimeValid(promotion.promotionEndDate)) {
            await updateVoucherStatus(data.voucherId, true);
            createPromotionOrder(orderId, data.promotionId);
            closeDetailTable();
            closeSaleTable();
            openNotification(
              "Áp dụng Voucher",
              "Áp dụng thành công!",
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            );
          } else {
            openNotification(
              "Áp dụng Voucher",
              "Voucher đã quá hạn!",
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            );
          }
        } else {
          openNotification(
            "Áp dụng Voucher",
            "Voucher đã được sử dụng!",
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          );
        }
      }
    }
  };

  // các hành động function ^

  // các popup v

  const openFoodTable = (table: Table, order: Order) => {
    loadProducts(table);
    lockTableWhenAction(table);
    setFoodTable(table); // Mở popup sau khi có đủ dữ liệu
    setSelectOrderbyTableId(order);
  };

  const closeFoodTable = (table: Table) => {
    unlockTableWhenAction(table);
    setFoodTable(null);
    setSelectOrderbyTableId(null);
    setOrderDetailsTemp([]);
    setSearchTerm("");
    setFilteredProducts(products);
  };

  const openSwapTable = (table: Table, order: Order) => {
    lockTableWhenAction(table);
    setSwapTable(table);
    setSelectOrderbyTableId(order);
    getOrderbyTableId(table.tableId);
  };
  const closeSwapTable = (table: Table) => {
    unlockTableWhenAction(table);
    setSwapTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };
  const closeSwapTable2 = () => {
    setSwapTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };

  const openSplitTable = (table: Table, order: Order) => {
    lockTableWhenAction(table);
    setSplitTable(table);
    setSelectOrderbyTableId(order);
    getOrderbyTableId(table.tableId);
  };
  const closeSplitTable = (table: Table) => {
    unlockTableWhenAction(table);
    setSplitTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
    setOrderDetailsTemp2([]);
  };

  const openCombineTable = (table: Table, order: Order) => {
    lockTableWhenAction(table);
    setCombineTable(table);
    setSelectOrderbyTableId(order);
    getOrderbyTableId(table.tableId);
  };
  const closeCombineTable = (table: Table) => {
    unlockTableWhenAction(table);
    setCombineTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };

  const openDeleteTable = (table: Table, order: Order) => {
    setDeleteTable(table);
    setSelectOrderbyTableId(order);
    getOrderbyTableId(table.tableId);
  };
  const closeDeleteTable = () => {
    setDeleteTable(null);
    setSelectOrderbyTableId(null);
    setSelectTable(null);
  };

  const openDetailTable = (table: Table, order: Order) => {
    setDetailTable(table);
    setSelectOrderbyTableId(order);
    getOrderbyTableId(table.tableId);
  };
  const closeDetailTable = () => {
    setDetailTable(null);
    setSelectOrderbyTableId(null);
  };

  const openEmptyTable = (table: Table) => {
    loadProducts(table);
    setEmptyTable(table);
    // getOrderbyTableId(table.tableId);
  };
  const closeEmptyTable = () => {
    setEmptyTable(null);
    setSelectOrderbyTableId(null);
    setOrderDetailsTemp([]);
    setSearchTerm("");
    setFilteredProducts(products);
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
    // setSelectOrderbyTableId(null);
  };

  const openLockTable = (table: Table) => {
    setLockTable(table);
    // getOrderbyTableId(table.tableId);
  };
  const closeLockTable = () => {
    setLockTable(null);
    setSelectOrderbyTableId(null);
  };

  const openSaleTable = (table: Table) => {
    setSaleTable(table);
    // getOrderbyTableId(table.tableId);
  };
  const closeSaleTable = () => {
    setSaleTable(null);
    setInputValue("");
    setShowCheckVoucher(false);
    // setSelectOrderbyTableId(null);
  };

  const hehe = () => {};

  // các popup ^

  useEffect(() => {
    setOrderDetailsTemp(orderDetails);
  }, [orderDetails]);

  return (
    <>
      {contextHolder}
      <div>
        <StyledWrapperTab style={{ marginBottom: "25px", marginTop: "-25px" }}>
          <div className="radio-inputs">
            <label className="radio">
              <input
                type="radio"
                name="radio"
                value="all"
                checked={filter === "all"}
                onChange={handleRadioChange}
              />
              <span className="name">Tất cả</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="radio"
                value="paying"
                checked={filter === "paying"}
                onChange={handleRadioChange}
              />
              <span className="name">Thanh toán</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="radio"
                value="empty"
                checked={filter === "empty"}
                onChange={handleRadioChange}
              />
              <span className="name">Bàn trống</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="radio"
                value="gdeli"
                checked={filter === "gdeli"}
                onChange={handleRadioChange}
              />
              <span className="name">GDeli</span>
            </label>
          </div>
        </StyledWrapperTab>
        <StyledWrapper>
          {filteredTables.map((table) => (
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
                    : table.tableStatus === "PAYING_TABLE"
                    ? "Thanh Toán"
                    : table.tableStatus === "LOCKED_TABLE"
                    ? "Khóa"
                    : "Không xác định"
                }
                location={table.location}
                timeOrder={times[table.tableId] || ""}
                foodTable={async () => {
                  {
                    table.tableStatus === "OCCUPIED_TABLE"
                      ? openFoodTable(
                          table,
                          (await getOrderbyTableId(table.tableId)) ||
                            defaultOrder
                        )
                      : void null;
                  }
                }}
                swapTable={async () => {
                  {
                    table.tableStatus === "OCCUPIED_TABLE" &&
                    table.location !== "GDeli"
                      ? openSwapTable(
                          table,
                          (await getOrderbyTableId(table.tableId)) ||
                            defaultOrder
                        )
                      : void null;
                  }
                }}
                splitTable={async () => {
                  {
                    table.tableStatus === "OCCUPIED_TABLE" &&
                    table.location !== "GDeli"
                      ? openSplitTable(
                          table,
                          (await getOrderbyTableId(table.tableId)) ||
                            defaultOrder
                        )
                      : void null;
                  }
                }}
                combineTable={async () => {
                  {
                    table.tableStatus === "OCCUPIED_TABLE" &&
                    table.location !== "GDeli"
                      ? openCombineTable(
                          table,
                          (await getOrderbyTableId(table.tableId)) ||
                            defaultOrder
                        )
                      : void null;
                  }
                }}
                deleteTable={async () => {
                  {
                    table.tableStatus === "OCCUPIED_TABLE"
                      ? openDeleteTable(
                          table,
                          (await getOrderbyTableId(table.tableId)) ||
                            defaultOrder
                        )
                      : void null;
                  }
                }}
                detailTable={async () => {
                  {
                    table.tableStatus === "EMPTY_TABLE"
                      ? openEmptyTable(table)
                      : table.tableStatus === "PAYING_TABLE"
                      ? openDetailTable(
                          table,
                          (await getOrderbyTableId(table.tableId)) ||
                            defaultOrder
                        )
                      : table.tableStatus === "LOCKED_TABLE"
                      ? openLockTable(table)
                      : hehe();
                  }
                }}
              />
              {/* {table.tableStatus === "OCCUPIED_TABLE" ||
            table.tableStatus === "LOCKED_TABLE"
              ? times[table.tableId] || ""
              : ""} */}
            </div>
          ))}
        </StyledWrapper>

        {foodTable && (
          <PopupOverlay onClick={() => closeFoodTable(foodTable)}>
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
                    &ensp;
                    <OrderLabel>Món ăn</OrderLabel>
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Mã Đơn Hàng:</OrderLabel>{" "}
                    <span>{selectOrderbyTableId?.orderId}</span>
                  </div>
                  <div className="box-food" key={selectOrderbyTableId?.orderId}>
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
                          saveEditDetail(
                            selectOrderbyTableId?.orderId || 0,
                            foodTable
                          )
                        }
                      >
                        Lưu
                      </button>
                    </StyledWrapperButton>
                    &emsp;
                    <StyledWrapperButton>
                      <button onClick={() => closeFoodTable(foodTable)}>
                        Đóng
                      </button>
                    </StyledWrapperButton>
                  </div>
                </div>
              </PopupCardGrid>
            </PopupCard>
          </PopupOverlay>
        )}

        {swapTable && (
          <PopupOverlay onClick={() => closeSwapTable(swapTable)}>
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
                      {tablesEmpty
                        .filter(
                          (table) =>
                            table.tableId !== swapTable.tableId &&
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
                                  : table.tableStatus === "PAYING_TABLE"
                                  ? "Thanh Toán"
                                  : table.tableStatus === "LOCKED_TABLE"
                                  ? "Khóa"
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
                            : swapTable.tableStatus === "PAYING_TABLE"
                            ? "Thanh Toán"
                            : swapTable.tableStatus === "LOCKED_TABLE"
                            ? "Khóa"
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
                              swapTable
                            )
                          }
                        >
                          Lưu
                        </button>
                      </StyledWrapperButton>
                      &emsp;
                      <StyledWrapperButton>
                        <button onClick={() => closeSwapTable(swapTable)}>
                          Đóng
                        </button>
                      </StyledWrapperButton>
                    </div>
                  </div>
                </div>
              </PopupCardGrid>
            </PopupCard>
          </PopupOverlay>
        )}

        {splitTable && (
          <PopupOverlay onClick={() => closeSplitTable(splitTable)}>
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
                      {tablesEmpty
                        .filter(
                          (table) =>
                            table.tableId !== splitTable.tableId &&
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
                                  : table.tableStatus === "PAYING_TABLE"
                                  ? "Thanh Toán"
                                  : table.tableStatus === "LOCKED_TABLE"
                                  ? "Khóa"
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
                            : splitTable.tableStatus === "PAYING_TABLE"
                            ? "Thanh Toán"
                            : splitTable.tableStatus === "LOCKED_TABLE"
                            ? "Khóa"
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
                        <button onClick={() => closeSplitTable(splitTable)}>
                          Đóng
                        </button>
                      </StyledWrapperButton>
                    </div>
                  </div>
                </div>
              </PopupCardGrid>
            </PopupCard>
          </PopupOverlay>
        )}

        {combineTable && (
          <PopupOverlay onClick={() => closeCombineTable(combineTable)}>
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
                                  : table.tableStatus === "PAYING_TABLE"
                                  ? "Thanh Toán"
                                  : table.tableStatus === "LOCKED_TABLE"
                                  ? "Khóa"
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
                            : combineTable.tableStatus === "PAYING_TABLE"
                            ? "Thanh Toán"
                            : combineTable.tableStatus === "LOCKED_TABLE"
                            ? "Khóa"
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
                              combineTable
                            )
                          }
                        >
                          Lưu
                        </button>
                      </StyledWrapperButton>
                      &emsp;
                      <StyledWrapperButton>
                        <button onClick={() => closeCombineTable(combineTable)}>
                          Đóng
                        </button>
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
                    Bạn có chắc chắn hủy bàn? Mọi thứ liên quan tới order của
                    bàn sẽ bị ẩn và không thể khôi phục.
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
            {/* <PopupCard
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
          </PopupCard> */}
            <StyleDetail onClick={(e) => e.stopPropagation()}>
              <div className="d-flex">
                <div className="cash" onClick={() => openPayTable(detailTable)}>
                  <div className="text-center">
                    <i className="bi bi-cash fs-3 borderIn"></i>
                    <p>Thanh&#160;toán</p>
                  </div>
                </div>
                <div
                  className="sale"
                  onClick={() => openSaleTable(detailTable)}
                >
                  <div className="text-center">
                    <i className="bi bi-tags fs-3 borderIn"></i>
                    <p>Mã&#160;giảm&#160;giá</p>
                  </div>
                </div>
                <div
                  className="unlock"
                  onClick={async () => {
                    unlockTable(
                      detailTable,
                      (await getOrderbyTableId(detailTable.tableId || 0)) ||
                        defaultOrder
                    );
                  }}
                >
                  <div className="text-center">
                    <i className="bi bi-key fs-3 borderIn"></i>
                    <p>Mở&#160;khóa</p>
                  </div>
                </div>
              </div>
            </StyleDetail>
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
                        value={searchTerm}
                        onChange={handleSearchChange}
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
                        onClick={() => saveEmptyTable(emptyTable.tableId)}
                      >
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
                                    await findProductById(
                                      detail.productId || 0
                                    ),
                                    detail.unitPrice || 0
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
                                    await findProductById(
                                      detail.productId || 0
                                    ),
                                    detail.unitPrice || 0
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
                                  addDetail3(
                                    await findProductById(
                                      detail.productId || 0
                                    ),
                                    detail.unitPrice || 0
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
                                  addDetail3(
                                    await findProductById(
                                      detail.productId || 0
                                    ),
                                    detail.unitPrice || 0
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
                        onClick={async () => {
                          if (
                            orderDetailsTemp.length === 0 ||
                            orderDetailsTemp2.length === 0
                          ) {
                            openNotification(
                              "Tách bàn",
                              "Chưa có món trong bàn!",
                              <InfoCircleOutlined
                                style={{ color: "#1890ff" }}
                              />
                            );
                            return;
                          }

                          const order =
                            (await getOrderbyTableId(
                              splitTable?.tableId || 0
                            )) || defaultOrder;

                          savePopupSplitFood(
                            order,
                            popupSplitFood.tableId,
                            orderDetailsTemp,
                            orderDetailsTemp2,
                            splitTable || defaultTable
                          );
                        }}
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
              <PopupCardGrid>
                <div className="grid-container-pay">
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Các món đã gọi</OrderLabel>
                  </div>
                  <div className="box d-flex align-items-center justify-content-center">
                    <OrderLabel>Thanh toán</OrderLabel>
                  </div>
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
                  <StylePay>
                    <div className="box payment-box">
                      <div className="payment-info">
                        <div className="form-group">
                          <label htmlFor="customerPayment">
                            Số tiền khách đưa:
                          </label>
                          <input
                            id="customerPayment"
                            type="number"
                            className="form-control"
                            placeholder="Nhập số tiền khách đưa"
                            onChange={(e) =>
                              handleCustomerPaymentChange(
                                e.target.value,
                                selectOrderbyTableId?.totalAmount || 0
                              )
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="totalBill">Tổng hóa đơn:</label>
                          <span id="totalBill" className="amount">
                            {selectOrderbyTableId?.totalAmount} đ
                          </span>
                        </div>
                        <div className="form-group">
                          <label htmlFor="change">Số tiền cần trả lại:</label>
                          <span id="change" className="amount">
                            {change} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </StylePay>

                  <div className="box"></div>
                  <div className="box d-flex align-items-center justify-content-end">
                    <StyledWrapperButton>
                      <button
                        onClick={async () => {
                          if (
                            customerPayment <
                            (selectOrderbyTableId?.totalAmount || 0)
                          ) {
                            alert("Số tiền khách đưa không đủ để thanh toán.");
                            return;
                          }
                          await confirmPay(
                            payTable.tableId,
                            (await getOrderbyTableId(payTable.tableId || 0)) ||
                              defaultOrder
                          );
                        }}
                      >
                        Xác nhận thanh toán
                      </button>
                    </StyledWrapperButton>
                    &emsp;
                    <StyledWrapperButton>
                      <button onClick={closePayTable}>Đóng</button>
                    </StyledWrapperButton>
                  </div>
                </div>
              </PopupCardGrid>
              {/* <OrderLabel>Tiền khách trả:</OrderLabel>{" "}
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
            </StyledWrapperButton> */}
            </PopupCard>
          </PopupOverlay>
        )}

        {lockTable && (
          <PopupOverlay onClick={closeLockTable}>
            <StyleDetail onClick={(e) => e.stopPropagation()}>
              <div
                className="unlock"
                onClick={async () => {
                  await unlockTableWhenAction(lockTable);
                  closeLockTable();
                  setTables([]);
                  loadTables();
                }}
              >
                <div className="text-center">
                  <i className="bi bi-key fs-3 borderIn"></i>
                  <p>Mở khóa</p>
                </div>
              </div>
            </StyleDetail>
          </PopupOverlay>
        )}

        {saleTable && (
          <PopupOverlay onClick={closeSaleTable}>
            <PopupCard onClick={(e) => e.stopPropagation()}>
              <PopupCardGrid>
                <div
                  className="w-100"
                  style={{ overflowY: "auto", height: "80vh" }}
                >
                  <div className="grid-container-swapTable">
                    <div className="box d-flex align-items-center justify-content-center">
                      <OrderLabel>Bàn hiện tại: </OrderLabel>
                      {saleTable.tableId}
                    </div>
                    <div className="box d-flex align-items-center justify-content-center">
                      <OrderLabel>Hóa đơn: </OrderLabel>
                      {selectOrderbyTableId?.orderId}
                    </div>
                    <div className="box d-flex align-items-center justify-content-center">
                      <FormReservation>
                        <form className="form">
                          <div className="input-box">
                            <label>Nhập mã Voucher:</label>
                            <input
                              value={inputValue} // Liên kết giá trị input với state
                              onChange={handleChange} // Gọi hàm xử lý khi giá trị thay đổi
                              placeholder="Nhập mã voucher"
                              type="text"
                            />
                          </div>
                          <button
                            className="px-2"
                            type="button"
                            onClick={() =>
                              checkVoucher(
                                inputValue,
                                selectOrderbyTableId?.orderId || 0
                              )
                            }
                          >
                            Kiểm tra
                          </button>
                          {showCheckVoucher && (
                            <div className="my-2">
                              <p>
                                Tên Voucher:{" "}
                                <span>{checkVoucher2?.promotion_name}</span>
                              </p>
                              <p>
                                Mô tả: <span>{checkVoucher2?.description}</span>
                              </p>
                              <p>
                                Giá trị:{" "}
                                <span>{checkVoucher2?.promotion_value}đ</span>
                              </p>
                              <p>
                                Trạng thái:{" "}
                                <span className="text-success">
                                  {checkVoucher2?.status
                                    ? "Đã được sử dụng"
                                    : "Có thể sử dụng"}
                                </span>
                              </p>
                            </div>
                          )}
                        </form>
                      </FormReservation>
                    </div>
                    <div className="box" style={{ overflowY: "auto" }}>
                      <div
                        className="border rounded p-2 h-100"
                        style={{ overflowY: "auto", overflowX: "hidden" }}
                      >
                        {isLoading ? (
                          <p>Đang tải chi tiết đơn hàng...</p>
                        ) : orderDetailsTemp.length > 0 ? (
                          orderDetailsTemp.map((detail) => (
                            <div className="row align-items-center mb-3">
                              <div className="col-4 text-start">
                                <strong>{detail.productName}</strong>
                              </div>
                              <div className="col-4 text-end">
                                {detail.unitPrice} x {detail.quantity}
                              </div>
                              <div className="col-4 text-end">
                                <strong>
                                  {(detail.unitPrice || 0) *
                                    (detail.quantity || 0)}{" "}
                                  đ
                                </strong>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Không có chi tiết đơn hàng.</p>
                        )}
                        <hr />
                        Tổng tiền: <strong>{totalAmount}</strong>
                      </div>
                    </div>
                    <div className="box"></div>
                    <div className="box d-flex align-items-center justify-content-end">
                      <StyledWrapperButton>
                        <button
                          onClick={() => {
                            checkVoucherCode(
                              inputValue,
                              selectOrderbyTableId?.orderId || 0
                            );
                          }}
                        >
                          Xác nhận
                        </button>
                      </StyledWrapperButton>
                      &emsp;
                      <StyledWrapperButton>
                        <button onClick={closeSaleTable}>Đóng</button>
                      </StyledWrapperButton>
                    </div>
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
    </>
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
  .grid-container-pay {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 7.5vh 65vh 7.5vh;
  }

  @media (max-width: 1146px) {
    /* Điều chỉnh độ rộng màn hình theo yêu cầu */
    .grid-container-pay {
      grid-template-columns: 100%; /* Chuyển sang bố cục một cột */
      grid-template-rows: auto; /* Hàng có chiều cao tự động */
    }

    .grid-container-pay .box:nth-child(3),
    .grid-container-pay .box:nth-child(5) {
      display: none; /* Ẩn các box 1, 3, và 5 */
    }
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
      height: 400px;
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
      height: 400px;
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
    width: 300px;
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
`;

const StyleDetail = styled.div`
  .cash {
    width: 175px;
    height: 175px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #85bb65;
    border: 1px solid black;
    border-radius: 15px;
    box-shadow: 20px 20px 15px 0 #ababab4d;
    margin: 0 10px;
  }
  .sale {
    width: 175px;
    height: 175px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #66ccff;
    border: 1px solid black;
    border-radius: 15px;
    box-shadow: 20px 20px 15px 0 #ababab4d;
    margin: 0 10px;
  }
  .unlock {
    width: 175px;
    height: 175px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffff99;
    border: 1px solid black;
    border-radius: 15px;
    box-shadow: 20px 20px 15px 0 #ababab4d;
    margin: 0 10px;
  }
  .borderIn {
    border: 2px solid black;
    border-radius: 13.5px;
    padding: 50px 65px 75px;
  }
`;

const StylePay = styled.div`
  .payment-box {
    padding: 15px;
    border: none;
  }

  .payment-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input[type="number"] {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .amount {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
`;

const FormReservation = styled.div`
  .container {
    position: relative;
    max-width: 550px;
    width: 100%;
    background: #fcedda;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .container header {
    position: relative;
    font-size: 1.2rem;
    color: #000;
    font-weight: 600;
    text-align: center;
    width: auto;
  }

  .container .form {
    margin-top: 15px;
  }

  .form .input-box {
    width: 100%;
    margin-top: 10px;
  }

  .input-box label {
    color: #000;
  }

  .form :where(.input-box input, .select-box) {
    position: relative;
    height: 35px;
    width: 100%;
    outline: none;
    font-size: 1rem;
    color: #808080;
    margin-top: 5px;
    border: 1px solid #ee4e34;
    border-radius: 6px;
    padding: 0 15px;
    background: #fcedda;
  }

  .input-box input:focus {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }

  .form .column {
    display: flex;
    column-gap: 15px;
    width: 100%;
  }

  .form .gender-box {
    margin-top: 10px;
  }

  .form :where(.gender-option, .gender) {
    display: flex;
    align-items: center;
    column-gap: 50px;
    flex-wrap: wrap;
  }

  .form .gender {
    column-gap: 5px;
  }

  .gender input {
    accent-color: #ee4e34;
  }

  .form :where(.gender input, .gender label) {
    cursor: pointer;
  }

  .gender label {
    color: #000;
  }

  .address :where(input, .select-box) {
    margin-top: 10px;
  }

  .select-box select {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    color: #808080;
    font-size: 1rem;
    background: #fcedda;
  }

  .form button {
    height: 40px;
    width: auto;
    color: #000;
    font-size: 1rem;
    font-weight: 400;
    margin-top: 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #ee4e34;
    text-align: center;
  }

  .form button:hover {
    background: #ee3e34;
  }

  form p {
    color: #808080;
  }

  .clamped-text {
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Giới hạn số dòng */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis; /* Thêm dấu "..." */
  }

  .buttonGroup {
    width: 100%;
  }
`;

export default ManagementTableCashier;

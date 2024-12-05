import axios from "axios";
import { request } from "./Request";
import OrderDetailsWithNameProduct from "../../models/StaffModels/OrderDetailsWithNameProduct";
import OrderDetailModel from "../../models/StaffModels/OrderDetaitModel";

const BASE_URL = "https://wanrenbuffet.online/api";

const getHeaders = () => {
  const employeeToken = localStorage.getItem("employeeToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${employeeToken}`,
  };
};

export async function getAllOrderDetailsByOrderId(
  orderId: number
): Promise<OrderDetailModel[]> {
  const rs: OrderDetailModel[] = [];
  try {
    const data = await request(
      `https://wanrenbuffet.online/api-data/Orders/${orderId}/orderDetails`
    );
    if (data && data._embedded && data._embedded.orderDetails) {
      for (const orderDetail of data._embedded.orderDetails) {
        const orderDetailModel = new OrderDetailModel(
          orderDetail.orderDetailId,
          orderDetail.quantity,
          orderDetail.unitPrice,
          orderDetail.itemNotes
        );
        rs.push(orderDetailModel);
      }
      return rs;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error, "Cannot log all orderDetail by orderId");
    return [];
  }
}

export async function getTableNumberByOrderId(
  orderId: number
): Promise<number> {
  try {
    const response = await request(
      `https://wanrenbuffet.online/api-data/Orders/${orderId}/tablee`
    );
    const tableNumber = response.tableNumber;
    return tableNumber;
  } catch (error) {
    return 0;
  }
}

export async function getOrderDetailWithNameProduct(
  orderId: number
): Promise<OrderDetailsWithNameProduct[]> {
  const rs: OrderDetailsWithNameProduct[] = [];
  try {
    const data = await request(
      `${BASE_URL}/orders_detail_staff/get/order_details/with_name/${orderId}`
    );
    if (data && data.orderDetails) {
      for (const orderDetail of data.orderDetails) {
        const orderDetailModel = new OrderDetailsWithNameProduct(
          orderDetail.productName,
          orderDetail.quantity,
          orderDetail.price
        );
        rs.push(orderDetailModel);
      }
      return rs;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

export async function getOrderAmount(orderId: number): Promise<number> {
  try {
    const amountOfOrder = await request(
      `${BASE_URL}/order_staff/get_amount/${orderId}`
    );
    return amountOfOrder.amount;
  } catch (error) {
    return 0;
  }
}

export const updateOStatus = async (orderId: number, status: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/order_staff/update-status/${orderId}?status=${status}`,
      {
        method: "PUT",
        headers: getHeaders()
      }
    );
  } catch (error) {}
};

export const createPayment = async (lastAmount: number, orderId:number, employeeUserId: number, paymentMethod: string, status: boolean) => {
  try {
      const newOrderResponse = await fetch(`${BASE_URL}/payment/create_payment/normal`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
              amountPaid: lastAmount,
              paymentMethod: paymentMethod,
              paymentStatus: status,
              orderId: orderId,
              userId: Number(employeeUserId)
          })
      });
  } catch (error) {
    console.log(error)
  }
}

export async function updateLoyaltyPoint(phoneNumber: string, amount: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/customer/loyal_point/${phoneNumber}/${amount}`,
      {
        method: "PUT",
        headers: getHeaders(),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return "Không thể thực hiện tích điểm";
  }
}

export async function updateTotalAmount(
  orderId: number,
  total_amount: number
): Promise<number> {
  try {
    const response = await axios.put(
      `${BASE_URL}/order_staff/update/total_amount/${orderId}/${total_amount}`,
      {
        method: "PUT",
        headers: getHeaders(),
      }
    );
    const data = response.data;
    return data.amount_last;
  } catch (error) {
    return 0;
  }
}

// ORDER ON TABLE

export const fetchOrderDetailsAPI = async (orderId: number) => {
  const response = await fetch(`${BASE_URL}/orders_detail_staff/${orderId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

export const fetchOrderStatusAPI = async (orderId: number) => {
  const response = await fetch(`${BASE_URL}/order_staff/status/${orderId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

export const getPromotionByOrderId = async (orderId: number) => {
  const response = await fetch(`${BASE_URL}/promotions/info/${orderId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

export const getLoyaltyPoints = async (phoneNumber: string) => {
  const response = await fetch(
    `${BASE_URL}/customer/loyalty-points?phoneNumber=${phoneNumber}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  return response.json();
};

export const updateLoyaltyPoints = async (
  phoneNumber: number,
  pointsToDeduct: number
) => {
  const response = await fetch(`${BASE_URL}/customer/update-loyalty-points`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      pointsToDeduct: pointsToDeduct,
    }),
  });
};

export const transferTable = async (
  orderId: number,
  selectedTableId: number
) => {
  const response = await fetch(`${BASE_URL}/order_staff/${orderId}/transfer`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      orderId: orderId,
      newTableId: selectedTableId,
    }),
  });
};

export const fetchReservations = async () => {
  const response = await fetch(`${BASE_URL}/reservation/today`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

export const fetchTables = async () => {
  const response = await fetch(
    `https://wanrenbuffet.online/api-data/Table?page=0&size=50`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  return response.json();
};

export const fetchProductDetailsAPI = async (productId: number) => {
  const response = await fetch(`${BASE_URL}/product/${productId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

export const checkCustomer = async (orderId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/order_staff/check-customer?orderId=${orderId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const text = await response.text();
    return text;
  } catch (error) {}
};

export const updateReservationStatus = async (
  reservationId: number,
  status: string
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/reservation/${reservationId}/status?status=${status}`,
      {
        method: "PUT",
        headers: getHeaders(),
      }
    );

    if (response.ok) {
      const message = await response.text(); // API trả về chuỗi thông báo
      return message;
    } else {
      const errorMessage = await response.text();
    }
  } catch (error) {}
};

export const updateDiscountPoints = async (
  orderId: number,
  discountPoints: number
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/order_staff/update-discount-points-order?orderId=${orderId}&discountPoints=${discountPoints}`,
      {
        method: "PUT",
        headers: getHeaders(),
      }
    );

    if (response.ok) {
      const message = await response.text(); // API trả về chuỗi thông báo
      return message;
    } else {
      const errorMessage = await response.text();
    }
  } catch (error) {}
};

export const getDiscountPoints = async (orderId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/order_staff/get-discount-points?orderId=${orderId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (response.ok) {
      const discountPoints = await response.json();
      return discountPoints;
    } else {
    }
  } catch (error) {}
};

export const fetchTableStatus = async (tableId: number) => {
  const response = await fetch(`${BASE_URL}/table/status/${tableId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Error fetching table status`);
  const responseText = await response.text();
  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    return responseText;
  }
};

export const fetchOrderIdByTableId = async (tableId: number) => {
  const response = await fetch(
    `${BASE_URL}/order_staff/findOrderIdByTableId/${tableId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  const text = await response.text();
  return text ? Number(text) : null;
};

export const CreateNewOrder = async (
  userId: number,
  tableId: number,
  numberPeople: number
) => {
  const response = await fetch(`${BASE_URL}/order_staff/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      userId,
      address: "145 Phan Xích Long",
      notes: "Order tại bàn",
      orderStatus: "IN_TRANSIT",
      totalAmount: 0,
      tableId,
      numberPeople: numberPeople,
    }),
  });
  return response.json();
};

export const updateOrderDetails = async (orderId: number, details: any) => {
  try {
    if (!orderId || orderId <= 0) {
      throw new Error("Invalid orderId passed to updateOrderDetails");
    }

    const response = await fetch(
      `${BASE_URL}/orders_detail_staff/add_or_update/${orderId}`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(details),
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (error) {}
};

export const updateOrderAmount = async (orderId: number, amount: number) => {
  const response = await fetch(`${BASE_URL}/order_staff/${orderId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ totalAmount: amount }),
  });
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await fetch(
    `${BASE_URL}/api/order_staff/updateStatus/${orderId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ orderStatus: status }),
    }
  );
};

export const updateTableStatus = async (tableId: number, status: string) => {
  const response = await fetch(`${BASE_URL}/table/${tableId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ tableStatus: status }),
  });
};

export const updateQuantityOrderDetails = async (details: any) => {
  const response = await fetch(
    `${BASE_URL}/orders_detail_staff/quantity-update`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(details),
    }
  );
  return response.json();
};

export const payWithVNPay = async (
  total_amount: number,
  user_id: number,
  order_id: number,
  phoneNumber: string,
  pointsToDeduct: number
) => {
  try {
    const formData = new URLSearchParams();
    formData.append("amount", String(total_amount));
    formData.append(
      "orderInfo",
      "Pay for the bill at the table by " +
        String(user_id) +
        " " +
        String(order_id) +
        " " +
        String(phoneNumber) +
        " " +
        String(pointsToDeduct)
    );
    const employeeToken = localStorage.getItem("employeeToken");
    // formData.append('baseUrl', baseUrl);
    const response = await axios.post(
      `${BASE_URL}/payment/submit_order_vnpay`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${employeeToken}`,
        },
      }
    );
    const paymentUrl = response.data;
    console.log(response.data);

    window.location.href = paymentUrl; // Redirect to VNPay payment gateway
  } catch (error) {}
};

export const updateCustomerInOrder = async (
  orderId: number,
  phoneNumber: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/order_staff/update-customer`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ orderId: orderId, phoneNumber: phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.text();
  } catch (error) {}
};

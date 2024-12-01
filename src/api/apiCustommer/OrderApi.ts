// src/services/orderService.ts

import axios from "axios";

import { OrderModel } from "../../models/OrderModel";

// Hàm lấy đơn hàng đang trong trạng thái "PREPARING_ORDER"
export async function getPreparingOrders(
  customerId: number
): Promise<OrderModel[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `https://wanrenbuffet.netlify.app/api/orders/GetOrderByCustomerId/${customerId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Kiểm tra cấu trúc dữ liệu trả về
    if (response.data) {
      return response.data as OrderModel[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Cannot fetch preparing orders:", error);
    return [];
  }
}

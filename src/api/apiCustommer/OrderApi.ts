// src/services/orderService.ts

import axios from "axios";

import { OrderModel } from "../../models/OrderModel";

// Định nghĩa baseURL cho API
const API_BASE_URL = "http://localhost:8080/orders/search";

// Hàm lấy đơn hàng đang trong trạng thái "PREPARING_ORDER"
export async function getPreparingOrders(customerId: number): Promise<OrderModel[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/findPreparingOrdersByCustomerId`, {
            params: {
                customerId: customerId,
                orderStatus: "PREPARING_ORDER",
            },
            headers: {
                "Content-Type": "application/json",
                // Thêm Authorization header nếu cần
                // "Authorization": `Bearer ${token}`,
            },
        });

        // Kiểm tra cấu trúc dữ liệu trả về
        if (response.data && response.data._embedded && response.data._embedded.orders) {
            return response.data._embedded.orders as OrderModel[];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Cannot fetch preparing orders:", error);
        return [];
    }
}

// Hàm lấy tất cả đơn hàng của khách hàng với pagination
export async function getAllOrdersByCustomerId(customerId: number, page: number = 0, size: number = 10): Promise<{ orders: OrderModel[]; totalPages: number }> {
    try {
        const response = await axios.get(`${API_BASE_URL}/findAllOrdersByCustomerId`, {
            params: {
                customerId: customerId,
                page: page,
                size: size,
            },
            headers: {
                "Content-Type": "application/json",
                // Thêm Authorization header nếu cần
                // "Authorization": `Bearer ${token}`,
            },
        });

        if (response.data && response.data._embedded && response.data._embedded.orders) {
            const orders: OrderModel[] = response.data._embedded.orders as OrderModel[];
            const totalPages: number = response.data.page.totalPages;
            return { orders, totalPages };
        } else {
            return { orders: [], totalPages: 0 };
        }
    } catch (error) {
        console.error("Cannot fetch all orders:", error);
        return { orders: [], totalPages: 0 };
    }
}

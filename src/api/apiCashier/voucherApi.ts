import axios from "axios";
import { BASE_URL } from "./foodApi";

export type Voucher = {
status?: string;
promotionId?: number;
customerId?: number;
  }

export type PromotionOrder = {
    promotionId?: number;
    orderId?: number;
}

const getHeaders = () => {
    const employeeToken = localStorage.getItem("employeeToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${employeeToken}`,
    };
  };

  export const fetchVoucherByCode = async (code:string) => {
    try {
      const response = await axios.get(`${BASE_URL}/Voucher/${code}/findByCode`, {
        method: "GET",
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  export const updateVoucherStatus = async (voucherId: number, newStatus: boolean) => {
    try {
      await axios.patch(`${BASE_URL}/api-data/Voucher/${voucherId}`, {
        status: newStatus
      }, {
        method: "PATCH",
        headers: getHeaders(),
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đặt bàn:", error);
      throw error;
    }
  };

  export const fetchPromotionById = async (id:number) => {
    try {
      const response = await axios.get(`${BASE_URL}/Promotion/${id}/info`, {
        method: "GET",
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  export const createPromotionOrder = async (orderId: number, promotionId: number) => {
    const response = await fetch(`${BASE_URL}/Promotion/createPromotionOrder`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        orderId: orderId,
        promotionId: promotionId
      }),
    });
  
    if (!response.ok) {
      throw new Error("Error creating reservation");
    }
  
    const data = await response.json();
    return data; // Dữ liệu trả về từ server sau khi tạo mới
  };
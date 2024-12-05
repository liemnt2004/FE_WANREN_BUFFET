// tableApi.ts
import axios from "axios";
import { Order } from "./ordersOnl";


const getHeaders = () => {
  const employeeToken = localStorage.getItem("employeeToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${employeeToken}`,
  };
};

export type Table = {
  createdDate: string;
  updatedDate: string | null;
  tableId: number;
  tableNumber: number;
  tableStatus: string;
  location: string;
};

export const fetchTables = async () => {
  try {
    const response = await axios.get("http://localhost:8080/Table/all", {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};


export const fetchOrderbyTableId = async (tableId: number) => {
  try {
    const response = await axios.get(`http://localhost:8080/Table/${tableId}/orders`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data._embedded.orders;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};

export const updateTableStatus = async (tableId: number, newStatus: string) => {
  try {
    await axios.patch(`http://localhost:8080/Table/${tableId}`, {
      tableStatus: newStatus
    }, {
      method: "PATCH",
      headers: getHeaders(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    throw error;
  }
};



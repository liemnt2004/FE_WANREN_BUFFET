// tableApi.ts
import axios from "axios";

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
    const response = await axios.get("http://localhost:8080/Table");
    return response.data._embedded.tablees;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};

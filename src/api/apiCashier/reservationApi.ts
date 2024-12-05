import axios from "axios";

export type Reservation = {
  reservationId: number;
};

const getHeaders = () => {
  const employeeToken = localStorage.getItem("employeeToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${employeeToken}`,
  };
};

export const fetchReservations = async () => {
  try {
    const response = await axios.get("http://localhost:8080/Reservation/all", {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};

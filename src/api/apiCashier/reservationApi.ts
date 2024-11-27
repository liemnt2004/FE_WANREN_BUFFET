import axios from "axios";

export type Reservation = {
  reservationId: number;
};

export const fetchReservations = async () => {
  try {
    const response = await axios.get("http://localhost:8080/Reservation/all");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};

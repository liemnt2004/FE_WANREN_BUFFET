import axios from "axios";
import { BASE_URL } from "./foodApi";

export type Reservation = {
  reservationId: number;
  createdDate: string;
  updatedDate: string | null;
  numberPeople: number;
  dateToCome: string;
  timeToCome: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  note: string | null;
  status: string | null;
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
    const response = await axios.get(`${BASE_URL}/Reservation/all`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};

export const createReservation = async (reservationData: any) => {
  const response = await fetch(`${BASE_URL}/Reservation/createNewReservation`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    throw new Error("Error creating reservation");
  }

  const data = await response.json();
  return data; // Dữ liệu trả về từ server sau khi tạo mới
};

export const updateReservationStatus = async (reservationId: number, newStatus: string) => {
  try {
    await axios.patch(`${BASE_URL}/api-data/Reservation/${reservationId}`, {
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

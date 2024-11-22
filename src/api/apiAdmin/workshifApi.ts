import axios from "axios";
import WorkShiftModel from "../../models/AdminModels/WorkShiftModel";

const API_URL = "http://localhost:8080";

/**
 * Lấy token của nhân viên từ localStorage
 */
function getEmployeeToken(): string {
  const token = localStorage.getItem("employeeToken");
  if (!token) {
    throw new Error("Employee token is missing. Please log in.");
  }
  return token;
}

/**
 * Gọi API để lấy danh sách lịch làm việc
 */
export async function ListWorkShift(
  month: number,
  year: number
): Promise<WorkShiftModel[]> {
  try {
    // Tạo Authorization header với Bearer token
    const token = getEmployeeToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Gọi API
    const response = await axios.get(`${API_URL}/work-shift`, {
      headers,
      params: { month, year },
    });

    // Kiểm tra phản hồi
    if (response.status === 204) {
      console.warn("No work schedules found for the specified month and year.");
      return [];
    }

    return response.data as WorkShiftModel[];
  } catch (error) {
    console.error("Error fetching work shifts:", error);
    throw error;
  }
}

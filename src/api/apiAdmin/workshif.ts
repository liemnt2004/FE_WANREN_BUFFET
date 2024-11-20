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
    const response = await axios.get(`${API_URL}/User/work-schedules`, {
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
export async function updateWorkShift(
  username: string,
  shiftId: number,
  workDate: Date
): Promise<void> {
  try {
    // Tạo Authorization header với Bearer token
    const token = getEmployeeToken(); // Hàm này lấy token của nhân viên
    if (!token) {
      throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Định dạng ngày làm việc thành chuỗi "yyyy-MM-dd"
    const formattedDate = workDate.toISOString().split("T")[0];

    // Dữ liệu cần gửi lên server
    const data = {
      username,
      shiftId,
      workDate: formattedDate,
    };

    // Gọi API với phương thức PATCH
    const response = await axios.patch(
      `${API_URL}/User/work-schedules/update`,
      data,
      { headers }
    );

    // Xử lý phản hồi từ server
    if (response.status === 200) {
      console.log("Cập nhật ca làm việc thành công:", response.data);
    } else {
      console.warn("Đã xảy ra lỗi không mong muốn:", response.status);
    }
  } catch (error: any) {
    if (error.response) {
      // Xử lý lỗi từ phản hồi của server
      console.error("Lỗi từ server:", error.response.data);
      throw new Error(error.response.data || "Lỗi xảy ra từ server.");
    } else if (error.request) {
      // Xử lý lỗi liên quan đến request (không nhận được phản hồi)
      console.error("Không nhận được phản hồi từ server:", error.request);
      throw new Error("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } else {
      // Xử lý các lỗi khác
      console.error("Lỗi không xác định:", error.message);
      throw new Error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
    }
  }
}

import axios from "axios";
import WorkScheduleModel from "../../models/AdminModels/WorkScheduleModel";
import WorkScheduleFullModel from "../../models/AdminModels/WorkScheduleFullModel";
const API_URL = "http://localhost:8080/work-schedules";

// Hàm để lấy token từ localStorage
function getEmployeeToken(): string {
  const token = localStorage.getItem("employeeToken");
  if (!token) {
    throw new Error("Employee token is missing. Please log in.");
  }
  return token;
}

// Hàm gọi API để tạo WorkSchedule
export async function createWorkSchedule(
  workSchedule: WorkScheduleModel
): Promise<void> {
  try {
    // Gửi request với token
    const response = await axios.post(`${API_URL}/create`, workSchedule, {
      headers: {
        Authorization: `Bearer ${getEmployeeToken()}`, // Đính kèm token trong header
        "Content-Type": "application/json",
      },
    });

    // Xử lý kết quả trả về
    console.log("WorkSchedule created successfully:", response.data);
  } catch (error: any) {
    // Xử lý lỗi
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
}
// Hàm gọi API để lấy danh sách WorkSchedule theo ngày
export async function getWorkSchedulesByDate(
  date: string
): Promise<WorkScheduleFullModel[]> {
  try {
    // Gửi request với token
    const response = await axios.get(`${API_URL}/${date}`, {
      headers: {
        Authorization: `Bearer ${getEmployeeToken()}`, // Đính kèm token trong header
        "Content-Type": "application/json",
      },
    });

    // Xử lý và trả về danh sách WorkScheduleFullModel
    return response.data.map(
      (schedule: any) =>
        new WorkScheduleFullModel(
          schedule.username,
          schedule.fullName,
          schedule.userType,
          schedule.shiftId,
          new Date(schedule.workDate) // Chuyển đổi chuỗi ngày thành đối tượng Date
        )
    );
  } catch (error: any) {
    // Xử lý lỗi
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
}
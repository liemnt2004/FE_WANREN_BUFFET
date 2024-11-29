import axios from "axios";
import AdminModel from "../../models/AdminModels/AdminModal";

const API_BASE_URL = "http://localhost:8080/User";

/**
 * Hàm lấy token từ localStorage
 */
function getEmployeeToken(): string {
  const token = localStorage.getItem("employeeToken");
  if (!token) {
    throw new Error("Employee token is missing. Please log in.");
  }
  return token;
}

/**
 * Lấy danh sách tất cả admin
 * @returns {Promise<AdminModel[]>} Promise chứa danh sách admin
 */
export const fetchAdminList = async (): Promise<AdminModel[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admins`, {
      headers: {
        Authorization: `Bearer ${getEmployeeToken()}`, // Thêm token vào header
      },
    });
    console.log(response)
    return response.data as AdminModel[];
  } catch (error) {
    console.error("Error fetching admin list:", error);
    throw error;
  }
};

/**
 * Tạo admin mới
 * @param adminData Dữ liệu admin cần tạo
 * @returns {Promise<AdminModel>} Admin mới được tạo
 */
export const createAdmin = async (
  adminData: Partial<AdminModel>
): Promise<AdminModel> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admins/create`,
      adminData,
      {
        headers: {
          Authorization: `Bearer ${getEmployeeToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data as AdminModel;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};
export const updateAdmin = async (
  adminId: number,
  adminData: Partial<AdminModel>
): Promise<AdminModel> => {
  try {
    const token = localStorage.getItem("employeeToken");
    if (!token) {
      throw new Error("Employee token is missing. Please log in.");
    }

    const response = await axios.put(
      `${API_BASE_URL}/admins/update/${adminId}`,
      adminData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data as AdminModel;
  } catch (error: any) {
    console.error("Error updating admin:", error);
    throw new Error(error.response?.data?.message || "Failed to update admin.");
  }
};
/**
 * Xóa admin
 * @param adminId ID của admin cần xóa
 * @returns {Promise<void>} Promise không trả về giá trị
 */
export const deleteAdmin = async (adminId: number): Promise<void> => {
  try {
    const token = getEmployeeToken(); // Lấy token từ localStorage

    // Gửi yêu cầu DELETE đến API backend
    await axios.delete(`${API_BASE_URL}/admins/delete/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực
        "Content-Type": "application/json",
      },
    });

    console.log(`Admin with ID ${adminId} deleted successfully.`);
  } catch (error: any) {
    console.error("Error deleting admin:", error);

    // Kiểm tra lỗi và hiển thị thông báo phù hợp
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xóa tài khoản này.");
    } else if (error.response?.status === 404) {
      throw new Error("Tài khoản không tồn tại.");
    } else {
      throw new Error(
        error.response?.data?.message || "Failed to delete admin."
      );
    }
  }
};

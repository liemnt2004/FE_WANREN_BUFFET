import axios from "axios";

const API_BASE_URL = "http://localhost:8080/User";

/**
 * Lấy danh sách tất cả admin
 * @returns {Promise<AdminModel>} Promise chứa danh sách admin
 */
export const fetchAdminList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admins`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin list:", error);
    throw error;
  }
};

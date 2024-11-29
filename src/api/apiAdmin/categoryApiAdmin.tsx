// src/api/apiAdmin/categoryApiAdmin.ts

import axios from "axios";

// Định nghĩa interface cho Category
export interface Category {
    categoryId: number;
    categoryName: string;
    description: string;
}

// Cấu hình cơ bản cho API
const API_BASE_URL = "http://localhost:8080/Category"; // Thay đổi URL này thành URL thực tế của backend bạn

// Hàm lấy token từ localStorage
const getAuthToken = (): string => {
    const token = localStorage.getItem("employeeToken");
    if (!token) {
        throw new Error("Token không tồn tại.");
    }
    return token;
};

/**
 * Lấy danh sách tất cả các Category từ backend.
 * @returns Promise<Category[]> - Trả về một mảng các Category.
 */
export const fetchCategoryList = async (): Promise<Category[]> => {
    try {
        const response = await axios.get<{ _embedded?: { categories: Category[] }; }>(`${API_BASE_URL}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`, // Thêm Authorization header với Bearer token
            },
        });

        // Kiểm tra và trả về danh sách category từ _embedded nếu có, ngược lại trả về danh sách rỗng
        return response.data._embedded?.categories || [];
    } catch (error) {
        console.error("Error fetching category list:", error);
        throw error;
    }
};

/**
 * Tạo một Category mới.
 * @param category Dữ liệu Category mới.
 * @returns Promise<Category> - Trả về Category vừa tạo.
 */
export const createCategory = async (category: Omit<Category, "categoryId">): Promise<Category> => {
    try {
        const response = await axios.post<Category>(`${API_BASE_URL}`, category, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`, // Thêm Authorization header với Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

/**
 * Cập nhật một Category.
 * @param categoryId ID của Category cần cập nhật.
 * @param category Dữ liệu Category cập nhật.
 * @returns Promise<Category> - Trả về Category đã được cập nhật.
 */
export const updateCategory = async (categoryId: number, category: Partial<Omit<Category, "categoryId">>): Promise<Category> => {
    try {
        const response = await axios.put<Category>(`${API_BASE_URL}/${categoryId}`, category, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`, // Thêm Authorization header với Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

/**
 * Xóa một Category.
 * @param categoryId ID của Category cần xóa.
 * @returns Promise<void>
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`, // Thêm Authorization header với Bearer token
            },
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

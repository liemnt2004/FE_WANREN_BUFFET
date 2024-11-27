// src/api/apiAdmin/productApi.ts
import axios from "axios";
import {Product} from "../../layouts/ADMIN/ProductManagement";


const API_BASE_URL = "http://localhost:8080/Product";

// Lấy danh sách sản phẩm với phân trang và tìm kiếm
export const fetchProductList = async (
    page: number,
    searchQuery: string
): Promise<{ data: Product[]; totalPages: number; totalElements: number }> => {
    try {
        if (searchQuery !== "") {
            const response = await axios.get(
                `http://localhost:8080/Product/search/findByProductNameContaining`,
                {
                    params: {
                        productName: searchQuery,
                        page: page,
                        size: 20,
                    },
                    headers: {
                        Authorization: `Bearer ${getEmployeeToken()}`,
                    },
                }
            );

            return {
                data: response.data._embedded.products,
                totalPages: response.data.page.totalPages,
                totalElements: response.data.page.totalElements,
            };
        } else {
            const response = await axios.get(`${API_BASE_URL}`, {
                params: {
                    page: page,
                    size: 20,
                },
                headers: {
                    Authorization: `Bearer ${getEmployeeToken()}`,
                },
            });

            return {
                data: response.data._embedded.products,
                totalPages: response.data.page.totalPages,
                totalElements: response.data.page.totalElements,
            };
        }
    } catch (error) {
        console.error("Error fetching product list:", error);
        throw error;
    }
};



// Thêm mới sản phẩm
export const createProduct = async (productData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}`, productData, {
            headers: {
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId: number, productData: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${productId}`, productData, {
            headers: {
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa sản phẩm
export const deleteProduct = async (productId: number) => {
    try {
        await axios.delete(`${API_BASE_URL}/${productId}`, {
            headers: {
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });
    } catch (error) {
        throw error;
    }
};

// Hàm lấy token từ localStorage
const getEmployeeToken = (): string => {
    const employeeToken = localStorage.getItem("employeeToken");
    if (!employeeToken) {
        throw new Error("Employee token is missing.");
    }
    return employeeToken;
};

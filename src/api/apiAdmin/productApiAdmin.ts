// src/api/apiAdmin/productApi.ts
import axios from "axios";
import { Category } from "./categoryApiAdmin";  // Import Category type

export interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
    typeFood: string;
    image: string;
    quantity: number;
    productStatus: "IN_STOCK" | "OUT_OF_STOCK" | "HIDDEN";
    category: Category;  // Category object
}

const API_BASE_URL = "https://wanrenbuffet.online/api-data/Product";

// Lấy danh sách sản phẩm với phân trang và tìm kiếm
export const fetchProductList = async (
    page: number,
    searchQuery: string
): Promise<{ data: Product[]; totalPages: number; totalElements: number }> => {
    try {
        let url = `${API_BASE_URL}`;

        if (searchQuery !== "") {
            url = `${API_BASE_URL}/search/findByProductNameContaining`;
        }

        const response = await axios.get(url, {
            params: {
                productName: searchQuery,
                page: page,
                size: 20,
            },
            headers: {
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });

        // Lấy danh sách sản phẩm từ phản hồi và xử lý category
        const products = await Promise.all(
            response.data._embedded.products.map(async (product: any) => {
                // Lấy dữ liệu category từ API bằng productId
                const categoryResponse = await axios.get(
                    `https://wanrenbuffet.online/api-data/Category/search/findCategoryByProductId?productId=${product.productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getEmployeeToken()}`,
                        },
                    }
                );

                return {
                    ...product,
                    category: categoryResponse.data, // Gán dữ liệu category vào product
                };
            })
        );

        return {
            data: products,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements,
        };
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

// Cập nhật danh mục sản phẩm
export const updateCategory = async (productId: number, categoryId: number) => {
    try {
        const response = await axios.put(
            `https://wanrenbuffet.online/api/product/UpdateCategory?productId=${productId}&categoryId=${categoryId}`,

            {
                headers: {
                    Authorization: `Bearer ${getEmployeeToken()}`,
                },
            }
        );
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

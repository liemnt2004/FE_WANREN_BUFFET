// src/api/apiAdmin/promotionApiAdmin.ts

import axios from "axios";
import PromotionAdmin from "../../models/AdminModels/Promotion";
import { PromotionInput } from "../../models/AdminModels/PromotionInput";

// Base API URL for promotions
export const API_BASE_URL = "https://wanrenbuffet.online";

// Function to get employee token
function getEmployeeToken(): string {
    const employeeToken = localStorage.getItem("employeeToken");
    if (!employeeToken) {
        throw new Error("Employee token is missing. Please log in.");
    }
    return employeeToken;
}

// Fetch promotions with pagination and search
export const fetchPromotionList = async (
    page: number,
    searchText: string
): Promise<{ data: PromotionAdmin[]; totalPages: number; totalElements: number }> => {
    try {
        let response: any;

        if (searchText.length > 0) {
            // Khi có tìm kiếm, sử dụng endpoint tìm kiếm
            response = await axios.get(`${API_BASE_URL}/api-data/Promotion/search/findByPromotionNameContaining`, {
                params: {
                    promotionName: searchText,
                    page,
                    size: 20
                },
                headers: {
                    Authorization: `Bearer ${getEmployeeToken()}`,
                },
            });
        } else {
            // Nếu không có tìm kiếm, lấy tất cả khuyến mãi
            response = await axios.get(`${API_BASE_URL}/api-data/Promotion`, {
                params: {
                    page,
                    size: 20
                },
                headers: {
                    Authorization: `Bearer ${getEmployeeToken()}`,
                },
            });
        }

        // Mapping dữ liệu từ API
        const promotionsData = response.data?._embedded?.promotions || [];
        const promotions = promotionsData.map((promotion: any) => {
            // Mapping dữ liệu đúng tên trường
            const promotionId = promotion.promotionId || promotion.promotion; // Tùy thuộc vào API
            const unitPrice = typeof promotion.unitPrice === 'number' ? promotion.unitPrice :
                typeof promotion.unitPrice === 'string' ? parseFloat(promotion.unitPrice) : 0;

            const image = typeof promotion.image === 'string' && promotion.image.startsWith('http') ? promotion.image : '';

            const updatedDate = typeof promotion.updatedDate === 'string' ? promotion.updatedDate :
                typeof promotion.updatedDate === 'number' ? new Date(promotion.updatedDate).toISOString() : null;

            return new PromotionAdmin(
                promotionId,
                promotion.promotionName,
                promotion.description,
                promotion.promotionType,
                promotion.promotionValue,
                promotion.type_food || "",
                promotion.startDate,
                promotion.endDate,
                promotion.promotionStatus,
                unitPrice,
                image,
                promotion.createdDate || "",
                updatedDate || null
            );
        });

        const totalElements = response.data?.page?.totalElements ?? promotions.length;
        const totalPages = response.data?.page?.totalPages ?? 1;

        return { data: promotions, totalPages, totalElements };
    } catch (error) {
        console.error("Error fetching promotion list:", error);
        throw error;
    }
};

// Create a new promotion
export const createPromotion = async (
    newPromotion: PromotionInput
): Promise<PromotionAdmin> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/Promotion/create`, newPromotion, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });

        if (response.status !== 201) {
            console.error("Error creating Promotion:", response.data);
            throw new Error("Failed to create Promotion");
        }

        const promotion = response.data;
        const unitPrice = typeof promotion.unitPrice === 'number' ? promotion.unitPrice :
            typeof promotion.unitPrice === 'string' ? parseFloat(promotion.unitPrice) : 0;

        const image = typeof promotion.image === 'string' && promotion.image.startsWith('http') ? promotion.image : '';

        const updatedDate = typeof promotion.updatedDate === 'string' ? promotion.updatedDate :
            typeof promotion.updatedDate === 'number' ? new Date(promotion.updatedDate).toISOString() : null;

        return new PromotionAdmin(
            promotion.promotionId || promotion.promotion,
            promotion.promotionName,
            promotion.description,
            promotion.promotionType,
            promotion.promotionValue,
            promotion.type_food || "",
            promotion.startDate,
            promotion.endDate,
            promotion.promotionStatus,
            unitPrice,
            image,
            promotion.createdDate || "",
            updatedDate || null
        );
    } catch (error) {
        console.error("Cannot create Promotion:", error);
        throw error;
    }
};

// Update an existing promotion
export const updatePromotion = async (
    id: number,
    promotionUpdates: Partial<PromotionInput>
): Promise<PromotionAdmin> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/api/Promotion/update/${id}`, promotionUpdates, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });

        if (response.status !== 200) {
            console.error("Error updating Promotion:", response.data);
            throw new Error("Failed to update Promotion");
        }

        const promotion = response.data;
        const unitPrice = typeof promotion.unitPrice === 'number' ? promotion.unitPrice :
            typeof promotion.unitPrice === 'string' ? parseFloat(promotion.unitPrice) : 0;

        const image = typeof promotion.image === 'string' && promotion.image.startsWith('http') ? promotion.image : '';

        const updatedDate = typeof promotion.updatedDate === 'string' ? promotion.updatedDate :
            typeof promotion.updatedDate === 'number' ? new Date(promotion.updatedDate).toISOString() : null;

        return new PromotionAdmin(
            promotion.promotionId || promotion.promotion,
            promotion.promotionName,
            promotion.description,
            promotion.promotionType,
            promotion.promotionValue,
            promotion.type_food || "",
            promotion.startDate,
            promotion.endDate,
            promotion.promotionStatus,
            unitPrice,
            image,
            promotion.createdDate || "",
            updatedDate || null
        );
    } catch (error) {
        console.error("Error updating Promotion:", error);
        throw error;
    }
};

// Delete a promotion
export const deletePromotion = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/api/Promotion/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${getEmployeeToken()}`,
            },
        });
        console.log(`Promotion with ID ${id} has been deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting promotion with ID ${id}:`, error);
        throw error;
    }
};

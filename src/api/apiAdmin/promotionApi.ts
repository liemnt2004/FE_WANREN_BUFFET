// src/api/apiAdmin/promotionApiAdmin.ts

import axios from "axios";
import PromotionAdmin from "../../models/AdminModels/Promotion";
import { PromotionInput } from "../../models/AdminModels/PromotionInput";

// Base API URL for promotions
const API_BASE_URL = "https://wanrenbuffet.online";

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
            // When we have a search text, use the search endpoint
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
            // If no search text, fetch all promotions
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

       
        

        const promotionsData = response.data?._embedded?.promotions || [];
        const promotions = promotionsData.map((promotion: any) =>
            new PromotionAdmin(
                promotion.promotion,
                promotion.promotionName,
                promotion.description,
                promotion.promotionType,
                promotion.promotionValue,
                promotion.type_food || "", // Map API field `type_food` to `typeFood` if needed
                promotion.startDate,
                promotion.endDate,
                promotion.promotionStatus,
                promotion.image || "",
                promotion.createdDate || "",
                promotion.updatedDate || ""
            )
        );

        console.log(promotions);
        

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
        const response = await axios.post(`${API_BASE_URL}/Promotion/create`, newPromotion, {
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
        return new PromotionAdmin(
            promotion.promotionId,
            promotion.promotionName,
            promotion.description,
            promotion.promotionType,
            promotion.promotionValue,
            promotion.typeFood || promotion.type_food || "",
            promotion.startDate,
            promotion.endDate,
            promotion.promotionStatus,
            promotion.image || "",
            promotion.createdDate || "",
            promotion.updatedDate || ""
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
        const response = await axios.patch(`${API_BASE_URL}/Promotion/update/${id}`, promotionUpdates, {
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
        return new PromotionAdmin(
            promotion.promotionId,
            promotion.promotionName,
            promotion.description,
            promotion.promotionType,
            promotion.promotionValue,
            promotion.typeFood || promotion.type_food || "",
            promotion.startDate,
            promotion.endDate,
            promotion.promotionStatus,
            promotion.image || "",
            promotion.createdDate || "",
            promotion.updatedDate || ""
        );
    } catch (error) {
        console.error("Error updating Promotion:", error);
        throw error;
    }
};

// Delete a promotion
export const deletePromotion = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/Promotion/delete/${id}`, {
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

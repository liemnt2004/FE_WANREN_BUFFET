// src/api/apiCustommer/promotionApi.ts

import { request } from "../Request";
import Promotion from "../../models/PromotionModel"; // Đảm bảo đúng đường dẫn và tên

interface PromotionApiResponse {
    promotion: number;
    promotionName: string;
    description: string;
    promotionType: string;
    promotionValue: number;
    startDate: string;
    endDate: string;
    promotionStatus: boolean;
    image?: string;
    type_food?: string;
    unitPrice: number; // Đã thêm
}

interface EmbeddedPromotions {
    _embedded?: {
        promotions?: PromotionApiResponse[];
    };
}

export async function getAllPromotion(): Promise<Promotion[]> {
    const result: Promotion[] = [];
    try {
        const data: EmbeddedPromotions = await request('https://wanrenbuffet.online/api-data/Promotion/search/findByPromotionStatus?promotionStatus=true');

        if (data?._embedded?.promotions) {
            for (const promotion of data._embedded.promotions) {
                const promotionModel = new Promotion(
                    promotion.promotion,
                    promotion.promotionName,
                    promotion.description,
                    promotion.promotionType,
                    promotion.promotionValue,
                    promotion.startDate,
                    promotion.endDate,
                    promotion.promotionStatus,
                    promotion.image || "",       // Use empty string if image is not provided
                    promotion.type_food || "",    // Use empty string if type_food is not provided
                    promotion.unitPrice           // Thêm unitPrice
                );
                result.push(promotionModel);
            }
            console.log(result);
        }
        return result;
    } catch (error) {
        console.error("Error fetching promotion list:", error);
        return [];
    }
}

export async function GetPromotionById(PromotionId: number): Promise<Promotion | null> {
    try {
        const data: PromotionApiResponse = await request(`https://wanrenbuffet.online/api-data/Promotion/${PromotionId}`);

        if (data) {
            return new Promotion(
                data.promotion,
                data.promotionName,
                data.description,
                data.promotionType,
                data.promotionValue,
                data.startDate,
                data.endDate,
                data.promotionStatus,
                data.image || "",
                data.type_food || "",
                data.unitPrice // Thêm unitPrice
            );
        } else {
            return null; // Return null if no data is found
        }
    } catch (error) {
        console.error(`Error fetching promotion with ID ${PromotionId}:`, error);
        return null;
    }
}

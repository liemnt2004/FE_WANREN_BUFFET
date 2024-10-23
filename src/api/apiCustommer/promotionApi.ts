
import {request} from "../Request";
import PromotionModel from "../../models/PromotionModel";

export async function getAllPromotion(): Promise<PromotionModel[]> {
    const rs: PromotionModel[] = [];
    try {
        const data = await request('http://localhost:8080/Promotion/search/findByPromotionStatus?promotionStatus=true');

        if (data && data._embedded && data._embedded.promotions) {

            for (const promotion of data._embedded.promotions) {
                const promotionmodel = new PromotionModel(
                   promotion.PromotionId,
                    promotion.promotionName,
                    promotion.description,
                    promotion.promotionType,
                    promotion.promotionValue,
                    promotion.startDate,
                    promotion.endDate,
                    promotion.promotionStatus
                );
                rs.push(promotionmodel);
            }

            return rs;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Cannot fetch product list:", error);
        return [];
    }
}
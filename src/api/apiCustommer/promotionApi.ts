import {request} from "../Request";
import PromotionModel from "../../models/PromotionModel";

export async function getAllPromotion(): Promise<PromotionModel[]> {
    const rs: PromotionModel[] = [];
    try {
        const data = await request('https://wanrenbuffet.netlify.app/Promotion/search/findByPromotionStatus?promotionStatus=true');
        console.log(data)
        if (data && data._embedded && data._embedded.promotions) {

            for (const promotion of data._embedded.promotions) {
                const promotionmodel = new PromotionModel(
                    promotion.promotion
                    ,
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



export async function GetPromotionById(PromotionId: number): Promise<PromotionModel | null> {
    try {

        const data = await request(`http://103.124.92.95:8080/Promotion/${PromotionId}`);

        if (data) {
            return new PromotionModel(
                data.promotion,
                data.promotionName,
                data.description,
                data.promotionType,
                data.promotionValue,
                data.startDate,
                data.endDate,
                data.promotionStatus
            );
        } else {
            return null; // Return null if no data is found
        }
    } catch (error) {
        console.error("Cannot fetch promotion details:", error);
        return null;
    }
}
export interface PromotionInput {
    promotionName: string;
    description: string;
    promotionType: string;
    promotionValue: number;
    type_food: string;
    startDate: string; // ISO string hoặc định dạng tương ứng
    endDate: string;   // ISO string hoặc định dạng tương ứng
    promotionStatus: boolean;
    image: string;
    unitPrice:number;
  }
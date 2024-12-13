// src/models/AdminModels/Promotion.ts

export default class PromotionAdmin {
  promotion: number;
  promotionName: string;
  description: string;
  promotionType: string;
  promotionValue: number;
  type_food: string;
  startDate: string; // ISO string hoặc định dạng tương ứng
  endDate: string;   // ISO string hoặc định dạng tương ứng
  promotionStatus: boolean;
  image?: string;    // URL ảnh
  createdDate: string;
  updatedDate: string | null;

  constructor(
    promotion: number,
      promotionName: string,
      description: string,
      promotionType: string,
      promotionValue: number,
      type_food: string,
      startDate: string,
      endDate: string,
      promotionStatus: boolean,
      image?: string,
      createdDate?: string,
      updatedDate?: string | null
  ) {
      this.promotion = promotion;
      this.promotionName = promotionName;
      this.description = description;
      this.promotionType = promotionType;
      this.promotionValue = promotionValue;
      this.type_food = type_food;
      this.startDate = startDate;
      this.endDate = endDate;
      this.promotionStatus = promotionStatus;
      this.image = image;
      this.createdDate = createdDate || new Date().toISOString();
      this.updatedDate = updatedDate || null;
  }
}


// src/models/AdminModels/PromotionInput.ts




import axios from "axios";
import PromotionAdmin from "../../models/AdminModels/Promotion";

const API_BASE_URL = "http://localhost:8080/Promotion";

export const getAllPromotions = async (): Promise<PromotionAdmin[]> => {
  let page = 0;
  let allPromotions: PromotionAdmin[] = [];
  let totalPages: number | undefined;

  try {
    do {
      const response = await axios.get(`${API_BASE_URL}?page=${page}`);

      // Access metadata for pagination (totalPages, etc.)
      const promotionsData = response.data._embedded.promotions;
      const promotions = promotionsData.map(
        (promotion: any) =>
          new PromotionAdmin(
            promotion.createdDate,
            promotion.updatedDate,
            promotion.promotionName,
            promotion.description,
            promotion.promotionType,
            promotion.promotionValue,
            promotion.startDate,
            promotion.endDate,
            promotion.promotionStatus,
            promotion.promotion
          )
      );

      allPromotions = [...allPromotions, ...promotions];

      totalPages = response.data.page?.totalPages;

      page += 1;
    } while (page <= (totalPages || 1));

    return allPromotions;
  } catch (error) {
    console.error("Error fetching promotion list:", error);
    throw error;
  }
};
export async function createPromotion(
  newPromotion: Partial<PromotionAdmin>
): Promise<void> {
  try {
    const response = await fetch(`http://localhost:8080/Promotion/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPromotion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating Promotion:", errorData);
      throw new Error("Failed to create Promotion");
    }
  } catch (error) {
    console.error("Cannot create Promotion:", error);
    throw error;
  }
}

export const updatePromotion = async (
  id: number,
  promotionUpdates: Partial<PromotionAdmin>
): Promise<PromotionAdmin> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/update/${id}`,
      promotionUpdates,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Promotion:", error);
    throw error;
  }
};
export const deletePromotion = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/delete/${id}`);
    console.log(`Promotion with ID ${id} has been deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting promotion with ID ${id}:`, error);
    throw error;
  }
};

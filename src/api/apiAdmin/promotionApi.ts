import axios from "axios";
import PromotionAdmin from "../../models/AdminModels/Promotion";

const API_BASE_URL = "https://wanrenbuffet.online/api-data/Promotion";

// Function to get employee token
function getEmployeeToken(): string {
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    throw new Error("Employee token is missing. Please log in.");
  }
  return employeeToken;
}

// Fetch all promotions with pagination
// Fetch all promotions with pagination
export const getAllPromotions = async (): Promise<PromotionAdmin[]> => {
  let allPromotions: PromotionAdmin[] = [];

  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${getEmployeeToken()}`,
      },
    });

    const promotionsData = response.data?._embedded?.promotions || [];
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

    allPromotions = promotions; // Gán promotions vào allPromotions

    return allPromotions;
  } catch (error) {
    console.error("Error fetching promotion list:", error);
    throw error;
  }
};


// Create a new promotion
export async function createPromotion(
  newPromotion: Partial<PromotionAdmin>
): Promise<void> {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, newPromotion, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getEmployeeToken()}`,
      },
    });

    if (response.status !== 201) {
      console.error("Error creating Promotion:", response.data);
      throw new Error("Failed to create Promotion");
    }
  } catch (error) {
    console.error("Cannot create Promotion:", error);
    throw error;
  }
}

// Update an existing promotion
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
          Authorization: `Bearer ${getEmployeeToken()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Promotion:", error);
    throw error;
  }
};

// Delete a promotion
export const deletePromotion = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/delete/${id}`, {
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

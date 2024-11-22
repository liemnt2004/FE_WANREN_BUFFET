// productApi.ts
import axios from "axios";


export type Product = {
  productId?: number;
  productName?: string;
  description?: string;
  price?: number;
  createdDate?: string;
  updatedDate?: string | null;
  typeFood?: string;
  image?: string;
  productStatus?: string;
  quantity?: number;
}


// Hàm lấy danh sách sản phẩm
export const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/Product');
    return response.data._embedded.products;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    throw error;
  }
};

// Hàm cập nhật trạng thái sản phẩm
export const updateProductStatus = async (productId: number, newStatus: string) => {
  try {
    await axios.patch(`http://localhost:8080/Product/${productId}`, {
      productStatus: newStatus
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    throw error;
  }
};

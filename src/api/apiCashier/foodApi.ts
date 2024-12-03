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
    const response = await axios.get('https://wanrenbuffet.online/Product/all');
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    throw error;
  }
};

export const fetchProductsInStock = async () => {
  try {
    // Gọi API để lấy danh sách tất cả sản phẩm
    const response = await axios.get('https://wanrenbuffet.online/Product/all');
    const allProducts = response.data;

    // Lọc sản phẩm có trạng thái IN_STOCK
    const productsInStock = allProducts.filter(
      (product: Product) => product.productStatus === 'IN_STOCK'
    );

    return productsInStock;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm IN_STOCK:", error);
    throw error;
  }
};


// Hàm cập nhật trạng thái sản phẩm
export const updateProductStatus = async (productId: number, newStatus: string) => {
  try {
    await axios.patch(`https://wanrenbuffet.online/Product/${productId}`, {
      productStatus: newStatus
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    throw error;
  }
};

export const findProductById = async (productId: number) => {
  try {
    // Gọi API để lấy thông tin sản phẩm
    const response = await axios.get(`https://wanrenbuffet.online/Product/${productId}`);
    return response.data; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

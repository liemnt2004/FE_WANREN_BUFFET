// productApi.ts
import axios from "axios";

export const BASE_URL = "https://wanrenbuffet.online";
//export const BASE_URL = "https://wanrenbuffet.online";

const getHeaders = () => {
  const employeeToken = localStorage.getItem("employeeToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${employeeToken}`,
  };
};


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
    const response = await axios.get(`${BASE_URL}/Product/all`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    throw error;
  }
};

export const fetchProductsInStock = async () => {
  try {
    // Gọi API để lấy danh sách tất cả sản phẩm
    const response = await axios.get(`${BASE_URL}/Product/all`, {
      method: "GET",
      headers: getHeaders(),
    });
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
    await axios.patch(`${BASE_URL}/api-data/Product/${productId}`, {
      productStatus: newStatus
    }, {
      method: "PATCH",
      headers: getHeaders(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    throw error;
  }
};

export const findProductById = async (productId: number) => {
  try {
    // Gọi API để lấy thông tin sản phẩm
    const response = await axios.get(`${BASE_URL}/api-data/Product/${productId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

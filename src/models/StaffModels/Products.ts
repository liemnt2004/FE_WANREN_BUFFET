// src/models.ts

export interface Category {
    categoryId: number; // ID của danh mục
    categoryName: string; // Tên danh mục
    description?: string; // Mô tả (tuỳ chọn)
  }
  
  export interface Product {
    productId: number; // ID duy nhất của sản phẩm
    productName: string; // Tên của sản phẩm
    description?: string; // Mô tả chi tiết về sản phẩm (tuỳ chọn)
    price: number; // Giá sản phẩm
    typeFood?: string; // Loại thực phẩm (tuỳ chọn)
    image: string; // Đường dẫn hình ảnh sản phẩm
    productStatus?: string; // Trạng thái sản phẩm (tuỳ chọn)
    quantity?: number; // Số lượng sản phẩm (tuỳ chọn)
    category?: Category; // Danh mục mà sản phẩm thuộc về (tuỳ chọn)
  }
  
  
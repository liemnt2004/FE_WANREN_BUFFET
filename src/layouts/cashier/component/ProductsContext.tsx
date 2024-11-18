import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu Product
interface Product{
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

// Định nghĩa kiểu dữ liệu của Context
interface ProductsContextType {
  filteredProducts: Product[];
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Tạo Context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider cho Context
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  return (
    <ProductsContext.Provider value={{ filteredProducts, setFilteredProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Hook để sử dụng Context
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchProducts } from "../../../api/apiCashier/foodApi";

interface Product {
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

interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Tải dữ liệu từ API khi Provider khởi tạo
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data); // Lọc ban đầu đồng bộ với products
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      }
    };

    loadProducts();
  }, []);

  // Cập nhật filteredProducts mỗi khi products thay đổi
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        setProducts,
        setFilteredProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

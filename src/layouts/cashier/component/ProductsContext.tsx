import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchProducts, Product } from "../../../api/apiCashier/foodApi";

interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  filterProducts: (searchTerm: string) => void; // Thêm hàm lọc
  loadProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Tải dữ liệu từ API khi Provider khởi tạo
  const loadProducts = async () => {
    try {
      const data = await fetchProducts(); // Giả sử fetchProducts lấy dữ liệu sản phẩm
      setProducts(data); // Cập nhật state `products` với dữ liệu từ API
      if (searchTerm) {
        filterProducts(searchTerm);
      } else {
        setFilteredProducts(data); // Nếu không có `searchTerm`, hiển thị tất cả
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []); // Chạy lần duy nhất khi Provider khởi tạo

  // Cập nhật `filteredProducts` mỗi khi `products` thay đổi
  // useEffect(() => {
  //   setFilteredProducts(products);
  // }, [products]);

  // Hàm lọc sản phẩm
  const filterProducts = (searchTerm: string) => {
    const filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        setProducts,
        searchTerm,
        setSearchTerm,
        setFilteredProducts,
        filterProducts, // Truyền hàm lọc sản phẩm
        loadProducts,
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

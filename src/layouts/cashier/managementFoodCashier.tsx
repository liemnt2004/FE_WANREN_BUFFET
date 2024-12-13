import { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4_1 } from "uuid";
import { Product, updateProductStatus } from "../../api/apiCashier/foodApi";
import AlertSuccess from "./component/alertSuccess";
import CardFoodCashier from "./component/cardFoodCashier";
import { useProducts } from "./component/ProductsContext";

const ManagementFoodCashier = () => {
  // UseState v

  const [products, setProducts] = useState<Product[]>([]);

  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  const {
    filteredProducts,
    setFilteredProducts,
    loadProducts,
    filterProducts,
    searchTerm,
  } = useProducts();

  // UseState ^

  // lấy api v

  // useEffect(() => {
  //   const loadProducts = async () => {
  //     const data = await fetchProducts();
  //     setProducts(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
  //   };

  //   loadProducts();
  // }, []);

  // lấy api ^

  // các function v

  const toggleProductStatus = async (
    productId: number,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "HIDDEN" ? "IN_STOCK" : "HIDDEN";

    try {
      // Gọi API để cập nhật trạng thái
      await updateProductStatus(productId, newStatus);
      loadProducts();
      // filterProducts(searchTerm);

      // alert v
      const newAlert = {
        id: uuidv4_1(), // Tạo ID duy nhất cho mỗi alert
        message:
          newStatus === "HIDDEN"
            ? "Ẩn món ăn thành công!"
            : "Hiện món ăn thành công!",
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== newAlert.id)
        );
      }, 3000);
      // alert ^
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    }
  };

  // // search
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filteredProducts, setFilteredProducts] = useState(products);

  // useEffect(() => {
  //   setFilteredProducts(products); // Cập nhật lại danh sách khi `products` thay đổi
  // }, [products]);

  // const handleSearchChange = (event: { target: { value: string } }) => {
  //   const value = event.target.value.toLowerCase();
  //   setSearchTerm(value);

  //   const filtered = products.filter((product) =>
  //     product.productName?.toLowerCase().includes(value)
  //   );
  //   setFilteredProducts(filtered);
  // };

  // các function ^

  return (
    <div>
      <CardGrid>
        {filteredProducts.map((product) => (
          <div
            className="d-flex justify-content-center"
            key={product.productId}
          >
            <CardFoodCashier
              img={product.image}
              price={product.price}
              name={product.productName}
              description={product.description}
              status={product.productStatus === "HIDDEN" ? false : true}
              productId={product.productId}
              onToggleStatus={toggleProductStatus}
            />
          </div>
        ))}
      </CardGrid>
      {/* Container hiển thị thông báo */}
      <div className="fixed top-4 right-4 flex flex-col items-end space-y-2">
        {alerts.map((alert) => (
          <AlertSuccess key={alert.id} message={alert.message} />
        ))}
      </div>
    </div>
  );
};

export default ManagementFoodCashier;

// Styled components
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

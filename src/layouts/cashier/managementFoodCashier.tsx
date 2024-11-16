import { useEffect, useState } from "react";
import CardFoodCashier from "./component/cardFoodCashier";
import styled from "styled-components";
import axios from "axios";






type Product = {
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






const ManagementFoodCashier = () => {




  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      const fetchProducts = async () => {
          try {
              const response = await axios.get('http://localhost:8080/Product');
              setProducts(response.data._embedded.products);
          } catch (error) {
              console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
          }
      };

      fetchProducts();
  }, []);






  const toggleProductStatus = async (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === "HIDDEN" ? "IN_STOCK" : "HIDDEN";

    try {
        await axios.patch(`http://localhost:8080/Product/${productId}`, {
            productStatus: newStatus
        });

        // Cập nhật lại trạng thái trong danh sách sản phẩm
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product.productId === productId 
                    ? { ...product, productStatus: newStatus }
                    : product
            )
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    }
};







    return (
        <CardGrid>

            {products.map(product =>(
              <CardFoodCashier img={product.image} price={product.price} name={product.productName} description={product.description} status={product.productStatus==="HIDDEN"?false:true} productId={product.productId} onToggleStatus={toggleProductStatus}  />
            ))}

        </CardGrid>
    );
};

export default ManagementFoodCashier;

// Styled components
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px; /* Space between cards */
  padding: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on smaller screens */
  }
`;

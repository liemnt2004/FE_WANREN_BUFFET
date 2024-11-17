import { useEffect, useState } from "react";
import CardFoodCashier from "./component/cardFoodCashier";
import styled from "styled-components";
import axios from "axios";
import { fetchProducts, updateProductStatus, Product } from '../../api/apiCashier/foodApi';




const ManagementFoodCashier = () => {




  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      const loadFood = async () => {
          const data = await fetchProducts();
          setProducts(data)
      };

      loadFood();
  }, []);






  const toggleProductStatus = async (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === "HIDDEN" ? "IN_STOCK" : "HIDDEN";

    try {
        await updateProductStatus(productId, newStatus);

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

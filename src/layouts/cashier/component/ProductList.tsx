import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
    createdDate: string;
    updatedDate: string | null;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/Product');
                console.log("Dữ liệu trả về từ API:", response.data);
                setProducts(response.data._embedded.products); // Truy cập vào _embedded.products
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>
            <ul>
                {products.map(product => (
                    <li key={product.productId}>{product.productName} - ${product.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;

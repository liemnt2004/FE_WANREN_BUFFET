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
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://wanrenbuffet.online/Product');
                console.log("Dữ liệu trả về từ API:", response.data);
                setProducts(response.data._embedded.products); // Truy cập vào _embedded.products
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchProducts();
    }, []);
    // Hàm lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>

            {/* Thanh tìm kiếm */}
            <div className="search-container">
                <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // Cập nhật từ khóa tìm kiếm
                className="search-input"
                />
            </div>
            {/* Hiển thị danh sách sản phẩm */}
            <ul>
                {products.map(product => (
                    <li key={product.productId}>{product.productName} - ${product.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;

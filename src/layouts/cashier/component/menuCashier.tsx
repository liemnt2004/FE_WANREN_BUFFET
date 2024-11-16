import React, { useState, useEffect } from 'react';
import Logo from '../assets/img/logo2.png';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import '../assets/css/cashierMenu.css';
import { ProductsProvider } from './ProductsContext';
import { useProducts } from "./ProductsContext";

// Component dành cho thanh tìm kiếm
const StyledWrapperSearch = styled.div`
  .input[type="text"] {
    display: block;
    color: rgb(34, 34, 34);
    background: linear-gradient(142.99deg, rgba(233, 222, 250, 0.63) 15.53%, rgba(251, 252, 219, 0.63) 88.19%);
    box-shadow: 0px 12px 24px -1px rgba(0, 0, 0, 0.18);
    border: none;
    border-radius: 50px;
    padding: 18px 15px;
    outline: none;
    text-align: center;
    width: 500px;
    transition: 0.5s;
    margin: 7px auto;
  }

  .input[type="text"]:hover {
    width: 580px;
  }

  .input[type="text"]:focus {
    width: 660px;
  }

  @media (max-width: 768px) {
    .input[type="text"] {
      width: 300px;
    }
  }

  @media (max-width: 480px) {
    .input[type="text"] {
      width: 200px;
    }
  }
`;

const StyledWrapperMenu = styled.div`
  #navbody {
    width: 300px;
    height: 60px;
    background-color: rgb(255, 255, 255);
    border-radius: 40px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.041);
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .ul {
    list-style: none;
    width: 100%;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
  }

  .ul .li {
    display: inline-block;
  }

  .radio {
    display: none;
  }

  .svg {
    width: 70px;
    height: 70px;
    opacity: 80%;
    cursor: pointer;
    padding: 13px 20px;
    transition: 0.2s;
  }

  .ul .li .svg:hover {
    transition: 0.1s;
    color: #0d6efd;
    position: relative;
    margin-top: -4px;
    opacity: 100%;
  }

  @media (max-width: 768px) {
    #navbody {
      width: 100%;
      height: auto;
      justify-content: center;
    }
  }
`;

interface Product{
  productId: number;
  productName: string;
  description: string;
  price: number;
  createdDate: string;
  updatedDate: string | null;
  typeFood: string;
  image: string;
  productStatus: string;
  quantity: number;
}

const productFilter: any = () =>{

}

const MenuCashier: React.FC = () => {
  const { setFilteredProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState<string>(''); // State để lưu giá trị tìm kiếm
  const [products, setProducts] = useState<Product[]>([]); // State để lưu danh sách sản phẩm
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State để lưu sản phẩm đã lọc
  const [loading, setLoading] = useState<boolean>(false); // State để kiểm tra trạng thái loading
  const [error, setError] = useState<string>(''); // State để lưu thông báo lỗi nếu có

  // Hàm lấy dữ liệu sản phẩm từ API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Bắt đầu loading
      setError(''); // Reset error trước khi lấy dữ liệu mới

      try {
        // Giả sử bạn đã có dữ liệu sản phẩm từ API
        const response = await fetch('http://localhost:8080/Product');
        const data = await response.json();
        if (data && data._embedded) {
          setProducts(data._embedded.products); // Lưu sản phẩm vào state
          setFilteredProducts(data._embedded.products); // Mặc định hiển thị tất cả sản phẩm
        } else {
          throw new Error('Không có dữ liệu từ API');
        }
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu sản phẩm: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchProducts();
  }, []);

  // Hàm xử lý tìm kiếm khi người dùng nhập từ khóa
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchTerm(keyword); // Cập nhật giá trị tìm kiếm

    // Lọc sản phẩm theo từ khóa
    const filtered = products.filter(product =>
      product.productName.toLowerCase().includes(keyword.toLowerCase()) // Kiểm tra nếu tên sản phẩm có chứa từ khóa
    );

    setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm đã lọc
  };

  return (
    <ProductsProvider>
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 border rounded shadow-lg">
      <div className="logo d-flex align-items-center mb-3 mb-md-0">
        <img src={Logo} alt="Warent-Buffet" style={{ width: 125 }} />
      </div>

      {/* Thanh tìm kiếm */}
      <StyledWrapperSearch>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm} // Gán giá trị của input từ state
          onChange={handleSearch} // Xử lý tìm kiếm khi người dùng thay đổi
          className="input"
        />
      </StyledWrapperSearch>


      <StyledWrapperMenu>
        <div id="navbody">
          <form action="#" className="d-flex align-items-center p-0 m-0">
            <ul className="ul p-0 m-0">
              <input defaultChecked name="rad" className="radio" id="choose1" type="radio" />
              <label htmlFor="choose1">
                <li className="li">
                  <Link to="/cashier">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      height={24}
                      width={24}
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="svg w-6 h-6 text-gray-800 dark:text-white"
                    >
                      <path
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                        strokeWidth={2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                      />
                    </svg>
                  </Link>
                </li>
              </label>
            </ul>
          </form>
        </div>
      </StyledWrapperMenu>
    </div>
    </ProductsProvider>
  );
};

export default MenuCashier;

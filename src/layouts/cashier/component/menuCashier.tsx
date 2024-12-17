import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../assets/css/cashierMenu.css";
import Logo from "../assets/img/logo2.png";
import { ProductsProvider, useProducts } from "./ProductsContext";

// Component dành cho thanh tìm kiếm
const StyledWrapperSearch = styled.div`
  .input[type="text"] {
    display: block;
    color: rgb(34, 34, 34);
    background: linear-gradient(
      142.99deg,
      rgba(233, 222, 250, 0.63) 15.53%,
      rgba(251, 252, 219, 0.63) 88.19%
    );
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

const productFilter: any = () => {};

const MenuCashier: React.FC = () => {
  const {
    products,
    filteredProducts,
    filterProducts,
    searchTerm,
    setSearchTerm,
  } = useProducts(); // Lấy các giá trị từ context

  // search
  // const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: { target: { value: string } }) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterProducts(value); // Lọc sản phẩm khi giá trị thay đổi
  };

  return (
    <ProductsProvider>
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 border rounded shadow-lg">
        <div className="logo d-flex align-items-center mb-3 mb-md-0">
          <Link to={"/cashier"}>
            <img src={Logo} alt="Warent-Buffet" style={{ width: 125 }} />
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <StyledWrapperSearch>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm} // Gán giá trị của input từ state
            onChange={handleSearchChange} // Xử lý tìm kiếm khi người dùng thay đổi
            className="input"
          />
        </StyledWrapperSearch>
        <div className="flex flex-col">
          <div className="border border-gray-300 py-3 flex gap-1 shadow-xl rounded-md">
            <div className="group relative px-4 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-full hover:text-blue-500">
                <Link to={"/cashier"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    height={32}
                    width={32}
                  >
                    <path
                      stroke="currentColor"
                      d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                    />
                  </svg>
                </Link>
              </div>
              <span className="absolute -top-8 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Trang&nbsp;Chính
              </span>
            </div>
          </div>
        </div>
      </div>
    </ProductsProvider>
  );
};

export default MenuCashier;

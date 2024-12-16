import React from "react";
import { Link } from "react-router-dom"; // useNavigate để chuyển hướng sau khi logout
import "../assets/css/cashierSidebar.css";

const SidebarCashier = () => {

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/employee/login";
  };

  return (
    <div className="card bg-white p-3 shadow-md shadow-purple-200/50 rounded-md" style={{color: 'var(--text-color) !important', backgroundColor: "var(--body-color) !important" }}>
      <ul className="w-full flex flex-col gap-2 m-0 p-0">
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier" className="no-underline"  style={{color: 'var(--text-color) !important'}}>
            <button className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-200 to-purple-400 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-bookmark-dash-fill"></i>
              <span className="no-underline">Trang Chính</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/table" className="no-underline">
            <button className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-200 to-purple-400 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-table"></i>
              <span className="no-underline">Quản Lý Bàn</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/food" className="no-underline">
            <button className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-200 to-purple-400 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-egg-fried"></i>
              <span className="no-underline">Quản Lý Món Ăn</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/ordersOnline" className="no-underline">
            <button className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-200 to-purple-400 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-basket-fill"></i>
              <span className="no-underline">Đơn Online</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/reservation" className="no-underline">
            <button className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-200 to-purple-400 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-calendar-check-fill"></i>
              <span className="no-underline">Đặt Bàn</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-200 to-purple-400 focus:text-white text-gray-700 transition-all ease-linear">
            <i className="bi bi-gear-fill"></i>
            <span>Cài Đặt</span>
          </button>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button
            className="w-75 p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear"
            onClick={handleLogout} // Gọi hàm logout khi click vào button
          >
            <i className="bi bi-door-closed-fill"></i>
            <span>Đăng Xuất</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarCashier;

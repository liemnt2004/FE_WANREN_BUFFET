import React from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate để chuyển hướng sau khi logout
import "../assets/css/cashierSidebar.css";

const SidebarCashier = () => {
  const navigate = useNavigate(); // Hook để chuyển hướng sau khi logout

  // Hàm xử lý logout
  const handleLogout = () => {
    // Hiển thị thông báo xác nhận logout
    const confirmLogout = window.confirm(
      "Bạn có chắc chắn muốn đăng xuất không? "
    );

    if (confirmLogout) {
      // Xóa thông tin người dùng khỏi localStorage (hoặc nơi bạn lưu trữ thông tin đăng nhập)
      localStorage.removeItem("user"); // Giả sử bạn lưu thông tin người dùng trong 'user'

      // Chuyển hướng về trang login sau khi logout
      navigate("/login"); // Đảm bảo rằng đường dẫn '/login' là trang đăng nhập của bạn

      // Hiển thị thông báo logout thành công
      alert("Bạn đã đăng xuất thành công.");
    }
  };

  return (
    <div className="card bg-white p-3 shadow-md shadow-purple-200/50 rounded-md">
      <ul className="w-full flex flex-col gap-2 m-0 p-0">
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier" className="no-underline">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-bookmark-dash-fill"></i>
              <span className="no-underline">Trang Chính</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/table" className="no-underline">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-table"></i>
              <span className="no-underline">Quản Lý Bàn</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/food" className="no-underline">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-egg-fried"></i>
              <span className="no-underline">Quản Lý Món Ăn</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier/ordersOnline" className="no-underline">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-basket-fill"></i>
              <span className="no-underline">Đơn Online</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <Link to="/cashier" className="no-underline">
            <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
              <i className="bi bi-calendar-check-fill"></i>
              <span className="no-underline">Đặt Bàn</span>
            </button>
          </Link>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
            <i className="bi bi-gear-fill"></i>
            <span>Cài Đặt</span>
          </button>
        </li>
        <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
          <button
            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear"
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

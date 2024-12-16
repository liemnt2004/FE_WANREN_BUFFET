// src/components/MenuAdmin.tsx
import React, { useState, useContext } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import logo from "./assets/img/warenbuffet.png";
import "./assets/css/CustomerManagement.css";
import { AuthContext } from "../customer/component/AuthContext";
import { EyeOutlined } from "@ant-design/icons";

function MenuAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // Hàm để toggle dropdown
  function logout() {
    localStorage.removeItem("employeeToken");
    window.location.reload();
  }
  const { employeeFullName } = useContext(AuthContext);
  const handleOffcanvasClose = () => {
    const backdrops = document.querySelectorAll(".offcanvas-backdrop");

    // Nếu không có backdrop nào, tạo và thêm mới một cái với các lớp cần thiết
    if (backdrops.length === 0) {
      const newBackdrop = document.createElement("div");
      newBackdrop.classList.add("offcanvas-backdrop", "fade", "show"); // Thêm các lớp "fade" và "show"
      document.body.appendChild(newBackdrop); // Thêm vào body hoặc nơi bạn muốn
    }

    // Nếu có nhiều hơn 1 backdrop, chỉ xóa phần tử đầu tiên
    if (backdrops.length > 1) {
      backdrops[0].remove(); // Xóa phần tử đầu tiên
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <div className="topbar">
        <div className="left-side">
          <span className="menu-toggle">
            <i
              className="fas fa-bars"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu_admin"
              aria-controls="offcanvasMenu_admin"
              onClick={() => handleOffcanvasClose()}
            ></i>
          </span>
        </div>

        <div className="icons">
          <div className="notification">
            <i className="fas fa-bell"></i>
            <span className="badge">8</span>
          </div>
          <div className="profile   ">
            <div></div>
            <div className="dropdown">
              <img
                src="https://i.pravatar.cc/300"
                alt="User Profile"
                className="dropdown-toggle"
                onClick={toggleDropdown} // Điều khiển dropdown bằng React state
                aria-expanded={isOpen}
              />
              <span> {employeeFullName}</span>
              {/* Dropdown menu */}
              {isOpen && (
                <ul className="dropdown-menu show">
                  <li>
                    <a className="dropdown-item" onClick={() => logout()}>
                      Đăng xuất
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar_admin">
        <div className="logo">
          <img src={logo} alt="Shop Logo" />
        </div>
        <div className="menu">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-home"></i> Home
          </NavLink>
          <NavLink
            to="/admin/manage-product"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-utensils"></i> Manage Dishes
          </NavLink>
          <NavLink
            to="/admin/manage-promotions"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-bullhorn"></i> Manage Promotions
          </NavLink>
          <NavLink
            to="/admin/manage-accounts"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-user-cog"></i> Manage Accounts
          </NavLink>
          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-users"></i> Manage Employees
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-user-friends"></i> Manage Customers
          </NavLink>
          <NavLink
            to="/admin/manage-work-shifts"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-calendar-alt"></i> Manage Work Shifts
          </NavLink>
          <NavLink
            to="/admin/review"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <EyeOutlined /> Review
          </NavLink>
          <NavLink
            to="/admin/revenue-report"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-chart-line"></i> Revenue Report
          </NavLink>
        </div>
      </div>
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasMenu_admin"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-home"></i> Home
          </NavLink>
          <NavLink
            to="/admin/manage-product"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-utensils"></i> Manage Dishes
          </NavLink>
          <NavLink
            to="/admin/manage-promotions"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-bullhorn"></i> Manage Promotions
          </NavLink>
          <NavLink
            to="/admin/manage-accounts"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-user-cog"></i> Manage Accounts
          </NavLink>
          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-users"></i> Manage Employees
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-user-friends"></i> Manage Customers
          </NavLink>
          <NavLink
            to="/admin/manage-work-shifts"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-calendar-alt"></i> Manage Work Shifts
          </NavLink>
          <NavLink
            to="/admin/revenue-report"
            className={({ isActive }) =>
              isActive ? "menuItem active" : "menuItem"
            }
          >
            <i className="fas fa-chart-line"></i> Revenue Report
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default MenuAdmin;

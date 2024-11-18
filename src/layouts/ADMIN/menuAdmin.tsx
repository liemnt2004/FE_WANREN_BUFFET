// src/components/MenuAdmin.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import logo from "./assets/img/warenbuffet.png";
import "./assets/css/CustomerManagement.css";

function MenuAdmin() {
  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <div className="topbar">
        <div className="left-side">
          <span className="menu-toggle">
            <i className="fas fa-bars"></i>
          </span>
          <span>Categories</span>
        </div>
        <div className="time-button">
          <button className="time-btn">Day</button>
          <button className="time-btn active">Week</button>
          <button className="time-btn">Month</button>
          <button className="time-btn">Year</button>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="icons">
          <div className="notification">
            <i className="fas fa-bell"></i>
            <span className="badge">8</span>
          </div>
          <div className="profile">
            <img src="https://i.pravatar.cc/300" alt="User Profile" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
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
            to="/admin/manage-dishes"
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

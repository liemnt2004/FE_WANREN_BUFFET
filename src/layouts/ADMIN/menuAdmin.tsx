import { Link } from "react-router-dom";
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
          <div className="menuItem">
            <i className="fas fa-home"></i> Home
          </div>
          <div className="menuItem">
            <i className="fas fa-utensils"></i> Manage Dishes
          </div>
          <div className="menuItem">
            <i className="fas fa-bullhorn"></i> Manage Promotions
          </div>
          <div className="menuItem">
            <i className="fas fa-user-cog"></i> Manage Accounts
          </div>
          <div className="menuItem">
            <Link to="/admin/employeemanagement">
              <i className="fas fa-users"></i> Manage Employees
            </Link>
          </div>
          <div className="menuItem active">
            <Link to="/admin/customermanagement">
              <i className="fas fa-user-friends"></i> Manage Customers
            </Link>
          </div>
          <div className="menuItem">
            <i className="fas fa-calendar-alt"></i> Manage Work Shifts
          </div>
          <div className="menuItem">
            <i className="fas fa-chart-line"></i> Revenue Report
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuAdmin;

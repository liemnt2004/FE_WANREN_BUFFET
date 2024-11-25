import React, { useContext } from 'react';
import '../assets/css/styles.css'
import { AuthContext } from "../../customer/component/AuthContext";
const Header: React.FC<{ toggleId: string }> = ({ toggleId }) => {
  const {employeeFullName} = useContext(AuthContext);
  return (
    <header className="header" id="header">
      <div className="header__container">
        <a href="#" className="header__logo">
          <i className="ri-cloud-fill"></i>
          {employeeFullName ? (<span>{employeeFullName}</span>): (<span>None employee</span>)}        
        </a>
        <button className="header__toggle">
          <i className="ri-menu-line"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

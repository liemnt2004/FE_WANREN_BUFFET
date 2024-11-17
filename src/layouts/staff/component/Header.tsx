import React from 'react';

const Header: React.FC<{ toggleId: string }> = ({ toggleId }) => {
  return (
    <header className="header" id="header">
      <div className="header__container">
        <a href="#" className="header__logo">
          <i className="ri-cloud-fill"></i>
          <span>Danh sách Order</span>
        </a>
        <button className="header__toggle" id={toggleId}>
          <i className="ri-menu-line"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

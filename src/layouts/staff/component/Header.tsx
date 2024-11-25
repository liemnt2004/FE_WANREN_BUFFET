import React from 'react';
import '../assets/css/styles.css'

const Header: React.FC<{ toggleId: string }> = () => {
  return (
    <header className="header" id="header">
      <div className="header__container">
        <a href="#" className="header__logo">
          <i className="ri-cloud-fill"></i>
          <span>Nguyễn Quang Hoài Nam</span>
        </a>
        <button className="header__toggle">
          <i className="ri-menu-line"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

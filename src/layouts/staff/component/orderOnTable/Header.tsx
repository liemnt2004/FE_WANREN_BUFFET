import React from 'react';

interface HeaderProps {
  onCartClick: () => void;
  selectedItemsSubtotal: number;
  totalCartQuantity: number;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, selectedItemsSubtotal, totalCartQuantity }) => {
  return (
    <header className="header" id="header">
      <div className="header__container">
        <a
          href="#"
          className="header__logo"
          onClick={(e) => {
            e.preventDefault();
            onCartClick();
          }}
        >
          <i className="bi bi-bag cart-icon ps-3 pe-1 me-2 fs-4 position-relative">
            {totalCartQuantity > 0 && (
              <span
                style={{ width: '25px', height: '25px', fontStyle: 'normal', color: 'white', fontSize: '14px' }}
                className="d-flex align-items-center justify-content-center position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {totalCartQuantity}
                <span className="visually-hidden">unread messages</span>
              </span>
            )}
          </i>
          <span>{selectedItemsSubtotal.toLocaleString()} VND</span>
        </a>
        <button className="header__toggle">
          <i className="ri-menu-line"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import avarta from '../assets/img/Cream and Black Simple Illustration Catering Logo.png'

interface SidebarProps {
  onClickContent: (contentType: 'home' | '2nd_floor' | 'gdeli' | 'setting') => void;
}

const Sidebar: React.FC<SidebarProps> = ({  onClickContent }) => {

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__user">
          <div className="sidebar__img">
            <img src={avarta} alt="image"/>
          </div>
          <div className="sidebar__info">
            <h3>Nguyễn Quang Hoài Nam</h3>
            <span>1023271</span>
          </div>
        </div>
        <div className="sidebar__content">
          <div>
            <h3 className="sidebar__title">Khu Vực</h3>
            <div className="sidebar__list">
              <a href="#" className="sidebar__link active-link" onClick={() => onClickContent('home')}>
                <i className="ri-pie-chart-2-fill"></i>
                <span>Tầng Trệt</span>
              </a>
              <a href="#" className="sidebar__link" onClick={() => onClickContent('2nd_floor')}>
                <i className="ri-wallet-3-fill"></i>
                <span>Tầng 2</span>
              </a>
              <a href="#" className="sidebar__link"  onClick={() => onClickContent('gdeli')}>
                <i className="ri-calendar-fill"></i>
                <span>G-Deli</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="sidebar__title">Cài Đặt</h3>
            <div className="sidebar__list">
              <a href="#" className="sidebar__link"  onClick={() => onClickContent('setting')}>
                <i className="ri-settings-3-fill"></i>
                <span>Cài Đặt</span>
              </a>
              <a href="#" className="sidebar__link">
                <i className="ri-notification-2-fill"></i>
                <span>Thông Báo</span>
              </a>
            </div>
          </div>
        </div>
        <div className="sidebar__actions">
          <button>
            <i className="ri-moon-clear-fill sidebar__link sidebar__theme" id="theme-button">
              <span>Giao diện</span>
            </i>
          </button>
          <button className="sidebar__link">
            <i className="ri-logout-box-r-fill"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import logo from '../../customer/assets/img/warenbuffet.png';
import '../assets/css/styles.css';

interface SidebarProps {
  onClickContent: (contentType: 'home' | '2nd_floor' | 'gdeli' | 'setting') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClickContent }) => {
  const [activeLink, setActiveLink] = useState<'home' | '2nd_floor' | 'gdeli' | 'setting'>('home'); // Default link

  const handleClick = (contentType: 'home' | '2nd_floor' | 'gdeli' | 'setting') => {
    setActiveLink(contentType); // Update the active link state
    onClickContent(contentType); // Call the passed function
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "http://localhost:3000/employee/login";
  };

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__user">
          <div className="sidebar__img">
            <img src={logo} alt="WAREN BUFFET Logo" className="" width={100} />
          </div>
        </div>
        <div className="sidebar__content">
          <div>
            <h3 className="sidebar__title">Khu Vực</h3>
            <div className="sidebar__list">
              <p
                className={`sidebar__link mb-0 ${activeLink === 'home' ? 'active-link' : ''}`}
                onClick={() => handleClick('home')}
              >
                <i className="ri-pie-chart-2-fill"></i>
                <span style={{ color: 'var(--firstColor)' }}>Tầng Trệt</span>
              </p>
              <p
                className={`sidebar__link mb-0 ${activeLink === '2nd_floor' ? 'active-link' : ''}`}
                onClick={() => handleClick('2nd_floor')}
              >
                <i className="ri-wallet-3-fill"></i>
                <span style={{ color: 'var(--firstColor)' }}>Tầng 2</span>
              </p>
              <p
                className={`sidebar__link ${activeLink === 'gdeli' ? 'active-link' : ''}`}
                onClick={() => handleClick('gdeli')}
              >
                <i className="ri-calendar-fill"></i>
                <span style={{ color: 'var(--firstColor)' }}>G-Deli</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="sidebar__title">Cài Đặt</h3>
            <div className="sidebar__list">
              <p
                className={`sidebar__link mb-0 ${activeLink === 'setting' ? 'active-link' : ''}`}
                onClick={() => handleClick('setting')}
              >
                <i className="ri-settings-3-fill"></i>
                <span style={{ color: 'var(--firstColor)' }}>Cài Đặt</span>
              </p>
              <p
                className={`sidebar__link mb-0`}
              >
                <i className="ri-notification-2-fill"></i>
                <span style={{ color: 'var(--firstColor)' }}>Thông Báo</span>
              </p>
            </div>
          </div>
        </div>
        <div className="sidebar__actions">
          <button>
            <i className="ri-moon-clear-fill sidebar__link sidebar__theme" id="theme-button">
              <span style={{ color: 'var(--firstColor)' }}>Giao diện</span>
            </i>
          </button>
          <button className="sidebar__link" onClick={handleLogout}>
            <i className="ri-logout-box-r-fill"></i>
            <span style={{ color: 'var(--firstColor)' }}>Đăng Xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
import React, { useEffect, useState } from 'react';
import logoLight from '../assets/img/warenbuffet.png';
import logoDark from '../assets/img/warenbuffetDark.png';
import '../assets/css/styles.css';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onClickContent: (contentType: 'home' | '2nd_floor' | 'gdeli' | 'setting') => void;
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onClickContent, isVisible }) => {
  const [activeLink, setActiveLink] = useState<'home' | '2nd_floor' | 'gdeli' | 'setting'>('home'); // Default link
  const navigate = useNavigate();

  const handleClick = (contentType: 'home' | '2nd_floor' | 'gdeli' | 'setting') => {
    setActiveLink(contentType); // Update the active link state
    onClickContent(contentType); // Call the passed function
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    window.location.reload()
  };

  const [theme, setTheme] = useState(localStorage.getItem('selected-theme') || 'light');

  return (
    <nav className={`sidebar ${isVisible ? 'show-sidebar' : ''}`} id="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__user">
          <div className="sidebar__img">
            <img src={theme === 'light' ? logoLight : logoDark} alt="WAREN BUFFET Logo" className="" width={100} />
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
            </div>
          </div>
        </div>
        <div className="sidebar__actions">
          <button onClick={() => navigate(0)}>
            <i className="ri-refresh-line sidebar__link sidebar__theme" id="theme-button">
              <span style={{ color: 'var(--firstColor)' }}>Đồng Bộ</span>
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

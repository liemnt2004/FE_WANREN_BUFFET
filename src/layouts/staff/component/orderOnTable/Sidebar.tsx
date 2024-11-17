import React from 'react';
import { useParams } from 'react-router-dom';

interface SidebarProps {
  toggleId: string;
  onClickContent: (contentType: 'hotpot' | 'meat' | 'seafood' | 'meatballs' | 'vegetables' | 'noodles' | 'buffet_tickets' | 'dessert' | 'mixers' | 'cold_towel' | 'soft_drinks' | 'beer' | 'wine' | 'mushroom') => void;
  onOpenExitModal: () => void; // Thêm tham số này
  onOpenSwitchTableModal: () => void; // Thêm prop mới
}

const Sidebar: React.FC<SidebarProps> = ({ onClickContent, onOpenExitModal}) => {
  const { tableId } = useParams<{ tableId: string }>();

  const sidebarLinks = [
    { label: 'Nước lẩu', value: 'hotpot' },
    { label: 'Thịt', value: 'meat' },
    { label: 'Hải sản', value: 'seafood' },
    { label: 'Hàng viên', value: 'meatballs' },
    { label: 'Rau', value: 'vegetables' },
    { label: 'Nấm', value: 'mushroom' },
    { label: 'Mỳ - Bún', value: 'noodles' },
    { label: 'Vé Buffet', value: 'buffet_tickets' },
    { label: 'Khăn lạnh', value: 'cold_towel' },
    { label: 'Nước pha chế', value: 'mixers' },
    { label: 'Nước giải khát', value: 'soft_drinks' },
    { label: 'Bia', value: 'beer' },
    { label: 'Rượu', value: 'wine' },
    { label: 'Tráng miệng', value: 'dessert' }, // Thêm mục dessert cho ALACARTE
  ];

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__user">
          <div className="sidebar__img">
            {/* <img src={} alt="image"/> */}
          </div>
          <div className="sidebar__info">
            <h3 className="fw-bold fs-4" style={{ color: 'var(--first-color)' }}>Bàn số {tableId}</h3>
            <span>WANRENT BUFFET</span>
          </div>
        </div>
        <div className="sidebar__content">
          <div>
            <h3 className="sidebar__title">BUFFET</h3>
            <div className="sidebar__list">
              {sidebarLinks.map(link => (
                (link.value === 'hotpot' || link.value === 'meat' || link.value === 'mushroom' || link.value === 'seafood' || link.value === 'meatballs' || link.value === 'vegetables' || link.value === 'noodles') && (
                  <a
                    key={link.value}
                    className="sidebar__link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onClickContent(link.value as 'hotpot' | 'meat' | 'mushroom' | 'seafood' | 'meatballs' | 'vegetables' | 'noodles')}
                  >
                    <i className="ri-pie-chart-2-fill"></i>
                    <span>{link.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>

          <div>
            <h3 className="sidebar__title">ALACARTE</h3>
            <div className="sidebar__list">
              {sidebarLinks.map(link => (
                (link.value === 'buffet_tickets' || link.value === 'dessert') && (
                  <a
                    key={link.value}
                    className="sidebar__link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onClickContent(link.value as 'buffet_tickets' | 'dessert')}
                  >
                    <i className="ri-pie-chart-2-fill"></i>
                    <span>{link.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>
          <div>
            <h3 className="sidebar__title">NƯỚC UỐNG</h3>
            <div className="sidebar__list">
              {sidebarLinks.map(link => (
                (link.value === 'mixers' || link.value === 'soft_drinks' || link.value === 'beer' || link.value === 'wine') && (
                  <a
                    key={link.value}
                    className="sidebar__link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onClickContent(link.value as 'mixers' | 'soft_drinks' | 'beer' | 'wine')}
                  >
                    <i className="ri-pie-chart-2-fill"></i>
                    <span>{link.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
        <div className="sidebar__actions">
          <button>
            <i className="ri-moon-clear-fill sidebar__link sidebar__theme" id="theme-button">
              <span>Giao diện</span>
            </i>
          </button>
          <button className="sidebar__link" onClick={onOpenExitModal} >
            <i className="ri-logout-box-r-fill"></i>
            <span>Thoát</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

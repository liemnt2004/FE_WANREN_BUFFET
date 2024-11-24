import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../../customer/assets/img/warenbuffet.png';
import TransferTableModal from '../TransferTableModal';
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

interface SidebarProps {
  toggleId: string;
  onClickContent: (contentType: 'hotpot' | 'meat' | 'seafood' | 'meatballs' | 'vegetables' | 'noodles' | 'buffet_tickets' | 'dessert' | 'mixers' | 'cold_towel' | 'soft_drinks' | 'beer' | 'wine' | 'mushroom') => void;
  onOpenExitModal: () => void; // Thêm tham số này
  onOpenSwitchTableModal: () => void; // Thêm prop mới
}

const Sidebar: React.FC<SidebarProps> = ({ onClickContent, onOpenExitModal }) => {
  const { tableId } = useParams<{ tableId: string }>();
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string, description: string, icon: React.ReactNode, pauseOnHover: boolean = true) => {
    api.open({
      message,
      description,
      showProgress: true,
      pauseOnHover,
      placement: 'topRight',
      duration: 3,
      icon,
    });
  };

  const handleTransfer = (orderId: number, newTableId: number) => {
    openNotification(
      'Chuyển bàn',
      'Chuyển bàn thành công!',
      <CheckCircleOutlined style={{ color: '#52c41a' }} />
    );
    navigate(`/orderOnTable/${newTableId}`,{ state: { adults: 2, children: 0, tableLocation: 'Table' } });
    setShowTransferModal(false);
  };

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
    { label: 'Tráng miệng', value: 'dessert' },
  ];

  return (
    <>
    {contextHolder}
      <nav className="sidebar" id="sidebar">
        <div className="sidebar__container">
          <div className="sidebar__user">
            <div className="sidebar__img">
              <img src={logo} alt="WAREN BUFFET Logo" className="" width={100} />
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
                    <p
                      key={link.value}
                      className="sidebar__link mb-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onClickContent(link.value as 'hotpot' | 'meat' | 'mushroom' | 'seafood' | 'meatballs' | 'vegetables' | 'noodles')}
                    >
                      <i className="ri-pie-chart-2-fill"></i>
                      <span style={{ color: 'var(--firstColor)' }}>{link.label}</span>
                    </p>
                  )
                ))}
              </div>
            </div>

            <div>
              <h3 className="sidebar__title">ALACARTE</h3>
              <div className="sidebar__list">
                {sidebarLinks.map(link => (
                  (link.value === 'buffet_tickets' || link.value === 'dessert') && (
                    <p
                      key={link.value}
                      className="sidebar__link mb-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onClickContent(link.value as 'buffet_tickets' | 'dessert')}
                    >
                      <i className="ri-pie-chart-2-fill"></i>
                      <span style={{ color: 'var(--firstColor)' }}>{link.label}</span>
                    </p>
                  )
                ))}
              </div>
            </div>
            <div>
              <h3 className="sidebar__title">NƯỚC UỐNG</h3>
              <div className="sidebar__list">
                {sidebarLinks.map(link => (
                  (link.value === 'mixers' || link.value === 'soft_drinks' || link.value === 'beer' || link.value === 'wine') && (
                    <p
                      key={link.value}
                      className="sidebar__link mb-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onClickContent(link.value as 'mixers' | 'soft_drinks' | 'beer' | 'wine')}
                    >
                      <i className="ri-pie-chart-2-fill"></i>
                      <span style={{ color: 'var(--firstColor)' }}>{link.label}</span>
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="sidebar__actions">
            <button onClick={() => setShowTransferModal(true)}>
              <i className="ri-moon-clear-fill sidebar__link sidebar__theme" id="theme-button">
                <span style={{ color: 'var(--firstColor)' }}>Chuyển bàn</span>
              </i>
            </button>
            {showTransferModal && (
              <TransferTableModal
                currentTableId={Number(tableId)}
                onClose={() => setShowTransferModal(false)}
                onTransfer={handleTransfer}
              />
            )}
            <button className="sidebar__link" onClick={onOpenExitModal} >
              <i className="ri-logout-box-r-fill"></i>
              <span style={{ color: 'var(--firstColor)' }}>Thoát</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

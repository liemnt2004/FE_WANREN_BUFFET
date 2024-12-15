import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../../customer/component/AuthContext';

interface SettingProps {
    toggleTheme: () => void;
    icon: string;
}

const InfoSetting: React.FC<SettingProps> = ({ toggleTheme, icon }) => {
    const { employeeUserId, employeeFullName } = useContext(AuthContext);
    return (
        <div className="container" style={{ maxWidth: '800px', backgroundColor: 'var(--body-color)', padding: '20px', borderRadius: '10px' }}>
            {/* Header */}
            <div className="d-flex justify-content-center align-items-center mb-4">
                <h2 style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Thông tin cài đặt</h2>
            </div>

            {/* Information Section */}
            <div className="row mb-3">
                <div className="col-md-12" style={{ color: 'var(--text-color)' }}>
                    <div className="d-flex justify-content-between">
                        <p><strong>Tên nhân viên:</strong></p>
                        <p>{`${employeeFullName}`} - W1108</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p><strong>Mã nhân viên:</strong></p>
                        <p>{`${employeeUserId}`}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p><strong>Máy chủ:</strong></p>
                        <p>10.8.3.11:59900</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p><strong>Phiên bản:</strong></p>
                        <p>v1.6.36</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p><strong>G-POS version:</strong></p>
                        <p>2.4.100</p>
                    </div>
                </div>
            </div>

            <p
                className="sidebar__link mb-0 p-0"
                onClick={toggleTheme}
            >
                <i className={`ri ${icon}`}></i>
                <span style={{ color: 'var(--firstColor)' }}>Giao Diện</span>
            </p>
        </div>
    );
};

export default InfoSetting;

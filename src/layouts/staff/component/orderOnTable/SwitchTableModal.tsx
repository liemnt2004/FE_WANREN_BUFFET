// SwitchTableModal.tsx
import React, { useState } from 'react';
import '../../assets/css/exitModal.css';
import '../../assets/css/product_detail.css';
import '../../assets/css/styles.css';
import { notification } from 'antd';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';


interface SwitchTableModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const SwitchTableModal: React.FC<SwitchTableModalProps> = ({ onClose, onConfirm }) => {
    const [pin, setPin] = useState('');
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

    const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPin(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (pin === '1108') {
            onConfirm();
        } else {
            openNotification(
                'Xác nhận',
                'Mã PIN không chính xác!',
                <CloseCircleOutlined style={{ color: '#f5222d' }} />
            );
        }
    };

    return (
        <>
        {contextHolder}
            <div className="ps36231 modal fade show d-block" id="modalPin" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-4 text-center">
                        <h5>Nhập mã PIN nhà hàng để tiếp tục</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="input-field">
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={handlePinChange}
                                    className="otp-input"
                                    maxLength={4}
                                    required
                                />
                            </div>
                            <div className='d-flex justify-content-center align-items-center mt-2'>
                                <button className="btn btn-secondary mt-2 me-4" onClick={onClose}>Hủy</button>
                                <button type="submit" className="btn btn-primary mt-2">Xác nhận</button>
                            </div>
                        </form>

                    </div>
                </div>
                <div className="modal-backdrop fade show" onClick={onClose}></div>
            </div>
        </>
    );
};

export default SwitchTableModal;

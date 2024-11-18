// SwitchTableModal.tsx
import React, { useState } from 'react';
import '../../assets/css/exitModal.css';
import '../../assets/css/product_detail.css';
import '../../assets/css/styles.css';


interface SwitchTableModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const SwitchTableModal: React.FC<SwitchTableModalProps> = ({ onClose, onConfirm }) => {
    const [pin, setPin] = useState('');

    const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPin(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (pin === '1108') {
            onConfirm(); // Call onConfirm if the PIN is correct
        } else {
            alert('Mã PIN không đúng'); // Show an error message if the PIN is incorrect
        }
    };

    return (
        <div className="ps36231 modal fade show d-block" id="modalPin" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 text-center">
                    <header>
                        <i className="bi bi-patch-check-fill fs-2"></i>
                    </header>
                    <h5>Nhập mật khẩu nhân viên để tiếp tục</h5>
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
    );
};

export default SwitchTableModal;

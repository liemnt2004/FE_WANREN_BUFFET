import React from 'react';
import '../../assets/css/exitModal.css';
import '../../assets/css/product_detail.css';

interface ExitModalProps {
    onClose: () => void;
    onCheckout: () => void;
    onSwitchTable: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ onClose, onCheckout, onSwitchTable }) => {
    return (
        <div className="ps36231 modal fade show d-block" id="modalOut" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 text-center">
                    <div className="mb-3 text-center">
                        <i className="bi bi-box-arrow-right fs-1"></i>
                    </div>
                    <h3 className="mb-2">Thoát</h3>
                    <p>Bạn có thể chọn thanh toán ngay hoặc chuyển bàn</p>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <button className="btn btn-primary" onClick={onCheckout}>
                            <i className="bi bi-credit-card pe-2"></i>Thanh toán ngay
                        </button>
                        <button className="btn btn-primary" onClick={onSwitchTable}>
                            <i className="bi bi-box-arrow-right pe-2"></i>Chuyển bàn
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
        </div>
    );
};

export default ExitModal;

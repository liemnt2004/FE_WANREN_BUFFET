// ModalDetail.tsx
import React from 'react';

interface ModalDetailProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id: number;
        name: string;
        image: string;
        price: number;
        description: string;
    };
}

const ModalDetail: React.FC<ModalDetailProps> = ({ isOpen, onClose, item }) => {
    if (!isOpen) return null; // Không hiển thị nếu modal không mở

    return (
        <div className="modal" id="modalDetail">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="container-modal">
                        <div className="container-modal-header">
                            <div className="control-img">
                                <img src={item.image} alt={item.name} />
                                <div className="container-button d-grid place-item-center">
                                    <button type="button" className="btn-close" onClick={onClose}></button>
                                </div>
                            </div>
                        </div>
                        <div className="container-modal-footer">
                            <div className="name-item">{item.name}</div>
                            <div className="note pt-2">
                                <textarea className="form-control no-border" aria-label="With textarea" placeholder="Ghi chú"></textarea>
                            </div>
                            <div className="container-price-quantity">
                                <div className="price-quantity ">
                                    <div className="price">
                                        <span>Giá: {item.price}&nbsp;₫</span>
                                    </div>
                                    <div className="quantity-control">
                                        <div className="minus"><span><i className="bi bi-dash-lg"></i></span></div>
                                        <div className="quantity">1</div>
                                        <div className="plus"><span><i className="bi bi-plus-lg"></i></span></div>
                                    </div>
                                </div>
                                <div className="control-btn-add-to-cart">
                                    <button>Thêm vào giỏ hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDetail;

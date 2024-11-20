import React, { useState } from 'react';
import '../../assets/css/product_detail.css';
import ProductModel from '../../../../models/StaffModels/ProductModel';

interface ProductModalProps {
    product: ProductModel;
    onClose: () => void;
    incrementQuantity: (productId: number, note: string) => void;
    decrementQuantity: (productId: number, note: string) => void;
    cartItems: {
        product: ProductModel;
        quantity: number;
        note: string;
        totalPrice: number;
    }[];
}


const ProductModal: React.FC<ProductModalProps> = ({
    product,
    onClose,
    incrementQuantity,
    decrementQuantity,
    cartItems,
}) => {
    const [note, setNote] = useState('');

    // Tìm mục giỏ hàng dựa trên productId và note
    const cartItem = cartItems.find(
        (item) => item.product.productId === product.productId && item.note === note
    );

    const quantity = cartItem ? cartItem.quantity : 0;

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value);
    };

    return (
        <div className="ps36231 modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="container-modal">
                        <div className="container-modal-header">
                            <div className="control-img">
                                <img src={product.image} alt={product.productName} className="rounded" />
                                <div className="container-button d-grid place-item-center">
                                    <button type="button" className="btn-close" onClick={onClose}></button>
                                </div>
                            </div>
                        </div>
                        <div className="container-modal-footer">
                            <div className="name-item fw-bold">{product.productName}</div>
                            <div className="note pt-2">
                                <textarea
                                    className="form-control no-border"
                                    aria-label="With textarea"
                                    placeholder="Ghi chú"
                                    value={note}
                                    onChange={handleNoteChange}
                                ></textarea>
                            </div>
                            <div className="container-price-quantity mt-3">
                                <div className="price-quantity">
                                    <div className="price fw-bold">
                                        <span>Giá: {product.price.toLocaleString()} ₫</span>
                                    </div>
                                    <div className="quantity-control d-flex align-items-center pt-2">
                                        <button
                                            id="decrement"
                                            className="btn btn-primary btn-sm"
                                            onClick={() => decrementQuantity(product.productId, note)}
                                            disabled={quantity <= 0}
                                        >
                                            <i className="bi bi-dash-lg"></i>
                                        </button>
                                        <span className="mx-3 fs-5 text-dark">{quantity}</span>
                                        <button
                                            id="increment"
                                            className="btn btn-primary btn-sm"
                                            onClick={() => incrementQuantity(product.productId, note)}
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </div>
    );
};

export default ProductModal;



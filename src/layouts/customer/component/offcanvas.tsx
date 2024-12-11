import React, { useContext } from 'react';
import { CartContext } from "./CartContext";
import formatMoney from "./FormatMoney";
import { Link } from "react-router-dom";
import { Offcanvas } from 'react-bootstrap';

interface CartOffcanvasProps {
  show: boolean;
  onHide: () => void;
}

const CartOffcanvas: React.FC<CartOffcanvasProps> = ({ show, onHide }) => {
    const cartContext = useContext(CartContext);

    if (!cartContext) {
        return null; // Hoặc hiển thị một thông báo lỗi
    }

    const { cartItems, updateQuantity, removeFromCart, subtotal } = cartContext;

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Giỏ Hàng</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="cart-page tinh-overflowScroll" style={{ height: 400, overflowY: 'auto' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col" className="text-end">Thành tiền</th>
                                <th scope="col" className="text-end">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <tr key={item.productId}>
                                        <td className="cart-info d-flex align-items-center" style={{ width: '100%' }}>
                                            <img 
                                                src={item.image} 
                                                className="rounded me-2" 
                                                alt={item.productName} 
                                                width="80" 
                                            />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{item.productName}</p>
                                            </div>
                                        </td>
                                        <td style={{ width: '5%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => {
                                                    const newValue = Number(e.target.value);
                                                    const validValue = newValue <= 0 ? 1 : newValue;
                                                    updateQuantity(item.productId, validValue);
                                                }}
                                            />
                                        </td>
                                        <td className="text-end">{formatMoney(item.price * item.quantity)}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeFromCart(item.productId)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">Giỏ hàng của bạn đang trống.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="total-price d-flex justify-content-end mt-3">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Tổng tiền</td>
                                <td className="text-end fw-bold">{formatMoney(subtotal)} VND</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Link to="/checkout" onClick={onHide} className="btn btn-danger w-100 mt-3">Tiến hành thanh toán</Link>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CartOffcanvas;

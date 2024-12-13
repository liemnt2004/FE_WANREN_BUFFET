import React, { useContext } from 'react';
import { CartContext } from "./CartContext";
import formatMoney from "./FormatMoney";
import { Link } from "react-router-dom";
import { Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface CartOffcanvasProps {
  show: boolean;
  onHide: () => void;
}

const CartOffcanvas: React.FC<CartOffcanvasProps> = ({ show, onHide }) => {
    const cartContext = useContext(CartContext);
    const { t } = useTranslation();

    if (!cartContext) {
        return null;
    }

    const { cartItems, updateQuantity, removeFromCart, subtotal } = cartContext;

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{t('cart.title')}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="cart-page tinh-overflowScroll" style={{ height: 400, overflowY: 'auto' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">{t('cart.product')}</th>
                                <th scope="col">{t('cart.quantity')}</th>
                                <th scope="col" className="text-end">{t('cart.subtotal')}</th>
                                <th scope="col" className="text-end">{t('cart.action')}</th>
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
                                                {t('cart.delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">{t('cart.emptyCart')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="total-price d-flex justify-content-end mt-3">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>{t('cart.total')}</td>
                                <td className="text-end fw-bold">{formatMoney(subtotal)} {t('cart.currency')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Link to="/checkout" onClick={onHide} className="btn btn-danger w-100 mt-3">
                    {t('cart.checkout')}
                </Link>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CartOffcanvas;

import React, {useEffect, useState} from 'react';
import './assets/css/styles.css';
import './assets/css/cart.css';

// Interface mô tả cấu trúc của sản phẩm trong giỏ hàng
interface CartItem {
    productId: number;
    productName: string;
    price: number;
    image:string;
    quantity: number;
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load giỏ hàng từ session storage khi component được mount
    useEffect(() => {
        const storedCart = sessionStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Hàm lưu giỏ hàng vào session storage
    const saveCartToSession = (items: CartItem[]) => {
        sessionStorage.setItem('cartItems', JSON.stringify(items));
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const addItemToCart = (productId: number, productName: string,image:string, price: number) => {
        const existingProduct = cartItems.find((item) => item.productId === productId);

        if (existingProduct) {
            // Nếu sản phẩm đã có trong giỏ, tăng số lượng
            const updatedCart = cartItems.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updatedCart);
            saveCartToSession(updatedCart);
        } else {
            // Nếu chưa có, thêm sản phẩm mới
            const newItem = { productId, productName, price,image, quantity: 1 };
            const updatedCart = [...cartItems, newItem];
            setCartItems(updatedCart);
            saveCartToSession(updatedCart);
        }
    };

    // Hàm tăng số lượng sản phẩm
    const increaseQuantity = (productId: number) => {
        const updatedCart = cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCart);
        saveCartToSession(updatedCart);
    };

    // Hàm giảm số lượng sản phẩm
    const decreaseQuantity = (productId: number) => {
        const updatedCart = cartItems.map((item) =>
            item.productId === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setCartItems(updatedCart);
        saveCartToSession(updatedCart);
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeItemFromCart = (productId: number) => {
        const updatedCart = cartItems.filter((item) => item.productId !== productId);
        setCartItems(updatedCart);
        saveCartToSession(updatedCart);
    };

    // Hàm tính tổng tiền
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <section className="breadcrumb-section set-bg mt-5"
                         style={{ backgroundImage: `url(https://bizweb.dktcdn.net/100/140/774/themes/827866/assets/bg_breadcrumb.jpg?1726129051952)` }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <div className="breadcrumb__text">
                                    <h2>Cart</h2>
                                    <div className="breadcrumb__option">
                                        <a href="/">Home</a>
                                        <span>Cart</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="shopping-cart">
                    <table className="cart-table">
                        <thead>
                        <tr>
                            <th style={{ borderTopLeftRadius: '20px' }}>Món Ăn</th>
                            <th>Giá</th>
                            <th>Số Lượng</th>
                            <th style={{ borderTopRightRadius: '20px' }}>Xóa</th>
                        </tr>
                        </thead>
                        <tbody className="cart-items">
                        {cartItems.map((item) => (
                            <tr key={item.productId}>
                                <td className="product-info">
                                    <img src={item.image} alt={item.productName} className="product-image" />
                                    <span className="product-name"> {item.productName}</span>
                                </td>
                                <td className="product-price">{item.price.toLocaleString('vi-VN')}</td>
                                <td>
                                    <div className="quantity-control">
                                        <button className="decrease-btn" onClick={() => decreaseQuantity(item.productId)}>-</button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            className="quantity-input"
                                            readOnly
                                        />
                                        <button className="increase-btn" onClick={() => increaseQuantity(item.productId)}>+</button>
                                    </div>
                                </td>
                                <td>
                                    <span className="delete-btn" onClick={() => removeItemFromCart(item.productId)}>Xóa</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Total Price and Checkout Button */}
                    <div className="cart-footer d-flex flex-column align-items-end">
                        <div className="total-price mb-3">
                            <span className="total-label">Tổng tiền:</span>
                            <span className="total-amount">{calculateTotal().toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="action-buttons d-flex">
                            <button className="btn btn-outline-secondary me-2">Tiếp tục mua hàng</button>
                            <a href="/checkout">
                                <button className="btn btn-danger">Tiến hành thanh toán</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

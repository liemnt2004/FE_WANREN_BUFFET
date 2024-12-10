import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import { AuthContext } from "./component/AuthContext";
import './assets/css/menu.css';
import { CartContext } from './component/CartContext';
import { Offcanvas } from 'react-bootstrap';
import CartOffcanvas from "./component/offcanvas";

function MenuCustomer() {
    const { fullName } = useContext(AuthContext);
    const cartContext = useContext(CartContext);

    const [showOffcanvas, setShowOffcanvas] = useState(false);      // State cho menu
    const [showCartOffcanvas, setShowCartOffcanvas] = useState(false); // State cho giỏ hàng

    if (!cartContext) {
        return null;
    }

    function login() {
        window.location.href = "https://wanrenbuffet.netlify.app/login";
    }

    const handleShowMenu = () => setShowOffcanvas(true);
    const handleCloseMenu = () => setShowOffcanvas(false);

    const handleShowCart = () => setShowCartOffcanvas(true);
    const handleCloseCart = () => setShowCartOffcanvas(false);

    return (
        <nav className="menu-bar d-flex align-items-center">
            {/* Menu Icon */}
            <i
                className="bi bi-list"
                onClick={handleShowMenu}
            ></i>

            {/* Brand Logo */}
            <Link to="/" className="brand">
                <img src={logo} alt="WAREN BUFFET Logo" className="logo" />
            </Link>

            {/* Navigation Links */}
            <Link to="/menu" className="nav-link" onClick={handleCloseMenu}>Thực Đơn</Link>
            <Link to="/promotion" className="nav-link" onClick={handleCloseMenu}>Ưu Đãi</Link>
            <Link to="/reservation" className="btn-book" onClick={handleCloseMenu}>Đặt Bàn</Link>

            {/* Cart Icon */}
            <button
                className="cart btn p-0 border-0 bg-transparent"
                onClick={handleShowCart}
            >
                <div className="position-relative">
                    <i className="bi bi-bag cart-icon cursor-pointer"></i>
                    {cartContext?.cartItems?.length > 0 && (
                        <span className="position-absolute top-2 p-2 start-100 translate-middle badge badge-custom bg-danger rounded-circle">
                            {cartContext.cartItems.length}
                        </span>
                    )}
                </div>
            </button>

            {/* User Info */}
            <div className="d-flex align-items-center user">
                {fullName ? (
                    <>
                        <Link to="/profile" className="btn-user">
                            <i className="bi bi-person-fill"></i>
                        </Link>
                        <p style={{ margin: 0 }}>Xin chào, {fullName}</p>
                    </>
                ) : (
                    <>
                        <button onClick={login} className="btn-user">
                            <i className="bi bi-box-arrow-in-right"></i>
                        </button>
                        <p style={{ margin: 0 }}>Xin chào, Khách</p>
                    </>
                )}
            </div>

            {/* Offcanvas Sidebar Menu */}
            <Offcanvas show={showOffcanvas} onHide={handleCloseMenu} placement="start" id="offcanvasMenu">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Link
                        to="/menu"
                        className="nav-link nav-link-menu"
                        onClick={handleCloseMenu}
                    >
                        Thực Đơn
                    </Link>
                    <Link
                        to="/promotion"
                        className="nav-link nav-link-menu"
                        onClick={handleCloseMenu}
                    >
                        Ưu Đãi
                    </Link>
                    <Link
                        to="/reservation"
                        className="nav-link nav-link-menu"
                        onClick={handleCloseMenu}
                    >
                        Đặt Bàn
                    </Link>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Offcanvas Cart */}
            <CartOffcanvas show={showCartOffcanvas} onHide={handleCloseCart} />

        </nav>
    );
}

export default MenuCustomer;

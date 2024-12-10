import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import { AuthContext } from "./component/AuthContext";
import './assets/css/menu.css';
import { CartContext } from './component/CartContext';

function MenuCustomer() {
    const { fullName } = useContext(AuthContext);
    const closeRef = useRef<HTMLButtonElement>(null);  // Ref for the modal close button
    const cartContext = useContext(CartContext);

    if (!cartContext) {
        return null;
    }

    function login() {
        window.location.href = "https://wanrenbuffet.netlify.app/login";
    }

    // Close modal function
    const hideActiveModal = () => {
        const modal = document.getElementsByClassName('offcanvas show')[0];
        const fade = document.getElementsByClassName('offcanvas-backdrop show')[0];
        if (modal) modal.classList.remove('show');
        if (fade) fade.classList.remove('show');
    };

    const handleOffcanvasClose = () => {
        const backdrops = document.querySelectorAll('.offcanvas-backdrop');

        // If no backdrop, create one and add necessary classes
        if (backdrops.length === 0) {
            const newBackdrop = document.createElement('div');
            newBackdrop.classList.add('offcanvas-backdrop', 'fade', 'show');
            document.body.appendChild(newBackdrop);
        }

        // If more than 1 backdrop, remove the first one
        if (backdrops.length > 1) {
            backdrops[0].remove();
        }
    };

    return (
        <nav className="menu-bar d-flex align-items-center">
            {/* Menu Icon */}
            <i
                className="bi bi-list"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasMenu"
                aria-controls="offcanvasMenu"
                onClick={handleOffcanvasClose}
            ></i>

            {/* Brand Logo */}
            <Link to="/" className="brand">
                <img src={logo} alt="WAREN BUFFET Logo" className="logo" />
            </Link>

            {/* Navigation Links */}
            <Link to="/menu" className="nav-link" onClick={hideActiveModal}>Thực Đơn</Link>
            <Link to="/promotion" className="nav-link" onClick={hideActiveModal}>Ưu Đãi</Link>
            <Link to="/reservation" className="btn-book" onClick={hideActiveModal}>Đặt Bàn</Link>

            {/* Cart Icon */}
            <a
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasCart"
                aria-controls="offcanvasCart"
                className="cart"
                onClick={handleOffcanvasClose}
            >
                <div className="position-relative">
                    <i className="bi bi-bag cart-icon cursor-pointer"></i>
                    {cartContext?.cartItems?.length > 0 && (
                        <span className="position-absolute top-2 p-2 start-100 translate-middle badge badge-custom bg-danger rounded-circle">
                            {cartContext.cartItems.length}
                        </span>
                    )}
                </div>
            </a>


            {/* User Info */}
            <div className="d-flex align-items-center user">
                {fullName ? (
                    <>
                        <Link to="/profile" className="btn-user cursor-pointer">
                            <i className="bi bi-person-fill"></i>
                        </Link>
                        <p style={{ margin: 0 }}>Xin chào, {fullName}</p>
                    </>
                ) : (
                    <>
                        <a onClick={login} className="btn-user cursor-pointer">
                            <i className="bi bi-box-arrow-in-right"></i>
                        </a>
                        <p style={{ margin: 0 }}>Wanren Xin Chào!</p>
                    </>
                )}
            </div>

            {/* Offcanvas Sidebar Menu */}
            <div
                className="offcanvas offcanvas-start"
                tabIndex={-1}
                id="offcanvasMenu"
                aria-labelledby="offcanvasMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menu</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        ref={closeRef} // Correctly assign the ref here
                        onClick={hideActiveModal}  // Close modal when clicking the close button
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <Link
                        to="/menu"
                        className="nav-link nav-link-menu"
                        onClick={hideActiveModal}
                    >
                        Thực Đơn
                    </Link>
                    <Link
                        to="/promotion"
                        className="nav-link nav-link-menu"
                        onClick={hideActiveModal}
                    >
                        Ưu Đãi
                    </Link>
                    <Link
                        to="/reservation"
                        className="nav-link nav-link-menu"
                        onClick={hideActiveModal}
                    >
                        Đặt Bàn
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default MenuCustomer;

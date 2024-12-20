import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import { AuthContext } from "./component/AuthContext";
import './assets/css/menu.css';
import { CartContext } from './component/CartContext';
import { Offcanvas } from 'react-bootstrap';
import CartOffcanvas from "./component/offcanvas";
import LanguageSwitcher from "./component/LanguageSwitcher";
import { useTranslation } from 'react-i18next';
import ThemeToggle from "./ThemeToggle";
function MenuCustomer() {
    const { fullName } = useContext(AuthContext);
    const cartContext = useContext(CartContext);

    const [showOffcanvas, setShowOffcanvas] = useState(false);      // State cho menu
    const [showCartOffcanvas, setShowCartOffcanvas] = useState(false); // State cho giỏ hàng
    const { t } = useTranslation(); 
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
                <div className="logo" />
            </Link>

            {/* Navigation Links */}
            <Link to="/menu" className="nav-link" style={{color: 'var(--text-color)'}} onClick={handleCloseMenu}>{t('menu')}</Link>
            <Link to="/promotion" className="nav-link" style={{color: 'var(--text-color)'}} onClick={handleCloseMenu}>{t('promotion')}</Link>
            <Link to="/reservation" className="btn-book" style={{color: 'var(--text-color)', }} onClick={handleCloseMenu}>{t('reservation')}</Link>

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
                        <Link to="/profile" className="btn-user cursor-pointer">
                            <i className="bi bi-person-fill"></i>
                        </Link>
                        <p style={{ margin: 0 , color:'var(--text-color)'}}>{t('wellcome')}, {fullName}</p>
                    </>
                ) : (
                    <>
                        <button onClick={login} className="btn-user cursor-pointer">
                            <i className="bi bi-box-arrow-in-right"></i>
                        </button>
                        <p style={{ margin: 0 ,color:'var(--text-color)'}}>Wanren {t('wellcome')}!</p>
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
                        {t('menu')}
                    </Link>
                    <Link
                        to="/promotion"
                        className="nav-link nav-link-menu"
                        onClick={handleCloseMenu}
                    >
                        {t('promotion')}
                    </Link>
                    <Link
                        to="/reservation"
                        className="nav-link nav-link-menu"
                        onClick={handleCloseMenu}
                    >
                        {t('reservation')}
                    </Link>
                    <LanguageSwitcher></LanguageSwitcher>
                    <ThemeToggle></ThemeToggle>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Offcanvas Cart */}
            <CartOffcanvas show={showCartOffcanvas} onHide={handleCloseCart} />

        </nav>
    );
}

export default MenuCustomer;

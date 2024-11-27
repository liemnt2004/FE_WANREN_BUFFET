// src/layouts/customer/MenuCustomer.tsx
import React, {useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import { AuthContext } from "./component/AuthContext";
import './assets/css/menu.css';
function MenuCustomer() {
    const { fullName } = useContext(AuthContext);
    function  login() {
        window.location.href = "http://localhost:3000/login"
    }
    useEffect(() => {
        const handleOffcanvasClose = () => {
            const backdrops = document.querySelectorAll('.offcanvas-backdrop');
            backdrops.forEach((backdrop) => backdrop.remove());
        };

        document.addEventListener("hidden.bs.offcanvas", handleOffcanvasClose);

        return () => {
            document.removeEventListener("hidden.bs.offcanvas", handleOffcanvasClose);
        };
    }, []);
    return (

        <nav className="menu-bar d-flex align-items-center">
            {/* Menu Icon */}
            <i
                className="bi bi-list"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasMenu"
                aria-controls="offcanvasMenu"
            ></i>

            {/* Brand Logo */}
            <Link to="/" className="brand">
                <img src={logo} alt="WAREN BUFFET Logo" className="logo" />
            </Link>

            {/* Navigation Links (visible on medium to large screens) */}
            <Link to="/menu" className="nav-link">Thực Đơn</Link>
            <Link to="/promotion" className="nav-link">Ưu Đãi</Link>
            <Link to="/reservation" className="btn-book">Đặt Bàn</Link>

            {/* Cart Icon */}
            <a
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasCart"
                aria-controls="offcanvasCart"
            >
                <i className="bi bi-bag cart-icon"></i>
            </a>

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
                        <a  onClick={login} className="btn-user">
                            <i className="bi bi-box-arrow-in-right"></i>
                        </a>
                        <p style={{ margin: 0 }}>Xin chào, Khách</p>
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
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <Link
                        to="/menu"
                        className="nav-link nav-link-menu"
                    >
                        Thực Đơn
                    </Link>
                    <Link
                        to="/promotion"
                        className="nav-link nav-link-menu"
                    >
                        Ưu Đãi
                    </Link>
                    <Link
                        to="/reservation"
                        className="nav-link nav-link-menu"
                    >
                        Đặt Bàn
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default MenuCustomer;

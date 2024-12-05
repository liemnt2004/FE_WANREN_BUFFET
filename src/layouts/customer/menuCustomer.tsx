// src/layouts/customer/MenuCustomer.tsx
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import { AuthContext } from "./component/AuthContext";
import './assets/css/menu.css';
import { CartContext } from './component/CartContext';

function MenuCustomer() {
    const { fullName } = useContext(AuthContext);

    function login() {
        window.location.href = "https://wanrenbuffet.netlify.app/login";
    }

    const cartContext = useContext(CartContext);


        const handleOffcanvasClose = () => {
            const backdrops = document.querySelectorAll('.offcanvas-backdrop');

            // Nếu không có backdrop nào, tạo và thêm mới một cái với các lớp cần thiết
            if (backdrops.length === 0) {
                const newBackdrop = document.createElement('div');
                newBackdrop.classList.add('offcanvas-backdrop', 'fade', 'show');  // Thêm các lớp "fade" và "show"
                document.body.appendChild(newBackdrop);  // Thêm vào body hoặc nơi bạn muốn
            }

            // Nếu có nhiều hơn 1 backdrop, chỉ xóa phần tử đầu tiên
            if (backdrops.length > 1) {
                backdrops[0].remove();  // Xóa phần tử đầu tiên
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
                onClick={()=>handleOffcanvasClose()}
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
            {fullName ? (
                    <a
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                    className="cart"
                    onClick={()=>handleOffcanvasClose()}
                >
                    <div className="position-relative">
                        <i className="bi bi-bag cart-icon"></i>
                        <span className="position-absolute top-2 p-2 start-100 translate-middle badge bg-danger">
                            {cartContext?.cartItems.length}
                        </span>
                    </div>
                </a>
            ) : (
                <a
        
                className="cart"
            
            >
                <div className="position-relative">
                    <i className="bi bi-bag cart-icon"></i>
                    <span className="position-absolute top-2 p-2 start-100 translate-middle badge bg-danger">
                        {0}
                    </span>
                </div>
            </a>
            )}
            

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
                        <a onClick={login} className="btn-user">
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

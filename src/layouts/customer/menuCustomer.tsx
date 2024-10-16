import React from "react";
import logo from './assets/img/warenbuffet.png'

function MenuCustomer() {
    return (
        <nav className="menu-bar d-flex align-items-center">
            <i className="bi bi-list"></i>
            <a href="index.html" className="brand">
                <img src={logo} alt="WAREN BUFFET Logo" className="logo" />
            </a>
            <a href="menu1.html" className="nav-link">Thực Đơn</a>
            <a href="promotion.html" className="nav-link">Ưu Đãi</a>
            <a href="reservation.html" className="btn-book">Đặt Bàn</a>
            <a href="cart.html"><i className="bi bi-bag cart-icon"></i></a>

            <div className="d-flex align-items-center user">
                <a href="#" className="btn-user"><i className="bi bi-person-fill"></i></a>
                <p style={{ margin: 0 }}>Xin chào, Hoài Nam</p>
            </div>
        </nav>
    );
}

export default MenuCustomer;

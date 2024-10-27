// src/layouts/customer/MenuCustomer.tsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import {AuthContext} from "./component/AuthContext";


function MenuCustomer() {
    const { fullName } = useContext(AuthContext);

    return (
        <nav className="menu-bar d-flex align-items-center">
            <i className="bi bi-list"></i>
            <Link to="/" className="brand">
                <img src={logo} alt="WAREN BUFFET Logo" className="logo" />
            </Link>
            <Link to="/menu" className="nav-link">Thực Đơn</Link>
            <Link to="/promotion" className="nav-link">Ưu Đãi</Link>
            <Link to="/reservation" className="btn-book">Đặt Bàn</Link>
            <a data-bs-toggle="offcanvas"
               data-bs-target="#offcanvasCart"
               aria-controls="offcanvasCart">
                <i className="bi bi-bag cart-icon"></i>
            </a>

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
                        <Link to="/login" className="btn-user">
                            <i className="bi bi-box-arrow-in-right"></i>
                        </Link>
                        <p style={{ margin: 0 }}>Xin chào, Khách</p>
                    </>
                )}
            </div>
        </nav>
    );
}

export default MenuCustomer;

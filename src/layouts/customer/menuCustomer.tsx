import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './assets/img/warenbuffet.png';
import {jwtDecode} from "jwt-decode";


interface DecodedToken {
    sub: string;
    fullName: string;
    // Các trường khác nếu có
}

function MenuCustomer() {
    const [fullName, setFullName] = useState<string | null>(null);
    const navigate = useNavigate(); // Nếu bạn cần điều hướng sau khi đăng nhập

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                if (decoded.fullName) {
                    setFullName(decoded.fullName);
                } else {
                    setFullName(decoded.sub); // Fallback nếu fullName không có
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setFullName(null);
            }
        }
    }, []); // Thêm dependency array để useEffect chỉ chạy một lần khi component mount

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
               aria-controls="offcanvasCart"><i className="bi bi-bag cart-icon"></i></a>

            {
                fullName ? <div className="d-flex align-items-center user">
                    <Link to="/profile" className="btn-user"><i className="bi bi-person-fill"></i></Link>
                    <p style={{margin: 0}}>Xin chào, {fullName}</p>
                </div> : <div className="d-flex align-items-center user">
                    <Link to="/login" className="btn-user"><i className="bi bi-box-arrow-in-right"></i></Link>
                    <p style={{margin: 0}}>Đăng Nhập</p>
                </div>
            }

        </nav>
    );
}

export default MenuCustomer;

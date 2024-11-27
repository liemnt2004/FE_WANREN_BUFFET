// src/pages/LoginSuccess.js

import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const LoginSuccess = () => {
    const history = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("token", token);  // Lưu token vào localStorage

            // Chuyển hướng đến trang dashboard hoặc trang chính
            window.location.href = "http://localhost:3000/"// Hoặc trang khác mà bạn muốn người dùng chuyển đến
        } else {
            // Nếu không có token, có thể chuyển hướng về trang lỗi hoặc trang đăng nhập
            history("/login");
        }
    }, [history]);

    return (
        <div>
            <h1>Đang xử lý đăng nhập...</h1>
        </div>
    );
};

export default LoginSuccess;

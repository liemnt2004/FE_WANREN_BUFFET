// src/components/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Nếu bạn sử dụng React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Nếu bạn cài đặt Bootstrap qua npm

const NotFoundPage: React.FC = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3">
                    <span className="text-danger">Opps!</span> Page not found.
                </p>
                <p className="lead">
                    The page you’re looking for doesn’t exist.
                </p>
                {/* Sử dụng Link từ react-router-dom để chuyển hướng mà không reload lại trang */}

                {/* Nếu bạn không sử dụng React Router, bạn có thể sử dụng thẻ <a> như trong HTML gốc */}
                {/* <a href="/" className="btn btn-primary">Go Home</a> */}
            </div>
        </div>
    );
};

export default NotFoundPage;

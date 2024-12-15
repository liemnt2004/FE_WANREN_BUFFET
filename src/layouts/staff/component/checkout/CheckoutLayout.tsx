import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const CheckoutLayout: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('selected-theme') || 'light');
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
    }, [theme]);
    return (
        <div className="checkout-layout">
            {/* Đây là nơi các trang checkout con (Checkout1, Checkout2, Checkout3) sẽ được render */}
            <Outlet />
        </div>
    );
};

export default CheckoutLayout;

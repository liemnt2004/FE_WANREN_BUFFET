import React from "react";
import { Outlet } from "react-router-dom";

const CheckoutLayout: React.FC = () => {
    return (
        <div className="checkout-layout">
            {/* Đây là nơi các trang checkout con (Checkout1, Checkout2, Checkout3) sẽ được render */}
            <Outlet />
        </div>
    );
};

export default CheckoutLayout;

import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import MenuCustomer from "./layouts/customer/menuCustomer";
import MenuProductCustomer from "./layouts/customer/menuProductCustomer";
import IndexCustomer from "./layouts/customer/indexCustomer";
import ReservationForm from "./layouts/customer/reservationCustomer";
import PromotionCustomer from "./layouts/customer/promotionCustomer";
import MenuProfile from "./layouts/customer/profileCustomer";

import LoginRegisterComponent from "./layouts/customer/SignIn";
import Offcanvas from "./layouts/customer/offcanvas";
import {CartProvider} from "./layouts/customer/CartContext";
import CartOffcanvas from "./layouts/customer/offcanvas";


function App() {
    return(
        <CartProvider>
            <Router>
                <Routing/>
            </Router>
        </CartProvider>

    )

}

export function Routing() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isLoginRoute = location.pathname === "/login"; // Kiểm tra nếu đường dẫn là "/login"
    const isRegisterRoute = location.pathname === "/register";

    return (
        <>
            {/* Hiển thị MenuCustomer nếu không phải là trang admin hoặc login */}
            {!isAdminRoute && !isLoginRoute && !isRegisterRoute && <MenuCustomer />}

            {/* Định nghĩa các Routes */}
            <Routes>
                <Route path="/" element={<IndexCustomer />} />
                <Route path="/menu" element={<MenuProductCustomer />} />
                <Route path="/admin" element={<MenuProductCustomer />} />
                <Route path="/reservation" element={<ReservationForm />} />
                <Route path="/promotion" element={<PromotionCustomer />} />

                <Route path="/profile" element={<MenuProfile />} />
                <Route path="/login" element={<LoginRegisterComponent />} />
                <Route path="/register" element={<LoginRegisterComponent />} />

            </Routes>

            {/* Bao gồm CartOffcanvas để nó có sẵn trên tất cả các trang */}
            <CartOffcanvas />
        </>
    );
}


export default App;

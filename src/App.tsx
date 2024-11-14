import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuCustomer from "./layouts/customer/menuCustomer";
import MenuProductCustomer from "./layouts/customer/menuProductCustomer";
import IndexCustomer from "./layouts/customer/indexCustomer";
import ReservationForm from "./layouts/customer/reservationCustomer";
import PromotionCustomer from "./layouts/customer/promotionCustomer";
import MenuProfile from "./layouts/customer/profileCustomer";
import LoginRegisterComponent from "./layouts/customer/SignIn";
import CartOffcanvas from "./layouts/customer/component/offcanvas";
import { CartProvider } from "./layouts/customer/component/CartContext";
import { AuthProvider, AuthContext } from "./layouts/customer/component/AuthContext";
import PublicRoute from "./layouts/customer/component/PublicRoute";
import Checkout from "./layouts/customer/CheckoutCustomer";
import PromotionDetail from "./layouts/customer/PromotionDetail";
import Forgotpassword from "./layouts/customer/forgotpassword";
import EnterOtp from "./layouts/customer/EnterOtp";
import ResetPasswordOtp from "./layouts/customer/ResetPasswordOtp";
import PrivateRoute from "./layouts/PrivateRoute";
import EmployeeLoginComponent from "./layouts/EmployeeLoginComponent";
import EmployeePublicRoute from "./layouts/EmployeePublicRoute";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routing />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}
export default App;


export function Routing() {
    const hiddenRoutes = ['/admin', '/login', '/register', '/employee/login'];

    return (
        <>
            {/* Hiển thị MenuCustomer trừ khi ở các routes ẩn */}
            {!hiddenRoutes.includes(window.location.pathname) && <MenuCustomer />}

            <Routes>
                {/* Các route công khai */}
                <Route path="/" element={<IndexCustomer />} />
                <Route path="/menu" element={<MenuProductCustomer />} />
                <Route path="/reservation" element={<ReservationForm />} />
                <Route path="/promotion" element={<PromotionCustomer />} />
                <Route path="/forgot-password" element={<Forgotpassword />} />
                <Route path="/enter-otp" element={<EnterOtp />} />
                <Route path="/reset-password" element={<ResetPasswordOtp />} />
                <Route path="/promotion_detail/:id" element={<PromotionDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<MenuProfile />} />

                {/* Bảo vệ route login và register cho khách hàng */}
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginRegisterComponent />
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <LoginRegisterComponent />
                    </PublicRoute>
                } />

                {/* Route đăng nhập cho nhân viên */}
                <Route path="/employee/login" element={
                    <EmployeePublicRoute>
                        <EmployeeLoginComponent />
                    </EmployeePublicRoute>
                } />

                {/* Route dành cho nhân viên */}
                <Route path="/employee" element={
                    <PrivateRoute allowedRoles={['EMPLOYEE', 'MANAGER']}>
                        <IndexCustomer />
                    </PrivateRoute>
                } />

                {/* Route dành cho quản lý */}
                <Route path="/manager" element={
                    <PrivateRoute allowedRoles={['MANAGER']}>
                        <IndexCustomer />
                    </PrivateRoute>
                } />

                {/* Trang không có quyền truy cập */}
                <Route path="/unauthorized" element={<IndexCustomer />} />

                {/* Route không tìm thấy */}
                <Route path="*" element={<IndexCustomer />} />
            </Routes>

            {/* Bao gồm CartOffcanvas trên tất cả các trang */}
            <CartOffcanvas />
        </>
    );
}




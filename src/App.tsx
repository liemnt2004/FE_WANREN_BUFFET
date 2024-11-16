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
import AdminLayout from "./layouts/ADMIN/AdminLayout";
import CustomerManagement from "./layouts/ADMIN/customermanagement";
import MenuAdmin from "./layouts/ADMIN/menuAdmin";
import StaffLayout from "./layouts/ADMIN/StaffLayout";
import EmployeeManagement from "./layouts/ADMIN/employeemanagement";
import MainDash from "./layouts/ADMIN/Dashboard";
import NotFoundPage from "./layouts/404";

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
    const hiddenRoutes = ['/admin', '/login', '/register', '/employee/login' , '/staff/employees' , '/staff' , "/admin/manage-work-shifts"];

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
                <Route path="/staff" element={
                    <PrivateRoute allowedRoles={['STAFF', 'ADMIN']}>
                        <IndexCustomer/>
                    </PrivateRoute>
                } />



                {/* Route dành cho quản lý */}
                <Route path="/cashier" element={
                    <PrivateRoute allowedRoles={['CASHIER','ADMIN']}>
                        <IndexCustomer />
                    </PrivateRoute>
                } />

                <Route path="/admin" element={
                    <PrivateRoute allowedRoles={['ADMIN']}>
                        <StaffLayout />
                    </PrivateRoute>
                } >
                    <Route index element={<MainDash />} /> {/* Default */}
                    <Route path="/admin/customers" element={<CustomerManagement />} />
                    <Route path="/admin/employees" element={<EmployeeManagement />} />
                    <Route path="/admin/dashboard" element={<MainDash />} />
                 </Route>



                {/* Route không tìm thấy */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Bao gồm CartOffcanvas trên tất cả các trang */}
            <CartOffcanvas />
        </>
    );
}




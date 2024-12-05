import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuCustomer from "./layouts/customer/menuCustomer";
import MenuProductCustomer from "./layouts/customer/menuProductCustomer";
import IndexCustomer from "./layouts/customer/indexCustomer";
import ReservationForm from "./layouts/customer/reservationCustomer";
import PromotionCustomer from "./layouts/customer/promotionCustomer";
import MenuProfile from "./layouts/customer/profileCustomer";
import LoginRegisterComponent from "./layouts/customer/SignIn";
import CartOffcanvas from "./layouts/customer/component/offcanvas";
import { CartProvider } from "./layouts/customer/component/CartContext";
import {
  AuthProvider,
  AuthContext,
} from "./layouts/customer/component/AuthContext";
import PublicRoute from "./layouts/customer/component/PublicRoute";
import Checkout from "./layouts/customer/CheckoutCustomer";
import PromotionDetail from "./layouts/customer/PromotionDetail";
import Forgotpassword from "./layouts/customer/forgotpassword";
import EnterOtp from "./layouts/customer/EnterOtp";
import ResetPasswordOtp from "./layouts/customer/ResetPasswordOtp";
import PrivateRoute from "./layouts/PrivateRoute";
import EmployeeLoginComponent from "./layouts/EmployeeLoginComponent";
import EmployeePublicRoute from "./layouts/EmployeePublicRoute";
import CustomerManagement from "./layouts/ADMIN/customermanagement";
import MenuAdmin from "./layouts/ADMIN/menuAdmin";
import StaffLayout from "./layouts/ADMIN/StaffLayout";
import EmployeeManagement from "./layouts/ADMIN/employeemanagement";
import MainDash from "./layouts/ADMIN/Dashboard";
import NotFoundPage from "./layouts/404";
import Management from "./layouts/ADMIN/manager";
import PromotionManagement from "./layouts/ADMIN/promotionManagement";
import StaffIndex from "./layouts/staff/component/StaffIndex";
import CheckoutLayout from "./layouts/staff/component/checkout/CheckoutLayout";
import Checkout1 from "./layouts/staff/component/checkout/Checkout1";
import Checkout2 from "./layouts/staff/component/checkout/Checkout2";
import Checkout3 from "./layouts/staff/component/checkout/Checkout3";
import ProductManagement from "./layouts/ADMIN/ProductManagement";
import OrderOnTable from "./layouts/staff/component/orderOnTable/Order";
import WorkShift from "./layouts/ADMIN/WorkShift";
import LoginSuccess from "./layouts/customer/LoginSuccess";
import CheckoutSucess from "./layouts/staff/component/checkout/CheckoutSucess";
import CheckoutFailed from "./layouts/staff/component/checkout/CheckoutFailed";
import MainLayoutCashier from "./layouts/cashier/mainLayoutCashier";
import ManagementTableCashier from "./layouts/cashier/managementTableCashier";
import ManagementFoodCashier from "./layouts/cashier/managementFoodCashier";
import ManagementOrdersOnlCashier from "./layouts/cashier/managementOrdersOnlCashier";
import ManagementReservationCashier from "./layouts/cashier/managementReservationCashier";
import DashboardCashier from "./layouts/cashier/dashboardCashier";

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
  const isHiddenRoute = (pathname: string) => {
    return hiddenRoutes.some(
      (route) =>
        pathname === route ||
        (route === "/orderOnTable" && /^\/orderOnTable\/\d+$/.test(pathname)) ||
        (route === "/checkout" && /^\/checkout\/step[1-3]$/.test(pathname)) ||
        (route === "/checkout" && /^\/checkout\/sucessful/.test(pathname)) ||
        (route === "/checkout" && /^\/checkout\/failed/.test(pathname)) ||
        (route === "/cashier" && /^\/cashier\/.+$/.test(pathname))
    );
  };
  const hiddenRoutes = [
    "/admin",
    "/login",
    "/register",
    "/employee/login",
    "/staff/employees",
    "/staff",
    "/admin/manage-work-shifts",
    "/admin/manage-promotions",
    "/admin/manage-accounts",
    "/admin/customers",
    "/admin/employees",
    "/admin/dashboard",
    "/orderOnTable",
    "/checkout",
    "/admin/manage-product",
    "/cashier",
  ];

  return (
    <>
      {/* Hiển thị MenuCustomer trừ khi ở các routes ẩn */}
      {!isHiddenRoute(window.location.pathname) && <MenuCustomer />}

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
        <Route path="/login-success" element={<LoginSuccess />} />

        {/* Bảo vệ route login và register cho khách hàng */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginRegisterComponent />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <LoginRegisterComponent />
            </PublicRoute>
          }
        />

        {/* Route đăng nhập cho nhân viên */}
        <Route
          path="/employee/login"
          element={
            <EmployeePublicRoute>
              <EmployeeLoginComponent />
            </EmployeePublicRoute>
          }
        />

        {/* Route dành cho nhân viên */}
        <Route path="/orderOnTable" element={<OrderOnTable />} />
        <Route path="/checkout" element={<CheckoutLayout />}>
          <Route path="step1" element={<Checkout1 />} />
          <Route path="step2" element={<Checkout2 />} />
          <Route path="step3" element={<Checkout3 />} />
          <Route path="sucessful" element={<CheckoutSucess />} />
          <Route path="failed" element={<CheckoutFailed />} />
        </Route>
        <Route
          path="/staff"
          element={
            <PrivateRoute allowedRoles={["STAFF", "ADMIN"]}>
              <StaffIndex />
            </PrivateRoute>
          }
        />

        {/* Route dành cho quản lý */}
        <Route
          path="/cashier"
          element={
            <PrivateRoute allowedRoles={["CASHIER", "ADMIN"]}>
              <MainLayoutCashier />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardCashier />} />
          <Route path="table" element={<ManagementTableCashier />} />
          <Route path="food" element={<ManagementFoodCashier />} />
          <Route path="ordersOnline" element={<ManagementOrdersOnlCashier />} />
          <Route
            path="reservation"
            element={<ManagementReservationCashier />}
          />
        </Route>

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <StaffLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<MainDash />} /> {/* Default */}
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/employees" element={<EmployeeManagement />} />
          <Route path="/admin/dashboard" element={<MainDash />} />
          <Route
            path="/admin/manage-promotions"
            element={<PromotionManagement />}
          />
          <Route path="/admin/manage-product" element={<ProductManagement />} />
          <Route path="/admin/manage-accounts" element={<Management />} />
          <Route path="/admin/manage-work-shifts" element={<WorkShift />} />
        </Route>

        {/* Route không tìm thấy */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Bao gồm CartOffcanvas trên tất cả các trang */}
      <CartOffcanvas />
    </>
  );
}

import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import WorkShift from "./layouts/ADMIN/workshiftManagement";
import LoginCashier from "./layouts/cashier/loginCashier";
import MainLayoutCashier from "./layouts/cashier/mainLayoutCashier";
import DashboardCashier from "./layouts/cashier/dashboardCashier";
import ManagementTableCashier from "./layouts/cashier/managementTableCashier";
import ManagementFoodCashier from "./layouts/cashier/managementFoodCashier";
import ManagementOrdersOnlCashier from "./layouts/cashier/managementOrdersOnlCashier";
import { useLocation } from "react-router-dom";
import { ProductsProvider } from "./layouts/cashier/component/ProductsContext";

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
  const location = useLocation();

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
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const cashierRoutes = [
    "/cashier",
    "/cashier/orders",
    "/cashier/dashboard",
    "/cashier/table",
    "/cashier/food",
    "/cashier/ordersOnline",
  ];
  const cashierExcludedRoutes = ["/cashier/login"];

  // Kiểm tra nếu đường dẫn là /cashier/login thì không hiển thị menu nào
  if (cashierExcludedRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route
          path="/cashier/login"
          element={
            !isLoggedIn ? (
              <LoginCashier
                onLoginSuccess={function (): void {
                  setIsLoggedIn(true);
                  <Navigate to="/cashier" />;
                  throw new Error("Function not implemented.");
                }}
              />
            ) : (
              <Navigate to="/cashier" />
            )
          }
        />
      </Routes>
    );
  }

  if (cashierRoutes.includes(location.pathname)) {
    return (
      <ProductsProvider>
        <Routes>
          <Route
            path="/cashier"
            element={
              isLoggedIn ? (
                <MainLayoutCashier />
              ) : (
                <Navigate to="/cashier/login" />
              )
            }
          >
            <Route index element={<DashboardCashier />} />
            {/* Thêm các tuyến khác cho cashier */}
            <Route path="table" element={<ManagementTableCashier />} />
            <Route path="food" element={<ManagementFoodCashier />} />
            <Route
              path="ordersOnline"
              element={<ManagementOrdersOnlCashier />}
            />
          </Route>
        </Routes>
      </ProductsProvider>
    );
  }

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
        <Route
          path="/staff"
          element={
            <PrivateRoute allowedRoles={["STAFF", "ADMIN"]}>
              <IndexCustomer />
            </PrivateRoute>
          }
        />

        {/* Route dành cho quản lý */}
        <Route
          path="/cashier"
          element={
            <PrivateRoute allowedRoles={["CASHIER", "ADMIN"]}>
              <IndexCustomer />
            </PrivateRoute>
          }
        />

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

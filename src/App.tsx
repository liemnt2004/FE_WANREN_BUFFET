import React, { useContext } from "react";
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
import CustomerManagement from "./layouts/ADMIN/customermanagement";
import EmployeeManagement from "./layouts/ADMIN/employeemanagement";
import MenuAdmin from "./layouts/ADMIN/menuAdmin";
import MainLayoutCashier from "./layouts/cashier/mainLayoutCashier";
import ManagementTableCashier from "./layouts/cashier/managementTableCashier";
import ManagementFoodCashier from "./layouts/cashier/managementFoodCashier";
import DashboardCashier from "./layouts/cashier/dashboardCashier";
import WorkShift from "./layouts/ADMIN/workshiftManagement";
import PromotionManagement from "./layouts/ADMIN/promotionManagement";
import Management from "./layouts/ADMIN/manager";
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

export function Routing() {
  const hiddenRoutes = ["/admin", "/login", "/register"];
  const hiddenRoutesAdmin = [
    "/admin",
    "/admin/customermanagement",
    "/admin/employeemanagement",
    "/admin/workshift",
    "/admin/managepromotions",
    "/admin/manageaccounts",
  ];
  const cashierRoutes = [
    "/cashier",
    "/cashier/orders",
    "/cashier/dashboard",
    "/cashier/table",
    "/cashier/food",
  ];

  return (
    <>
      {/* Display MenuCustomer unless on hidden routes */}
      {!(
        hiddenRoutes.includes(window.location.pathname) ||
        hiddenRoutesAdmin.includes(window.location.pathname) ||
        cashierRoutes.includes(window.location.pathname)
      ) && <MenuCustomer />}
      {/* Admin */}
      {hiddenRoutesAdmin.includes(window.location.pathname) && <MenuAdmin />}
      {/* Define routes */}
      <Routes>
        <Route path="/" element={<IndexCustomer />} />
        <Route path="/menu" element={<MenuProductCustomer />} />
        <Route path="/admin" element={<MenuProductCustomer />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/promotion" element={<PromotionCustomer />} />
        <Route path="/promotion_detail/:id" element={<PromotionDetail />} />
        {/* Fixed route path */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<MenuProfile />} />
        {/* Protect login and register routes */}
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
        {/* Admin */}
        <Route
          path="/admin/customermanagement"
          element={<CustomerManagement />}
        />
        <Route
          path="/admin/employeemanagement"
          element={<EmployeeManagement />}
        />
        <Route path="/admin/workshift" element={<WorkShift />} />
        <Route
          path="/admin/managepromotions"
          element={<PromotionManagement />}
        />
        <Route path="/admin/manageaccounts" element={<Management />} />
        {/* <Route path="/admin/workshift" element={<WorkShift />} /> */}
      </Routes>
      {/* cashier */}
      <Routes>
        <Route path="/cashier" element={<MainLayoutCashier />}>
          <Route index element={<DashboardCashier />} />
          {/* Thêm các tuyến khác cho cashier */}
          <Route path="table" element={<ManagementTableCashier />} />
          <Route path="food" element={<ManagementFoodCashier />} />
        </Route>
      </Routes>

      {/* Include CartOffcanvas on all pages */}
      <CartOffcanvas />
    </>
  );
}

export default App;

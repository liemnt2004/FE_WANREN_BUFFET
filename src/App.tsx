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
import { AuthProvider } from "./layouts/customer/component/AuthContext";
import PublicRoute from "./layouts/customer/component/PublicRoute";
import Checkout from "./layouts/customer/CheckoutCustomer";
import Employeemanagement from "./layouts/ADMIN/employeemanagement";
import CustommerManagement from "./layouts/ADMIN/customermanagement";
import MenuAdmin from "./layouts/ADMIN/menuAdmin";
import AdminLayout from "./layouts/ADMIN/AdminLayout";

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
  const hiddenRoutes = [
    "/admin",
    "/login",
    "/register",
    "/admin/employeemanagement",
    "/admin/customermanagement",
  ];

  return (
    <>
      {/* Display MenuCustomer unless on hidden routes */}
      {hiddenRoutes.includes(window.location.pathname) ? (
        <MenuAdmin />
      ) : (
        <MenuCustomer />
      )}

      {/* Define routes */}
      <Routes>
        <Route path="/" element={<IndexCustomer />} />
        <Route path="/menu" element={<MenuProductCustomer />} />
        <Route path="/admin" element={<MenuProductCustomer />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/promotion" element={<PromotionCustomer />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<MenuProfile />} />

        {/* Sử dụng AdminLayout cho các Route của admin */}
        <Route
          path="/admin/employeemanagement"
          element={
            <AdminLayout>
              <Employeemanagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/customermanagement"
          element={
            <AdminLayout>
              <CustommerManagement />
            </AdminLayout>
          }
        />

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
      </Routes>

      {/* Include CartOffcanvas on all pages */}
      <CartOffcanvas />
    </>
  );
}

export default App;

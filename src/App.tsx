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

  return (
    <>
      {/* Display MenuCustomer unless on hidden routes */}
      {!hiddenRoutes.includes(window.location.pathname) && <MenuCustomer />}

      {/* Define routes */}
      <Routes>
        <Route path="/" element={<IndexCustomer />} />
        <Route path="/menu" element={<MenuProductCustomer />} />
        <Route path="/admin" element={<MenuProductCustomer />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/promotion" element={<PromotionCustomer />} />
        <Route
          path="/promotion_detail/:id"
          element={<PromotionDetail />}
        />{" "}
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
      </Routes>

      {/* Include CartOffcanvas on all pages */}
      <CartOffcanvas />
    </>
  );
}

export default App;

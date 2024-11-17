import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  RouteObject,
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import MenuCustomer from "./layouts/customer/menuCustomer";
import MenuProductCustomer from "./layouts/customer/menuProductCustomer";
import IndexCustomer from "./layouts/customer/indexCustomer";
import ReservationForm from "./layouts/customer/reservationCustomer";
import PromotionCustomer from "./layouts/customer/promotionCustomer";
import MenuProfile from "./layouts/customer/profileCustomer";
import LoginRegisterComponent from "./layouts/customer/SignIn";
import CartOffcanvas from "./layouts/customer/component/offcanvas";
import Checkout from "./layouts/customer/CheckoutCustomer";
import Employeemanagement from "./layouts/ADMIN/employeemanagement";
import CustommerManagement from "./layouts/ADMIN/customermanagement";
import MenuAdmin from "./layouts/ADMIN/menuAdmin";
import AdminLayout from "./layouts/ADMIN/AdminLayout";
import DashboardCashier from "./layouts/cashier/dashboardCashier";
import { CartProvider } from "./layouts/customer/component/CartContext";
import MenuCashier from "./layouts/cashier/component/menuCashier";
import LoginCashier from "./layouts/cashier/loginCashier";
import MainLayoutCashier from "./layouts/cashier/mainLayoutCashier";
import ManagementTableCashier from "./layouts/cashier/managementTableCashier";
import ManagementFoodCashier from "./layouts/cashier/managementFoodCashier";
import ManagementOrdersOnlCashier from "./layouts/cashier/managementOrdersOnlCashier";
import Header from "./layouts/staff/component/Header";
import Sidebar from "./layouts/staff/component/Sidebar";
import MainContent from "./layouts/staff/component/MainContent";
import OrderOnTable from "./layouts/staff/component/orderOnTable/orderOnTable";
import CheckoutLayout from "./layouts/staff/component/checkout/CheckoutLayout";
import Checkout1 from "./layouts/staff/component/checkout/Checkout1";
import Checkout2 from "./layouts/staff/component/checkout/Checkout2";
import Checkout3 from "./layouts/staff/component/checkout/Checkout3";
import TableModal from "./layouts/staff/component/TableModal";

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Tạo ngữ cảnh (context) cho AuthContext với giá trị mặc định undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo hook để sử dụng AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Định nghĩa kiểu dữ liệu cho props của AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component cung cấp trạng thái và các hàm liên quan đến xác thực
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hàm đăng nhập/đăng xuất giả lập
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Component chính của ứng dụng
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

// Component Routing để định nghĩa các tuyến đường và hiển thị menu tương ứng
function Routing() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Các tuyến đường dành riêng cho admin
  const adminRoutes = [
    "/admin", "/admin/employeemanagement",
    "/admin/customermanagement",
  ];
  const cashierRoutes = ["/cashier", "/cashier/orders", "/cashier/dashboard", "/cashier/table", "/cashier/food", "/cashier/ordersOnline"];
  const cashierExcludedRoutes = ["/cashier/login"];

  // Đối tượng ánh xạ các component menu
  const menuComponents = {
    admin: <MenuAdmin />,
    cashier: <MenuCashier />,
    customer: <MenuCustomer />,
  };




  // Xác định loại menu dựa trên đường dẫn hiện tại
  const menuType = adminRoutes.includes(location.pathname)
    ? "admin"
    : cashierRoutes.includes(location.pathname)
      ? "cashier"
      : "customer";







  // phần routes của cashier v





  // Kiểm tra nếu đường dẫn là /cashier/login thì không hiển thị menu nào
  if (cashierExcludedRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/cashier/login" element={!isLoggedIn ? <LoginCashier onLoginSuccess={function (): void {
          setIsLoggedIn(true);
          <Navigate to="/cashier" />
          throw new Error("Function not implemented.");
        }} /> : <Navigate to="/cashier" />} />
      </Routes>
    );
  }







  if (cashierRoutes.includes(location.pathname)) {
    return (
      <Routes>


        <Route path="/cashier" element={isLoggedIn ? <MainLayoutCashier /> : <Navigate to="/cashier/login" />}>
          <Route index element={<DashboardCashier />} />
          {/* Thêm các tuyến khác cho cashier */}
          <Route path="table" element={<ManagementTableCashier />} />
          <Route path="food" element={<ManagementFoodCashier />} />
          <Route path="ordersOnline" element={<ManagementOrdersOnlCashier />} />
        </Route>




      </Routes>
    );
  }




  // phần routes của cashier ^
  type ContentType = 'home' | '2nd_floor' | 'gdeli' | 'setting';

  const selectedContent = 'home';

  const handleSidebarClick = (contentType: ContentType) => {

  };


  return (


    <>
      {/* Hiển thị MenuAdmin nếu là các đường dẫn của admin, ngược lại hiển thị MenuCustomer */}
      {/* {menuComponents[menuType]} */}

      {/* Định nghĩa các tuyến đường */}

      <div>
        <Routes>
          <Route path="/staff" element={<><Header toggleId="header-toggle" /><Sidebar onClickContent={handleSidebarClick} /><MainContent content={selectedContent} /></>} />
          <Route path="/orderOnTable/:tableId" element={<OrderOnTable />} />


          <Route path="/checkout/order/:orderId" element={<CheckoutLayout />}>
            <Route path="step1" element={<Checkout1 />} />
            <Route path="step2" element={<Checkout2 />} />
            <Route path="step3" element={<Checkout3 />} />
          </Route>
        </Routes>
        <TableModal />
      </div>

      <Routes>
        {/* Tuyến đường công khai cho trang chủ */}
        <Route path="/" element={<IndexCustomer />} />

        {/* Các tuyến đường công khai khác */}
        <Route path="/menu" element={<MenuProductCustomer />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/promotion" element={<PromotionCustomer />} />



        {/* Các tuyến đường yêu cầu xác thực */}
        <Route
          path="/checkout"
          element={
            isAuthenticated ? <Checkout /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <MenuProfile /> : <Navigate to="/login" replace />
          }
        />

        {/* Các tuyến đường của admin sử dụng AdminLayout */}
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

        {/* Các tuyến đường công khai cho đăng nhập và đăng ký */}
        <Route path="/login" element={<LoginRegisterComponent />} />
        <Route path="/register" element={<LoginRegisterComponent />} />
      </Routes>

      {/* Hiển thị CartOffcanvas trên tất cả các trang */}
      <CartOffcanvas />
    </>
  );
}

export default App;
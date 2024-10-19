import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import MenuCustomer from "./layouts/customer/menuCustomer";
import MenuProductCustomer from "./layouts/customer/menuProductCustomer";
import IndexCustomer from "./layouts/customer/indexCustomer";
import ReservationForm from "./layouts/customer/reservationCustomer";
import PromotionCustomer from "./layouts/customer/promotionCustomer";
import Cart from "./layouts/customer/cartCustomer";
import MenuProfile from "./layouts/customer/profileCustomer";


function App() {
    return(
        <Router>
            <Routing/>
        </Router>
    )

}

export function Routing() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isLoginRoute = location.pathname === "/login"; // Check if the path is "/login"

    return (
        <>

            {!isAdminRoute && !isLoginRoute && <MenuCustomer />}

            <Routes>
                <Route path="/" element={<IndexCustomer />} />
                <Route path="/menu" element={<MenuProductCustomer />} />
                <Route path="/admin" element={<MenuProductCustomer />} />
                <Route path="/reservation" element={<ReservationForm/>}></Route>
                <Route path="/promotion" element={<PromotionCustomer/>}></Route>
                <Route path="/cart" element={<Cart/>}></Route>
                <Route path="/profile" element={<MenuProfile/>}></Route>
            </Routes>
        </>
    );
}


export default App;

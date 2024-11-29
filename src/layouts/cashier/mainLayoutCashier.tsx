import { Outlet } from "react-router-dom";
import MenuCashier from "./component/menuCashier";
import SidebarCashier from "./component/sidebarCashier";
import ProductList from "./component/ProductList";
import { ProductsProvider } from "./component/ProductsContext";

const mainLayoutCashier = () => {
  return (
    <ProductsProvider>
      <div className="container-fuild" style={{ backgroundColor: "#f7f7f1" }}>
        <MenuCashier />
        <div className="row m-0" style={{ minHeight: "86vh" }}>
          <div className="col-2 p-0">
            <SidebarCashier />
          </div>
          <div className="col-10 p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </ProductsProvider>
  );
};
export default mainLayoutCashier;

import { Outlet } from "react-router-dom";
import MenuCashier from "./component/menuCashier";
import { ProductsProvider } from "./component/ProductsContext";
import SidebarCashier from "./component/sidebarCashier";

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

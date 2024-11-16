import { Outlet } from "react-router-dom";
import MenuCashier from "./component/menuCashier";
import SidebarCashier from "./component/sidebarCashier";
import ProductList from "./component/ProductList";

const mainLayoutCashier = () => {
    return(
        <div className="container-fuild" style={{backgroundColor: '#f7f7f1'}}>
            <MenuCashier />
            <div className="row">
                <div className="col-2 p-0"><SidebarCashier /></div>
                {/* <div className="col-10 p-5"><ProductList /></div> */}
                <div className="col-10 p-5"><Outlet /></div>
            </div>
        </div>
    )
};
export default mainLayoutCashier;
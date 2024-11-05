import MenuCashier from "./component/menuCashier"
import SidebarCashier from "./component/sidebarCashier"

const dashboardCashier = () => {
    return(
        <div className="container-fuild" style={{backgroundColor: '#f7f7f1'}}>
            <SidebarCashier />
        </div>
    )  
}
export default dashboardCashier
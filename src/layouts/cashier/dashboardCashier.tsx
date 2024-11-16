import styled from "styled-components";
import CardMenuCashier from "./component/cardMenuCashier";
import MenuCashier from "./component/menuCashier";
import SidebarCashier from "./component/sidebarCashier";
import { Link } from "react-router-dom";

const DashboardCashier = () => {
  return (
    <StyledWrapper>
    <div className="card-container">
      <Link to="table">
      <CardMenuCashier icon="bi-table" title="Table" color1="#FDABDD" color2="#FFFCCE" />
      </Link>
      <Link to="food">
      <CardMenuCashier icon="bi-egg-fried" title="Food" color1="#a1c4fd" color2="#c2e9fb" />
      </Link>
    </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
.card-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* Mặc định 4 thẻ mỗi hàng */
    gap: 20px; /* Khoảng cách giữa các thẻ */
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    .card-container {
      grid-template-columns: repeat(2, 1fr); /* Khi màn hình nhỏ, 2 thẻ mỗi hàng */
    }
  }
`

export default DashboardCashier;

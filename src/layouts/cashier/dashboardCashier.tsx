import styled from "styled-components";
import CardMenuCashier from "./component/cardMenuCashier";
import MenuCashier from "./component/menuCashier";
import SidebarCashier from "./component/sidebarCashier";
import { Link } from "react-router-dom";

const DashboardCashier = () => {
  return (
    <StyledWrapper>
      <div className="card-container">
        <Link to="table" className="d-flex justify-content-center">
          <CardMenuCashier
            icon="bi-table"
            title="Bàn"
            color1="#FDABDD"
            color2="#FFFCCE"
          />
        </Link>
        <Link to="food" className="d-flex justify-content-center">
          <CardMenuCashier
            icon="bi-egg-fried"
            title="Món&#160;Ăn"
            color1="#a1c4fd"
            color2="#c2e9fb"
          />
        </Link>
        <Link to="ordersOnline" className="d-flex justify-content-center">
          <CardMenuCashier
            icon="bi-basket"
            title="Đơn&#160;Online"
            color1="#84fab0"
            color2="#8fd3f4"
          />
        </Link>
        <Link to="ordersOnline" className="d-flex justify-content-center">
          <CardMenuCashier
            icon="bi-calendar-check"
            title="Đặt&#160;Bàn"
            color1="#C2649A"
            color2="#E4C7B7"
          />
        </Link>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card-container {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(200px, 1fr)
    );
    gap: 20px;
  }
  }
`;

export default DashboardCashier;

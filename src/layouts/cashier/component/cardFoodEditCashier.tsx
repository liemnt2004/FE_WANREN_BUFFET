import React from "react";
import styled from "styled-components";

type Props = {
  img?: string;
  price?: number;
  name?: string;
  status?: boolean;
  productId?: number;
  onToggleCart: () => void;
};
const CardFoodEditCashier = ({
  img,
  price,
  name,
  status,
  productId,
  onToggleCart,
}: Props) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-img">
          <img src={img} alt={img} />
        </div>
        <div className="card-title">{name}</div>

        <hr className="card-divider m-0" />
        <div className="card-footer p-0 m-0 border-0">
          <div className="card-price">{price}đ</div>
          <button className="card-btn" onClick={onToggleCart}>
            <i className="bi bi-cart"></i>
          </button>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    --main-focus: #2d8cf0;
    width: 190px;
    height: 260px;
    background: var(--bg-color);
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
    gap: 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  .card:last-child {
    justify-content: flex-end;
  }

  .card-img {
    /* clear and add new css */
    transition: all 0.5s;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .card-title {
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: var(--font-color);
  }

  .card-divider {
    width: 100%;
    border: 1px solid var(--main-color);
    border-radius: 50px;
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .card-price {
    font-size: 20px;
    font-weight: 500;
    color: var(--font-color);
  }

  .card-price span {
    font-size: 20px;
    font-weight: 500;
    color: var(--font-color-sub);
  }

  .card-btn {
    height: 35px;
    background: var(--bg-color);
    border: 2px solid var(--main-color);
    border-radius: 5px;
    padding: 0 15px;
    transition: all 0.3s;
  }

  .card-btn svg {
    width: 100%;
    height: 100%;
    fill: var(--main-color);
    transition: all 0.3s;
  }

  .card-img:hover {
    transform: translateY(-3px);
  }

  .card-btn:hover {
    border: 2px solid var(--main-focus);
  }

  .card-btn:hover svg {
    fill: var(--main-focus);
  }

  .card-btn:active {
    transform: translateY(3px);
  }
`;

export default CardFoodEditCashier;

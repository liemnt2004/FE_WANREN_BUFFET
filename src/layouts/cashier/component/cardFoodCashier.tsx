import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import '../assets/css/cashierCardFood.css';


type Props = {
  img?: string;
  price?: number;
  name?: string;
  description?: string;
  status?: boolean;
  productId?: number;
  onToggleStatus: (productId: number, currentStatus: string) => void;
};

const CardFoodCashier = ({ img, price, name, description, status, productId, onToggleStatus }: Props) => {
  const [isOn, setIsOn] = useState(status);

  useEffect(() => {
    setIsOn(status); // Đồng bộ isOn với trạng thái mới khi cha thay đổi
  }, [status]);

  const handleToggle = () => {
    onToggleStatus(productId!, isOn ? "IN_STOCK" : "HIDDEN");
    setIsOn(!isOn); // Thay đổi ngay lập tức khi nhấn nút
  };

  return (
    <div className="flex flex-col bg-white w-72 h-80 rounded-md py-3 px-6 border">
      <img src={img} alt={name} className="w-full h-32 object-cover rounded-md" />
      <h3 className="text-center font-bold text-xl text-gray-800 m-0 pb-2">{price}đ</h3>
      <h3 className="text-base font-semibold text-gray-900 m-0 p-0">{name}</h3>
      <p className="text-sm text-gray-500 pb-3 p-0 m-0 truncate-description">{description}</p>
      <div className="flex justify-around items-center py-3">
        <StyledWrapper>
          <label className="switch">
            <input
              type="checkbox"
              className="toggle"
              checked={isOn}
              onChange={handleToggle}
            />
            <span className="slider" />
            <span className="card-side" />
          </label>
        </StyledWrapper>
      </div>
    </div>
  );
};





const StyledWrapper = styled.div`
  .switch {
    --input-focus: #2d8cf0;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
    --input-out-of-focus: #ccc;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 70px;
    height: 36px;
    transform: translateX(calc(50% - 10px));
  }

  .toggle {
    opacity: 0;
  }

  .slider {
    box-sizing: border-box;
    border-radius: 100px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--input-out-of-focus);
    transition: 0.3s;
  }

  .slider:before {
    content: "off";
    box-sizing: border-box;
    height: 30px;
    width: 30px;
    position: absolute;
    left: 2px;
    bottom: 1px;
    border: 2px solid var(--main-color);
    border-radius: 100px;
    background-color: var(--bg-color);
    color: var(--main-color);
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 25px;
    transition: 0.3s;
  }

  .toggle:checked + .slider {
    background-color: var(--input-focus);
    transform: translateX(-32px);
  }

  .toggle:checked + .slider:before {
    content: "on";
    transform: translateX(32px);
  }`;




export default CardFoodCashier;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Order } from "../../../api/apiCashier/ordersOnl";
import { fetchOrderbyTableId } from "../../../api/apiCashier/tableApi";

type Props = {
  tableId?: number;
  tableNumber?: number;
  status?: string;
  location?: string;
  foodTable?: () => void;
  swapTable?: () => void;
  splitTable?: () => void;
  combineTable?: () => void;
  detailTable?: () => void;
};

const CardTableCashier = ({
  tableId,
  tableNumber,
  status,
  location,
  foodTable,
  swapTable,
  splitTable,
  combineTable,
  detailTable,
}: Props) => {
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const orders = await fetchOrderbyTableId(tableId || 0); // Gọi API lấy orders
        if (orders && orders.length > 0) {
          // Lọc lấy order mới nhất theo `createdDate`
          const mostRecentOrder = orders.reduce(
            (latest: Order, current: Order) =>
              new Date(latest.createdDate || 0) >
              new Date(current.createdDate || 0)
                ? latest
                : current
          );
          setLatestOrder(mostRecentOrder); // Lưu vào state
        } else {
          setLatestOrder(null); // Không có order
        }
      } catch (error) {
        console.error("Lỗi khi tải order:", error);
        setLatestOrder(null);
      }
    };

    fetchLatestOrder();
  }, [tableId]);

  return (
    <StyledWrapper status={status}>
      <div className="card p-0">
        <section className="info-section" onClick={detailTable}>
          <div className="background-design">
            <div className="circle" />
            <div className="circle" />
            <div className="circle" />
          </div>
          <div className="left-side">
            <div className="weather">
              <div>Wanren&#160;Buffet</div>
            </div>
            <div className="temperature">{tableNumber}.</div>
            <div className="range">{location}</div>
          </div>
          <div className="right-side">
            <div>
              <div className="hour">
                {status === "Có Khách"
                  ? `${new Date(
                      latestOrder?.createdDate || ""
                    ).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : ""}
              </div>
              <div className="date">
                {status === "Có Khách"
                  ? `${new Date(
                      latestOrder?.createdDate || ""
                    ).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}`
                  : ""}
              </div>
            </div>
            <div className="city">{status}</div>
          </div>
        </section>
        <section className="days-section">
          <button onClick={foodTable}>
            <p className="day m-0">Món</p>
          </button>
          <button onClick={swapTable}>
            <p className="day m-0">Đổi</p>
          </button>
          <button onClick={splitTable}>
            <p className="day m-0">Tách</p>
          </button>
          <button onClick={combineTable}>
            <p className="day m-0">Gộp</p>
          </button>
        </section>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ status?: string }>`
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 180px;
    width: 280px;
    border-radius: 25px;
    background: lightgrey;
    overflow: hidden;
    transition: 100ms ease;
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 4px;
  }

  /* ---------- Info section ---------- */

  .info-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 75%;
    color: black;
  }

  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    z-index: 2;
    padding-left: 18px;
  }

  button {
    display: block;
    border: none;
    background: transparent;
  }

  .weather {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }

  .weather div {
    display: flex;
    align-items: center;
  }

  .weather div:nth-child(1) {
    width: 40%;
    height: auto;
  }

  .temperature {
    font-size: 34pt;
    font-weight: 500;
    line-height: 8%;
  }

  .right-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    height: 100%;
    padding-right: 18px;
    z-index: 1;
  }

  .right-side > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .hour {
    font-size: 19pt;
    line-height: 1em;
  }

  .date {
    font-size: 15px;
  }

  /* ---------- Background ---------- */
  .background-design {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: ${({ status }) =>
      status === "Có Khách" ? "#ffedbc" : status === "Trống" ? "#fff" : "#fff"};
    overflow: hidden;
  }

  .circle {
    background-color: ${({ status }) =>
      status === "Có Khách" ? "#ffb88c" : status === "Trống" ? "#fff" : "#fff"};
  }

  .circle:nth-child(1) {
    position: absolute;
    top: -80%;
    right: -50%;
    width: 300px;
    height: 300px;
    opacity: 0.4;
    border-radius: 50%;
  }

  .circle:nth-child(2) {
    position: absolute;
    top: -70%;
    right: -30%;
    width: 210px;
    height: 210px;
    opacity: 0.4;
    border-radius: 50%;
  }

  .circle:nth-child(3) {
    position: absolute;
    top: -35%;
    right: -8%;
    width: 100px;
    height: 100px;
    opacity: 1;
    border-radius: 50%;
  }

  /* ---------- Days section ---------- */
  .days-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 25%;
    background-color: ${({ status }) =>
      status === "Có Khách"
        ? "#ffedbc"
        : status === "Trống"
        ? "#f5f5f5"
        : "#fff"};
    gap: 2px;
    box-shadow: inset 0px 2px 5px
      ${({ status }) =>
        status === "Có Khách"
          ? "#ffedbc"
          : status === "Trống"
          ? "#f5f5f5"
          : "#fff"};
  }

  .days-section button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: ${({ status }) =>
      status === "Có Khách"
        ? "#f7bb97"
        : status === "Trống"
        ? "#f5f5f5"
        : "#fff"};
    box-shadow: inset 0px 2px 5px
      ${({ status }) =>
        status === "Có Khách"
          ? "#f7bb97"
          : status === "Trống"
          ? "#f5f5f5"
          : "#fff"};
    cursor: pointer;
    transition: 100ms ease;
    gap: 5px;
  }

  .days-section button:hover {
    scale: 0.9;
    border-radius: 10px;
  }

  .days-section .day {
    font-size: 10pt;
    font-weight: 500;
    color: black;
    opacity: 0.7;
  }

  .icon-weather-day {
    display: flex;
    align-items: center;
    width: 20px;
    height: 100%;
  }
`;

export default CardTableCashier;

import styled from "styled-components";

type Props = {
  tableId?: number;
  tableNumber?: number;
  status?: string;
  location?: string;
  foodTable?: () => void;
  swapTable?: () => void;
  splitTable?: () => void;
  combineTable?: () => void;
  deleteTable?: () => void;
  detailTable?: () => void;
  timeOrder?: string;
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
  deleteTable,
  detailTable,
  timeOrder,
}: Props) => {
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
                {timeOrder ? timeOrder.substring(11, 16) : ""}
              </div>
              <div className="date">
                {timeOrder
                  ? `${timeOrder.substring(8, 10)}-${timeOrder.substring(5, 7)}`
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
          <button onClick={deleteTable}>
            <p className="day m-0">Hủy</p>
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
    color: ${({ status }) =>
      status === "Có Khách"
        ? "black"
        : status === "Thanh Toán"
        ? "#fff"
        : status === "Khóa"
        ? "#fff"
        : status === "Trống"
        ? "black"
        : "black"};
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
      status === "Có Khách"
        ? "#ffedbc"
        : status === "Thanh Toán"
        ? "#ec7263"
        : status === "Khóa"
        ? "#ec7263"
        : status === "Trống"
        ? "#fff"
        : "#fff"};
    overflow: hidden;
  }

  .circle {
    background-color: ${({ status }) =>
      status === "Có Khách"
        ? "#ffb88c"
        : status === "Thanh Toán"
        ? "#efc745"
        : status === "Khóa"
        ? "#efc745"
        : status === "Trống"
        ? "#fff"
        : "#fff"};
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
        : status === "Thanh Toán"
        ? "#974859"
        : status === "Khóa"
        ? "#974859"
        : status === "Trống"
        ? "#f5f5f5"
        : "#fff"};
    gap: 2px;
    box-shadow: inset 0px 2px 5px
      ${({ status }) =>
        status === "Có Khách"
          ? "#ffedbc"
          : status === "Thanh Toán"
          ? "#974859"
          : status === "Khóa"
          ? "#974859"
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
        : status === "Thanh Toán"
        ? "#a75265"
        : status === "Khóa"
        ? "#a75265"
        : status === "Trống"
        ? "#f5f5f5"
        : "#fff"};
    box-shadow: inset 0px 2px 5px
      ${({ status }) =>
        status === "Có Khách"
          ? "#f7bb97"
          : status === "Thanh Toán"
          ? "#974859"
          : status === "Khóa"
          ? "#974859"
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
    color: ${({ status }) =>
      status === "Có Khách"
        ? "black"
        : status === "Thanh Toán"
        ? "#fff"
        : status === "Khóa"
        ? "#fff"
        : status === "Trống"
        ? "black"
        : "black"};
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

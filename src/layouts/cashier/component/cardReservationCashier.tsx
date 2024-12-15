import styled from "styled-components";

type Props = {
  reservationId?: number;
  status?: string;
  time?: string;
  date?: string;
  name?: string;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "CANCELED":
      return "bi bi-calendar-x";
    case "PENDING":
      return "bi bi-calendar";
    case "APPROVED":
      return "bi bi-calendar-check";
    case "SEATED":
      return "bi bi-calendar-heart";
    default:
      return "";
  }
};

export const getStatus = (status: string) => {
  switch (status) {
    case "CANCELED":
      return "Hủy";
    case "PENDING":
      return "Chờ xác nhận";
    case "APPROVED":
      return "Xác nhận";
    case "SEATED":
      return "Đã đến";
    default:
      return "";
  }
};

const CardReservationCashier = ({
  reservationId,
  status,
  time,
  date,
  name,
}: Props) => {
  const safeTime = time || "00:00";
  const safeDate = date || new Date().toISOString();

  return (
    <StyledWrapper status={status}>
      <div className="card">
        <div className="card-content">
          <div className="card-top">
            <span className="card-title">{reservationId}.</span>
            <p>{getStatus(status || "")}</p>
          </div>
          <div className="card-bottom">
            <span>{name}</span>
            <span>
              {`${safeTime.slice(0, 5)} - ${new Date(safeDate)
                .getDate()
                .toString()
                .padStart(2, "0")}/${(new Date(safeDate).getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${new Date(safeDate).getFullYear()}`}
            </span>

            {/* <svg
              width={32}
              viewBox="0 -960 960 960"
              height={32}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z" />
            </svg> */}
          </div>
        </div>
        <div className="card-image">
          <i
            className={getStatusIcon(status || "")}
            style={{ fontSize: 36 }}
          ></i>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ status?: string }>`
  .card {
    width: 320px;
    background: ${
      ({ status }) =>
        status === "APPROVED"
          ? "#fff480"
          : status === "PENDING"
          ? "#fff"
          : status === "CANCELED"
          ? "#ffc0cb"
          : status === "SEATED"
          ? "#CCFFCC"
          : "#fff" // Màu mặc định
    };
    color: black;
    position: relative;
    border-radius: 2.5em;
    padding: 2em;
    transition: transform 0.4s ease;
  }

  .card .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5em;
    height: 100%;
    transition: transform 0.4s ease;
  }

  .card .card-top,
  .card .card-bottom {
    display: flex;
    justify-content: space-between;
  }

  .card .card-top p,
  .card .card-top .card-title,
  .card .card-bottom p,
  .card .card-bottom .card-title {
    margin: 0;
  }

  .card .card-title {
    font-weight: bold;
  }

  .card .card-top p,
  .card .card-bottom p {
    font-weight: 600;
  }

  .card .card-bottom {
    align-items: flex-end;
  }

  .card .card-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .card .card-image svg {
    width: 4em;
    height: 4em;
    transition: transform 0.4s ease;
  }

  .card:hover {
    cursor: pointer;
    transform: scale(0.97);
  }

  .card:hover .card-content {
    transform: scale(0.96);
  }

  .card:hover .card-image svg {
    transform: scale(1.05);
  }

  .card:active {
    transform: scale(0.9);
  }
`;

export default CardReservationCashier;

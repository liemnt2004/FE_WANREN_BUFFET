import styled from "styled-components";

type Props = {
  orderId?: number;
  orderStatus?: string;
  totalAmount?: number;
  notes?: string;
  address?: string;
  username?: string;
  date?: string;
  phoneNumber?: string;
  onClick?: () => void;
};

const CardOrdersOnlCashier = ({
  orderId,
  orderStatus,
  totalAmount,
  notes,
  address,
  username,
  date,
  phoneNumber,
  onClick,
}: Props) => {
  return (
    <StyledWrapper status={orderStatus}>
      <div className="card" onClick={onClick}>
        <h3 className="card__title">{orderId}.</h3>
        <p className="card__content">{notes}</p>
        <div className="card__date my-1">{username}</div>
        <div className="card__date my-1">{phoneNumber}</div>
        <div className="card__date my-1">
          {date
            ? `${date.substring(11, 16)} - ${date.substring(
                8,
                10
              )}/${date.substring(5, 7)}`
            : ""}
        </div>
        <div className="card__arrow">
          <i className="bi bi-justify fs-5"></i>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ status?: string }>`
  /* this card is inspired form this - https://georgefrancis.dev/ */

  .card {
    --border-radius: 0.75rem;
    --primary-color: #7257fa;
    --secondary-color: #3c3852;
    width: 210px;
    font-family: "Arial";
    padding: 1rem;
    cursor: pointer;
    border-radius: var(--border-radius);
    background: ${({ status }) =>
      status === "WAITING"
        ? "#FFFFFF"
        : status === "PREPARING_ORDER"
        ? "#FFFFCC"
        : status === "IN_TRANSIT"
        ? "#99FFFF"
        : status === "DELIVERED"
        ? "#CCFFCC"
        : "#F5F5F5"}; /* Default color */
    box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
    position: relative;
  }

  .card > * + * {
    margin-top: 1.1em;
  }

  .card .card__content {
    color: var(--secondary-color);
    font-size: 0.86rem;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Hiển thị tối đa 2 dòng */
    -webkit-box-orient: vertical;
    overflow: hidden; /* Ẩn phần văn bản vượt quá */
    text-overflow: ellipsis; /* Thêm dấu "..." */
    white-space: normal;
  }

  .card .card__title {
    padding: 0;
    margin: 0;
    font-size: 1.3rem;
    font-weight: bold;
  }

  .card .card__date {
    color: #6e6b80;
    font-size: 0.8rem;
  }

  .card .card__arrow {
    position: absolute;
    background: var(--primary-color);
    padding: 0.4rem;
    border-top-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    bottom: 0;
    right: 0;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card svg {
    transition: 0.2s;
  }

  /* hover */
  .card:hover .card__title {
    color: var(--primary-color);
    text-decoration: underline;
  }

  .card .card__arrow {
    opacity: 0.7;
  }
  .card:hover .card__arrow {
    opacity: 1;
  }
`;

export default CardOrdersOnlCashier;

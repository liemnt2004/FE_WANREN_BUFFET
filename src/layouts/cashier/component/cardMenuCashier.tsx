import styled from "styled-components";

type Props = {
  icon?: string;
  title?: string;
  color1?: string;
  color2?: string;
};

const CardMenuCashier = ({ icon, title, color1, color2 }: Props) => {
  return (
    <StyledWrapper color1={color1} color2={color2}>
      <div className="card">
        <div className="card-details">
          <p className="text-title">
            <i className={`bi ${icon}`}></i>
          </p>
        </div>
        <button className="card-button text-center w-auto">{title}</button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ color1?: string; color2?: string }>`
  .card {
    width: 190px;
    height: 254px;
    border-radius: 20px;
    background: linear-gradient(
      135deg,
      ${({ color1 }) => color1 || "#ffffff"} 0%,
      ${({ color2 }) => color2 || "#ffffff"} 100%
    );
    position: relative;
    padding: 1.8rem;
    border: 2px solid #c3c6ce;
    transition: 0.5s ease-out;
    overflow: visible;
  }

  .card-details {
    color: black;
    height: 100%;
    gap: 0.5em;
    display: grid;
    place-content: center;
  }

  .card-button {
    transform: translate(-50%, 125%);
    width: 60%;
    border-radius: 1rem;
    border: none;
    background-color: #008bf8;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    position: absolute;
    left: 50%;
    bottom: 0;
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .text-body {
    color: rgb(134, 134, 134);
  }

  /*Text*/
  .text-title {
    font-size: 1.5em;
    font-weight: bold;
  }

  /*Hover*/
  .card:hover {
    border-color: #008bf8;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }

  .card:hover .card-button {
    transform: translate(-50%, 50%);
    opacity: 1;
  }
`;

export default CardMenuCashier;

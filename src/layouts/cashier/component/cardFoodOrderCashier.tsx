import styled from "styled-components";

type Props = {
  imageUrl?: string;
  productName?: string;
  price?: number;
  quantity?: number;
};

const CardFoodOrderCashier = ({
  imageUrl,
  productName,
  price,
  quantity,
}: Props) => {
  return (
    <div className="d-flex justify-content-center">
      <div
        className="card border-dark rounded-3 p-3 w-100"
        style={{ maxWidth: "600px" }}
      >
        <Responsive>
          <div className="row g-0 align-items-center grid-responsive">
            {/* Phần hình ảnh sản phẩm */}
            <div className="">
              <img
                src={imageUrl}
                alt="Sản phẩm"
                className="img-fluid rounded-start"
              />
            </div>

            {/* Phần tên sản phẩm */}
            <div className="">
              <div className="card-body">
                <h5 className="card-title mb-0">{productName}</h5>
              </div>
            </div>

            {/* Phần số tiền */}
            <div className="">
              <div className="card-body">
                <p className="card-text mb-0 text-danger">
                  {(price || 0) * (quantity || 0)}đ
                </p>
              </div>
            </div>

            {/* Phần số lượng */}
            <div className="">
              <div className="card-body">
                <p className="card-text mb-0">SL: {quantity}</p>
              </div>
            </div>
          </div>
        </Responsive>
      </div>
    </div>
  );
};
export default CardFoodOrderCashier;

const Responsive = styled.div`
  .grid-responsive {
    display: grid;
    grid-template-columns: 2fr 5fr 3fr 2fr; /* Chia kích thước theo tỷ lệ */
    gap: 10px; /* Khoảng cách giữa các phần tử */
    align-items: center;
  }

  /* Đáp ứng khi màn hình thu nhỏ */
  @media (max-width: 1080px) {
    .grid-responsive {
      grid-template-columns: 1fr; /* Mỗi phần tử chiếm toàn bộ chiều ngang */
      gap: 10px;
    }
  }
`;

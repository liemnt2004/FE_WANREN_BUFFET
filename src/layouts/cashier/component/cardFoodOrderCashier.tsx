
type Props = {
    imageUrl?: string;
    productName?: string;
    price?: number;
    quantity?: number;
  };

const CardFoodOrderCashier = ({ imageUrl, productName, price, quantity }: Props) => {
    return (
        <div className="card border-dark rounded-3 p-3" style={{ maxWidth: '600px' }}>
      <div className="row g-0 align-items-center">
        {/* Phần hình ảnh sản phẩm */}
        <div className="col-3">
          <img src={imageUrl} alt="Sản phẩm" className="img-fluid rounded-start" />
        </div>

        {/* Phần tên sản phẩm */}
        <div className="col-4">
          <div className="card-body">
            <h5 className="card-title mb-0">{productName}</h5>
          </div>
        </div>

        {/* Phần số tiền */}
        <div className="col-3">
          <div className="card-body">
            <p className="card-text mb-0">{price}đ</p>
          </div>
        </div>

        {/* Phần số lượng */}
        <div className="col-2">
          <div className="card-body">
            <p className="card-text mb-0">SL: {quantity}</p>
          </div>
        </div>
      </div>
    </div>
    )
}
export default CardFoodOrderCashier
import React, { useState } from 'react';
import '../../assets/css/styles.css'
import ProductModel from '../../../../models/StaffModels/ProductModel';

interface ProductCardProps {
    product: ProductModel;
    cartQuantity: number;
    onImageClick: () => void;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
    onAddToCart: (item: {
        product: ProductModel;
        quantity: number;
        note: string;
        totalPrice: number;
    }) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    cartQuantity,
    onImageClick,
    decrementQuantity,
    incrementQuantity,
    onAddToCart
}) => {
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');

    const handleAddToCart = () => {
        const totalPrice = product.price * 1;
        onAddToCart({
            product,
            quantity,
            note,
            totalPrice,
        });
    };
    return (
        <div className="col-6 col-md-3">
            <div
                className="card border border-0 p-3 card-custom"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
            >
                <img
                    src={product.image}
                    className="rounded-3"
                    alt={product.productName}
                    onClick={onImageClick} // Open modal on image click
                    style={{ cursor: 'pointer' }}
                />
                <div className="card-body p-0 pt-2">
                    <h5 className="card-title fs-6 m-0 p-0 fw-bold">{product.productName}</h5>
                </div>
                <div className="mt-4 mb-2 d-flex justify-content-between align-items-center">
                    <h6 className="card__price fw-bold">{product.price} đ</h6>
                    <div className="input__septer d-flex justify-content-end align-items-center add-to-cart">
                        {cartQuantity > 0 ? (
                            <div>
                                <button id="increment"
                            type="button"
                            className="btn btn-danger" onClick={decrementQuantity}><i className="bi bi-dash-lg"></i></button>
                                <span className='px-2 text-dark fw-bold'>{cartQuantity}</span>
                                <button id="increment"
                            type="button"
                            className="btn btn-danger" onClick={incrementQuantity}><i className="bi bi-plus-lg"></i></button>
                            </div>
                        ) : (
                            <button id="increment"
                            type="button"
                            className="btn btn-danger" onClick={handleAddToCart}><i className="bi bi-plus-lg"></i></button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

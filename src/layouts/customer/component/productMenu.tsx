import React, {useEffect, useState} from "react";
import formatMoney from "./FormatMoney";
import {CartItem} from "./CartContext";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    addToCart: (product: { id: number; name: string; price: number; image: string }) => void;
}

const   ProductMenu: React.FC<Product> = (props) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart từ sessionStorage khi component mount
    useEffect(() => {
        const storedCart = sessionStorage.getItem('cartItems');
        if (storedCart) {
            try {
                const parsedCart: CartItem[] = JSON.parse(storedCart);
                setCartItems(parsedCart);
            } catch (e) {
                console.error("Failed to parse cartItems từ sessionStorage:", e);
                setCartItems([]);
            }
        }
    }, []);
    const { id, name, price, image, addToCart } = props;

    const product = { id, name, price, image };

    return (
        <div className="my-3 d-flex" style={{ paddingLeft: 0 }} key={id}>
            <div className="col-4">
                <img src={image} style={{ height: "80px" }} alt={name} className="img-fluid rounded" />
            </div>
            <div className="col-6">
                <div className="row m-0 align-items-center">
                    <span style={{ fontWeight: "bold" }}>{name}</span>
                    <span style={{ fontSize: "15px" }}>{formatMoney(price)}</span>
                </div>
            </div>
            <div className="col-2 d-flex justify-content-end align-items-center add-to-cart">
                <button
                    id="increment"
                    type="button"

                    className="btn btn-danger"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                    onClick={() => addToCart(product)} // Handle adding to cart
                >
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default ProductMenu;

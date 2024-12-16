import React, { useContext, useEffect, useState } from "react";
import formatMoney from "./FormatMoney";
import { CartContext, CartItem } from "./CartContext";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    addToCart: (product: { id: number; name: string; price: number; image: string }) => void;
    decreaseQuantity: (productId: number) => void;
}

const ProductMenu: React.FC<Product> = (props) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const cartContext = useContext(CartContext);

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

    const { id, name, price, image, addToCart, decreaseQuantity } = props;

    const product = { id, name, price, image };

    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        if (!cartContext) return;
        const cartItem = cartContext.cartItems.find(item => item.productId === id);
        setQuantity(cartItem ? cartItem.quantity : 0);
    }, [cartContext?.cartItems, id]);


    return (
        <div className="my-3 d-flex" style={{ paddingLeft: 0  }} key={product.id}>
            <div className="col-3">
                <img src={image} style={{ height: "80px" }} alt={name} className="img-fluid rounded" />
            </div>
            <div className="col-6">
                <div className="row m-0 align-items-center ms-2">
                    <span className="text-span-custom" style={{ fontWeight: "bold" }}>{name}</span>
                    <span className="text-span-custom" style={{ fontSize: "15px" }}>{formatMoney(price)}</span>
                </div>
            </div>
            <div className="col-3 d-flex justify-content-end align-items-center add-to-cart">
                {quantity > 0 && (
                    <button
                        id="increment"
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => decreaseQuantity(product.id)} // Handle removing from cart
                    >
                        <i className="bi bi-dash-lg"></i>
                    </button>
                )}
                {quantity > 0 && (
                    <span className="mx-2">{quantity}</span>
                )}
                <button
                    type="button"
                    id="increment"
                    className="btn btn-danger"
                    onClick={() => addToCart(product)} // Handle adding to cart
                >
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default ProductMenu;

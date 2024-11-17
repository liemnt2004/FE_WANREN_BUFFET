import React, { createContext, useContext, useState, ReactNode } from 'react';
import ProductModel from '../../../../models/ProductModel';

interface CartItem {
    product: ProductModel;
    quantity: number;
    note: string;
    totalPrice: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems((prevItems) => {
            const itemExists = prevItems.find(cartItem => cartItem.product.productId === item.product.productId);
            
            if (itemExists) {
                return prevItems.map(cartItem =>
                    cartItem.product.productId === item.product.productId
                        ? { ...cartItem, quantity: cartItem.quantity + item.quantity, note: item.note, totalPrice: cartItem.totalPrice + item.totalPrice }
                        : cartItem
                );
            }
            return [...prevItems, item];
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// src/contexts/CartContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartItem) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    subtotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // Khởi tạo cartItems từ sessionStorage
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCart = sessionStorage.getItem('cartItems');
        if (storedCart) {
            try {
                return JSON.parse(storedCart) as CartItem[];
            } catch (e) {
                console.error("Failed to parse cartItems từ sessionStorage:", e);
                return [];
            }
        }
        return [];
    });

    // Lưu cart vào sessionStorage khi cartItems thay đổi
    useEffect(() => {
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: CartItem) => {
        setCartItems(prevItems => {
            const existingProduct = prevItems.find(item => item.productId === product.productId);
            if (existingProduct) {
                return prevItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [
                    ...prevItems,
                    {
                        productId: product.productId,
                        productName: product.productName,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                    },
                ];
            }
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems =>
            prevItems.filter(item => item.productId !== productId)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook để sử dụng CartContext dễ dàng hơn
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được sử dụng trong CartProvider");
    }
    return context;
};

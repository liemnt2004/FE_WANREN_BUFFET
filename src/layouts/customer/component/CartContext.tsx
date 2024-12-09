// src/components/CartContext.tsx
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
    addMultipleToCart: (products: CartItem[]) => void; // Thêm hàm mới
    buyAgain: (product: CartItem, quantity: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    subtotal: number;
    decreaseQuantity: (productId: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {

    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCart = sessionStorage.getItem('cartItems');
        if (storedCart) {
            try {
                return JSON.parse(storedCart) as CartItem[];
            } catch (e) {
                console.error("Failed to parse cartItems from sessionStorage:", e);
                return [];
            }
        }
        return [];
    });

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

    // Hàm mới để thêm nhiều sản phẩm vào giỏ hàng
    const addMultipleToCart = (products: CartItem[]) => {
        setCartItems(prevItems => {
            const updatedItems = [...prevItems];
            products.forEach(product => {
                const existingProduct = updatedItems.find(item => item.productId === product.productId);
                if (existingProduct) {
                    existingProduct.quantity += product.quantity;
                } else {
                    updatedItems.push({ ...product });
                }
            });
            return updatedItems;
        });
    };

    const buyAgain = (product: CartItem, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingProduct = prevItems.find(item => item.productId === product.productId);
            if (existingProduct) {
                return prevItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [
                    ...prevItems,
                    { ...product, quantity },
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

    const decreaseQuantity = (productId: number) => {
        setCartItems(prevItems => {
            return prevItems
                .map(item => {
                    if (item.productId === productId) {
                        if (item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return null;
                        }
                    }
                    return item;
                })
                .filter(item => item !== null) as CartItem[];
        });
    };
    


    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, addMultipleToCart, buyAgain, updateQuantity, removeFromCart, clearCart, subtotal, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for using CartContext
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

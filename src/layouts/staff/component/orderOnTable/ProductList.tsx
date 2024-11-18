import React, { useEffect, useState } from 'react';
import { fetchProductsByCategory } from '../../../../api/apiStaff/productApi';
import ProductModel from '../../../../models/StaffModels/ProductModel';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

interface ProductListProps {
    category: string;
    cartItems: { product: ProductModel; quantity: number; note: string; totalPrice: number }[];
    setCartItems: React.Dispatch<React.SetStateAction<{ product: ProductModel; quantity: number; note: string; totalPrice: number }[]>>;
}

const ProductList: React.FC<ProductListProps> = ({ category, cartItems, setCartItems }) => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const fetchedProducts = await fetchProductsByCategory(category);
                setProducts(fetchedProducts);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [category]);

    const handleImageClick = (product: ProductModel) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleAddToCart = (item: {
        product: ProductModel;
        quantity: number;
        note: string;
        totalPrice: number;
    }) => {
        setCartItems((prevItems) => {
            const itemExists = prevItems.find(
                (cartItem) =>
                    cartItem.product.productId === item.product.productId &&
                    cartItem.note === item.note
            );

            if (itemExists) {
                return prevItems.map((cartItem) =>
                    cartItem.product.productId === item.product.productId &&
                        cartItem.note === item.note
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + item.quantity,
                            totalPrice: cartItem.totalPrice + item.totalPrice,
                        }
                        : cartItem
                );
            }

            return [...prevItems, item];
        });
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const incrementQuantity = (productId: number, note: string) => {
        setCartItems((prevItems) =>
            prevItems.map((cartItem) =>
                cartItem.product.productId === productId && cartItem.note === note
                    ? {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                        totalPrice: cartItem.totalPrice + cartItem.product.price,
                    }
                    : cartItem
            )
        );
    };

    const decrementQuantity = (productId: number, note: string) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.product.productId === productId && item.note === note
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            totalPrice: item.totalPrice - item.product.price
                        }
                        : item
                )
                .filter((item) => item.quantity > 0) // Remove items with zero quantity
        );
    };

    // Calculate total cart quantity for a product, including all notes
    const getTotalProductQuantity = (productId: number) => {
        return cartItems
            .filter((item) => item.product.productId === productId)
            .reduce((total, item) => total + item.quantity, 0);
    };

    if (loading) {
        return <div style={{ paddingLeft: '20px' }}>Loading products...</div>;
    }

    if (error) {
        return <div style={{ paddingLeft: '20px' }} className="error">{error}</div>;
    }

    if (products.length === 0) {
        return <div style={{ paddingLeft: '20px' }}>No products available in this category.</div>;
    }

    return (
        <div style={{ margin: '0 18px 18px 18px' }}>
            <div className="content-section">
                <div className="row g-4 mb-5">
                    {products.map((product) => {
                        const totalProductQuantity = getTotalProductQuantity(product.productId); // Get the total quantity for this product
                        return (
                            <ProductCard
                                onAddToCart={handleAddToCart}
                                product={product}
                                cartQuantity={totalProductQuantity} // Pass total quantity for this product
                                onImageClick={() => handleImageClick(product)}
                                incrementQuantity={() => {
                                    const cartItem = cartItems.find((item) => item.product.productId === product.productId);
                                    if (cartItem) {
                                        incrementQuantity(product.productId, cartItem.note);
                                    }
                                }}
                                decrementQuantity={() => {
                                    const cartItem = cartItems.find((item) => item.product.productId === product.productId);
                                    if (cartItem) {
                                        decrementQuantity(product.productId, cartItem.note);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            {showModal && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}
        </div>
    );
};

export default ProductList;

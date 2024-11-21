import React, { useEffect, useRef, useState } from 'react';
import { getAllProduct } from '../../../../api/apiStaff/productApi';
import ProductModel from '../../../../models/StaffModels/ProductModel';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

interface ProductListProps {
    category: string;
    area: string;
    cartItems: { product: ProductModel; quantity: number; note: string; totalPrice: number }[];
    setCartItems: React.Dispatch<React.SetStateAction<{ product: ProductModel; quantity: number; note: string; totalPrice: number }[]>>;
}

const ProductList: React.FC<ProductListProps> = ({ category, area, cartItems, setCartItems }) => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const fetchedProducts = await getAllProduct();

                const adjustProductPrice = (product: ProductModel, area: string): ProductModel => {
                    if (area === 'Table' && product.typeFood !== 'buffet_tickets' && product.typeFood !== 'mixers' && product.typeFood !== 'soft_drinks') {
                        const adjustedProduct = new ProductModel(
                            product.productId,         // Sử dụng getter để lấy thông tin
                            product.productName,
                            product.description,
                            0,                         // Đặt giá thành 0
                            product.typeFood,
                            product.image,
                            product.quantity || 0,     // Đảm bảo có quantity
                            product.productStatus,
                            product.category
                        );
                        return adjustedProduct;
                    }
                    return product;
                };

                const adjustedProducts = fetchedProducts.map((product) => adjustProductPrice(product, area));

                setProducts(adjustedProducts); // Đảm bảo kiểu dữ liệu
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [area]); // Thêm area vào dependencies

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

    const incrementQuantity = (productId: number, note: string | null) => {
        setCartItems((prevItems) => {
            const normalizedNote = note || ''; // Chuẩn hóa note (nếu null thì thành chuỗi rỗng)
            const existingItem = prevItems.find(
                (cartItem) =>
                    cartItem.product.productId === productId && cartItem.note === normalizedNote
            );

            if (existingItem) {
                // Tăng số lượng nếu mục đã tồn tại
                return prevItems.map((cartItem) =>
                    cartItem === existingItem
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                            totalPrice: cartItem.totalPrice + cartItem.product.price,
                        }
                        : cartItem
                );
            } else {
                // Thêm mục mới nếu không tìm thấy
                const product = products.find((p) => p.productId === productId);
                if (!product) return prevItems;

                return [
                    ...prevItems,
                    {
                        product,
                        quantity: 1,
                        note: normalizedNote,
                        totalPrice: product.price,
                    },
                ];
            }
        });
    };

    const decrementQuantity = (productId: number, note: string | null) => {
        setCartItems((prevItems) => {
            const normalizedNote = note || ''; // Chuẩn hóa note (nếu null thì thành chuỗi rỗng)
            return prevItems
                .map((cartItem) =>
                    cartItem.product.productId === productId && cartItem.note === normalizedNote
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity - 1,
                            totalPrice: cartItem.totalPrice - cartItem.product.price,
                        }
                        : cartItem
                )
                .filter((item) => item.quantity > 0); // Xóa mục có số lượng bằng 0
        });
    };



    // Calculate total cart quantity for a product, including all notes
    const getTotalProductQuantity = (productId: number) => {
        return cartItems
            .filter((item) => item.product.productId === productId)
            .reduce((total, item) => total + item.quantity, 0);
    };

    const groupedProducts = products.reduce((groups, product) => {
        const category = product.typeFood || 'Unknown'; // Default to 'Unknown' if typeFood is undefined
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(product);
        return groups;
    }, {} as { [key: string]: ProductModel[] });

    const typeFoodMapping: { [key: string]: string } = {
        hotpot: 'Nước lẩu',
        meat: 'Thịt',
        seafood: 'Hải sản',
        meatballs: 'Hàng viên',
        vegetables: 'Rau củ',
        noodles: 'Mì - Bún',
        buffet_tickets: 'Vé buffet',
        dessert: 'Tráng miệng',
        mixers: 'Nước pha chế',
        cold_towel: 'Khăn lạnh',
        soft_drinks: 'Nước giải khát',
        beer: 'Bia',
        mushroom: 'Nấm',
        wine: 'Rượu',
    };

    const productRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Scroll to the selected category
    const scrollToCategory = (category: string) => {
        const section = productRefs.current[category];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Automatically scroll to the selected category
    useEffect(() => {
        if (category) {
            scrollToCategory(category);
        }
    }, [category]);

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
        <div style={{ margin: '0 18px 18px 18px'}}>
            {Object.keys(groupedProducts).map((typeFood) => (
                <div key={typeFood} className="content-section" style={{paddingTop: '15px'}} ref={(el) => productRefs.current[typeFood] = el}>
                    <h4>{typeFoodMapping[typeFood] || typeFood}</h4>
                    <div className="row g-4 mb-5">
                        {groupedProducts[typeFood].map((product) => {
                            const totalProductQuantity = getTotalProductQuantity(product.productId);
                            return (
                                <ProductCard
                                    onAddToCart={handleAddToCart}
                                    product={product}
                                    cartQuantity={totalProductQuantity}
                                    onImageClick={() => handleImageClick(product)}
                                    incrementQuantity={() => {
                                        const cartItem = cartItems.find(
                                            (item) => item.product.productId === product.productId && item.note === ''
                                        );
                                        incrementQuantity(product.productId, cartItem?.note || null);
                                    }}
                                    decrementQuantity={() => {
                                        const cartItem = cartItems.find(
                                            (item) => item.product.productId === product.productId && item.note === ''
                                        );
                                        decrementQuantity(product.productId, cartItem?.note || null);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
            {showModal && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    incrementQuantity={(productId, note) => incrementQuantity(productId, note)}
                    decrementQuantity={(productId, note) => decrementQuantity(productId, note)}
                    cartItems={cartItems}
                />
            )}
        </div>

    );
};

export default ProductList;

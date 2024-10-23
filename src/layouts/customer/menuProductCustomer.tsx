
import React, { useEffect, useState } from "react";
import './assets/css/styles.css';
import './assets/css/menu.css';

// Importing images directly
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';

import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';

import ProductModel from "../../models/ProductModel";

import useDebounce from "./useDebounce";
import { fetchProductsByType, getProductHot, SearchProduct } from "../../api/apiCustommer/productApi";

import ProductMenu from "./productMenu";

// Define the Category type
type Category = 'Mains' | 'Desserts' | 'Drinks';

interface CartItem {
    productId: number;
    productName: string;
    price: number;
    image: string;
    quantity: number;
}

const MenuProductCustomer: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('Mains');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [listProduct, setListProduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(""); // State cho ô tìm kiếm

    // Debounced search term
    const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

    useEffect(() => {
        const storedCart = sessionStorage.getItem('cartItems');
        if (storedCart) {
            try {
                const parsedCart: CartItem[] = JSON.parse(storedCart);
                setCartItems(parsedCart);
            } catch (e) {
                console.error("Failed to parse cartItems from sessionStorage:", e);
                setCartItems([]);
            }
        }
    }, []);

    // Fetch products when selectedCategory or debouncedSearchTerm changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let products: ProductModel[] = [];

                if (debouncedSearchTerm.trim() !== "") {
                    // Nếu có từ khóa tìm kiếm, gọi API tìm kiếm
                    products = await SearchProduct( debouncedSearchTerm);
                } else {
                    // Nếu không, gọi API lấy sản phẩm theo loại
                    products = await fetchProductsByType(selectedCategory);
                }

                setListProduct(products);
            } catch (err) {
                setError("Failed to load products.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory, debouncedSearchTerm]);

    // Handle add to cart
    const addToCart = (product: ProductModel) => {
        const existingProductIndex = cartItems.findIndex(item => item.productId === product.productId);

        if (existingProductIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingProductIndex].quantity += 1;
            setCartItems(updatedCartItems);
            sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } else {
            const newCartItem: CartItem = {
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                quantity: 1,
                image: product.image,
            };
            const newCartItems = [...cartItems, newCartItem];
            setCartItems(newCartItems);
            sessionStorage.setItem('cartItems', JSON.stringify(newCartItems));
        }
    };

    // Handle update quantity in cart
    const handleUpdateQuantity = (productId: number, quantity: number) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const renderProducts = () => {
        if (loading) {
            return <div className="text-center">Loading products...</div>;
        }

        if (error) {
            return <div className="text-danger text-center">{error}</div>;
        }

        if (listProduct.length === 0) {
            return <div className="text-center">No products available in this category.</div>;
        }

        return listProduct.map((product) => (
            <ProductMenu
                key={product.productId}
                id={product.productId}
                name={product.productName}
                price={product.price}
                image={product.image}
                addToCart={() => addToCart(product)}
            />
        ));
    };

    return (
        <>
            <div className="row mobile-layout">
                {/* Left Section */}
                <div className="col-md-8 position-relative left-section" style={{ paddingBottom: 0 }}>
                    <section className="banner">
                        <div id="carouselExampleIndicators" className="carousel slide">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                                        aria-label="Slide 2"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src={websiteGreen} className="d-block w-100 img-fluid" alt="Slide 1" />
                                </div>
                                <div className="carousel-item">
                                    <img src={bannerHome} className="d-block w-100 img-fluid" alt="Slide 2" />
                                </div>
                            </div>
                        </div>
                    </section>
                    <img src={bannerBuffet} alt="Main Dish Image" className="img-fluid" />
                </div>

                {/* Right Section */}
                <div className="col-12 col-md-4 px-md-4 px-2" style={{ paddingTop: 20 }}>
                    <div className="menu"
                         style={{ height: 'calc(100vh - 40px)', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                        <div className="row d-flex justify-content-center mb-3">
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                               onClick={() => setSelectedCategory('Mains')}>Mains</a>
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                               onClick={() => setSelectedCategory('Desserts')}>Desserts</a>
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                               onClick={() => setSelectedCategory('Drinks')}>Drinks</a>
                        </div>
                        <div>
                            {/* Category Header */}
                            <div className="row" style={{ height: '12.5%', marginLeft: '0px', paddingBottom: '20px' }}>
                                <span className="text-center fs-4" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}>
                                    {
                                        searchTerm ? "Search" : selectedCategory
                                    }

                                </span>
                            </div>

                            {/* Dropdown and Search Input */}
                            <div className="row" style={{ height: '3rem', marginLeft: '0px' }}>
                                <div className="p-0 d-flex justify-content-between align-items-center">
                                    {/* Dropdown */}
                                    <div className="dropdown">
                                        <a
                                            className="btn dropdown-toggle p-0 border-0"
                                            style={{ height: '2rem', fontSize: '15px' }}
                                            href="#"
                                            role="button"
                                            id="dropdownMenuLink"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Sort By
                                        </a>

                                        <ul className="dropdown-menu p-0" aria-labelledby="dropdownMenuLink"
                                            style={{ fontSize: '15px' }}>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Price: Low to High
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Price: High to Low
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Newest
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Search Input */}
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search in here"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 tinh-overflowScroll border-0 d-block"
                             style={{ maxHeight: 'calc(100vh - 200px)', marginLeft: 0, overflowY: 'auto' }}>
                            {renderProducts()}
                        </div>
                    </div>
                </div>

                {/* Offcanvas for Cart */}
                <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasCart"
                     aria-labelledby="offcanvasCartLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title">Giỏ Hàng</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className="cart-page tinh-overflowScroll" style={{ height: 400, overflowY: 'auto' }}>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Product</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col" className="text-end">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="cart-info d-flex align-items-center">
                                            <img src={item.image} className="rounded" alt={item.productName} width="80" />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{item.productName}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleUpdateQuantity(item.productId, Number(e.target.value))}
                                            />
                                        </td>
                                        <td className="text-end">{item.price * item.quantity} VND</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="total-price d-flex justify-content-end">
                            <table className="table">
                                <tr>
                                    <td>Subtotal</td>
                                    <td className="text-end fw-bold">
                                        {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} VND
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <button className="btn btn-danger">Tiến hành thanh toán</button>
                    </div>
                </div>
            </div>
        </>
    );

};

export default MenuProductCustomer;

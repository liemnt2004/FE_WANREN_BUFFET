import React, { useEffect, useState } from "react";
import './assets/css/styles.css';
import './assets/css/menu.css';

// Importing images directly
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import launam from './assets/img/la_u_na_m_2.jpg';
import nuocGaoDuaHau from './assets/img/nuoc-gao-dua-hau_1_1.jpg';
import nuocGaoOiXoai from './assets/img/nuoc-gao-oi-xoai_1_1.jpg';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import ProductMenu from "./productMenu";
import { fetchProductsByType, getProductHot } from "../../api/apiCustommer/productApi";
import ProductModel from "../../models/ProductModel";


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
    const [listproduct, setlistproduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Load cart items from sessionStorage on component mount
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

    // Fetch products when selectedCategory changes
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchProductsByType(selectedCategory)
            .then(product => {
                setlistproduct(product);
            })
            .catch(err => {
                setError("Failed to load products.");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedCategory]);

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

    const renderProducts = () => {
        if (loading) {
            return <div className="text-center">Loading products...</div>;
        }

        if (error) {
            return <div className="text-danger text-center">{error}</div>;
        }

        if (listproduct.length === 0) {
            return <div className="text-center">No products available in this category.</div>;
        }

        return listproduct.map((product) => (
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
                            {/* Mains Header */}
                            <div className="row" style={{ height: '12.5%', marginLeft: '0px', paddingBottom: '20px' }}>
                                <span className="text-center fs-4" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}>
                                    {selectedCategory}
                                </span>
                            </div>

                            {/* Dropdown and Search Input */}
                            <div className="row" style={{ height: '1.5rem', marginLeft: '0px' }}>
                                <div className="p-0 d-flex justify-content-between align-items-center">
                                    <div className="dropdown">
                                        <a
                                            className="btn dropdown-toggle p-0 border-0"
                                            style={{ height: '1.5rem', fontSize: '15px' }}
                                            href="#"
                                            role="button"
                                            id="dropdownMenuLink"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Dropdown link
                                        </a>

                                        <ul className="dropdown-menu p-0" aria-labelledby="dropdownMenuLink"
                                            style={{ fontSize: '15px' }}>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Action
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Another action
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    Something else here
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <input type="text" className="form-control" id="name"
                                               placeholder="Search in here" required />
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
                                        <td><input type="number" value={item.quantity} min="1" readOnly /></td>
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

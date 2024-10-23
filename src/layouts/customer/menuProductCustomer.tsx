import React, { useEffect, useState, useContext } from "react";
import './assets/css/styles.css';
import './assets/css/menu.css';

// Import hình ảnh
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';

import ProductModel from "../../models/ProductModel";
import useDebounce from "./useDebounce";
import { fetchProductsByType, SearchProduct } from "../../api/apiCustommer/productApi";
import ProductMenu from "./productMenu";
import { CartContext } from "./CartContext";

// Định nghĩa loại Category
type Category = 'Mains' | 'Desserts' | 'Drinks';

const MenuProductCustomer: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('Mains');
    const [listProduct, setListProduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Trạng thái cho ô tìm kiếm

    // Debounced search term
    const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

    const cartContext = useContext(CartContext);




    // Fetch products when selectedCategory or debouncedSearchTerm changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let products: ProductModel[] = [];

                if (debouncedSearchTerm.trim() !== "") {
                    products = await SearchProduct( debouncedSearchTerm);
                } else {
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

    if (!cartContext) {
        return <div>Đang tải giỏ hàng...</div>;
    }

    const { addToCart } = cartContext;

    const renderProducts = () => {
        if (loading) {
            return <div className="text-center">Đang tải sản phẩm...</div>;
        }

        if (error) {
            return <div className="text-danger text-center">{error}</div>;
        }

        if (listProduct.length === 0) {
            return <div className="text-center">Không có sản phẩm nào trong danh mục này.</div>;
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
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall"
                               style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                               onClick={() => setSelectedCategory('Mains')}>Món Chính</a>
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall"
                               style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                               onClick={() => setSelectedCategory('Desserts')}>Tráng Miệng</a>
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall"
                               style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                               onClick={() => setSelectedCategory('Drinks')}>Nước</a>
                        </div>
                        <div>
                            {/* Category Header */}
                            <div className="row" style={{ height: '12.5%', marginLeft: '0px', paddingBottom: '20px' }}>
                                <span className="text-center fs-4" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}>
                                    {searchTerm ? "Tìm Kiếm" : selectedCategory}
                                </span>
                            </div>

                            {/* Dropdown and Search Input */}
                            <div className="row" style={{ height: '3rem', marginLeft: '0px' }}>
                                <div className="p-0 d-flex  align-items-end">
                                    {/* Dropdown */}


                                    {/* Search Input */}
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm Kiếm"
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
            </div>
        </>
    );
};

export default MenuProductCustomer;

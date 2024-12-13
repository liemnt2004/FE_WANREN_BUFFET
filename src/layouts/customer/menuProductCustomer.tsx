import React, { useEffect, useState, useContext } from "react";
import './assets/css/styles.css';
import './assets/css/menu.css';

// Import hình ảnh
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';

import ProductModel from "../../models/ProductModel";
import useDebounce from "./component/useDebounce";
import { fetchProductsByCategory, SearchProduct } from "../../api/apiCustommer/productApi";
import ProductMenu from "./component/productMenu";
import { CartContext } from "./component/CartContext";
import Banner from "./component/Banner";
import { useTranslation } from 'react-i18next';

// Định nghĩa loại Category
type Category = 'mains' | 'desserts' | 'soft_drinks';

const MenuProductCustomer: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('mains');
    const [listProduct, setListProduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Trạng thái cho ô tìm kiếm

    // Debounced search term
    const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

    const cartContext = useContext(CartContext);

    const { t } = useTranslation(); // Sử dụng hook useTranslation

    // Fetch products when selectedCategory or debouncedSearchTerm changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let products: ProductModel[] = [];

                if (debouncedSearchTerm.trim() !== "") {
                    products = await SearchProduct(debouncedSearchTerm);
                } else {
                    products = await fetchProductsByCategory(selectedCategory);
                }

                setListProduct(products);
            } catch (err) {
                setError(t('failed_to_load_products')); // Sử dụng khóa dịch thuật
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory, debouncedSearchTerm, t]);

    if (!cartContext) {
        return <div>{t('loading_cart')}</div>; // Sử dụng khóa dịch thuật
    }

    const { addToCart, decreaseQuantity } = cartContext;

    const renderProducts = () => {
        if (loading) {
            return <div className="text-center">{t('loading_products')}</div>; // Sử dụng khóa dịch thuật
        }

        if (error) {
            return <div className="text-danger text-center">{error}</div>;
        }

        if (listProduct.length === 0) {
            return <div className="text-center">{t('no_products_in_category')}</div>; // Sử dụng khóa dịch thuật
        }

        return listProduct.map((product) => (
            <ProductMenu
                key={product.productId}
                id={product.productId}
                name={product.productName}
                price={product.price}
                image={product.image}
                addToCart={() => addToCart(product)}
                decreaseQuantity={(productId: number) => decreaseQuantity(productId)}
            />
        ));
    };

    return (
        <>
            <div className="container-fluid row mobile-layout m-0">
                {/* Left Section */}
                <div className="col-md-8 position-relative left-section" style={{ paddingBottom: 0 }}>
                    <Banner></Banner>
                    <img src={bannerBuffet} alt={t('main_dish_image_alt')} className="img-fluid" />
                </div>

                {/* Right Section */}
                <div className="col-12 col-md-4 px-md-4 px-2" style={{ paddingTop: 20 }}>
                    <div className="menu"
                        style={{ height: 'calc(100vh - 40px)', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                        <div className="row d-flex justify-content-center mb-3">
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall"
                                style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                                onClick={() => setSelectedCategory('mains')}>{t('mains')}</a>
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall"
                                style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                                onClick={() => setSelectedCategory('desserts')}>{t('desserts')}</a>
                            <a href="#" className="tinh-scaleText tinh-textColor tinh-navWall"
                                style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}
                                onClick={() => setSelectedCategory('soft_drinks')}>{t('soft_drinks')}</a>
                        </div>
                        <div>
                            {/* Category Header */}
                            <div className="row" style={{ height: '12.5%', marginLeft: '0px', paddingBottom: '20px' }}>
                                <span className="text-center fs-4" style={{ color: 'var(--colorPrimary)', fontWeight: 'bold' }}>
                                    {searchTerm ? t('search_results') :
                                        (selectedCategory === 'mains' ? t('mains')
                                            : selectedCategory === 'desserts' ? t('desserts')
                                                : selectedCategory === 'soft_drinks' ? t('soft_drinks') 
                                                    : selectedCategory)}
                                </span>
                            </div>

                            {/* Dropdown and Search Input */}
                            <div className="row" style={{ height: '3rem', marginLeft: '0px' }}>
                                <div className="p-0 d-flex justify-content-center">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder={t('search_placeholder')} // Sử dụng khóa dịch thuật
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 tinh-overflowScroll border-0 d-block"
                            style={{ maxHeight: 'calc(100vh - 240px)', marginLeft: 0, overflowY: 'auto' }}>
                            {renderProducts()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuProductCustomer;

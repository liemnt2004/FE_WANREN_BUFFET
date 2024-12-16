// src/components/MainDash.tsx
import React, { useState, useEffect, useContext } from "react";
import './assets/css/styles.css';
import './assets/css/product_detail.css';
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import image1500x700 from './assets/img/1500x700-01_1_1.png';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import kichiHomeAll from './assets/img/kichi-home-all.png';
import lau3 from './assets/img/Lau3-300x300.jpg';
import cothaygia from './assets/img/cothaygia_t11.png';
import publicAvif from './assets/img/public.avif';
import khichi from './assets/img/Kichi.svg';
import bannerThum from './assets/img/Thêm tiêu đề.png';
import loginfooter from './assets/img/Cream and Black Simple Illustration Catering Logo.png';
import ProductModel from "../../models/ProductModel";
import { getProductHot } from "../../api/apiCustommer/productApi";
import { CartContext, CartItem, useCart } from "./component/CartContext"; // Sử dụng custom hook
import formatMoney from "./component/FormatMoney";
import { AuthContext } from "./component/AuthContext";
import { useNavigate } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import Banner from "./component/Banner";
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n";
import { Link } from "react-router-dom";


  
const IndexCustomer: React.FC = () => {
    const [listProduct, setListProduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null); // Lưu sản phẩm đang chọn

    const { fullName, logout } = useContext(AuthContext);
    const { cartItems, addToCart, updateQuantity, decreaseQuantity } = useCart();
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = React.useState<AccordionEventKey>('0');

    // Hàm xử lý sự kiện khi Accordion thay đổi
    const handleAccordionSelect = (eventKey: AccordionEventKey, e: React.SyntheticEvent<unknown>) => {
        console.log(eventKey);
        setActiveKey(eventKey);
    };
   
    const { t } = useTranslation(); 

    // State để quản lý số lượng của sản phẩm trong modal
    const [modalQuantities, setModalQuantities] = useState<{ [key: number]: number }>({});

    // Lấy sản phẩm hot khi component được render
    useEffect(() => {
        getProductHot()
            .then(product => {
                setListProduct(product);
                setLoading(false);

                // Khởi tạo số lượng mặc định là 1 cho từng sản phẩm
                const initialQuantities: { [key: number]: number } = {};
                product.forEach(p => {
                    initialQuantities[p.productId] = 1;
                });
                setModalQuantities(initialQuantities);
            })
            .catch(err => {
                setError("Không thể tải sản phẩm hot.");
                setLoading(false);
            });
    }, []);

    // useEffect to show modal when a product is selected
    useEffect(() => {
        if (selectedProduct) {



            const modalElement = document.getElementById(`productModal${selectedProduct.productId}`);
            if (modalElement) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();

            }
        }
    }, [selectedProduct]);


    const closeModal = () => {
        setSelectedProduct(null);
        const modalElement = document.getElementById(`productModal${selectedProduct?.productId}`);

        if (modalElement) {
            setModalQuantities({});
            const modal = new window.bootstrap.Modal(modalElement);

            modal.hide(); // Đóng modal
            modalElement.classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop')?.remove();
        }
    };



    // Hàm để thêm sản phẩm vào giỏ hàng với số lượng cụ thể
    const addProductToCart = (product: ProductModel) => {
        const quantity = modalQuantities[product.productId] || 1;

        const existingCartItem = cartItems.find(item => item.productId === product.productId);

        if (existingCartItem) {
            const updatedCartItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + quantity
            };

            updateQuantity(product.productId, updatedCartItem.quantity);
        } else {
            const cartItem: CartItem = {
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                image: product.image,
                quantity: quantity,
            };

            addToCart(cartItem);
        }

        closeModal();

    };


    const decreaseQuantityModal = (productId: number) => {
        const newQuantity = Math.max((modalQuantities[productId] || 1) - 1, 1); // Không để số lượng nhỏ hơn 1
        setModalQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
        // updateQuantity(productId, newQuantity);
    };

    const handleQuantityChange = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(event.target.value), 1); // Đảm bảo số lượng không nhỏ hơn 1
        setModalQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: value
        }));
    };

    const increaseQuantity = (productId: number) => {
        const newQuantity = (modalQuantities[productId] || 1) + 1;
        setModalQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
    };



    const handleProductClick = (product: ProductModel) => {
        // Nếu bấm vào sản phẩm đã được chọn, ta sẽ đặt lại `selectedProduct` thành null để đóng modal
        if (selectedProduct && selectedProduct.productId === product.productId) {
            setSelectedProduct(null); // Đóng modal nếu bấm lại vào sản phẩm đã chọn
        } else {
            product.quantity = 1;
            setSelectedProduct(product); // Mở modal cho sản phẩm được chọn

        }
    };

   
    
  
      









    return (
        <div className="container-fluid">
            <div className="row mobile-layout">
                <div className="col-md-9 position-relative left-section"
                    style={{ overflowY: "auto", maxHeight: "100vh", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div style={{ height: "2000px" }} className="about-left">
                        {/* Banner Section */}
                        <Banner></Banner>


                        {/* Main Dish Image */}
                        <img src={bannerBuffet} alt="Main Dish Image" className="img-fluid" />

                        {/* About Section */}
                        <section className="bg-white row pb-5 about-section" style={{ backgroundColor: 'var(--body-color) !important'}}>
                            <div className="col-md-6" style={{ backgroundColor: 'var(--body-color) !important' }}>
                                <div className="about">
                                    <h4 className="fw-bold">{t('laubangchuyen')}</h4>
                                    <p className="py-4">{t('aboutDescription')}</p>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ backgroundColor: 'var(--body-color) !important' }}>
                                <img src={kichiHomeAll} alt="" className="img-fluid rounded-3 text-center" />
                            </div>
                        </section>

                        {/* Hot Deal Section */}
                        <section className="hot-deal" style={{ backgroundColor: 'white' }}>
                            <h4 className="fw-bold">{t('hotDeal')}</h4>
                            {loading ? (
                                <div>Đang tải sản phẩm...</div>
                            ) : error ? (
                                <div className="text-danger">{error}</div>
                            ) : (
                                <div className="d-flex justify-content-center" style={{ backgroundColor: 'var(--body-color) !important' }}>
                                    <div className="row g-4 mb-5" style={{ backgroundColor: 'var(--body-color) !important'}}>
                                        {listProduct.map((product) => (
                                            <React.Fragment key={product.productId}>
                                                <div className="col-6 col-md-3">
                                                    <div className="card border border-0 p-3 card-custom" style={{ backgroundColor: 'var(--body-color) !important' }}>
                                                        <img
                                                            src={product.image || lau3}
                                                            className="rounded-3"
                                                            alt={product.productName || 'Product Image'}
                                                            onClick={() => handleProductClick(product)}
                                                        />
                                                        <div className="card-body p-0">
                                                            <h5 className="card-title fs-6 m-0 p-0 pt-3 ">{product.productName}</h5>
                                                        </div>
                                                        <div className="mt-3 d-flex align-items-center card__price justify-content-between">
                                                            <h6 className="fw-bold">{formatMoney(product.price)}</h6>
                                                            <div className="col-3 d-flex w-50 add-to-cart justify-content-end">
                                                                {/* Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa */}
                                                                {cartItems && cartItems.length > 0 ? (
                                                                    cartItems.map((item) => {
                                                                        if (item.productId === product.productId) {
                                                                            const quantity = item.quantity;

                                                                            return (
                                                                                <div className="d-flex align-items-center" key={item.productId}>
                                                                                    {quantity > 0 && (
                                                                                        <button
                                                                                            id="decrement"
                                                                                            type="button"
                                                                                            className="btn btn-danger ms-2"
                                                                                            onClick={() => decreaseQuantity(item.productId)} // Giảm số lượng
                                                                                        >
                                                                                            <i className="bi bi-dash-lg"></i>
                                                                                        </button>
                                                                                    )}
                                                                                    {quantity > 0 && (
                                                                                        <span className="mx-2">{quantity}</span>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })
                                                                ) : null}
                                                                <button
                                                                    type="button"
                                                                    id="increment"
                                                                    className="btn btn-danger"
                                                                    onClick={() => addToCart(product)}
                                                                >
                                                                    <i className="bi bi-plus-lg"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Modal cho mỗi sản phẩm */}
                                                {selectedProduct && selectedProduct.productId === product.productId && (
                                                    <div
                                                        className="modal fade ps36231"
                                                        id={`productModal${selectedProduct.productId}`}
                                                        tabIndex={-1}
                                                        aria-hidden="true"
                                                        onClick={(e) => {
                                                            if (e.target === e.currentTarget) { // Kiểm tra xem người dùng có click vào phần nền (background) của modal không
                                                                closeModal();
                                                            }
                                                        }}
                                                    >
                                                        <div className="modal-dialog modal-dialog-centered">
                                                            <div className="modal-content p-0">
                                                                <div className="container-modal">
                                                                    <div className="container-modal-header">
                                                                        <div className="control-img">
                                                                            <img
                                                                                src={selectedProduct.image}
                                                                                alt={selectedProduct.productName}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="container-modal-footer">
                                                                        <div className="name-item">{selectedProduct.productName}</div>
                                                                        <div className="capacity-item">{selectedProduct.description}</div>
                                                                        <div className="container-price-quantity">
                                                                            <div className="price">
                                                                                <span>Giá: {formatMoney(selectedProduct.price)}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="quantity-control d-flex justify-content-between align-items-center">
                                                                            <div>
                                                                                <button
                                                                                    id="increment"
                                                                                    type="button"
                                                                                    className="btn btn-danger"
                                                                                    onClick={() => decreaseQuantityModal(selectedProduct.productId)}
                                                                                >
                                                                                    <i className="bi bi-dash-lg"></i>
                                                                                </button>
                                                                                <input
                                                                                    type="number"
                                                                                    value={modalQuantities[selectedProduct.productId] || 1}
                                                                                    onChange={(e) =>
                                                                                        handleQuantityChange(selectedProduct.productId, e)
                                                                                    }
                                                                                    min="1"
                                                                                />
                                                                                <button
                                                                                    id="increment"
                                                                                    type="button"
                                                                                    className="btn btn-danger"
                                                                                    onClick={() => increaseQuantity(selectedProduct.productId)}
                                                                                >
                                                                                    <i className="bi bi-plus-lg"></i>
                                                                                </button>
                                                                            </div>
                                                                            <div>
                                                                                <button
                                                                                    className="btn btn-danger p-2"
                                                                                    onClick={() => addProductToCart(selectedProduct)}
                                                                                >
                                                                                    Thêm vào giỏ hàng
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>


                        {/* What Can We Do Section */}
                        <section className="what-can-we-do mt-3 pb-4" style={{ backgroundColor: 'var(--body-color) !important' }}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 help" style={{ paddingLeft: 0, paddingRight: '50px' ,backgroundColor: 'var(--body-color) !important' }}  >
                                        <h4 className="fw-bold pb-4">{t("whatCanWeDo")}</h4>
                                        <div className="container mt-5">
                                            <Accordion activeKey={activeKey} onSelect={handleAccordionSelect} flush>
                                                <Accordion.Item eventKey="0" style={{ backgroundColor: 'var(--body-color) !important' }} >
                                                    <Accordion.Header >{t('faq1Header')}</Accordion.Header>
                                                    <div
                                                        className="accordion-body"
                                                        style={{ display: activeKey === '0' ? 'block' : 'none', color:'var(--text-color)' }}
                                                    >
                                                        {t('faq1Body')}
                                                    </div>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey="1" style={{ backgroundColor: 'var(--body-color) !important' }} >
                                                    <Accordion.Header>{t('faq2Header')}</Accordion.Header>
                                                    <div
                                                        className="accordion-body"
                                                        style={{ display: activeKey === '1' ? 'block' : 'none' ,color:'var(--text-color)'}}
                                                    >
                                                       {t('faq2Body')}
                                                    </div>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey="2" style={{ backgroundColor: 'var(--body-color) !important' }} >
                                                    <Accordion.Header>{t('faq3Header')}</Accordion.Header>
                                                    <div
                                                        className="accordion-body"
                                                        style={{ display: activeKey === '2' ? 'block' : 'none',color:'var(--text-color)' }}
                                                    >
                                                        {t('faq3Body')}
                                                    </div>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey="3" style={{ backgroundColor: 'var(--body-color) !important' }} >
                                                    <Accordion.Header>{t('faq4Header')}</Accordion.Header>
                                                    <div
                                                        className="accordion-body"
                                                        style={{ display: activeKey === '3' ? 'block' : 'none',color:'var(--text-color)' }}
                                                    >
                                                        {t('faq4Body')}
                                                    </div>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey="4" style={{ backgroundColor: 'var(--body-color) !important' }} >
                                                    <Accordion.Header>{t('faq5Header')}</Accordion.Header>
                                                    <div
                                                        className="accordion-body"
                                                        style={{ display: activeKey === '4' ? 'block' : 'none' ,color:'var(--text-color)'}}
                                                    >
                                                        {t('faq5Body')}
                                                    </div>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{ paddingRight: 0 , backgroundColor: 'var(--body-color) !important' }}>
                                        <h4 className="fw-bold pb-4">{t('customerFeedback')}</h4>
                                        <div id="carouselExampleCaptions" className="carousel slide"
                                            data-bs-ride="carousel">
                                            {/* Carousel Indicators */}
                                            <div className="carousel-indicators">
                                                <button
                                                    type="button"
                                                    data-bs-target="#carouselExampleCaptions"
                                                    data-bs-slide-to="0"
                                                    className="active"
                                                    aria-current="true"
                                                    aria-label="Slide 1"
                                                ></button>
                                                <button
                                                    type="button"
                                                    data-bs-target="#carouselExampleCaptions"
                                                    data-bs-slide-to="1"
                                                    aria-label="Slide 2"
                                                ></button>
                                                <button
                                                    type="button"
                                                    data-bs-target="#carouselExampleCaptions"
                                                    data-bs-slide-to="2"
                                                    aria-label="Slide 3"
                                                ></button>
                                            </div>

                                            {/* Carousel Inner */}
                                            <div className="carousel-inner">
                                                {/* Slide 1 */}
                                                <div className="carousel-item active" >
                                                    <div className="customers-say text-center p-5" >
                                                        <div className="profile-img text-center">
                                                            <img
                                                                src={khichi}
                                                                alt="Khichi"
                                                                width="70"
                                                                height="70"
                                                                className="img-fluid"
                                                                style={{ borderRadius: '50%' }}
                                                            />
                                                        </div>
                                                        <div className="comment py-5">
                                                            <p>
                                                                Đồ ăn ngon, nhân viên nhiệt tình
                                                            </p>
                                                        </div>
                                                        <div className="profile-info">
                                                            <h5 className="name">Nguyen Hoai Nam</h5>
                                                            <p>Khách Hàng</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Slide 2 */}
                                                <div className="carousel-item">
                                                    <div className="customers-say text-center p-5">
                                                        <div className="profile-img">
                                                            <img
                                                                src={khichi}
                                                                alt="Icook"
                                                                width="70"
                                                                height="70"
                                                                className="img-fluid"
                                                                style={{ borderRadius: '50%' }}
                                                            />
                                                        </div>
                                                        <div className="comment py-5">
                                                            <p>
                                                                Phục vụ nhanh, nhân viên thân thiện
                                                            </p>
                                                        </div>
                                                        <div className="profile-info">
                                                            <h5 className="name">Mai Thi My Linh</h5>
                                                            <p>Khách Hàng</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Slide 3 */}
                                                <div className="carousel-item">
                                                    <div className="customers-say text-center p-5">
                                                        <div className="profile-img">
                                                            <img
                                                                src={khichi}
                                                                alt="Kichi"
                                                                width="70"
                                                                height="70"
                                                                className="img-fluid"
                                                                style={{ borderRadius: '50%' }}
                                                            />
                                                        </div>
                                                        <div className="comment py-5">
                                                            <p>
                                                                Đồ ăn ra nhanh
                                                            </p>
                                                        </div>
                                                        <div className="profile-info">
                                                            <h5 className="name">Luong Cong Huan</h5>
                                                            <p>Khách Hàng</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Carousel Controls */}
                                            <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-bs-target="#carouselExampleCaptions"
                                                data-bs-slide="prev"
                                            >
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-bs-target="#carouselExampleCaptions"
                                                data-bs-slide="next"
                                            >
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="text-center text-lg-start bg-body-tertiary text-muted" style={{ backgroundColor: 'var(--body-color) !important' }}>
                            <section className="pt-3">
                                <div className="container text-center text-md-start mt-5 pb-5 border-bottom">
                                    <div className="row mt-3" style={{color:'var(--text-color)'}}>
                                        <div className="col-md-5">
                                            <img src={loginfooter} width="100" alt="Logo Footer" className="img-feeback" />
                                            <p className="mt-3 mb-4">{t('footerDescription')}</p>
                                            <h6 className="fw-bold">{t('followUs')}</h6>
                                            <div className="footer-contact mt-3 text-secondary">
                                                <i className="bi bi-facebook pe-3"></i>
                                                <i className="bi bi-twitter pe-3"></i>
                                                <i className="bi bi-instagram pe-3"></i>
                                                <i className="bi bi-linkedin pe-3"></i>
                                                <i className="bi bi-rss-fill pe-3"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <h5 className="text-uppercase fw-bold mb-4">{t('openingHours')}</h5>
                                            <p>{t('openDays')}</p>
                                            <p>{t('holidayPolicy')}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h5 className="text-uppercase fw-bold mb-4">{t('aboutUs')}</h5>
                                            <section className="ratio ratio-16x9">
                                                <iframe
                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.177875756147!2d106.68670197570356!3d10.79768475879993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adedecb7bc5f%3A0xa3f78f8a3e35f1b0!2zTOG6qXUgQsSDbmcgQ2h1eeG7gW4gS2ljaGkgS2ljaGk!5e0!3m2!1svi!2s!4v1727163707823!5m2!1svi!2s"
                                                    width="300" height="200" style={{ border: 0 }}
                                                    loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                                <div className="container d-flex align-items-center py-4 justify-content-between">
                                    <p className="m-0">{t('projectName')}</p>
                                </div>
                            </section>
                        </footer>
                    </div>
                </div>
                {/* Right Section: Smaller Images */}
                <div className="col-md-3 right-section">
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <Link to="/menu"><img src={cothaygia} alt="Menu" className="img-fluid" /></Link>
                            <Link to="/menu" className="btn btn-outline-light mt-2">{t('menuButton')}</Link>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <Link to="/reservation"><img src={bannerHome} alt="Reservation" className="img-fluid" /></Link>
                            <Link to="/reservation" className="btn btn-outline-light mt-2">{t('reservationButton')}</Link>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <Link to="/promotion"><img src={publicAvif} alt="Promotion" className="img-fluid" /></Link>
                            <Link to="/promotion" className="btn btn-outline-light mt-2">{t('promotionButton')}</Link>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );

};

export default IndexCustomer;

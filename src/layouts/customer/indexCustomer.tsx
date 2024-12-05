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
import loginfooter from './assets/img/Cream and Black Simple Illustration Catering Logo.png';
import ProductModel from "../../models/ProductModel";
import { getProductHot } from "../../api/apiCustommer/productApi";
import {CartItem, useCart} from "./component/CartContext"; // Sử dụng custom hook
import formatMoney from "./component/FormatMoney";
import { AuthContext } from "./component/AuthContext";
import { useNavigate } from "react-router-dom";
import {Modal} from "bootstrap"
const IndexCustomer: React.FC = () => {
    const [listProduct, setListProduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null); // Lưu sản phẩm đang chọn

    const { fullName, logout } = useContext(AuthContext);
    const { cartItems, addToCart, updateQuantity } = useCart();
    const navigate = useNavigate();

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

// Hàm để thêm sản phẩm vào giỏ hàng với số lượng cụ thể
    const addProductToCart = (product: ProductModel) => {
        if (!fullName) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/login");
            return;
        }

        const quantity = modalQuantities[product.productId] || 1;

        const cartItem: CartItem = {
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            image: product.image,
            quantity: quantity,
        };

        addToCart(cartItem);

        // Sau đó, nếu người dùng muốn thay đổi số lượng, gọi updateQuantity
        if (quantity > 1) {
            updateQuantity(product.productId, quantity);
        }
    };

    const decreaseQuantity = (productId: number) => {
        const newQuantity = Math.max((modalQuantities[productId] || 1) - 1, 1); // Không để số lượng nhỏ hơn 1
        setModalQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
        updateQuantity(productId, newQuantity);
    };

    const handleQuantityChange = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(event.target.value), 1); // Đảm bảo số lượng không nhỏ hơn 1
        setModalQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: value
        }));

        // Cập nhật số lượng trong giỏ hàng sau khi thay đổi
        updateQuantity(productId, value);
    };

    const increaseQuantity = (productId: number) => {
        const newQuantity = (modalQuantities[productId] || 1) + 1;
        setModalQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
        updateQuantity(productId, newQuantity);
    };

    const handleProductClick = (product: ProductModel) => {
        setSelectedProduct(product);
    };








    return (
        <div className="container-fluid">
            <div className="row mobile-layout">
                <div className="col-md-9 position-relative left-section"
                     style={{ overflowY: "auto", maxHeight: "100vh", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div style={{height: "2000px"}} className="about-left">
                        {/* Banner Section */}
                        <section className="banner">
                            <div id="carouselExampleIndicators" className="carousel slide">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators"
                                            data-bs-slide-to="0"
                                            className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators"
                                            data-bs-slide-to="1"
                                            aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators"
                                            data-bs-slide-to="2"
                                            aria-label="Slide 3"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={websiteGreen} className="d-block w-100 img-fluid" alt="..."/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src={bannerHome} className="d-block w-100 img-fluid" alt="..."/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src={image1500x700} className="d-block w-100 img-fluid" alt="..."/>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button"
                                        data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button"
                                        data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </section>

                        {/* Main Dish Image */}
                        <img src={bannerBuffet} alt="Main Dish Image" className="img-fluid"/>

                        {/* About Section */}
                        <section className="bg-white row pb-5 about-section">
                            <div className="col-md-6">
                                <div className="about">
                                    <h4 className="fw-bold">Lẩu Băng chuyền</h4>
                                    <p className="py-4">Kichi-Kichi là chuỗi nhà hàng chuyên về Buffet lẩu hàng đầu Việt
                                        Nam...</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <img src={kichiHomeAll} alt="" className="img-fluid rounded-3 text-center"/>
                            </div>
                        </section>

                        {/* Hot Deal Section */}
                        <section className="hot-deal" style={{backgroundColor: 'white'}}>
                            <h4 className="fw-bold">HOT DEAL</h4>
                            {loading ? (
                                <div>Đang tải sản phẩm...</div>
                            ) : error ? (
                                <div className="text-danger">{error}</div>
                            ) : (
                                <div className="d-flex justify-content-center">
                                    <div className="row g-4 mb-5">
                                        {listProduct.map((product) => (
                                            <React.Fragment key={product.productId}>
                                                <div className="col-6 col-md-3"
                                                     onClick={() => handleProductClick(product)}>
                                                    <div className="card border border-0 p-3 card-custom text-center">
                                                        <img
                                                            src={product.image || lau3}
                                                            className="rounded-3"
                                                            alt={product.productName || 'Product Image'}
                                                            style={{height: 200, width: 250}}
                                                        />
                                                        <div className="card-body p-0">
                                                            <h5 className="card-title fs-6 m-0 p-0">{product.productName}</h5>
                                                        </div>
                                                        <div
                                                            className="mt-4 mb-2 d-flex justify-content-around align-items-center">
                                                            <h6 className="card__price fw-bold">{formatMoney(product.price)}</h6>
                                                            <button
                                                                id="increment"
                                                                onClick={() => addProductToCart(product)} // Chỉ thêm sản phẩm vào giỏ hàng, không mở modal
                                                                disabled={!fullName} // Vô hiệu hóa nếu chưa đăng nhập
                                                                title={fullName ? "Thêm vào giỏ hàng" : "Vui lòng đăng nhập để thêm vào giỏ hàng"}
                                                            >
                                                                <i className="bi bi-plus-lg"></i>
                                                            </button>

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
                                                    >
                                                        <div className="modal-dialog modal-dialog-centered">
                                                            <div className="modal-content">
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
                                                                        <div
                                                                            className="name-item">{selectedProduct.productName}</div>
                                                                        <div
                                                                            className="capacity-item">{selectedProduct.description}</div>
                                                                        <div className="container-price-quantity">
                                                                            <div className="price">
                                                                                <span>Giá: {formatMoney(selectedProduct.price)}</span>
                                                                            </div>

                                                                            <button
                                                                                className="control-btn-add-to-cart btn"
                                                                                onClick={() => addProductToCart(selectedProduct)}>
                                                                                Thêm vào giỏ hàng
                                                                            </button>
                                                                            <span>
                                                                                <div className="quantity-control">
                                                                                <button
                                                                                    className="btn"
                                                                                    onClick={() => decreaseQuantity(selectedProduct.productId)}
                                                                                >
                                                                                    -
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
                                                                                    className="btn"
                                                                                    onClick={() => increaseQuantity(selectedProduct.productId)}
                                                                                >
                                                                                    +
                                                                                </button>
                                                                            </div>
                                                                            </span>
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
                        <section className="what-can-we-do mt-3 pb-4" style={{backgroundColor: 'white'}}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 help" style={{paddingLeft: 0, paddingRight: '50px'}}>
                                        <h4 className="fw-bold pb-4">CHÚNG TÔI CÓ THỂ GIÚP GÌ CHO BẠN ?</h4>
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
  <div className="accordion-item">
    <h2 className="accordion-header" id="flush-headingOne">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
        Accordion Item #1
      </button>
    </h2>
    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
      <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="flush-headingTwo">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
        Accordion Item #2
      </button>
    </h2>
    <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
      <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="flush-headingThree">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
        Accordion Item #3
      </button>
    </h2>
    <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
      <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
    </div>
  </div>
</div>
                                    </div>
                                    <div className="col-md-6" style={{paddingRight: 0}}>
                                        <h4 className="fw-bold pb-4">KHÁCH HÀNG NÓI GÌ?</h4>
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
                                                <div className="carousel-item active">
                                                    <div className="customers-say text-center p-5">
                                                        <div className="profile-img text-center">
                                                            <img
                                                                src={khichi}
                                                                alt="Khichi"
                                                                width="70"
                                                                height="70"
                                                                className="img-fluid"
                                                                style={{borderRadius: '50%'}}
                                                            />
                                                        </div>
                                                        <div className="comment py-5">
                                                            <p>
                                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                                Magni nesciunt tempore, dolore voluptatibus
                                                                reprehenderit vel!
                                                            </p>
                                                        </div>
                                                        <div className="profile-info">
                                                            <h5 className="name">Nguyen Hoai Nam</h5>
                                                            <p>Customer</p>
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
                                                                style={{borderRadius: '50%'}}
                                                            />
                                                        </div>
                                                        <div className="comment py-5">
                                                            <p>
                                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                                Magni nesciunt tempore, dolore voluptatibus
                                                                reprehenderit vel!
                                                            </p>
                                                        </div>
                                                        <div className="profile-info">
                                                            <h5 className="name">Mai Thi My Linh</h5>
                                                            <p>Customer</p>
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
                                                                style={{borderRadius: '50%'}}
                                                            />
                                                        </div>
                                                        <div className="comment py-5">
                                                            <p>
                                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                                Magni nesciunt tempore, dolore voluptatibus
                                                                reprehenderit vel!
                                                            </p>
                                                        </div>
                                                        <div className="profile-info">
                                                            <h5 className="name">Luong Cong Huan</h5>
                                                            <p>Customer</p>
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
                        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
                            <section className="pt-3">
                                <div className="container text-center text-md-start mt-5 pb-5 border-bottom">
                                    <div className="row mt-3">
                                        <div className="col-md-5">
                                            <img src={loginfooter} width="100" alt="Logo Footer" className="img-feeback" />
                                            <p className="mt-3 mb-4">WANREN BUFFET là nhà hàng chuyên về Buffet lẩu hàng
                                                đầu Việt Nam</p>
                                            <h6 className="fw-bold">Theo dõi chúng tôi trên mạng xã hội:</h6>
                                            <div className="footer-contact mt-3 text-secondary">
                                                <i className="bi bi-facebook pe-3"></i>
                                                <i className="bi bi-twitter pe-3"></i>
                                                <i className="bi bi-instagram pe-3"></i>
                                                <i className="bi bi-linkedin pe-3"></i>
                                                <i className="bi bi-rss-fill pe-3"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <h5 className="text-uppercase fw-bold mb-4">Thời gian mở cửa</h5>
                                            <p>Thứ 2 - Chủ Nhật: 10h - 22h</p>
                                            <p>Chúng tôi làm việc tất cả các ngày lễ</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h5 className="text-uppercase fw-bold mb-4">Về Chúng Tôi</h5>
                                            <section className="ratio ratio-16x9">
                                                <iframe
                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.177875756147!2d106.68670197570356!3d10.79768475879993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adedecb7bc5f%3A0xa3f78f8a3e35f1b0!2zTOG6qXUgQsSDbmcgQ2h1eeG7gW4gS2ljaGkgS2ljaGk!5e0!3m2!1svi!2s!4v1727163707823!5m2!1svi!2s"
                                                    width="300" height="200" style={{border: 0}}
                                                    loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                                <div className="container d-flex align-items-center py-4 justify-content-between">
                                    <p className="m-0">Dự Án Tốt Nghiệp</p>
                                </div>
                            </section>
                        </footer>
                    </div>
                </div>
                {/* Right Section: Smaller Images */}
                <div className="col-md-3 right-section">
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <a href="/menu"><img src={cothaygia} alt="Menu" className="img-fluid"/></a>
                            <a href="/menu" className="btn btn-outline-light mt-2">Thực Đơn →</a>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <a href="/reservation"><img src={bannerHome} alt="Reservation" className="img-fluid"/></a>
                            <a href="/reservation" className="btn btn-outline-light mt-2">Đặt Bàn →</a>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <a href="/promotion"><img src={publicAvif} alt="Promotion" className="img-fluid"/></a>
                            <a href="/promotion" className="btn btn-outline-light mt-2">Ưu Đãi →</a>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );

};

export default IndexCustomer;

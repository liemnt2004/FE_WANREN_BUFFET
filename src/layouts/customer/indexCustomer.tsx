import React, { useState, useEffect, useContext } from "react";
import './assets/css/styles.css';
import './assets/css/product_detail.css';
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import image1500x700 from './assets/img/1500x700-01_1_1.png';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import kichiHomeAll from './assets/img/kichi-home-all.png';
import datHang from './assets/img/datHang.png';
import heThong from './assets/img/heThong.png';
import giaoHang from './assets/img/giaoHang.png';
import uuDai from './assets/img/uuDaipng.png';
import lau3 from './assets/img/Lau3-300x300.jpg';
import cothaygia from './assets/img/cothaygia_t11.png';
import publicAvif from './assets/img/public.avif';
import khichi from './assets/img/Kichi.svg';
import loginfooter from './assets/img/Cream and Black Simple Illustration Catering Logo.png';
import ProductModel from "../../models/ProductModel";
import { getProductHot } from "../../api/apiCustommer/productApi";
import {CartContext, CartItem} from "./component/CartContext";
import formatMoney from "./component/FormatMoney";
const IndexCustomer: React.FC = () => {
    const [listProduct, setListProduct] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const cartContext = useContext(CartContext);



    // Lấy sản phẩm hot khi component được render
    useEffect(() => {
        getProductHot()
            .then(product => {
                setListProduct(product);
                setLoading(false);
            })
            .catch(err => {
                setError("Không thể tải sản phẩm hot.");
                setLoading(false);
            });
    }, []);

    if (!cartContext) {
        return <div>Đang tải giỏ hàng...</div>;
    }

    const { addToCart } = cartContext;


    function addProduct(id: number, name: string, price: number, image: string) {
        const cartItem: CartItem = {
            productId: id,
            productName: name,
            price: price,
            image: image,
            quantity: 1, // Số lượng mặc định là 1 khi thêm sản phẩm
        };

        addToCart(cartItem); // Gọi hàm addToCart để thêm sản phẩm vào giỏ hàng
    }

    return (
        <div className="container-fluid">
            <div className="row mobile-layout">
                <div className="col-md-9 position-relative left-section"
                     style={{ overflowY: "auto", maxHeight: "100vh", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div style={{height: "2000px"}} className="about-left">
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
                                {

                                }
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
                        <img src={bannerBuffet} alt="Main Dish Image" className="img-fluid"/>
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

                        {/* Hiển thị Hot Deal */}
                        <section className="hot-deal">
                            <h4 className="fw-bold">HOT DEAL</h4>
                            {loading ? (
                                <div>Đang tải sản phẩm...</div>
                            ) : error ? (
                                <div className="text-danger">{error}</div>
                            ) : (
                                <div className="d-flex justify-content-center">
                                    <div className="row g-4 mb-5">
                                        {listProduct.map((product, index) => (
                                            <React.Fragment key={index}>
                                                <div className="col-6 col-md-3">
                                                    <div className="card border border-0 p-3 card-custom text-center">
                                                        <img src={product.image || lau3} className="rounded-3"
                                                             alt={product.productName || 'Product Image'}
                                                             style={{height: 200, width: 250}} data-bs-toggle="modal"
                                                             data-bs-target={`#productModal${product.productId}`}/>
                                                        <div className="card-body p-0">
                                                            <h5 className="card-title fs-6 m-0 p-0">{product.productName}</h5>
                                                        </div>
                                                        <div
                                                            className="mt-4 mb-2 d-flex justify-content-around align-items-center">
                                                            <h6 className="card__price fw-bold">{formatMoney(product.price)}</h6>
                                                            <button
                                                                id="increment"
                                                                onClick={() => addProduct(product.productId, product.productName, product.price, product.image)}
                                                            >
                                                                <i className="bi bi-plus-lg"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Modal cho mỗi sản phẩm */}
                                                <div className="modal fade ps36231"
                                                     id={`productModal${product.productId}`}
                                                     tabIndex={-1}
                                                     aria-labelledby="productModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="container-modal">
                                                                <div className="container-modal-header">
                                                                    <div className="control-img">
                                                                        <img src={product.image || lau3}
                                                                             alt={product.productName}/>
                                                                        <div
                                                                            className="container-button d-grid place-item-center">
                                                                            <button type="button" className="btn-close"
                                                                                    data-bs-dismiss="modal"></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="container-modal-footer">
                                                                    <div
                                                                        className="name-item">{product.productName}</div>
                                                                    <div className="capacity-item">900 ml</div>
                                                                    <div className="container-price-quantity">
                                                                        <div className="price-quantity">
                                                                            <div className="price">
                                                                                <span>Giá: {formatMoney(product.price)}</span>
                                                                            </div>
                                                                            <div className="quantity-control">
                                                                                <div className="minus"><span><i
                                                                                    className="bi bi-dash-lg"></i></span>
                                                                                </div>
                                                                                <div className="quantity">1</div>
                                                                                <div className="plus"><span><i
                                                                                    className="bi bi-plus-lg"></i></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="control-btn-add-to-cart">
                                                                            <button onClick={() => addToCart({
                                                                                productId: product.productId,
                                                                                productName: product.productName,
                                                                                price: product.price,
                                                                                quantity: 1,
                                                                                image: product.image
                                                                            })}>Thêm vào giỏ hàng
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                        <section className="what-can-we-do mt-3 pb-4">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 help" style={{paddingLeft: 0}}>
                                        <h4 className="fw-bold pb-4">CHÚNG TÔI CÓ THỂ GIÚP GÌ CHO BẠN ?</h4>
                                        <div className="accordion" id="accordionExample">
                                            <div className="accordion-item my-3 mt-0 rounded-0">
                                                <h2 className="accordion-header rounded-0">
                                                    <button
                                                        className="accordion-button accordion-item-design collapsed rounded-0"
                                                        type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseOne" aria-expanded="false"
                                                        aria-controls="collapseOne">
                                                        Accordion Item #1
                                                    </button>
                                                </h2>
                                                <div id="collapseOne" className="accordion-collapse collapse"
                                                     data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <strong>This is the first item's accordion body.</strong> It is
                                                        hidden by default.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item my-3 rounded-0">
                                                <h2 className="accordion-header rounded-0">
                                                    <button
                                                        className="accordion-button accordion-item-design collapsed rounded-0"
                                                        type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseTwo" aria-expanded="false"
                                                        aria-controls="collapseTwo">
                                                        Accordion Item #2
                                                    </button>
                                                </h2>
                                                <div id="collapseTwo" className="accordion-collapse collapse"
                                                     data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <strong>This is the second item's accordion body.</strong> It is
                                                        hidden by default.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item my-3 rounded-0">
                                                <h2 className="accordion-header rounded-0">
                                                    <button
                                                        className="accordion-button accordion-item-design collapsed rounded-0"
                                                        type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseThree" aria-expanded="false"
                                                        aria-controls="collapseThree">
                                                        Accordion Item #3
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" className="accordion-collapse collapse"
                                                     data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <strong>This is the third item's accordion body.</strong> It is
                                                        hidden by default.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item my-3 rounded-0">
                                                <h2 className="accordion-header rounded-0">
                                                    <button
                                                        className="accordion-button accordion-item-design collapsed rounded-0"
                                                        type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseFour" aria-expanded="false"
                                                        aria-controls="collapseFour">
                                                        Accordion Item #4
                                                    </button>
                                                </h2>
                                                <div id="collapseFour" className="accordion-collapse collapse"
                                                     data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <strong>This is the fourth item's accordion body.</strong> It is
                                                        hidden by default.
                                                    </div>
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
                        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
                            <section className="pt-3">
                                <div className="container text-center text-md-start mt-5 pb-5 border-bottom">
                                    <div className="row mt-3">
                                        <div className="col-md-5">
                                            <img src="assets/img/Cream and Black Simple Illustration Catering Logo.png"
                                                 width="100" alt=""/>
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
                <div className="col-md-3 right-section d-flex flex-column justify-content-between">
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <a href="/menu"><img src={cothaygia} alt="Menu" className="img-fluid"/></a>
                            <a href="/menu" className="btn btn-outline-light">Thực Đơn →</a>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <a href="/reservation"><img src={bannerHome} alt="Reservation" className="img-fluid"/></a>
                            <a href="/reservation" className="btn btn-outline-light">Đặt Bàn →</a>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 image-card text-center">
                            <a href="/promotion"><img src={publicAvif} alt="Promotion" className="img-fluid"/></a>
                            <a href="/promotion" className="btn btn-outline-light">Ưu Đãi →</a>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modals */}
            <div className="ps36231 modal" id="myModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="container-modal">
                            <div className="container-modal-header">
                                <div className="control-img">
                                    <img src={lau3} alt=""/>
                                    <div className="container-button d-grid place-item-center">
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                </div>
                            </div>
                            <div className="container-modal-footer">
                                <div className="name-item">Lẩu Xuyên Tiêu Deli</div>
                                <div className="capacity-item">900 ml</div>
                                <div className="capacity-item-details">
                                    <div className="capacity-item-name"></div>
                                    <div className="capacity-item-milli"></div>
                                </div>
                                <div className="container-price-quantity">
                                    <div className="price-quantity">
                                        <div className="price">
                                            <span>Giá: 45.000₫</span>
                                        </div>
                                        <div className="quantity-control">
                                            <div className="minus"><span><i className="bi bi-dash-lg"></i></span></div>
                                            <div className="quantity">1</div>
                                            <div className="plus"><span><i className="bi bi-plus-lg"></i></span></div>
                                        </div>
                                    </div>
                                    <div className="control-btn-add-to-cart">
                                        <button>Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default IndexCustomer;

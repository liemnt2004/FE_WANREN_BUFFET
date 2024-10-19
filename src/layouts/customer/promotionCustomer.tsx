import React from "react";

import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/1500x700-01_1_1.png';
import priceBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import thumnailPromation from './assets/img/public1.avif';
import './assets/css/styles.css';
import './assets/css/reservation.css';
import './assets/css/promotion.css'
const PromotionCustomer:React.FC = () =>{
    return (
        <div className="container-fluid">
            <div className="row mobile-layout">
                {/* Left Section: Main Image */}
                <div className="col-md-8 position-relative left-section" style={{paddingBottom: 0}}>
                    <div>
                        <section className="banner">
                            <div id="carouselExampleIndicators" className="carousel slide">
                                <div className="carousel-indicators">
                                    <button
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to="0"
                                        className="active"
                                        aria-current="true"
                                        aria-label="Slide 1"
                                    ></button>
                                    <button
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to="1"
                                        aria-label="Slide 2"
                                    ></button>
                                    <button
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to="2"
                                        aria-label="Slide 3"
                                    ></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={bannerHome} className="d-block w-100 img-fluid" alt="Promotion"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src={bannerHome} className="d-block w-100 img-fluid" alt="Promotion"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src={bannerBuffet} className="d-block w-100 img-fluid" alt="Promotion"/>
                                    </div>
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </section>

                        <img src={priceBuffet} alt="Main Dish Image" className="img-fluid"/>
                    </div>
                </div>

                {/* Right Section: Smaller Images */}
                <div
                    className="col-md-4"
                    style={{
                        paddingTop: '20px',
                        overflowY: 'auto',
                        maxHeight: '100vh',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <div className="container promotion">
                        <div className="row mb-4">
                            {/* First promotion block */}
                            <div className="col-md-7">
                                <img src={thumnailPromation} alt="Promotion 1" className="img-fluid"/>
                            </div>
                            <div className="col-md-5 d-flex flex-column justify-content-between">
                                <div>
                                    <h5>8 nhà Kichi-Kichi tặng Buffet 0 đồng cho nhóm 4 người</h5>
                                    <p>Thời gian áp dụng: <br/> 04/09/2024 - 30/09/2024</p>
                                    <p>Hết hạn sau: <br/> 2 ngày</p>
                                </div>
                                <a href="#" className="btn btn-danger mt-2">
                                    Xem chi tiết
                                </a>
                            </div>
                        </div>
                        <div className="row mb-4">
                            {/* Second promotion block */}
                            <div className="col-md-7">
                                <img src={thumnailPromation} alt="Promotion 2" className="img-fluid"/>
                            </div>
                            <div className="col-md-5 d-flex flex-column justify-content-between">
                                <div>
                                    <h5>8 nhà Kichi-Kichi tặng Buffet 0 đồng cho nhóm 4 người</h5>
                                    <p>Thời gian áp dụng: <br/> 04/09/2024 - 30/09/2024</p>
                                    <p>Hết hạn sau: <br/> 2 ngày</p>
                                </div>
                                <a href="#" className="btn btn-danger mt-2">
                                    Xem chi tiết
                                </a>
                            </div>
                        </div>
                        <div className="row mb-4">
                            {/* Third promotion block */}
                            <div className="col-md-7">
                                <img src={thumnailPromation} alt="Promotion 3" className="img-fluid"/>
                            </div>
                            <div className="col-md-5 d-flex flex-column justify-content-between">
                                <div>
                                    <h5>8 nhà Kichi-Kichi tặng Buffet 0 đồng cho nhóm 4 người</h5>
                                    <p>Thời gian áp dụng: <br/> 04/09/2024 - 30/09/2024</p>
                                    <p>Hết hạn sau: <br/> 2 ngày</p>
                                </div>
                                <a href="#" className="btn btn-danger mt-2">
                                    Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromotionCustomer;
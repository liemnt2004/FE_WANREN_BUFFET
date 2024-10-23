// src/components/PromotionCustomer.tsx
import React, { useEffect, useState } from "react";

// Import hình ảnh và CSS
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/1500x700-01_1_1.png';
import priceBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import thumnailPromation from './assets/img/public1.avif';
import './assets/css/styles.css';
import './assets/css/reservation.css';
import './assets/css/promotion.css';

// Import API và mô hình
import { getAllPromotion } from "../../api/apiCustommer/promotionApi";
import PromotionModel from "../../models/PromotionModel";

const PromotionCustomer: React.FC = () => {
    const [listpromotion, setListPromotion] = useState<PromotionModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const promotions = await getAllPromotion();
                setListPromotion(promotions);
            } catch (err) {
                console.error(err);
                setError('Đã xảy ra lỗi khi tải dữ liệu khuyến mãi.');
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    // Hàm tính ngày còn lại
    const calculateDaysRemaining = (endDate: string | Date): number => {
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading) {
        return <div className="container">Đang tải dữ liệu khuyến mãi...</div>;
    }

    if (error) {
        return <div className="container text-danger">{error}</div>;
    }

    return (
        <div className="container-fluid">
            <div className="row mobile-layout">
                {/* Left Section: Main Image */}
                <div className="col-md-8 position-relative left-section" style={{ paddingBottom: 0 }}>
                    <div>
                        <section className="banner">
                            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
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
                                        <img src={bannerHome} className="d-block w-100 img-fluid" alt="Promotion" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={bannerHome} className="d-block w-100 img-fluid" alt="Promotion" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={bannerBuffet} className="d-block w-100 img-fluid" alt="Promotion" />
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

                        <img src={priceBuffet} alt="Main Dish Image" className="img-fluid" />
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
                    {listpromotion.length === 0 ? (
                        <div className="text-center">Không có khuyến mãi nào.</div>
                    ) : (
                        listpromotion.map((promotion) => (
                            <div className="container promotion" key={promotion.PromotionId}>
                                <div className="row mb-4">
                                    {/* Hình ảnh khuyến mãi */}
                                    <div className="col-md-7">
                                        {/* Sử dụng hình ảnh từ promotion nếu có */}
                                        <img src={ thumnailPromation} alt={promotion.promotionName} className="img-fluid" />
                                    </div>
                                    {/* Thông tin khuyến mãi */}
                                    <div className="col-md-5 d-flex flex-column justify-content-between">
                                        <div>
                                            <h5>{promotion.promotionName}</h5>
                                            <p>{promotion.description}</p>
                                            <p>
                                                Thời gian áp dụng: <br />
                                                {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                                            </p>
                                            <p>
                                                Hết hạn sau: <br />
                                                {calculateDaysRemaining(promotion.endDate)} ngày
                                            </p>
                                        </div>
                                        <a href="#" className="btn btn-danger mt-2">
                                            Xem chi tiết
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromotionCustomer;

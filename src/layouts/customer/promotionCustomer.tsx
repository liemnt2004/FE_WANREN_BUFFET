// src/components/PromotionCustomer.tsx
import React, { useEffect, useState } from "react";
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/1500x700-01_1_1.png';
import priceBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import thumnailPromation from './assets/img/public1.avif';
import './assets/css/styles.css';
import './assets/css/reservation.css';
import './assets/css/promotion.css';

import { getAllPromotion } from "../../api/apiCustommer/promotionApi";
import PromotionModel from "../../models/PromotionModel";
import { Link } from "react-router-dom";
import Banner from "./component/Banner";
import { useTranslation } from 'react-i18next';

const PromotionCustomer: React.FC = () => {
    const [listpromotion, setListPromotion] = useState<PromotionModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const promotions = await getAllPromotion();
                setListPromotion(promotions);
            } catch (err) {
                console.error(err);
                setError(t('promotions.errorLoading'));
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [t]);

    const calculateDaysRemaining = (endDate: string | Date): number => {
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading) {
        return <div className="container">{t('promotions.loading')}</div>;
    }

    if (error) {
        return <div className="container text-danger">{error}</div>;
    }

    return (
        <div className="container-fluid">
            <div className="row mobile-layout">
                {/* Left Section */}
                <div className="col-md-8 position-relative left-section" style={{ paddingBottom: 0 }}>
                    <div>
                        <Banner />
                        <img src={priceBuffet} alt="Main Dish Image" className="img-fluid" />
                    </div>
                </div>

                {/* Right Section */}
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
                        <div className="text-center">{t('promotions.noPromotions')}</div>
                    ) : (
                        listpromotion.map((promotion) => (
                            <div className="container promotion" key={promotion.promotion}>
                                <div className="row mb-4">
                                    <div className="col-md-7">
                                        <img src={promotion.image} alt={promotion.promotionName} className="img-fluid" />
                                    </div>
                                    <div className="col-md-5 d-flex flex-column justify-content-between">
                                        <div>
                                            <h5>{promotion.promotionName}</h5>
                                            <p dangerouslySetInnerHTML={{ __html: promotion.description }}></p>
                                            <p>
                                                {t('promotions.applyTime')}<br />
                                                {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                                            </p>
                                            <p>
                                                {t('promotions.expireIn')}<br />
                                                {calculateDaysRemaining(promotion.endDate)} {t('promotions.days')}
                                            </p>
                                        </div>
                                        <Link to={'/promotion_detail/' + promotion.promotion} className="btn btn-danger mt-2">
                                            {t('promotions.viewDetails')}
                                        </Link>
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

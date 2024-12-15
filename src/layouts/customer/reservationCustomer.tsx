import React, { useState, ChangeEvent, FormEvent } from 'react';

// Importing images
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import './assets/css/styles.css';
import './assets/css/reservation.css';

import axios from 'axios';
import { AuthContext, DecodedToken } from './component/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { notification } from "antd";
import { useTranslation } from 'react-i18next';

interface FormData {
    customerId: number;
    numberPeople: string;
    timeToCome: string;
    dateToCome: string;
    phoneNumber: string;
    email: string;
    fullName: string;
    note: string;
    agree: boolean;
}

const ReservationForm: React.FC = () => {
    const token = localStorage.getItem('token');
    let decoded: DecodedToken | null = null;
    if (token) {
        decoded = jwtDecode<DecodedToken>(token);
    }

    const { t } = useTranslation();

    const [formData, setFormData] = useState<FormData>({
        customerId: Number(decoded?.userId || null),
        numberPeople: '',
        timeToCome: '',
        dateToCome: '',
        phoneNumber: '',
        email: '',
        fullName: '',
        note: '',
        agree: false
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

        if (!phoneRegex.test(formData.phoneNumber)) {
            notification.warning({
                message: t('reservationForm.warning'),
                description: "Số điện thoại không đúng định dạng!",
                placement: 'topRight',
            });
            return;
        }
        try {
            if (formData.agree === true) {
                const response = await axios.post('http://localhost:8080/api/reservation/create', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const message = response.data.message;

                if (message) {
                    notification.success({
                        message: t('reservationForm.success'),
                        description: message,
                        placement: 'topRight',
                    });
                    setFormData({
                        customerId: Number(decoded?.userId || null),
                        numberPeople: '',
                        timeToCome: '',
                        dateToCome: '',
                        phoneNumber: '',
                        email: '',
                        fullName: '',
                        note: '',
                        agree: false
                    })
                }
            } else {
                notification.warning({
                    message: t('reservationForm.warning'),
                    description: t('reservationForm.agreeMessage'),
                    placement: 'topRight',
                });
            }

        } catch (error) {
            console.error('Cannot create reservation', error);
            notification.error({
                message: t('reservationForm.error'),
                description: t('reservationForm.errorMessage'),
                placement: 'topRight',
            });
        }
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: 'white' }}>
            <div className="row mobile-layout">
                {/* Left Section: Main Image */}
                <div className="col-md-8 position-relative left-section" style={{ paddingBottom: 0 }}>
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
                                    <img src={websiteGreen} className="d-block w-100 img-fluid" alt="Website Green" />
                                </div>
                                <div className="carousel-item">
                                    <img src={bannerHome} className="d-block w-100 img-fluid" alt="Banner Home" />
                                </div>
                                <div className="carousel-item">
                                    <img src="/assets/img/1500x700-01_1_1.png" className="d-block w-100 img-fluid" alt="Banner" />
                                </div>
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="prev"
                            >
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">{t('reservationForm.previous')}</span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="next"
                            >
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">{t('reservationForm.next')}</span>
                            </button>
                        </div>
                    </section>
                    <img
                        src={bannerBuffet}
                        alt="Main Dish Image"
                        className="img-fluid"
                    />
                </div>

                {/* Right Section: Reservation Form */}
                <div className="col-md-4">
                    <form className="form-booktable" onSubmit={handleSubmit}>
                        <h3 className="text-center pb-5">{t('reservationForm.title')}</h3>
                        <p className="text-center">{t('reservationForm.subtitle')}</p>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="name" className="form-label">{t('reservationForm.fullName')} *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder={t('reservationForm.placeholderName') || ''}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">{t('reservationForm.email')} *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('reservationForm.placeholderEmail') || ''}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">{t('reservationForm.phone')} *</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder={t('reservationForm.placeholderPhone') || ''}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="guests" className="form-label">{t('reservationForm.numberPeople')} *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="guests"
                                    name="numberPeople"
                                    value={formData.numberPeople}
                                    onChange={handleChange}
                                    placeholder={t('reservationForm.placeholderNumberPeople') || ''}
                                    required
                                    min={1}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="date" className="form-label">{t('reservationForm.date')} *</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    name="dateToCome"
                                    value={formData.dateToCome}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="time" className="form-label">{t('reservationForm.time')} *</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="time"
                                    name="timeToCome"
                                    value={formData.timeToCome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label htmlFor="requests" className="form-label">{t('reservationForm.note')}</label>
                                <textarea
                                    className="form-control"
                                    id="requests"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder={t('reservationForm.placeholderNote') || ''}
                                ></textarea>
                            </div>

                            <div className="col-12 form-check mt-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agree"
                                    name="agree"
                                    checked={formData.agree}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="form-check-label" htmlFor="agree">
                                    {t('reservationForm.agreeLabel')}
                                </label>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <button type="submit" className="btn-reservation">{t('reservationForm.submit')}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;

import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';

// Importing images
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import './assets/css/styles.css';
import './assets/css/reservation.css';
import axios from 'axios';
import { AuthContext, DecodedToken } from './component/AuthContext';
import { jwtDecode } from 'jwt-decode';

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

    const [formData, setFormData] = useState<FormData>({
        customerId:  Number(decoded?.userId || null),
        numberPeople: '',
        timeToCome: '',
        dateToCome: '',
        phoneNumber: '',
        email: '',
        fullName: '',
        note: '',
        agree: false
    });

    const initialFormData = {
        customerId: Number(decoded?.userId || null),
        numberPeople: '',
        timeToCome: '',
        dateToCome: '',
        phoneNumber: '',
        email: '',
        fullName: '',
        note: '',
        agree: false,
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: (e.target as HTMLInputElement).checked, // Cast target to HTMLInputElement for checkboxes
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


        try {
            if(formData.agree === true){
                const response = await axios.post('https://wanrenbuffet.online/api/reservation/create', formData, {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                });
    
                const message = response.data.message;
    
                if(message){
                    alert(message);
                    setFormData(initialFormData); 
                }
            }else{
                alert("Vui lòng chọn đồng ý điều kiện!");
            }

        } catch (error) {
            console.log("Cannot create reservation", error);
        }

        console.log(formData);
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: 'white' }}>
            <div className="row mobile-layout">
                {/* Left Section: Main Image */}
                <div className="col-md-8 position-relative left-section" style={{ paddingBottom: 0 }}>
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
                        <img
                            src={bannerBuffet}
                            alt="Main Dish Image"
                            className="img-fluid"
                        />
                    </div>
                </div>

                {/* Right Section: Reservation Form */}
                <div className="col-md-4">
                    <form className="form-booktable" onSubmit={handleSubmit}>
                        <h3 className="text-center pb-5">ĐẶT BÀN</h3>
                        <p className="text-center">
                        Hãy đặt chỗ tại Wanren Buffet để có một chuyến phiêu lưu ẩm thực với những hương vị tuyệt vời. Đặt ngay!
                        </p>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="name" className="form-label">Tên của bạn *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập tên"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="guests" className="form-label">Số lượng người *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="guests"
                                    name="numberPeople"
                                    value={formData.numberPeople}
                                    onChange={handleChange}
                                    placeholder="Nhập số lượng người"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="date" className="form-label">Ngày đến *</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    name="dateToCome"
                                    value={formData.dateToCome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="time" className="form-label">Giờ đến *</label>
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
                                <label htmlFor="requests" className="form-label">Ghi chú</label>
                                <textarea
                                    className="form-control"
                                    id="requests"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Nhập ghi chú"
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
                                    Tôi đồng ý việc sử dụng thông tin cá nhân
                                </label>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <button type="submit" className="btn-reservation">Đặt bàn bây giờ</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;

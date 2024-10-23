import React, { useState, ChangeEvent, FormEvent } from 'react';

// Importing images
import websiteGreen from './assets/img/website_green.jpg';
import bannerHome from './assets/img/Banner-Hompage-_1500W-x-700H_px.jpg';
import bannerBuffet from './assets/img/banner-gia-buffet-kich-kichi-160824.jpg';
import './assets/css/styles.css';
import './assets/css/reservation.css';

interface FormData {
    name: string;
    email: string;
    phone: string;
    guests: string;
    date: string;
    time: string;
    requests: string;
    agree: boolean;
}

const ReservationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        guests: '',
        date: '',
        time: '',
        requests: '',
        agree: false,
    });

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here

        console.log(formData);
    };

    return (
        <div className="container-fluid">
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
                        <h3 className="text-center pb-5">RESERVATION</h3>
                        <p className="text-center">
                            Book at ZenAsia for a captivating culinary adventure with Asia's finest flavors. Reserve now!
                        </p>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="name" className="form-label">Your name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
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
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">Phone number *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="guests" className="form-label">Number of guests *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="guests"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    placeholder="Enter number of guests"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="date" className="form-label">Date *</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="time" className="form-label">Time *</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label htmlFor="requests" className="form-label">Special requests</label>
                                <textarea
                                    className="form-control"
                                    id="requests"
                                    name="requests"
                                    value={formData.requests}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter any special requests"
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
                                    I agree to use my personal data
                                </label>
                            </div>

                            <div className="col-12 text-center mt-3">
                                <button type="submit" className="btn-reservation">Reserve now</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;

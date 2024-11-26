// src/layouts/customer/CheckoutCustomer.tsx

import React, {
    useState,
    useEffect,
    ChangeEvent,
    FormEvent,
    useContext,
} from 'react';
import './assets/css/checkout.css';
import './assets/css/styles.css';
import { CartContext, CartItem } from './component/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import FormatMoney from "./component/FormatMoney";
import { request } from "../../api/Request";
import { DecodedToken } from "./component/AuthContext";

interface OrderDetailData {
    productId: number;
    quantity: number;
    unitPrice: number;
    itemNotes: string;
}

interface CheckoutFormData {
    username: string;
    tinh: string;
    quan: string;
    phuong: string;
    detail_address: string;
    phoneCheckout: string;
    emailCheckout: string;
    payment: string;
    note: string;
}

interface LocationData {
    id: string;
    full_name: string;
}

interface ApiResponse {
    error: number;
    data: LocationData[];
}

const HO_CHI_MINH_ID = '79';

const CheckoutCustomer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const cartContext = useContext(CartContext);
    const [listCart, setListCart] = useState<CartItem[]>(cartContext?.cartItems || []);

    // Modal State
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalType, setModalType] = useState<'success' | 'error'>('success');

    // Decode Token
    let decoded: DecodedToken | null = null;
    try {
        if (token) {
            decoded = jwtDecode<DecodedToken>(token);
        }
    } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
    }

    // Redirect if no token or failed to decode
    useEffect(() => {
        if (!decoded) {
            navigate('/login');
        }
    }, [decoded, navigate]);

    // Parse Query Parameters
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    const error = queryParams.get('error');

    // Show Modal based on Query Params
    useEffect(() => {
        if (success) {
            setModalMessage(decodeURIComponent(success));
            setModalType('success');
            setShowModal(true);
            navigate("/checkout", { replace: true });
        } else if (error) {
            setModalMessage(decodeURIComponent(error));
            setModalType('error');
            setShowModal(true);
            navigate("/checkout", { replace: true });
        }
    }, [success, error, navigate]);

    // Form Data State
    const [formData, setFormData] = useState<CheckoutFormData>({
        username: decoded?.sub || "",
        tinh: "Thành Phố Hồ Chí Minh",
        quan: '',
        phuong: '',
        detail_address: '',
        emailCheckout: decoded?.email || "",
        phoneCheckout: decoded?.phone || "",
        payment: '',
        note: '',
    });

    // New States for Address Selection
    const [useExistingAddress, setUseExistingAddress] = useState<boolean>(true); // Mặc định sử dụng địa chỉ đã lưu
    const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);

    // Locations State
    const [districts, setDistricts] = useState<LocationData[]>([]);
    const [wards, setWards] = useState<LocationData[]>([]);

    // Loading and Error States
    const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
    const [loadingWards, setLoadingWards] = useState<boolean>(false);
    const [errorDistricts, setErrorDistricts] = useState<string>('');
    const [errorWards, setErrorWards] = useState<string>('');
    const [errorSavedAddress, setErrorSavedAddress] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Fetch Districts
    useEffect(() => {
        let isMounted = true;

        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            setErrorDistricts('');
            try {
                const response = await fetch(
                    `https://esgoo.net/api-tinhthanh/2/${HO_CHI_MINH_ID}.htm`
                );
                const data: ApiResponse = await response.json();
                if (isMounted) {
                    if (data.error === 0) {
                        setDistricts(data.data);
                    } else {
                        setErrorDistricts('Không tải được danh sách quận/huyện.');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setErrorDistricts('Đã xảy ra lỗi khi tải danh sách quận/huyện.');
                }
            } finally {
                if (isMounted) {
                    setLoadingDistricts(false);
                }
            }
        };

        fetchDistricts();

        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch Wards when District Changes
    useEffect(() => {
        if (!formData.quan) {
            setWards([]);
            setFormData((prev) => ({ ...prev, phuong: '' }));
            return;
        }

        let isMounted = true;

        const fetchWards = async () => {
            setLoadingWards(true);
            setErrorWards('');
            try {
                const response = await fetch(
                    `https://esgoo.net/api-tinhthanh/3/${formData.quan}.htm`
                );
                const data: ApiResponse = await response.json();
                if (isMounted) {
                    if (data.error === 0) {
                        setWards(data.data);
                    } else {
                        setErrorWards('Hãy chọn phường của bạn');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setErrorWards('Đã xảy ra lỗi khi tải danh sách phường/xã.');
                }
            } finally {
                if (isMounted) {
                    setLoadingWards(false);
                }
            }
        };

        fetchWards();

        return () => {
            isMounted = false;
        };
    }, [formData.quan]);

    // Handle Input Changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Calculate Totals
    const subtotal = listCart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = 15000; // Example shipping fee
    const total = subtotal + shippingFee;

    // Handle Form Submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.payment) {
            setModalMessage('Vui lòng chọn phương thức thanh toán.');
            setModalType('error');
            setShowModal(true);
            setIsSubmitting(false);
            return;
        }

        let address22 = '';

        if (!showNewAddressForm && decoded) {
            // Sử dụng địa chỉ đã lưu từ token
            address22 = `${decoded.roles}`;
        } else {
            // Sử dụng địa chỉ mới nhập
            if (!formData.quan || !formData.phuong || !formData.detail_address) {
                setModalMessage('Vui lòng điền đầy đủ thông tin địa chỉ.');
                setModalType('error');
                setShowModal(true);
                setIsSubmitting(false);
                return;
            }

            const selectedDistrict = districts.find(district => district.id === formData.quan);
            const districtName = selectedDistrict ? selectedDistrict.full_name : "";
            address22 = `${formData.detail_address}, ${formData.phuong}, ${districtName}, ${formData.tinh}`;
        }

        const orderData = {
            username: formData.username,
            address: address22,
            phone: formData.phoneCheckout,
            email: formData.emailCheckout,
            payment: formData.payment,
            notes: formData.note,
            totalAmount: total,
            orderDetails: listCart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
                itemNotes: '',
            })),
        };

        try {
            // Nếu chọn VN PAY
            if (formData.payment === "VN PAY") {
                const createOrderResponse = await fetch('http://localhost:8080/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                });

                if (!createOrderResponse.ok) {
                    const errorData = await createOrderResponse.json();
                    throw new Error(errorData.message || "Đặt hàng thất bại.");
                }

                const createOrderResult = await createOrderResponse.json();
                const orderId = createOrderResult.orderId;

                // Tạo URL thanh toán
                const paymentResponse = await request(`http://localhost:8080/api/payment/create_payment?price=${total}`);
                if (!paymentResponse || !paymentResponse.url) {
                    throw new Error("Tạo thanh toán VN PAY thất bại.");
                }
                cartContext?.clearCart()
                // Chuyển hướng người dùng tới URL thanh toán VN PAY
                window.location.href = paymentResponse.url;

            } else if (formData.payment === "Check Payment") {
                // Xử lý phương thức thanh toán khác, ví dụ: Cash on Delivery
                const createOrderResponse = await fetch('http://localhost:8080/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                });

                if (!createOrderResponse.ok) {
                    const errorData = await createOrderResponse.json();
                    throw new Error(errorData.message || "Đặt hàng thất bại.");
                }

                const createOrderResult = await createOrderResponse.json();

                setModalMessage("Đặt hàng thành công. Chúng tôi sẽ liên hệ với bạn sớm.");
                setModalType('success');
                setShowModal(true);
                cartContext?.clearCart()
                navigate('/checkout'); // Chuyển hướng tới trang đơn hàng
            }
        } catch (error: any) {
            console.error("Đặt hàng thất bại:", error);
            setModalMessage(error.message || "Có lỗi xảy ra trong quá trình đặt hàng hoặc tạo thanh toán.");
            setModalType('error');
            setShowModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close Modal Handler
    const handleCloseModal = () => setShowModal(false);

    return (
        <section className="checkout spad container-fluid">
            <div className="container">
                <div className="checkout__form mt-3">
                    <h4>Thông Tin Thanh Toán</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Payment Information Form */}
                            <div className="col-lg-8 col-md-6">
                                {/* Button Toggle Address */}
                                <div className="checkout__input mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary mb-3"
                                        onClick={() => {
                                            setShowNewAddressForm(!showNewAddressForm);
                                        }}
                                    >
                                        {showNewAddressForm ? 'Sử Dụng Địa Chỉ Đã Lưu' : 'Thêm Địa Chỉ Mới'}
                                    </button>
                                </div>

                                {/* Nếu sử dụng địa chỉ đã lưu */}
                                {!showNewAddressForm && decoded && (
                                    <div className="checkout__input mb-3">
                                        <label>Địa Chỉ Đã Lưu</label>
                                        <div className="saved-address">
                                            <p><strong>Họ và Tên:</strong> {decoded.fullName}</p>
                                            <p><strong>Địa chỉ:</strong> {`${decoded.email}`}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Nếu thêm địa chỉ mới */}
                                {showNewAddressForm && (
                                    <>
                                        {/* Province Selection (Hidden/Disabled) */}
                                        <div className="css_select_div mb-3 d-none">
                                            <label htmlFor="tinh" className="form-label">
                                                Tỉnh/Thành phố<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                id="tinh"
                                                name="tinh"
                                                value={formData.tinh}
                                                onChange={handleChange}
                                                className="css_select"
                                                disabled
                                                required
                                            >
                                                <option value={HO_CHI_MINH_ID}>Hồ Chí Minh</option>
                                            </select>
                                        </div>

                                        {/* Quận/Huyện Selection */}
                                        <div className="checkout__input mb-3">
                                            <label htmlFor="quan" className="form-label">
                                                Quận/Huyện<span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <select
                                                className={`css_select ${errorDistricts ? 'is-invalid' : ''}`}
                                                id="quan"
                                                name="quan"
                                                title="Chọn Quận Huyện"
                                                value={formData.quan}
                                                onChange={handleChange}
                                                disabled={loadingDistricts}
                                                required
                                            >
                                                <option value="">Quận Huyện</option>
                                                {loadingDistricts && (
                                                    <option value="">Đang tải...</option>
                                                )}
                                                {!loadingDistricts &&
                                                    districts.map((district) => (
                                                        <option key={district.id} value={district.id}>
                                                            {district.full_name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errorDistricts && (
                                                <div className="invalid-feedback d-block">
                                                    {errorDistricts}
                                                </div>
                                            )}
                                        </div>

                                        {/* Phường/Xã Selection */}
                                        <div className="checkout__input mb-3">
                                            <label htmlFor="phuong" className="form-label">
                                                Phường/Xã<span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <select
                                                className={`css_select ${errorWards ? 'is-invalid' : ''}`}
                                                id="phuong"
                                                name="phuong"
                                                title="Chọn Phường Xã"
                                                value={formData.phuong}
                                                onChange={handleChange}
                                                disabled={!formData.quan || loadingWards}
                                                required
                                            >
                                                <option value="">Phường Xã</option>
                                                {loadingWards && <option value="">Đang tải...</option>}
                                                {!loadingWards &&
                                                    wards.map((ward) => (
                                                        <option key={ward.id} value={ward.full_name}>
                                                            {ward.full_name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errorWards && (
                                                <div className="invalid-feedback d-block">
                                                    {errorWards}
                                                </div>
                                            )}
                                        </div>

                                        {/* Detailed Address */}
                                        <div className="checkout__input mb-3">
                                            <label htmlFor="detail_address">
                                                Tên Đường / Tòa Nhà<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="detail_address"
                                                name="detail_address"
                                                value={formData.detail_address}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Phone and Email */}
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="checkout__input mb-3">
                                            <label htmlFor="phoneCheckout">
                                                Số Điện Thoại<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="phoneCheckout"
                                                name="phoneCheckout"
                                                value={formData.phoneCheckout}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="checkout__input mb-3">
                                            <label htmlFor="emailCheckout">
                                                Email<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="emailCheckout"
                                                name="emailCheckout"
                                                value={formData.emailCheckout}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="checkout__input mb-3">
                                    <label htmlFor="note">Ghi Chú Đơn Hàng</label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        placeholder="Ghi chú về đơn hàng của bạn, ví dụ: lưu ý khi giao hàng."
                                        value={formData.note}
                                        onChange={handleChange}
                                        className="form-control"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="col-lg-4 col-md-6">
                                <div className="checkout__order">
                                    <h4>Đơn Hàng</h4>
                                    <div className="checkout__order__products d-flex justify-content-between">
                                        <span>Sản Phẩm</span>
                                        <span>Tổng Tiền</span>
                                    </div>
                                    <ul className="list-group mb-3">
                                        {listCart.length > 0 ? (
                                            listCart.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    {item.productName} x {item.quantity}
                                                    <span>{FormatMoney(item.price * item.quantity)}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">Giỏ hàng của bạn trống</li>
                                        )}
                                    </ul>
                                    <div className="checkout__order__subtotal d-flex justify-content-between mb-2">
                                        <span>Tạm Tính</span>
                                        <span>{FormatMoney(subtotal)}</span>
                                    </div>
                                    <div className="checkout__order__subtotal d-flex justify-content-between mt-2">
                                        <span>Phí Giao Hàng</span>
                                        <span>{FormatMoney(shippingFee)}</span>
                                    </div>
                                    <div className="checkout__order__total d-flex justify-content-between mb-3">
                                        <span>Tổng Tiền</span>
                                        <span>{FormatMoney(total)}</span>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="checkout__input__checkbox mb-3">
                                        <label>
                                            Thanh Toán Khi Nhận Hàng
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Check Payment"
                                                checked={formData.payment === 'Check Payment'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className="checkout__input__checkbox mb-3">
                                        <label>
                                            VN PAY
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="VN PAY"
                                                checked={formData.payment === 'VN PAY'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className='checkoyt_submit'>
                                    <button
                                        type="submit"
                                        className="site-btn"
                                        disabled={listCart.length === 0 || isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5 className={`modal-title ${modalType === 'success' ? 'text-success' : 'text-danger'}`}>
                            {modalType === 'success' ? 'Thành Công' : 'Lỗi'}
                        </h5>
                        <p>{modalMessage}</p>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </section>
    );

};

export default CheckoutCustomer;

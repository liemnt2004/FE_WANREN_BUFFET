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
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import FormatMoney from "./component/FormatMoney";
import {request} from "../../api/Request";

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

interface Location {
    id: string;
    full_name: string;
}

interface ApiResponse {
    error: number;
    data: Location[];
}

interface DecodedToken {
    sub: string;
    email: string;
    phone?: string;
    fullName: string;
}

const HO_CHI_MINH_ID = '79'; // ID của Hồ Chí Minh

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const cartContext = useContext(CartContext);
    const [listCart, setListCart] = useState<CartItem[]>(
        cartContext?.cartItems || []
    );

    let decoded: DecodedToken | null = null;
    if (token) {
        try {
            decoded = jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Invalid token:', error);
            navigate('/login');
        }
    } else {
        navigate('/login');
    }

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

    const [districts, setDistricts] = useState<Location[]>([]);
    const [wards, setWards] = useState<Location[]>([]);

    const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
    const [loadingWards, setLoadingWards] = useState<boolean>(false);

    const [errorDistricts, setErrorDistricts] = useState<string>('');
    const [errorWards, setErrorWards] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            setErrorDistricts('');
            try {
                const response = await fetch(
                    `https://esgoo.net/api-tinhthanh/2/${HO_CHI_MINH_ID}.htm`
                );
                const data: ApiResponse = await response.json();
                if (data.error === 0) {
                    setDistricts(data.data);
                } else {
                    setErrorDistricts('Không tải được danh sách quận/huyện.');
                }
            } catch (error) {
                setErrorDistricts('Đã xảy ra lỗi khi tải danh sách quận/huyện.');
            } finally {
                setLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, []);

    useEffect(() => {
        if (!formData.quan) {
            setWards([]);
            setFormData((prev) => ({ ...prev, phuong: '' }));
            return;
        }

        const fetchWards = async () => {
            setLoadingWards(true);
            setErrorWards('');
            try {
                const response = await fetch(
                    `https://esgoo.net/api-tinhthanh/3/${formData.quan}.htm`
                );
                const data: ApiResponse = await response.json();
                if (data.error === 0) {
                    setWards(data.data);
                } else {
                    setErrorWards('Hãy chọn phường của bạn');
                }
            } catch (error) {
                setErrorWards('Đã xảy ra lỗi khi tải danh sách phường/xã.');
            } finally {
                setLoadingWards(false);
            }
        };

        fetchWards();
    }, [formData.quan]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Tính toán tổng tiền
    const subtotal = listCart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = 15000; // Ví dụ phí giao hàng
    const total = subtotal + shippingFee;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.payment) {
            alert('Vui lòng chọn phương thức thanh toán.');
            setIsSubmitting(false);
            return;
        }

        const selectedDistrict = districts.find(district => district.id === formData.quan);
        const districtName = selectedDistrict ? selectedDistrict.full_name : "";
        const address22 = `${formData.detail_address}, ${districtName}, ${formData.tinh}`;

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

    const data =  await   request(`http://localhost:8080/api/payment/create_payment?price=${total}`)
        console.log(data.url)
        window.location.href = data.url;
    };




    return (
        <section className="checkout spad container-fluid">
            <div className="container">
                <div className="checkout__form">
                    <h4>Thông Tin Thanh Toán</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Form Thông Tin Thanh Toán */}
                            <div className="col-lg-8 col-md-6">
                                <div className="checkout__input mb-3">
                                    <label htmlFor="full_name">
                                        Họ và Tên<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={decoded?.fullName || ''}
                                        className="form-control"
                                        readOnly
                                        required
                                    />
                                </div>

                                {/* Chọn Địa Phương */}
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

                                {/* Chọn Quận/Huyện */}
                                <div className="checkout__input mb-3">
                                    <label htmlFor="quan" className="form-label">
                                        Quận/Huyện<span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <select
                                        className={`css_select ${
                                            errorDistricts ? 'is-invalid' : ''
                                        }`}
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

                                {/* Chọn Phường/Xã */}
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

                                {/* Ghi Chú Đơn Hàng */}
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

                            {/* Tóm Tắt Đơn Hàng */}
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

                                    {/* Phương Thức Thanh Toán */}
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
                                    <button
                                        type="submit"
                                        className="site-btn w-100"
                                        disabled={listCart.length === 0 || isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Checkout;

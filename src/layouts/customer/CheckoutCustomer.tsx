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
import { jwtDecode } from 'jwt-decode';
import FormatMoney from "./component/FormatMoney";
import { request } from "../../api/Request";
import { DecodedToken } from "./component/AuthContext";
import { getAllPromotion } from "../../api/apiCustommer/promotionApi";
import PromotionModel from "../../models/PromotionModel";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation(); 

    const [listCart, setListCart] = useState<CartItem[]>(cartContext?.cartItems || []);
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [description, setDescription] = useState<string>();
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const handleShowQRCodeModal = (qrCodeUrl: string) => {
        setQrCodeUrl(qrCodeUrl);
        setShowQRCodeModal(true);
        setIsUpdating(true)
    };

    const handleCloseQRCodeModal = () => {
        setIsUpdating(false)
        setShowQRCodeModal(false);
        setIsSucess(false);
    };

    let decoded: DecodedToken | null = null;
    try {
        if (token) {
            decoded = jwtDecode<DecodedToken>(token);
        }
    } catch (error) {
        console.error('Invalid token:', error);
        window.location.href = "https://wanrenbuffet.netlify.app/login"
    }

    useEffect(() => {
        if (!decoded) {
            window.location.href = "https://wanrenbuffet.netlify.app/login";
        }
    }, [decoded, navigate]);

    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    const error = queryParams.get('error');

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
            navigate("/")
        }
    }, [success, error, navigate]);

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

    const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);
    const [districts, setDistricts] = useState<LocationData[]>([]);
    const [wards, setWards] = useState<LocationData[]>([]);

    const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
    const [loadingWards, setLoadingWards] = useState<boolean>(false);
    const [errorDistricts, setErrorDistricts] = useState<string>('');
    const [errorWards, setErrorWards] = useState<string>('');
    const [lastAmount, setLastAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [promotions, setPromotions] = useState<PromotionModel[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionModel | null>(null);
    const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);
    const [loadingPromotions, setLoadingPromotions] = useState<boolean>(false);
    const [errorPromotions, setErrorPromotions] = useState<string>('');

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
                        setErrorDistricts(t('checkout.error_load_districts') || 'Không tải được danh sách quận/huyện.');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setErrorDistricts(t('checkout.error_occurred_districts') || 'Đã xảy ra lỗi khi tải danh sách quận/huyện.');
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
    }, [t]);

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
                        setErrorWards(t('checkout.select_ward') || 'Hãy chọn phường của bạn');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setErrorWards(t('checkout.error_load_wards') || 'Đã xảy ra lỗi khi tải danh sách phường/xã.');
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
    }, [formData.quan, t]);

    const fetchPromotions = async () => {
        setLoadingPromotions(true);
        setErrorPromotions('');
        try {
            const promotionsData = await getAllPromotion();
            setPromotions(promotionsData);
        } catch (error: any) {
            console.error('Error fetching promotions:', error);
            setErrorPromotions(error.message || t('checkout.error_loading_promotions') || 'Có lỗi xảy ra khi tải mã giảm giá.');
        } finally {
            setLoadingPromotions(false);
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const subtotal = listCart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = 15000;

    let total = subtotal + shippingFee;
    let discountDisplay = null;
    if (selectedPromotion) {
        if (selectedPromotion.promotionType === 'DISCOUNT%') {
            const discountValue = (subtotal * selectedPromotion.promotionValue) / 100;
            total = subtotal - discountValue + shippingFee;
            discountDisplay = t('checkout.discount_percentage', { value: selectedPromotion.promotionValue, discount: FormatMoney(discountValue) });
        } else if (selectedPromotion.promotionType === 'DISCOUNT-') {
            total = subtotal - selectedPromotion.promotionValue + shippingFee;
            discountDisplay = t('checkout.discount_direct', { discount: FormatMoney(selectedPromotion.promotionValue) });
        }
        total = Math.max(total, 0);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        // Kiểm tra số điện thoại
        const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Regex cho số điện thoại Việt Nam (10 chữ số, không dấu cách)
        if (!phoneRegex.test(formData.phoneCheckout)) {
            setModalMessage(t('checkout.phone_number_invalid') || 'Số điện thoại không hợp lệ.');
            setModalType('error');
            setShowModal(true);
            setIsSubmitting(false);
            return;
        }
    
        // Kiểm tra email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex cho email hợp lệ
        if (!emailRegex.test(formData.emailCheckout)) {
            setModalMessage(t('checkout.email_invalid') || 'Email không hợp lệ.');
            setModalType('error');
            setShowModal(true);
            setIsSubmitting(false);
            return;
        }
    
        if (!formData.payment) {
            setModalMessage(t('checkout.select_payment_method') || 'Vui lòng chọn phương thức thanh toán.');
            setModalType('error');
            setShowModal(true);
            setIsSubmitting(false);
            return;
        }
    
        let address22 = '';
    
        if (!showNewAddressForm && decoded && decoded.address !== '' && decoded.address !== undefined && decoded.address !== null) {
            address22 = decoded.address || "";
        } else {
            if (!formData.quan || !formData.phuong || !formData.detail_address) {
                setModalMessage(t('checkout.fill_address_info') || 'Vui lòng điền đầy đủ thông tin địa chỉ.');
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
            promotion: selectedPromotion?.promotion || null,
            promotionCode: selectedPromotion ? selectedPromotion.promotionName : null,
            orderDetails: listCart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
                itemNotes: '',
            })),
        };
    
        try {
            if (formData.payment === "VNPAY") {
                const createOrderResponse = await fetch('https://wanrenbuffet.online/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                });
    
                if (!createOrderResponse.ok) {
                    const errorData = await createOrderResponse.json();
                    throw new Error(errorData.message || t('checkout.order_failed') || "Đặt hàng thất bại.");
                }
    
                const createOrderResult = await createOrderResponse.json();
                const orderId = createOrderResult.orderId;
    
                if (createOrderResult.jwtToken) {
                    localStorage.setItem("token", createOrderResult.jwtToken);
                    const newDecoded = jwtDecode<DecodedToken>(createOrderResult.jwtToken);
    
                    setFormData(prev => ({
                        ...prev,
                        username: newDecoded.sub || "",
                        emailCheckout: newDecoded.email || "",
                        phoneCheckout: newDecoded.phone || "",
                    }));
                }
    
                const paymentResponse = await request(`https://wanrenbuffet.online/api/payment/create_payment?price=${total}`);
                if (!paymentResponse || !paymentResponse.url) {
                    throw new Error(t('checkout.vnpay_failed') || "Tạo thanh toán VN PAY thất bại.");
                }
                cartContext?.clearCart();
    
                window.location.href = paymentResponse.url;
    
            } else if (formData.payment === "CASH") {
                // Xử lý thanh toán tiền mặt
                const createOrderResponse = await fetch('https://wanrenbuffet.online/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                });
    
                if (!createOrderResponse.ok) {
                    const errorData = await createOrderResponse.json();
                    throw new Error(errorData.message || t('checkout.order_failed') || "Đặt hàng thất bại.");
                }
    
                const createOrderResult = await createOrderResponse.json();
    
                if (createOrderResult.jwtToken) {
                    localStorage.setItem("token", createOrderResult.jwtToken);
                    const newDecoded = jwtDecode<DecodedToken>(createOrderResult.jwtToken);
                    setFormData(prev => ({
                        ...prev,
                        username: newDecoded.sub || "",
                        emailCheckout: newDecoded.email || "",
                        phoneCheckout: newDecoded.phone || "",
                    }));
                }
    
                setModalMessage(t('checkout.order_success') || "Đặt hàng thành công. Chúng tôi sẽ liên hệ với bạn sớm.");
                setModalType('success');
                setShowModal(true);
                cartContext?.clearCart();
                window.location.reload();
            } else if (formData.payment === "QR_CODE") {
                // Xử lý thanh toán qua QR code
                const createOrderResponse = await fetch('https://wanrenbuffet.online/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                });
    
                if (!createOrderResponse.ok) {
                    const errorData = await createOrderResponse.json();
                    throw new Error(errorData.message || t('checkout.order_failed') || "Đặt hàng thất bại.");
                }
    
                const createOrderResult = await createOrderResponse.json();
                const orderId: number = createOrderResult.orderId;
    
                if (createOrderResult.jwtToken) {
                    localStorage.setItem("token", createOrderResult.jwtToken);
                    const newDecoded = jwtDecode<DecodedToken>(createOrderResult.jwtToken);
                    setFormData(prev => ({
                        ...prev,
                        username: newDecoded.sub || "",
                        emailCheckout: newDecoded.email || "",
                        phoneCheckout: newDecoded.phone || "",
                    }));
                }
    
                const myBank = {
                    bank_ID: 'MB',
                    account_NO: '280520049999'
                };
    
                setDescription(orderId + " Thanh toan tai Wanren Buffet");
                setLastAmount(Number(2000));
    
                const generateQrCode = (bank: { bank_ID: string; account_NO: string; }, amount: number): string => {
                    return `https://img.vietqr.io/image/${bank.bank_ID}-${bank.account_NO}-compact.png?amount=${amount}&addInfo=${orderId + " Thanh toan tai Wanren Buffet"}`;
                };
                const QR = generateQrCode(myBank, Number(2000));
                handleShowQRCodeModal(QR);
            }
    
        } catch (error: any) {
            console.error("Đặt hàng thất bại:", error);
            setModalMessage(error.message || t('checkout.order_or_payment_error') || "Có lỗi xảy ra trong quá trình đặt hàng hoặc tạo thanh toán.");
            setModalType('error');
            setShowModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const handleOpenPromotionModal = () => {
        setShowPromotionModal(true);
        fetchPromotions();
    };

    const handleClosePromotionModal = () => {
        setShowPromotionModal(false);
    };

    const handleSelectPromotion = (promotion: PromotionModel) => {
        setSelectedPromotion(promotion);
        setShowPromotionModal(false);
    };

    const handleRemovePromotion = () => {
        setSelectedPromotion(null);
    };

    return (
        <section className="checkout spad container-fluid">
            <div className="container">
                <div className="checkout__form mt-3">
                    <h4>{t('checkout.payment_info')}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row w-100">
                            <div className="col-lg-8 col-md-6">
                                <div className="checkout__input mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-danger mb-3"
                                        onClick={() => {
                                            setShowNewAddressForm(!showNewAddressForm);
                                        }}
                                    >
                                        {showNewAddressForm ? t('checkout.use_saved_address') : t('checkout.add_new_address')}
                                    </button>
                                </div>

                                {!showNewAddressForm && decoded && (
                                    <div className="checkout__input mb-3">
                                        <label>{t('checkout.save_address')}</label>
                                        <div className="saved-address">
                                            <p style={{color:'var(--text-color)'}}><strong >{t('checkout.full_name')}:</strong> {decoded.fullName}</p>
                                            <p style={{color:'var(--text-color)'}}><strong>{t('checkout.address')}</strong> {`${decoded.address}`}</p>
                                        </div>
                                    </div>
                                )}

                                {showNewAddressForm && (
                                    <>
                                        <div className="css_select_div mb-3 d-none">
                                            <label htmlFor="tinh" className="form-label">
                                                {t('checkout.city')}<span className="text-danger">*</span>
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

                                        <div className="checkout__input mb-3">
                                            <label htmlFor="quan" className="form-label">
                                                {t('checkout.district')}<span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <select
                                                className={`css_select ${errorDistricts ? 'is-invalid' : ''}`}
                                                id="quan"
                                                name="quan"
                                                title={t('checkout.select_district')}
                                                value={formData.quan}
                                                onChange={handleChange}
                                                disabled={loadingDistricts}
                                                required
                                            >
                                                <option value="">{t('checkout.district')}</option>
                                                {loadingDistricts && (
                                                    <option value="">{t('checkout.loading')}...</option>
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

                                        <div className="checkout__input mb-3">
                                            <label htmlFor="phuong" className="form-label">
                                                {t('checkout.ward')}<span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <select
                                                className={`css_select ${errorWards ? 'is-invalid' : ''}`}
                                                id="phuong"
                                                name="phuong"
                                                title={t('checkout.select_ward')}
                                                value={formData.phuong}
                                                onChange={handleChange}
                                                disabled={!formData.quan || loadingWards}
                                                required
                                            >
                                                <option value="">{t('checkout.ward')}</option>
                                                {loadingWards && <option value="">{t('checkout.loading')}</option>}
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
                                                {t('checkout.street_building')}<span className="text-danger">*</span>
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

                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="checkout__input mb-3">
                                            <label htmlFor="phoneCheckout">
                                                {t('checkout.phone_number')}<span className="text-danger">*</span>
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

                                <div className="checkout__input mb-3">
                                    <label htmlFor="note">{t('checkout.note')}</label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        placeholder={t('checkout.note_placeholder') || ''}
                                        value={formData.note}
                                        onChange={handleChange}
                                        className="form-control"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 p-0">
                                <div className="checkout__order w-100 mb-5">
                                    <h4>{t('checkout.order')}</h4>
                                    <div className="checkout__order__products d-flex justify-content-between">
                                        <span>{t('checkout.product')}</span>
                                        <span className='pe-2'>{t('checkout.total')}</span>
                                    </div>
                                    <ul className="list-group mb-3 ">
                                        {listCart.length > 0 ? (
                                            listCart.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    {item.productName} x {item.quantity}
                                                    <span className='pe-2'>{FormatMoney(item.price * item.quantity)}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">{t('checkout.cart_empty')}</li>
                                        )}
                                    </ul>
                                    <div className="checkout__order__subtotal d-flex justify-content-between mb-2">
                                        <span>{t('checkout.subtotal')}</span>
                                        <span>{FormatMoney(subtotal)}</span>
                                    </div>

                                    {listCart.length > 0 && (
                                        <div className="checkout__input mb-2">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <label>{t('checkout.voucher')}</label>
                                                {selectedPromotion ? (
                                                    <>
                                                        <span>{selectedPromotion.promotionName}</span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={handleRemovePromotion}
                                                        >
                                                            {t('checkout.remove')}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={handleOpenPromotionModal}
                                                    >
                                                        {t('checkout.select_promotion')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {discountDisplay && (
                                        <div className="checkout__order__discount d-flex justify-content-between mt-2">
                                            <span>{discountDisplay}</span>
                                        </div>
                                    )}

                                    <div className="checkout__order__subtotal d-flex justify-content-between mt-2">
                                        <span>{t('checkout.ship')}</span>
                                        <span>{FormatMoney(shippingFee)}</span>
                                    </div>
                                    <div className="checkout__order__total d-flex justify-content-between mb-3">
                                        <span>{t('checkout.total')}</span>
                                        <span>{FormatMoney(total)}</span>
                                    </div>

                                    <div className='d-flex'>
                                        <div>
                                            <div className="checkout__input__checkbox me-3">
                                                <label className='text-dark'>
                                                    {t('checkout.cod')}
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="CASH"
                                                        checked={formData.payment === 'CASH'}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div className="checkout__input__checkbox">
                                                <label className='text-dark'>
                                                    VN PAY
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="VNPAY"
                                                        checked={formData.payment === 'VNPAY'}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>


                                        <div className="checkout__input__checkbox ms-2">
                                            <label className='text-dark'>
                                                QR CODE
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="QR_CODE"
                                                    checked={formData.payment === 'QR_CODE'}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className='text-center'>
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                            disabled={listCart.length === 0 || isSubmitting}
                                        >
                                            {isSubmitting ? t('checkout.processing') : t('checkout.place_order')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {showPromotionModal && (
                <div className="modal-overlay" onClick={handleClosePromotionModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5 className="modal-title">{t('checkout.choose_discount_code')}</h5>
                        {loadingPromotions ? (
                            <p>{t('checkout.loading_promotions')}</p>
                        ) : errorPromotions ? (
                            <p className="text-danger">{errorPromotions}</p>
                        ) : promotions.length > 0 ? (
                            <ul className="list-group">
  {promotions.map((promo) => (
    <li
      key={promo.promotion}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <div>
        <strong>{promo.promotionName}</strong>
      </div>
      
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleSelectPromotion(promo)}
        disabled={subtotal < promo.unitPrice}
      >
        {t("checkout.select")}
      </button>
    </li>
  ))}
</ul>

                        ) : (
                            <p>{t('checkout.no_available_promotions')}</p>
                        )}
                        <button className="btn btn-secondary mt-3" onClick={handleClosePromotionModal}>
                            {t('checkout.close')}
                        </button>
                    </div>
                </div>
            )}

            {showQRCodeModal && (
                <div className="modal-overlay" onClick={() => handleCloseQRCodeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5 className="modal-title">{t('checkout.pay_by_qr')}</h5>
                        <div className="qr-code-container">
                            <img src={qrCodeUrl} alt={t('checkout.qr_alt')} className="qr-code-image" />
                        </div>
                        <button className="btn btn-secondary mt-3" onClick={() => handleCloseQRCodeModal()}>
                            {t('checkout.close')}
                        </button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5 className={`modal-title ${modalType === 'success' ? 'text-success' : 'text-danger'}`}>
                            {modalType === 'success' ? t('checkout.success') : t('checkout.error')}
                        </h5>
                        <p>{modalMessage}</p>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            {t('checkout.close')}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CheckoutCustomer;

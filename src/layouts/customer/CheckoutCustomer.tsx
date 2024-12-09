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
import { getAllPromotion } from "../../api/apiCustommer/promotionApi";
import PromotionModel from "../../models/PromotionModel";



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
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    // Modal State
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [description, setDescription] = useState<string>();
    // State để hiển thị modal QR Code
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);

// URL của ảnh QR code
    const [qrCodeUrl, setQrCodeUrl] = useState("");

// Hàm mở modal và cập nhật URL QR Code
    const handleShowQRCodeModal = (qrCodeUrl:string) => {
        setQrCodeUrl(qrCodeUrl);  // Lưu URL ảnh QR
        setShowQRCodeModal(true);  // Mở modal
        setIsUpdating(true)
    };

// Hàm đóng modal và đặt lại giá trị success
    const handleCloseQRCodeModal = () => {
        console.log("Đã Tăt")
        setIsUpdating(false)
        setShowQRCodeModal(false);
        setIsSucess(false);  // Đặt lại trạng thái thành false khi đóng modal
    };

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
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');
        const error = queryParams.get('error');
    
        if (success) {
            setModalMessage(decodeURIComponent(success));
            setModalType('success');
            setShowModal(true);
        } else if (error) {
            setModalMessage(decodeURIComponent(error));
            setModalType('error');
            setShowModal(true);
        }
    }, [location.search]);
    

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
    const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);

    // Locations State
    const [districts, setDistricts] = useState<LocationData[]>([]);
    const [wards, setWards] = useState<LocationData[]>([]);

    // Loading and Error States
    const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
    const [loadingWards, setLoadingWards] = useState<boolean>(false);
    const [errorDistricts, setErrorDistricts] = useState<string>('');
    const [errorWards, setErrorWards] = useState<string>('');
    const [lastAmount, setLastAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // State Variables for Promotion Code Modal
    const [promotions, setPromotions] = useState<PromotionModel[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionModel | null>(null);
    const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);
    const [loadingPromotions, setLoadingPromotions] = useState<boolean>(false);
    const [errorPromotions, setErrorPromotions] = useState<string>('');

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

    // Fetch Promotions when Modal Opens
    const fetchPromotions = async () => {
        setLoadingPromotions(true);
        setErrorPromotions('');
        try {
            const promotionsData = await getAllPromotion();
            setPromotions(promotionsData);
        } catch (error: any) {
            console.error('Error fetching promotions:', error);
            setErrorPromotions(error.message || 'Có lỗi xảy ra khi tải mã giảm giá.');
        } finally {
            setLoadingPromotions(false);
        }
    };

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

    // Calculate Discounted Total
    let total = subtotal + shippingFee;
    let discountDisplay = null;
    if (selectedPromotion) {
        if (selectedPromotion.promotionType === 'DISCOUNT%') {
            const discountValue = (subtotal * selectedPromotion.promotionValue) / 100;
            total = subtotal - discountValue + shippingFee;
            discountDisplay = `Giảm ${selectedPromotion.promotionValue}% (-${FormatMoney(discountValue)})`;
        } else if (selectedPromotion.promotionType === 'DISCOUNT-') {
            total = subtotal - selectedPromotion.promotionValue + shippingFee;
            discountDisplay = `Giảm trực tiếp (-${FormatMoney(selectedPromotion.promotionValue)})`;
        }
        // Ensure total is not negative
        total = Math.max(total, 0);
    }

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

        if (!showNewAddressForm && decoded && decoded.address != '') {
            // Use saved address from token
            address22 = decoded.address || ""
        }

        else {
            // Use new address entered
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
            promotion: selectedPromotion?.PromotionId || null,
            promotionCode: selectedPromotion ? selectedPromotion.promotionName : null,
            orderDetails: listCart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
                itemNotes: '',
            })),
        };

        try {
            // If VN PAY is selected
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
                    throw new Error(errorData.message || "Đặt hàng thất bại.");
                }

                const createOrderResult = await createOrderResponse.json();
                const orderId = createOrderResult.orderId;

                // Kiểm tra và lưu token mới nếu có
                if (createOrderResult.jwtToken) {
                    localStorage.setItem("token", createOrderResult.jwtToken);
                    const newDecoded = jwtDecode<DecodedToken>(createOrderResult.jwtToken);

                    // Cập nhật formData với thông tin mới từ token
                    setFormData(prev => ({
                        ...prev,
                        username: newDecoded.sub || "",
                        emailCheckout: newDecoded.email || "",
                        phoneCheckout: newDecoded.phone || "",
                        // Bạn có thể cập nhật thêm các trường khác nếu cần
                    }));
                }

                // Create payment URL
                const paymentResponse = await request(`https://wanrenbuffet.online/api/payment/create_payment?price=${total}`);
                if (!paymentResponse || !paymentResponse.url) {
                    throw new Error("Tạo thanh toán VN PAY thất bại.");
                }
                cartContext?.clearCart();

                // Redirect user to VN PAY payment URL
                window.location.href = paymentResponse.url;

            } else if (formData.payment === "CASH") {
                // Handle other payment methods, e.g., Cash on Delivery
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
                    throw new Error(errorData.message || "Đặt hàng thất bại.");
                }

                const createOrderResult = await createOrderResponse.json();

                // Kiểm tra và lưu token mới nếu có
                if (createOrderResult.jwtToken) {
                    localStorage.setItem("token", createOrderResult.jwtToken);

                    const newDecoded = jwtDecode<DecodedToken>(createOrderResult.jwtToken);
                    // Cập nhật formData với thông tin mới từ token
                    setFormData(prev => ({
                        ...prev,
                        username: newDecoded.sub || "",
                        emailCheckout: newDecoded.email || "",
                        phoneCheckout: newDecoded.phone || "",
                        // Bạn có thể cập nhật thêm các trường khác nếu cần
                    }));
                }
                cartContext?.clearCart();

                setModalMessage("Đặt hàng thành công. Chúng tôi sẽ liên hệ với bạn sớm.");
                setModalType('success');
                setShowModal(true);
                window.location.reload()
            }else if(formData.payment === "QR_CODE"){
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
                    throw new Error(errorData.message || "Đặt hàng thất bại.");
                }

                const createOrderResult = await createOrderResponse.json();
                console.log(createOrderResult)
                const orderId:number = createOrderResult.orderId;

                console.log(orderId)


                if (createOrderResult.jwtToken) {
                    localStorage.setItem("token", createOrderResult.jwtToken);
                    const newDecoded = jwtDecode<DecodedToken>(createOrderResult.jwtToken);

                    // Cập nhật formData với thông tin mới từ token
                    setFormData(prev => ({
                        ...prev,
                        username: newDecoded.sub || "",
                        emailCheckout: newDecoded.email || "",
                        phoneCheckout: newDecoded.phone || "",
                        // Bạn có thể cập nhật thêm các trường khác nếu cần
                    }));
                }

                const myBank = {
                    bank_ID: 'MB',
                    account_NO: '280520049999'
                };






                setDescription(orderId + " Thanh toan tai Wanren Buffet");
                setLastAmount( Number(2000))


                const generateQrCode = (bank: { bank_ID: string; account_NO: string; }, amount: number): string => {
                    console.log(description)
                    return `https://img.vietqr.io/image/${bank.bank_ID}-${bank.account_NO}-compact.png?amount=${amount}&addInfo=${orderId + " Thanh toan tai Wanren Buffet"}`;
                };
                const QR = generateQrCode(myBank, Number(2000));
                handleShowQRCodeModal(QR);  // Mở modal và hiển thị QR code


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





    useEffect(() => {
        const interval = setInterval(async () => {

            if (isUpdating) {

                await checkPaid(lastAmount, description || "");
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isUpdating, lastAmount, description]);

    async function checkPaid(price: number , description: string) {
        console.log(description)
        if (isSucess) {
            return;
        } else {
            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbyXPtx_J0RXilysEH-qwzQ8n2QPHJe8LyrMTn74sQJJGKAFKeVhuFYBA32zR3WZiXKHyw/exec");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (Array.isArray(data.data) && data.data.length > 0) {
                    const lastPaid = data.data[1];
                    const lastPrice = lastPaid["Giá trị"];
                    const lastDescription = lastPaid["Mô tả"];
                    if (lastPrice >= lastAmount && lastDescription.includes(description)) {
                        console.log("thành công")
                        handleCloseQRCodeModal()
                        cartContext?.clearCart();
                        window.location.href = `https://wanrenbuffet.online/api/payment/callbck_qrcode/${description.trim().slice(0,2)}`;

                    } else {
                        console.log("Thanh toán đang cập nhật!")
                    }
                } else {
                    console.log("No data or data is not an array.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    }



    // Open Promotion Modal
    const handleOpenPromotionModal = () => {
        setShowPromotionModal(true);
        fetchPromotions();
    };

    // Close Promotion Modal
    const handleClosePromotionModal = () => {
        setShowPromotionModal(false);
    };

    // Handle Promotion Selection
    const handleSelectPromotion = (promotion: PromotionModel) => {
        setSelectedPromotion(promotion);
        setShowPromotionModal(false);
    };

    // Remove Selected Promotion
    const handleRemovePromotion = () => {
        setSelectedPromotion(null);
    };

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

                                {/* If using saved address */}
                                {!showNewAddressForm && decoded && (
                                    <div className="checkout__input mb-3">
                                        <label>Địa Chỉ Đã Lưu</label>
                                        <div className="saved-address">
                                            <p><strong>Họ và Tên:</strong> {decoded.fullName}</p>
                                            <p><strong>Địa chỉ:</strong> {`${decoded.address}`}</p>
                                        </div>
                                    </div>
                                )}

                                {/* If adding a new address */}
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

                                        {/* District Selection */}
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

                                        {/* Ward Selection */}
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

                                    {/* Promotion Code Selection */}
                                    {listCart.length > 0 && (
                                        <div className="checkout__input mb-3">
                                            <label>Mã Giảm Giá</label>
                                            <div className="d-flex align-items-center">
                                                {selectedPromotion ? (
                                                    <>
                                                        <span>{selectedPromotion.promotionName}</span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger ms-2"
                                                            onClick={handleRemovePromotion}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={handleOpenPromotionModal}
                                                    >
                                                        Chọn Mã Giảm Giá
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Display Discount if Applied */}
                                    {discountDisplay && (
                                        <div className="checkout__order__discount d-flex justify-content-between mt-2">
                                            <span>{discountDisplay}</span>
                                        </div>
                                    )}

                                    <div className="checkout__order__subtotal d-flex justify-content-between mt-2">
                                        <span>Phí Giao Hàng</span>
                                        <span>{FormatMoney(shippingFee)}</span>
                                    </div>
                                    <div className="checkout__order__total d-flex justify-content-between mb-3">
                                        <span>Tổng Tiền</span>
                                        <span>{FormatMoney(total)}</span>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className='d-flex'>
                                        <div>
                                        <div className="checkout__input__checkbox mb-3">
                                        <label>
                                            Thanh Toán Khi Nhận Hàng
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
                                    <div className="checkout__input__checkbox mb-3">
                                        <label>
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
                                        <label>
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

            {/* Promotion Code Modal */}
            {showPromotionModal && (
                <div className="modal-overlay" onClick={handleClosePromotionModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5 className="modal-title">Chọn Mã Giảm Giá</h5>
                        {loadingPromotions ? (
                            <p>Đang tải mã giảm giá...</p>
                        ) : errorPromotions ? (
                            <p className="text-danger">{errorPromotions}</p>
                        ) : promotions.length > 0 ? (
                            <ul className="list-group">
                            {promotions.map((promo) => (
                                    <li
                                        key={promo.PromotionId}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <strong>{promo.promotionName}</strong> - {promo.description}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => handleSelectPromotion(promo)}
                                        >
                                            Chọn
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Không có mã giảm giá khả dụng.</p>
                        )}
                        <button className="btn btn-secondary mt-3" onClick={handleClosePromotionModal}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {showQRCodeModal && (
                <div className="modal-overlay" onClick={() => handleCloseQRCodeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h5 className="modal-title">Thanh Toán Qua QR Code</h5>
                        <div className="qr-code-container">
                            {/* Hiển thị ảnh QR Code */}
                            <img src={qrCodeUrl} alt="QR Code thanh toán" className="qr-code-image" />
                        </div>
                        <button className="btn btn-secondary mt-3" onClick={() => handleCloseQRCodeModal()}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}


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

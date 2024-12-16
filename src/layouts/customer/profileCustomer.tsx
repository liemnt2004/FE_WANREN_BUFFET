

import React, { useContext, useEffect, useState } from "react";
import "./assets/css/styles.css";
import "./assets/css/Tinh_Style.css";
import "./assets/css/order_history.css";
import kichi from "./assets/img/Cream and Black Simple Illustration Catering Logo.png";
import { AuthContext, DecodedToken } from "./component/AuthContext";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { useNavigate } from "react-router-dom";
import { getProductHot } from "../../api/apiCustommer/productApi";
import { getPreparingOrders } from "../../api/apiCustommer/OrderApi";
import formatMoney from "./component/FormatMoney";
import axios from "axios";
import { OrderModel } from "../../models/OrderModel";
import { CartContext, CartItem } from "./component/CartContext";
import { useTranslation } from 'react-i18next';

interface PromotionVoucher {
    promotionName: string;
    image: string;
    endDate: string;
    voucherCode: string;
    status: boolean;
}

interface UserInfo {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
}



// models/ProductDetail.ts
export interface ProductDetail {
    _productId: number;
    _productName: string;
    _description: string;
    _price: number;
    _typefood: string;
    _image: string;
    _quantity: number;
    _productStatus: string;
    _total: number
}


interface UserInfoProps {
    userInfo: UserInfo;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

interface HistoryOrderProps {
    listOrder: OrderModel[];
    setListOrder: React.Dispatch<React.SetStateAction<OrderModel[]>>;
}



interface TogglePanelProps {
    togglePanel: (panelType: string) => void;
}

const AccountPanel: React.FC<TogglePanelProps> = ({ togglePanel }) => (
    <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
        <div
            className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
            onClick={() => togglePanel("account")}
        >
            <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
                <span className="text-black fw-bold fs-6 m-0 p-0">Tài Khoản Của Bạn</span>
            </div>
            <hr className="m-0 p-0" />
            <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
                <p className="tinh-fs10">Xem và thay đổi thông tin của bạn</p>
            </div>
        </div>
    </div>
);

const OrderPanel: React.FC<TogglePanelProps> = ({ togglePanel }) => (

    <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
        <div
            className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
            onClick={() => togglePanel("orders")}
        >
            <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
                <span className="text-black fw-bold fs-6 m-0 p-0">Đơn Hàng Của Bạn</span>
            </div>
            <hr className="m-0 p-0" />
            <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
                <p className="tinh-fs10">Quản lí và theo dõi các đơn hàng của bạn</p>
            </div>
        </div>
    </div>
);

const VoucherPanel: React.FC<TogglePanelProps> = ({ togglePanel }) => (
    <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
        <div
            className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
            onClick={() => togglePanel("voucher")}
        >
            <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
                <span className="text-black fw-bold fs-6 m-0 p-0">Voucher</span>
            </div>
            <hr className="m-0 p-0" />
            <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
                <p className="tinh-fs10">Bạn có thể xem và sử dụng các Voucher khuyến mãi</p>
            </div>
        </div>
    </div>
);

const MenuList: React.FC<TogglePanelProps> = ({ togglePanel }) => (
    <div className="row tinh-height90 m-0 p-3 align-items-center" id="leftContent2" >
        <div className="row tinh-height30 m-0 p-2 px-3 d-flex align-items-center justify-content-center" >
            <div className="row m-0 p-0 d-flex justify-content-center" >
                <img src={kichi} className="rounded-circle w-50 " alt="User Logo" style={{ width: 10 }} />
            </div>
        </div>
        <div className="d-flex flex-column justify-content-between" >
            <div className="tinh-btn-list-group" style={{color: 'var(--text-color)'}}>
                <a href="#" onClick={(e) => { e.preventDefault(); togglePanel("account"); }}>
                    <span style={{color: 'var(--text-color)'}}>Tài khoản của bạn</span>
                </a>
            </div>
            <div className="tinh-btn-list-group my-2">
                <a href="#" onClick={(e) => { e.preventDefault(); togglePanel("orders"); }}>
                    <span style={{color: 'var(--text-color)'}}>Đơn hàng của bạn</span>
                </a>
            </div>
            <div className="tinh-btn-list-group">
                <a href="#" onClick={(e) => { e.preventDefault(); togglePanel("voucher"); }}>
                    <span style={{color: 'var(--text-color)'}}>Voucher</span>
                </a>
            </div>
        </div>
    </div>
);

const PersonalInfo: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => {
    const [editing, setEditing] = useState(false);
    const [tempInfo, setTempInfo] = useState<UserInfo>(userInfo);
    const token = localStorage.getItem("token");
    const decoded = jwtDecode<DecodedToken>(token || "");
    const { t } = useTranslation();
    const handleSave = async () => {
        try {
            const response = await fetch(`https://wanrenbuffet.online/api/customer/updateCustomer/${decoded.sub}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tempInfo),
            });

            if (!response.ok) {
                throw new Error("Failed to update user information");
            }

            const updatedUser = await response.json();
            console.log(updatedUser)
            setUserInfo(updatedUser);
            localStorage.setItem("token", updatedUser.jwtToken);
            window.location.reload();
            setEditing(false);
        } catch (error) {
            console.error("Error updating user information:", error);
        }
    };

    const handleCancel = () => {
        setTempInfo(userInfo);
        setEditing(false);
    };

    return (
        <div className="col-12 col-sm-4 " style={{color: 'var(--text-color)'}}>
            <h4 className="py-3 fw-bold">{t('personal_info')}</h4>
            {!editing ? (
                <div id="personalInfo" >
                    <span  style={{color: 'var(--text-color)'}} id="nameDisplay">
                        {userInfo.fullName}
                    </span>
                    <br />
                    <span style={{color: 'var(--text-color)'}} id="phoneDisplay">
                        {userInfo.phoneNumber}
                    </span>
                    <br />
                    <span style={{color: 'var(--text-color)'}} id="email">
                        {userInfo.email}
                    </span>
                    <br />
                    <hr />
                    <a
                        href="#"
                        className=" none-underline"
                        onClick={(e) => {
                            e.preventDefault();
                            setEditing(true);
                        }}
                    >
                        {t('edit')}
                    </a>
                </div>
            ) : (
                <div id="editPersonalInfo">
                    <input
                        type="text"
                        id="nameInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={tempInfo.fullName} // use tempInfo instead of userInfo
                        onChange={(e) => setTempInfo({ ...tempInfo, fullName: e.target.value })}
                    />
                    <input
                        type="text"
                        id="phoneInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={tempInfo.phoneNumber} // use tempInfo instead of userInfo
                        onChange={(e) => setTempInfo({ ...tempInfo, phoneNumber: e.target.value })}
                    />
                    <input
                        type="email"
                        id="emailInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={userInfo.email}
                        onChange={(e) => setTempInfo({ ...tempInfo, email: e.target.value })}
                    />
                    <hr />
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14 tinh-mr"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        {t('save')}
                    </a>
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14"
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                    >
                        {t('cancel')}
                    </a>
                </div>
            )}
        </div>
    );
};







const PasswordInfo: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => {
    const [editing, setEditing] = useState(false);
    const [tempPassword, setTempPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>(""); // New state for confirm password
    const [error, setError] = useState<string | null>(null); // To display error messages
    const [token, setToken] = useState<string | null>(localStorage.getItem('token')); // Token state

    const authContext = useContext(AuthContext);
    const { t } = useTranslation();
    // Update token if it changes in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleSave = async () => {
        if (tempPassword !== confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        if (tempPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        try {
            const response = await fetch(`https://wanrenbuffet.online/api/customer/updatePassword/${authContext.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password: tempPassword }), // Pass the password in the body
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Không thể cập nhật mật khẩu');
            }

            setUserInfo({ ...userInfo, password: tempPassword });
            setEditing(false);
            setError(null); // Clear any error on successful update
        } catch (error: any) {
            console.error('Error updating password:', error);
            setError('Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setTempPassword("");
        setEditing(false);
    };

    return (
        <div className="card p-3 rounded-0 mb-3" style={{backgroundColor: 'var(--body-color-table)'}}>
            {/* Check if username contains "@" */}
            {authContext.username && authContext.username.includes("@") ? (
                // Don't allow editing if username contains "@"
                <div id="passwordInfo">
                    <h4 className="py-3">{t('password')}</h4>
                    <span className="tinh-fs12" id="passwordDisplay" >
                        *********
                    </span>
                    <br />
                    <hr />
                    <p className="text-muted">Bạn không thể thay đổi mật khẩu nếu tài khoản này Google.</p>
                </div>
            ) : (
                // Allow editing only if username doesn't contain "@"
                !editing && (
                    <div id="passwordInfo">
                        <h4 className="py-3">{t('password')}</h4>
                        <span className="tinh-fs12" id="passwordDisplay" style={{color: 'var(--text-color)'}}>
                            *********
                        </span>
                        <br />
                        <hr />
                        <a
                        style={{color: 'var(--text-color)'}}
                            href="#"
                            className="none-underline tinh-fs14"
                            onClick={(e) => {
                                e.preventDefault();
                                setEditing(true);
                            }}
                        >
                            {t('edit')}
                        </a>
                    </div>
                )
            )}

            {!authContext.username?.includes("@") && editing && (
                <div id="editPasswordInfo">
                    <input
                    style={{backgroundColor: 'white'}}

                        type="password"
                        id="passwordInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                    />
                    <input
                    style={{backgroundColor: 'white'}}
                    
                        type="password"
                        id="re-enterPassword"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                    />
                    {error && <div className="text-danger my-2">{error}</div>} {/* Display error message */}
                    <hr />
                    <a style={{color: 'var(--text-color)'}}
                        href="#"
                        className="none-underline tinh-fs14 tinh-mr"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        {t('save')}
                    </a>
                    <a style={{color: 'var(--text-color)'}}
                        href="#"
                        className="none-underline tinh-fs14"
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                    >
                        {t('cancel')}
                    </a>
                </div>
            )}
        </div>
    );
};




const AccountContent: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => (

    <div
        className="row tinh-height90 m-0 align-items-center tinh-overflowScroll"
        style={{ padding: "100px 40px 0 40px" }}
    >
        <PersonalInfo userInfo={userInfo} setUserInfo={setUserInfo} />

        <PasswordInfo userInfo={userInfo} setUserInfo={setUserInfo} />
    </div>
);

const OrdersContent: React.FC<HistoryOrderProps> = ({
    listOrder,
    setListOrder,
}) => {

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderDetails, setOrderDetails] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalmodal, setTotalmodal] = useState<number | null>(null);
    const [promotion, setPromotion] = useState<string | "">("");
    const cartContext = useContext(CartContext);
    const { t } = useTranslation();
    // State variables for order review
    const [selectedOrderForReview, setSelectedOrderForReview] =
        useState<OrderModel | null>(null);
    const [reviewContent, setReviewContent] = useState<string>("");
    const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    console.log(selectedOrderId);
    

    useEffect(() => {
        if (selectedOrderId) {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            const headers = {
                "Content-Type": "application/json",
            } as any;

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            axios
                .get<ProductDetail[]>(
                    `https://wanrenbuffet.online/api/orders/GetOrderDetailByOrderId/${selectedOrderId}`,
                    { headers: headers }
                )
                .then((response) => {
                    setOrderDetails(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching order details:", err);
                    setError("Failed to load order details.");
                    setLoading(false);
                });
        }
    }, [selectedOrderId]);


    useEffect(() => {
        // Calculate total whenever orderDetails changes
        if (selectedOrderId != null) {
            const total = orderDetails.reduce(
                (sum, product) => sum + product._price * product._quantity,
                0
            );
            setTotalmodal(total);
        }
    }, [orderDetails, selectedOrderId]);

    useEffect(() => {
        // Calculate total whenever orderDetails changes
        if (selectedOrderId != null) {
            const order = listOrder.find(order => order.orderId === selectedOrderId);
            setPromotion(order?.promotion || "0");
        }
    }, [orderDetails, selectedOrderId]);

    if (!cartContext) {
        return <div>Đang tải giỏ hàng...</div>;
    }

    const { addToCart } = cartContext;

    const handleBuyAgain = (products: ProductDetail[]) => {
        products.forEach((product) => {
            const cartItem: CartItem = {
                productId: product._productId,
                productName: product._productName,
                price: product._price,
                image: product._image,
                quantity: product._quantity,
            };

            addToCart(cartItem);
        });
    };

    const handleViewMore = (orderId: number) => {
        setSelectedOrderId(orderId);
    };

    const openOrderReviewModal = (order: OrderModel) => {
        setSelectedOrderForReview(order);
    };

    const closeOrderReviewModal = () => {
        setSelectedOrderForReview(null);
        setReviewContent("");
        setReviewError(null);
    };

    const handleOrderReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewSubmitting(true);
        setReviewError(null);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://wanrenbuffet.online/api/review/Creact_review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    order: Number(selectedOrderForReview?.orderId),
                    content: reviewContent,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            // Update the isReviewed flag for the order
            if (selectedOrderForReview) {
                setListOrder((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === selectedOrderForReview.orderId
                            ? { ...order, isReviewed: true }
                            : order
                    )
                );
            }

            // Reset form and close modal
            closeOrderReviewModal();

            alert("Đánh giá của bạn đã được gửi thành công!");
        } catch (error) {
            console.error("Error submitting review:", error);
            setReviewError("Gửi đánh giá thất bại. Vui lòng thử lại.");
        } finally {
            setReviewSubmitting(false);
        }
    };

    return (
        <div
            className="row tinh-height90 m-0 align-items-center tinh-overflowScroll order_history"
            style={{ padding: "20px 40px 0 40px" }}
        >
            <div className="container mt-5">
                {listOrder.map((order) => (
                    <div className="card mb-3" key={order.orderId}>
                        <div className="card-header order-header">
                            <span className="fs-6">{t('order_id')} {order.orderId}</span>
                            <span className="float-end fs-6">
                                {formatMoney(order.totalAmount)}
                            </span>
                        </div>
                        <div className="card-body">
                            <p className="order-info">{t('address')} {order.address}</p>
                            <div className="row g-0">
                                <div className="col-md-2">
                                    <img
                                        src={order.producHistorytDTOList[0]._image}
                                        className="img-fluid rounded w-100"
                                        alt="Product"
                                    />
                                </div>
                                <div className="col-md-10 px-3">
                                    <div className="product-info">
                                        <h5>{order.producHistorytDTOList[0]._productName}</h5>
                                        <p dangerouslySetInnerHTML={{ __html: order.producHistorytDTOList[0]._description }}></p>
                                        {/* Trạng thái sản phẩm */}
                                        <p>
                                            {(() => {
                                                const status = order.orderStatus;

                                                switch (status) {
                                                    case "PREPARING_ORDER":
                                                        return (
                                                            <span>
                                                                <i className="fas fa-cogs"></i> {t('order_status1')}
                                                            </span>
                                                        );
                                                    case "WAITING":
                                                        return (
                                                            <span>
                                                                <i className="fas fa-clock"></i> {t('order_status2')}
                                                            </span>
                                                        );
                                                    case "IN_TRANSIT":
                                                        return (
                                                            <span>
                                                                <i className="fas fa-truck"></i> {t('order_status3')}
                                                            </span>
                                                        );
                                                    case "DELIVERED":
                                                        return (
                                                            <span>
                                                                <i className="fas fa-check-circle"></i> {t('order_status4')}
                                                            </span>
                                                        );
                                                    default:
                                                        return (
                                                            <span>
                                                                <i className="fas fa-question-circle"></i> {t('order_status5')}
                                                            </span>
                                                        );
                                                }
                                            })()}
                                        </p>
                                        <p>x {order.producHistorytDTOList[0]._quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer card-footer-custom">
                            <button
                                type="button"
                                className="btn btn-primary btn-view-order"
                                onClick={() => handleViewMore(order.orderId)}
                            >
                                <i className="fas fa-info-circle"></i> {t('product_detail')}
                            </button>

                            {/* Conditionally render the review button */}
                            {!order.isReviewed ? (
                                <button
                                    className="btn btn-secondary btn-view-order"
                                    onClick={() => openOrderReviewModal(order)}
                                >
                                    {t('fellback')}
                                </button>
                            ) : (
                                <button className="btn btn-secondary btn-view-order" disabled>
                                    {t('fellback_succes')}
                                </button>
                            )}
                            <button
                                onClick={() => handleBuyAgain(order.producHistorytDTOList)}
                                className="btn btn-primary btn-view-order float-end btn-buy"
                            >
                                {t('buy_try')}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Modal for viewing more products */}
                <div
                    className={`modal fade ${selectedOrderId ? "show" : ""}`}
                    id="orderModal"
                    tabIndex={-1}
                    aria-labelledby="orderModalLabel"
                    aria-hidden={selectedOrderId ? "false" : "true"}
                    style={{ display: selectedOrderId ? "block" : "none" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            {loading && (
                                <div className="modal-body text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="modal-body">
                                    <p className="text-danger">{error}</p>
                                </div>
                            )}
                            {!loading && !error && selectedOrderId && (
                                <>
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="orderModalLabel">
                                            {t('order_id')} #{selectedOrderId} - {t('product_detail')}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={() => setSelectedOrderId(null)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        {orderDetails.length > 0 ? (
                                            orderDetails.map((product) => (
                                                <div className="row mb-3" key={product._productId}>
                                                    <div className="col-md-4">
                                                        <img
                                                            src={
                                                                product._image || "images/default_product.jpg"
                                                            }
                                                            className="img-fluid"
                                                            alt={product._productName}
                                                        />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <h5>{product._productName}</h5>
                                                        <p>{formatMoney(product._price)}</p>
                                                        <p>{product._description}</p>
                                                        <p>{t('quality')} x{product._quantity}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Không có sản phẩm nào trong đơn hàng này.</p>
                                        )}
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h6>
                                                    <strong>{t('ship')}</strong> {formatMoney(15000)}
                                                </h6>
                                                <h6>
                                                    <strong>{t('voucher')}</strong> {promotion}
                                                </h6>
                                                <h6>
                                                    <strong>{t('total')}</strong>{" "}
                                                    {formatMoney(totalmodal || 0)}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setSelectedOrderId(null)}
                                        >
                                            {t('cancel')}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Review Modal */}
                <div
                    className={`modal fade ${selectedOrderForReview ? "show" : ""}`}
                    id="orderReviewModal"
                    tabIndex={-1}
                    aria-labelledby="orderReviewModalLabel"
                    aria-hidden={selectedOrderForReview ? "false" : "true"}
                    style={{ display: selectedOrderForReview ? "block" : "none" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleOrderReviewSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="orderReviewModalLabel">
                                        {t('fellback')}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={closeOrderReviewModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {reviewError && (
                                        <div className="alert alert-danger">{reviewError}</div>
                                    )}
                                    <div className="mb-3">
                                        <label className="form-label">{t('order_id')}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedOrderForReview?.orderId}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="reviewContent" className="form-label">
                                            {t('Your_Reviews')}
                                        </label>
                                        <textarea
                                            id="reviewContent"
                                            className="form-control"
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            rows={4}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeOrderReviewModal}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={reviewSubmitting}
                                    >
                                        {reviewSubmitting ? `${t('loading_seen')}` : `${t('Enter_seen')}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VoucherContent: React.FC = () => {
    const [promotionVouchers, setPromotionVouchers] = useState<PromotionVoucher[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const customerId = 1;

    useEffect(() => {
        const fetchPromotionVouchers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`https://wanrenbuffet.online/api/vouchers/voucherInfo/${customerId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPromotionVouchers(response.data);
            } catch (err) {
                setError('Failed to fetch promotion vouchers');
            } finally {
                setLoading(false);
            }
        };

        fetchPromotionVouchers();
    }, [customerId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div
            className="container"
            style={{ paddingTop: '80px' }}
        >
            {promotionVouchers.length === 0 ? (
                <div>No vouchers found.</div>
            ) : (
                <div className="voucher-container" style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="voucher-header" style={{ display: 'flex', padding: '10px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>
                        <div style={{ flex: 1 }} className="voucher-date"></div>
                        <div style={{ flex: 2 }}>Tên Voucher</div>
                        <div style={{ flex: 1 }}>Mã Voucher</div>
                        <div style={{ flex: 1 }} className="voucher-date">Ngày kết thúc</div>
                        <div style={{ flex: 1 }}>Trạng thái</div>
                    </div>
                    <div className="voucher-body" style={{ overflowY: 'auto' }}>
                        {promotionVouchers.map((voucher, index) => (
                            <div key={index} className="voucher-row" style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ddd', alignItems: 'center' }}>
                                <div className="voucher-image" style={{ flex: 1 }}>
                                    <img src={voucher.image} alt={voucher.promotionName} style={{ width: '100px', height: 'auto' }} />
                                </div>
                                <div style={{ flex: 2 }}>{voucher.promotionName}</div>
                                <div style={{ flex: 1 , fontWeight: 'bold'}}>{voucher.voucherCode}</div>
                                <div className="voucher-date" style={{ flex: 1 }}>{new Date(voucher.endDate).toLocaleDateString()}</div>
                                <div style={{ flex: 1, color: voucher.status ? 'red' : 'green', padding: '10px' }}>
                                    {voucher.status ? 'Đã dùng' : 'Chưa sử dụng'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            )}
        </div>
    );
};

const MenuProfile: React.FC = () => {
    const { t } = useTranslation();
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    let decoded: DecodedToken | null = null;

    try {
        if (token) {
            decoded = jwtDecode<DecodedToken>(token);
        } else {
            throw new Error('No token found');
        }
    } catch (error) {
        console.error('Invalid or missing token:', error);
        navigate("/")
    }

    const [userInfo, setUserInfo] = useState<UserInfo>({
        fullName: decoded?.fullName || "",
        email: decoded?.email || "",
        phoneNumber: decoded?.phone || "",
        password: "", // Initialize as empty for security
    });
    const [listOrder, setListOrder] = useState<OrderModel[]>([]);
    useEffect(() => {
        getPreparingOrders(Number(decoded?.userId))
            .then(Order => {
                console.log(Order);

                setListOrder(Order)

            })
            .catch(error => {
                console.log(error)
            })
    }, []);

    const togglePanel = (panelType: string) => {
        setActivePanel(panelType);
    };

    function logout() {
        localStorage.removeItem("token")
        window.location.href = "https://wanrenbuffet.netlify.app/"
    }

    return (
        <>
            {/* Main Content */}
            <div className="container-fluid">
                <div className="row" style={{ padding: "20px", paddingBottom: "0" }}>
                    {/* Left Panel */}
                    <div
                        id="leftPanel"
                        className={`position-relative ${activePanel ? "col-md-4" : "col-md-8"
                            } col-12 tinh-rounded tinh-height transition-all`}
                        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                    >
                        {!activePanel ? (
                            <div className="row tinh-height90 m-0 p-3 align-items-center">
                                <AccountPanel togglePanel={togglePanel} />
                                <OrderPanel togglePanel={togglePanel} />
                                <VoucherPanel togglePanel={togglePanel} />
                            </div>
                        ) : (
                            <div className="row tinh-height90 m-0 p-3 align-items-center">
                                <MenuList togglePanel={togglePanel} />
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div
                        id="rightPanel"
                        className={`${activePanel ? "col-md-8" : "col-md-4"} col-12 tinh-height transition-all`}
                        style={{ paddingLeft: activePanel ? "40px" : "0" }}
                    >
                        {!activePanel ? (
                            <div className="row tinh-height90 m-0 p-3 align-items-center">
                                <div
                                    className="row tinh-height30 m-0 p-2 px-3 d-flex align-items-center justify-content-center">
                                    <div className="">

                                    </div>
                                </div>
                                <div
                                    className="row m-0 p-0 d-flex align-items-center justify-content-center tinh-vintage-style">
                                    <h2>{userInfo.fullName}</h2>
                                    <p>{userInfo.phoneNumber}</p>
                                    <p>Email: {userInfo.email}</p>
                                    <button className="btn" style={{color: 'var(--text-color)'}} onClick={logout}>{t('logout')}</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activePanel === "account" && (
                                    <AccountContent userInfo={userInfo} setUserInfo={setUserInfo} />
                                )}
                                {activePanel === "orders" && <OrdersContent setListOrder={setListOrder} listOrder={listOrder} />}
                                {activePanel === "voucher" && <VoucherContent />}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuProfile;

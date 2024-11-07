

import React, {useContext, useEffect, useState} from "react";
import "./assets/css/styles.css";
import "./assets/css/Tinh_Style.css";
import "./assets/css/order_history.css";
import kichi from "./assets/img/Cream and Black Simple Illustration Catering Logo.png";
import { DecodedToken } from "./component/AuthContext";
import {jwtDecode} from "jwt-decode"; // Corrected import
import { useNavigate } from "react-router-dom";
import {getProductHot} from "../../api/apiCustommer/productApi";
import {getPreparingOrders} from "../../api/apiCustommer/OrderApi";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import formatMoney from "./component/FormatMoney";
import axios from "axios";
import {OrderModel} from "../../models/OrderModel";
import {CartContext, CartItem} from "./component/CartContext";

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
    _quantity:number;
    _productStatus:string;
    _total:number
}


interface UserInfoProps {
    userInfo: UserInfo;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

interface HistoryOrderProps{
    listOrder: OrderModel[];
    setListOrder:React.Dispatch<React.SetStateAction<OrderModel[]>>;
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
    <div className="row tinh-height90 m-0 p-3 align-items-center" id="leftContent2">
        <div className="row tinh-height30 m-0 p-2 px-3 d-flex align-items-center justify-content-center">
            <div className="row m-0 p-0 d-flex justify-content-center">
                <img src={kichi} className="rounded-circle w-50" alt="User Logo" />
            </div>
        </div>
        <div className="d-flex flex-column justify-content-between">
            <div className="tinh-btn-list-group">
                <a href="#" onClick={(e) => { e.preventDefault(); togglePanel("account"); }}>
                    <span>Tài khoản của bạn</span>
                </a>
            </div>
            <div className="tinh-btn-list-group my-2">
                <a href="#" onClick={(e) => { e.preventDefault(); togglePanel("orders"); }}>
                    <span>Đơn hàng của bạn</span>
                </a>
            </div>
            <div className="tinh-btn-list-group">
                <a href="#" onClick={(e) => { e.preventDefault(); togglePanel("voucher"); }}>
                    <span>Voucher</span>
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

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/customer/updateCustomer/${decoded.sub}`, {
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
            localStorage.setItem("token",updatedUser.jwtToken);
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
        <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
            <h4 className="py-3">Thông tin cá nhân</h4>
            {!editing ? (
                <div id="personalInfo">
                    <span className="tinh-fs12" id="nameDisplay">
                        {userInfo.fullName}
                    </span>
                    <br/>
                    <span className="tinh-fs12" id="phoneDisplay">
                        {userInfo.phoneNumber}
                    </span>
                    <br/>
                    <span className="tinh-fs12" id="phoneDisplay">
                        {userInfo.email}
                    </span>
                    <br/>
                    <hr/>
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14"
                        onClick={(e) => {
                            e.preventDefault();
                            setEditing(true);
                        }}
                    >
                        Sửa
                    </a>
                </div>
            ) : (
                <div id="editPersonalInfo">
                    <input
                        type="text"
                        id="nameInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={tempInfo.fullName} // use tempInfo instead of userInfo
                        onChange={(e) => setTempInfo({...tempInfo, fullName: e.target.value})}
                    />
                    <input
                        type="text"
                        id="phoneInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={tempInfo.phoneNumber} // use tempInfo instead of userInfo
                        onChange={(e) => setTempInfo({...tempInfo, phoneNumber: e.target.value})}
                    />
                    <input
                        type="email"
                        id="emailInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={userInfo.email}
                        onChange={(e) => setTempInfo({...tempInfo, email: e.target.value})}
                    />
                    <hr/>
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14 tinh-mr"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        Lưu
                    </a>
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14"
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                    >
                        Hủy
                    </a>
                </div>
            )}
        </div>
    );
};




const PasswordInfo: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => {
    const [editing, setEditing] = useState(false);
    const [tempPassword, setTempPassword] = useState<string>("");
    const token = localStorage.getItem('token'); // Retrieve token for authorization

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/password', { // Updated endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password: tempPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            // Assuming the API returns a success message or updated user info
            setUserInfo({ ...userInfo, password: tempPassword });
            setEditing(false);
        } catch (error) {
            console.error('Error updating password:', error);
            // Optionally, set an error state to display to the user
        }
    };

    const handleCancel = () => {
        setTempPassword("");
        setEditing(false);
    };

    return (
        <div className="card p-3 rounded-0 mb-3">
            <h4 className="py-3">Mật Khẩu</h4>
            {!editing ? (
                <div id="passwordInfo">
                    <span className="tinh-fs12" id="passwordDisplay">
                        *********
                    </span>
                    <br />
                    <hr />
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14"
                        onClick={(e) => {
                            e.preventDefault();
                            setEditing(true);
                        }}
                    >
                        Sửa
                    </a>
                </div>
            ) : (
                <div id="editPasswordInfo">
                    <input
                        type="password"
                        id="passwordInput"
                        className="form-control tinh-fs14 tinh-no-outline my-2"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
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
                        Lưu
                    </a>
                    <a
                        href="#"
                        className="text-black none-underline tinh-fs14"
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                    >
                        Hủy
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

const OrdersContent: React.FC<HistoryOrderProps> = ({ listOrder , setListOrder }) => {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderDetails, setOrderDetails] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalmodal,setTotalmodal] = useState<number | null>();
    const cartContext = useContext(CartContext);

    useEffect(() => {
        if (selectedOrderId) {
            setLoading(true);
            setError(null);
            axios
                .get<any[]>(`http://localhost:8080/api/orders/GetOrderDetailByOrderId/${selectedOrderId}`)
                .then(response => {
                    setOrderDetails(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching order details:", err);
                    setError("Failed to load order details.");
                    setLoading(false);
                });
        }
    }, [selectedOrderId]);

    useEffect(() => {
        // Calculate total whenever orderDetails changes
        if (selectedOrderId != null) {
            const total = orderDetails.reduce((sum, product) => sum + (product._price * product._quantity), 0);
            setTotalmodal(total + 15000);
        }
    }, [orderDetails, selectedOrderId]);

    if (!cartContext) {
        return <div>Đang tải giỏ hàng...</div>;
    }

    const { addToCart ,subtotal } = cartContext;

    const handleBuyAgain = (products: ProductDetail[]) => {
        products.forEach((product) => {
            const cartItem: CartItem = {
                productId: product._productId,
                productName: product._productName,
                price: product._price,
                image: product._image,
                quantity: product._quantity,
            };

            addToCart(cartItem)
        });
    };





    const handleViewMore = (orderId: number) => {
        setSelectedOrderId(orderId);
    };

    return (
        <div
            className="row tinh-height90 m-0 align-items-center tinh-overflowScroll order_history"
            style={{ padding: "100px 40px 0 40px" }}
        >
            <div className="container mt-5">
                {listOrder.map((order) => (
                    <div className="card mb-3" key={order.orderId}>
                        <div className="card-header order-header">
                            <span>Mã Đơn Hàng: {order.orderId}</span>
                            <span className="float-end order-total">{formatMoney(order.totalAmount)}</span>
                        </div>
                        <div className="card-body">
                            <p className="order-info">

                            </p>

                            <p className="order-info">Địa Chỉ Giao Hàng: {order.address}</p>
                            <div className="row g-0">

                                    <div className="col-md-2">
                                        <img
                                            src={order.producHistorytDTOList[0]._image} // Replace with a dynamic source if available
                                            className="img-fluid rounded-start"
                                            alt="Product"
                                        />
                                        <div className="col-md-10">
                                            <div className="product-info">

                                                <h5>{order.producHistorytDTOList[0]._productName}</h5>
                                                <p>
                                                    {order.producHistorytDTOList[0]._description}
                                                </p>
                                                <p>
                                                    x {order.producHistorytDTOList[0]._quantity}
                                                </p>
                                                <button
                                                    onClick={() => handleBuyAgain(order.producHistorytDTOList)}
                                                    className="btn btn-outline-secondary btn-buy-again"
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasCart"
                                                    aria-controls="offcanvasCart"
                                                >
                                                    Mua Lại
                                                </button>
                                            </div>
                                        </div>
                                    </div>


                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-view-order"
                                data-bs-toggle="modal"
                                data-bs-target="#orderModal"

                                onClick={() => handleViewMore(order.orderId)}
                            >
                                <i className="fas fa-info-circle"></i> Chi Tiết Sản Phẩm Đã Mua
                            </button>

                        </div>
                    </div>
                ))}

                {/* Modal for viewing more products */}
                <div className="modal fade" id="orderModal" tabIndex={-1} aria-labelledby="orderModalLabel" aria-hidden="true">
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
                                        <h5 className="modal-title" id="orderModalLabel">Mã Đơn Hàng #{selectedOrderId} - Chi Tiết sản phẩm</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {orderDetails.length > 0 ? (
                                            orderDetails.map((product, index) => (
                                                <div className="row mb-3" key={product._productId}>
                                                    <div className="col-md-4">
                                                        <img src={product._image || "images/default_product.jpg"}
                                                             className="img-fluid" alt={product._productName}/>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <h5>{product._productName}</h5>
                                                        <p>{formatMoney(product._price)}</p>
                                                        <p>{product._description}</p>
                                                        <p>x{product._quantity}</p>
                                                    </div>

                                                </div>
                                            ))
                                        ) : (
                                            <p>No products found for this order.</p>
                                        )}
                                        {/* Assuming Shipping, Voucher, and Final Total are part of the order details or can be fetched separately */}
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h6><strong>Phí Giao Hàng:</strong> {formatMoney(15000)}</h6>
                                                <h6><strong>Voucher:</strong> -{formatMoney(20)}</h6>
                                                <h6><strong>Tổng Tiền:</strong> {formatMoney(totalmodal || 0)}</h6>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                data-bs-dismiss="modal">Close
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VoucherContent: React.FC = () => (
    <div
        className="row tinh-height90 m-0 p-3 px-5 align-items-center tinh-overflowScroll"
        style={{padding: "100px 40px 0 40px"}}
    >
        {/* Include your voucher components here */}
        <span>Voucher content goes here.</span>
    </div>
);

const MenuProfile: React.FC = () => {
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
        navigate('/login');
    }

    const [userInfo, setUserInfo] = useState<UserInfo>({
        fullName: decoded?.fullName || "",
        email: decoded?.email || "",
        phoneNumber: decoded?.phone || "",
        password: "", // Initialize as empty for security
    });

    const [listOrder,setListOrder] = useState<OrderModel[]>([]);
    useEffect(() => {
        getPreparingOrders(49)
            .then(Order =>{
                setListOrder(Order)
                console.log(Order)
            })
            .catch(error =>{
                console.log(error)
            })
    }, []);

    const togglePanel = (panelType: string) => {
        setActivePanel(panelType);
    };

    return (
        <>
            {/* Main Content */}
            <div className="container-fluid">
                <div className="row" style={{padding: "20px", paddingBottom: "0"}}>
                    {/* Left Panel */}
                    <div
                        id="leftPanel"
                        className={`position-relative ${
                            activePanel ? "col-md-4" : "col-md-8"
                        } col-12 tinh-rounded tinh-height transition-all`}
                        style={{boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}
                    >
                        {!activePanel ? (
                            <div className="row tinh-height90 m-0 p-3 align-items-center">
                                <AccountPanel togglePanel={togglePanel}/>
                                <OrderPanel togglePanel={togglePanel}/>
                                <VoucherPanel togglePanel={togglePanel}/>
                            </div>
                        ) : (
                            <div className="row tinh-height90 m-0 p-3 align-items-center">
                                <MenuList togglePanel={togglePanel}/>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div
                        id="rightPanel"
                        className={`${activePanel ? "col-md-8" : "col-md-4"} col-12 tinh-height transition-all`}
                        style={{paddingLeft: activePanel ? "40px" : "0"}}
                    >
                        {!activePanel ? (
                            <div className="row tinh-height90 m-0 p-3 align-items-center">
                                <div
                                    className="row tinh-height30 m-0 p-2 px-3 d-flex align-items-center justify-content-center">
                                    <div className="row m-0 p-0 tinh-height50 tinh-width50">
                                        <img
                                            src={kichi}
                                            alt="User Logo"
                                            className="img-fluid rounded-circle"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="row m-0 p-0 d-flex align-items-center justify-content-center tinh-vintage-style">
                                    <h2>{userInfo.fullName}</h2>
                                    <p>{userInfo.phoneNumber}</p>
                                    <p>Email: {userInfo.email}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activePanel === "account" && (
                                    <AccountContent userInfo={userInfo} setUserInfo={setUserInfo}/>
                                )}
                                {activePanel === "orders" && <OrdersContent setListOrder={setListOrder} listOrder={listOrder} />}
                                {activePanel === "voucher" && <VoucherContent/>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuProfile;

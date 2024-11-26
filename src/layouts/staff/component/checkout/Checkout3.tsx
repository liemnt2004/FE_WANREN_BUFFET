import React, { useContext, useEffect, useState } from "react";
import '../../assets/css/checkout_for_staff.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOrderDetailWithNameProduct, getOrderAmount, updateTotalAmount, updateTableStatus } from "../../../../api/apiStaff/orderForStaffApi";
import OrderDetailsWithNameProduct from "../../../../models/StaffModels/OrderDetailsWithNameProduct";
import { request } from "../../../../api/Request";
import { AuthContext } from "../../../customer/component/AuthContext";

const Checkout3: React.FC = () => {
    const location = useLocation();
    const { tableId, orderId } = location.state || {};
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const [lastAmount, setLastAmount] = useState<number>(0);
    const [choicePayment, setChoicePayment] = useState<string | undefined>(undefined);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsWithNameProduct[]>([]);
    const { employeeUserId } = useContext(AuthContext);
    const [isQrPopupVisible, setQrPopupVisible] = useState(false);
    const [qrCode, setQrCode] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const navigate = useNavigate();
    const styleOfA: React.CSSProperties = {
        cursor: "pointer",
        color: "white"
    }

    useEffect(() => {
        const loadOrderDetails = async () => {
            try {
                const fetchedOrderDetails = await getOrderDetailWithNameProduct(Number(orderId));
                const validOrderDetails = fetchedOrderDetails.filter((item: any) => item.quantity > 0 && item.price > 0);
                setOrderDetails(validOrderDetails);
                await updateTableStatus(Number(tableId), "LOCKED_TABLE");
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orderDetails';
                setError(errorMessage);
            }
        };

        const getAmount = async () => {
            try {
                const amountOfRs = await getOrderAmount(Number(orderId));
                setAmount(amountOfRs);
                setVat((amountOfRs * 0.08));
                setLastAmount(amountOfRs + (amountOfRs * 0.08));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to get amount';
                setError(errorMessage);
            }
        }

        getAmount();
        loadOrderDetails();
    }, []);

    const choiceClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const divId = event.currentTarget.dataset.id;
        setChoicePayment(divId);
    }

    const updateAmount = async (order_id: number, total_amount: number) => {
        try {
            const amountOfRs = await updateTotalAmount(order_id, total_amount);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update amount';
            console.log(errorMessage);
        }
    }

    const createPayment = async () => {
        try {
            const newOrderResponse = await fetch('http://localhost:8080/api/payment/create_payment/normal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amountPaid: lastAmount,
                    paymentMethod: "CASH",
                    paymentStatus: false,
                    orderId: orderId,
                    userId: employeeUserId
                })
            });
        } catch (error) {
            console.log(error, "Cannot creat payment");
        }
    }

    const generateQrCode = (bank: { bank_ID: string; account_NO: string; }, amount: number): string => {
        return `https://img.vietqr.io/image/${bank.bank_ID}-${bank.account_NO}-compact.png?amount=${amount}&addInfo=${(description)}`;
    };

    useEffect(() => {
        const myBank = {
            bank_ID: 'MB',
            account_NO: '280520049999'
        };
        setDescription(orderId + " Thanh toan tai Wanren Buffet");
        const QR = generateQrCode(myBank, lastAmount);
        setQrCode(QR);
    }, [generateQrCode, lastAmount, orderId]);


    const closeQrPopup = () => {
        setQrPopupVisible(false);
    };

    const checkoutClick = async () => {
        try {
            if (choicePayment === "1") {
                const paymentResponse = await request(`http://localhost:8080/api/payment/create_payment?price=${lastAmount}`);
                if (!paymentResponse || !paymentResponse.url) {
                    throw new Error("Tạo thanh toán VN PAY thất bại.");
                }
                // Chuyển hướng người dùng tới URL thanh toán VN PAY
                window.location.href = paymentResponse.url;
            } else if (choicePayment === "2") {
                setQrPopupVisible(true);
            } else if (choicePayment === "3") {
                updateAmount(Number(orderId), lastAmount);
                createPayment();
                alert("Thanh toán thành công!");
            }
        } catch (error) {
            console.error("Cannot checkout");
        }
    };
    async function checkPaid(price: number, description: string) {
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
                        updateTableStatus(Number(tableId), "EMPTY_TABLE")
                        
                        setIsSucess(true);
                    } else {
                        console.log("Chưa thành công")
                    }
                } else {
                    console.log("No data or data is not an array.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    }

    useEffect(() => {
        if (choicePayment?.includes("2")) {
            checkPaid(lastAmount, String(description));
        } 
    }, []);



    return (
        <div className="ps36231-checkout-staff-1">
            <div className="call-staff">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="turn-back">
                        <button onClick={() => navigate(-1)}>Quay lại</button>
                    </div>
                    <div className="call-staff-inner">
                        <i className="bi bi-bell-fill"></i>
                        Gọi nhân viên
                    </div>
                    <div className="turn-dashboard">
                        <button onClick={() => navigate("/staff")}>
                            <i className="bi bi-arrow-counterclockwise"></i> Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <h2 className="title-table title-red">Đây là thông tin đơn hàng, bạn chỉ trả tiền khi nhận được PHIẾU THANH TOÁN</h2>
                </div>
                <div className="container-table">
                    <div>
                        <table className="all-sp">
                            {orderDetails.map((orderDetail, index) => (
                                <tr key={index}>
                                    <td>{orderDetail.quantity + " x " + orderDetail.productName}</td>
                                    <td>{orderDetail.price?.toLocaleString() + " đ"}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>Tổng tiền hàng</td>
                                <td>{amount.toLocaleString() + " đ"}</td>
                            </tr>
                            <tr>
                                <td>VAT</td>
                                <td>{vat.toLocaleString() + " đ"}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="container-price-all-sp">
                    <div>
                        <table className="price-all-sp">
                            <thead>
                                <th>Tổng tiền cần thanh toán</th>
                                <th>{lastAmount.toLocaleString() + " VNĐ"}</th>
                            </thead>
                        </table>
                    </div>
                </div>
                <div className="container-method-checkout">
                    <div>
                        <div className="title-all-method-payment">
                            <div><i className="bi bi-wallet-fill text-white"></i></div>
                            <h3>Tất cả các hình thức thanh toán</h3>
                        </div>
                        <div className="all-div-method-payment">
                            <div data-id="1" onClick={choiceClick} className={choicePayment === '1' ? 'selected' : ''}>
                                <div className="control-img">
                                    <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="" />
                                </div>
                            </div>
                            <div data-id="2" onClick={choiceClick} className={choicePayment === '2' ? 'selected' : ''}>
                                <div className="control-img">
                                    <img src="https://downloadlogomienphi.com/sites/default/files/logos/download-logo-vector-vietqr-mien-phi.jpg" alt="" />
                                </div>
                            </div>
                            <div data-id="3" onClick={choiceClick} className={choicePayment === '3' ? 'selected' : ''}>
                                <div className="control-img">
                                    <img src="https://static.vecteezy.com/system/resources/previews/004/309/804/non_2x/stack-bills-money-cash-isolated-icon-free-vector.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-button">
                    <a style={styleOfA} onClick={checkoutClick}>Thanh toán</a>
                </div>
            </div>
            <div className="step-checkout">
                <div>
                    <button style={{ backgroundColor: '#bd4242' }}>1</button>
                    <button style={{ backgroundColor: '#bd4242' }}>2</button>
                    <button style={{ backgroundColor: '#bd4242' }}>3</button>
                </div>
            </div>
            {isQrPopupVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            position: "relative", // Để định vị dấu "X" bên trong popup
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            textAlign: "center",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <button
                            onClick={closeQrPopup}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "transparent",
                                border: "none",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                            aria-label="Close"
                        >
                            ✖
                        </button>

                        <div className="qr-code-img d-flex justify-content-center">
                            <img
                                src={qrCode}
                                alt="QR Code"
                                width={350}
                            />
                        </div>

                        <button className="btn btn-danger mt-3" onClick={() => checkPaid(lastAmount, String(description))}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout3;
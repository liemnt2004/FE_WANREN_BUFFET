import React, { useContext, useEffect, useState } from "react";
import '../../assets/css/checkout_for_staff.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOrderDetailWithNameProduct, getOrderAmount, updateTotalAmount, updateTableStatus, payWithVNPay, getPromotionByOrderId, getLoyaltyPoints, updateLoyaltyPoints, updateDiscountPoints, getDiscountPoints, updateOrderStatus } from "../../../../api/apiStaff/orderForStaffApi";
import OrderDetailsWithNameProduct from "../../../../models/StaffModels/OrderDetailsWithNameProduct";
import { notification } from 'antd';
import { InfoCircleOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../customer/component/AuthContext";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'

interface PromotionInfo {
    promotionName: string;
    promotionValue: number;
}

const Checkout3: React.FC = () => {
    const location = useLocation();
    const { tableId, orderId, phoneNumber } = location.state || {};
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const [lastAmount, setLastAmount] = useState<number>(0);
    const [choicePayment, setChoicePayment] = useState<string | undefined>(undefined);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsWithNameProduct[]>([]);
    const { employeeUserId, employeeFullName } = useContext(AuthContext);
    const [isQrPopupVisible, setQrPopupVisible] = useState(false);
    const [qrCode, setQrCode] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [isSucess, setIsSucess] = useState<boolean>(false);
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const styleOfA: React.CSSProperties = {
        cursor: "pointer",
        color: "white"
    }
    const [promotion, setPromotion] = useState<PromotionInfo | null>(null);
    const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
    const [inputValue, setInputValue] = useState<number>();
    const [maxPointsUsable, setMaxPointsUsable] = useState(0);
    const [pointsUsableDB, setPointsUsableDB] = useState(0);

    const openNotification = (message: string, description: string, icon: React.ReactNode, pauseOnHover: boolean = true) => {
        api.open({
            message,
            description,
            showProgress: true,
            pauseOnHover,
            placement: 'topRight',
            duration: 3,
            icon,
        });
    };

    useEffect(() => {
        const loadOrderDetails = async () => {
            try {
                const fetchedOrderDetails = await getOrderDetailWithNameProduct(Number(orderId));
                const validOrderDetails = fetchedOrderDetails.filter((item: any) => item.quantity > 0 && item.price > 0);
                setOrderDetails(validOrderDetails);
                await updateTableStatus(Number(tableId), "LOCKED_TABLE");
                updateOrderStatus(orderId, "WAITING");
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orderDetails';
                setError(errorMessage);
            }
        };

        const fetchPromotion = async () => {
            try {
                const data = await getPromotionByOrderId(orderId);
                setPromotion(data);
            } catch (err) {
            }
        };

        const getDiscount = async () => {
            try {
                const result = await getDiscountPoints(orderId);
                setPointsUsableDB(Number(result));
            } catch (err) {
            }
        }

        getDiscount();
        fetchPromotion();
        loadOrderDetails();
        if (phoneNumber !== null && phoneNumber !== undefined ) {
            fetchLoyaltyPoints(phoneNumber);
        }
    }, []);

    console.log(pointsUsableDB)

    const fetchLoyaltyPoints = async (phoneNumber: string) => {
        try {
            const data = await getLoyaltyPoints(phoneNumber);
            const loyaltyPoints = data.loyaltyPoints;
            setLoyaltyPoints(loyaltyPoints);
        } catch (error) {
            console.error("Failed to fetch loyalty points:", error);
            return null;
        }
    };
    
    useEffect(() => {
        const calculateAmounts = async () => {
            try {
                const totalAmount = orderDetails.reduce((sum, item) => {
                    if (item.quantity && item.price) {
                        return sum + item.quantity * item.price;
                    }
                    return sum;
                }, 0);
    
                const maxDiscount = Math.floor(totalAmount * 0.5);
    
                const discountFromPromotion = promotion ? promotion.promotionValue : 0;
                const appliedPromotionDiscount = Math.min(discountFromPromotion, maxDiscount);
    
                const remainingDiscountCap = maxDiscount - appliedPromotionDiscount;

                const discountFromLoyaltyPoints = Math.min(
                    pointsUsableDB > 0 ? pointsUsableDB : inputValue || 0,
                    loyaltyPoints,
                    remainingDiscountCap
                );
    
                setMaxPointsUsable(Math.min(loyaltyPoints, remainingDiscountCap));
    
                const totalDiscount = appliedPromotionDiscount + discountFromLoyaltyPoints;
                const discountedAmount = Math.max(totalAmount - totalDiscount, 0);
    
                const vatAmount = Math.floor(discountedAmount * 0.08);
                const finalAmount = Math.floor(discountedAmount + vatAmount);
    
                // Nếu pointsUsableDB có giá trị, trừ trực tiếp vào finalAmount
                const adjustedAmount = pointsUsableDB > 0 ? finalAmount - pointsUsableDB : finalAmount;
    
                setAmount(discountedAmount);
                setVat(vatAmount);
                setLastAmount(adjustedAmount); // Cập nhật lastAmount với giá trị đã trừ
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to calculate amounts';
                setError(errorMessage);
            }
        };
    
        calculateAmounts();
    }, [orderDetails, promotion, inputValue, loyaltyPoints, pointsUsableDB]);
    
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValue = Number(e.target.value);

        if (newInputValue > maxPointsUsable) {
            openNotification(
                'Điểm cần dùng!',
                'Lưu ý! Số điểm dùng không vượt quá 50% tổng bill (Bao gồm các voucher giảm giá khác)!',
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
            );
        } else {
        }

        setInputValue(newInputValue);
    };

    const checkAndPrintInvoice = (
        details: any[] = orderDetails,
        totalAmount: number = amount,
        vatAmount: number = vat,
        finalAmount: number = lastAmount
    ) => {
        if (details.length > 0 && totalAmount > 0 && vatAmount > 0 && finalAmount > 0) {
            console.log("Tiến hành in hóa đơn!");
            exportStyledInvoice();
        }
    };

    const handlePrintInvoice = () => {
        checkAndPrintInvoice(orderDetails, amount, vat, lastAmount);
    };

    const exportStyledInvoice = () => {
        const doc = new jsPDF();

        doc.setFont('Roboto', 'normal');

        const currentDate = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 200, 30, { align: 'right' });

        doc.setFontSize(20);
        doc.text("HÓA ĐƠN THANH TOÁN", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text("NO. 000" + `${orderId}`, 200, 20, { align: "right" });

        doc.setFontSize(12);
        doc.text("Hóa đơn:", 20, 40);
        doc.text(`Bàn số: ${tableId}`, 20, 45);
        doc.text(`Số hóa đơn: ${orderId}`, 20, 50);
        doc.text("Nhà hàng:", 140, 40);
        doc.text("Wanren Buffet", 140, 45);

        doc.text(`Nhân viên thanh toán: ${employeeFullName}`, 140, 50);

        const columns = ["Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"];
        const tableRows = orderDetails.map((item: any) => [
            item.productName,
            item.quantity,
            `${item.price} VND`,
            `${item.quantity * item.price} VND`,
        ]);

        autoTable(doc, {
            startY: 60,
            head: [columns],
            body: tableRows,
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 30 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
            },
            theme: "grid",
        });

        const lastY = (doc as any).lastAutoTable.finalY;

        let currentY = lastY + 10;

        doc.text(`Subtotal: ${amount} VND`, 20, currentY);
        doc.text(`VAT (8%): ${vat} VND`, 20, currentY + 10);
        doc.text(`Total: ${lastAmount} VND`, 20, currentY + 20);

        currentY += 40;
        doc.setFontSize(12);
        doc.text("Note: Thank you for choosing us!", 20, currentY + 10);

        doc.save(`invoice_order_${orderId}.pdf`);
    };





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

    const createPayment = async (paymentMethod: string, status: boolean) => {
        try {
            const employeeToken = localStorage.getItem("employeeToken");
            const newOrderResponse = await fetch('https://wanrenbuffet.online/api/payment/create_payment/normal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${employeeToken}`
                },
                body: JSON.stringify({
                    amountPaid: lastAmount,
                    paymentMethod: paymentMethod,
                    paymentStatus: status,
                    orderId: orderId,
                    userId: Number(employeeUserId)
                })
            });
        } catch (error) {
            console.log(error, "Cannot creat payment");
        }
    }

    useEffect(() => {
        const generateQrCode = (bank: { bank_ID: string; account_NO: string; }, amount: number): string => {
            return `https://img.vietqr.io/image/${bank.bank_ID}-${bank.account_NO}-compact.png?amount=${amount}&addInfo=${(description)}`;
        };
        const myBank = {
            bank_ID: 'MB',
            account_NO: '280520049999'
        };
        setDescription(orderId + " Thanh toan tai Wanren Buffet");
        const QR = generateQrCode(myBank, lastAmount);
        setQrCode(QR);
    }, [description, lastAmount, orderId]);


    const closeQrPopup = () => {
        setQrPopupVisible(false);
    };

    console.log("Phone: ", phoneNumber)
    console.log("point: ", inputValue)

    const checkoutClick = async () => {
        try {
            if (choicePayment === "1") {
                payWithVNPay(lastAmount, Number(employeeUserId), orderId, phoneNumber, Number(inputValue));
            } else if (choicePayment === "2") {
                setQrPopupVisible(true);
            } else if (choicePayment === "3") {
                updateAmount(Number(orderId), lastAmount);
                createPayment("CASH", false);
                if (Number(inputValue) > 0) {
                    try {
                        const result = await updateDiscountPoints(orderId, Number(inputValue)); // Gọi API
                        console.log(result); // Hiển thị thông báo thành công
                    } catch (err) {
                    }
                }
                navigate("/staff/checkout/sucessful", { state: { paymentMethod: "CASH", orderId: orderId, lastAmount: lastAmount, employeeUserId: employeeUserId } })
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
                        updateOrderStatus(Number(orderId), "DELIVERED")
                        createPayment("QR_CODE", true);
                        if (phoneNumber !== null && phoneNumber.length >= 10) {
                            updateLoyaltyPoints(phoneNumber, pointsUsableDB > 0 ? pointsUsableDB : Number(inputValue));
                        }
                        navigate("/staff/checkout/sucessful")
                        setIsSucess(true);
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

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!isUpdating) {
                setIsUpdating(true);
                await checkPaid(lastAmount, String(description));
                setIsUpdating(false);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isUpdating, lastAmount, description]);

    const handleManualCheck = async () => {
        if (isUpdating) {
            openNotification(
                'Xác nhận thanh toán',
                'Đang cập nhật!',
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
            );
            return;
        }
        setIsUpdating(true);
        await checkPaid(lastAmount, String(description));
        setIsUpdating(false);
    };


    return (
        <>
            {contextHolder}
            <div className="ps36231-checkout-staff-1">
                <div className="call-staff">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="turn-back">
                            <button onClick={() => navigate(-1)}>Quay lại</button>
                        </div>
                        {/* <div className="call-staff-inner">
                            <i className="bi bi-bell-fill"></i>
                            Gọi nhân viên
                        </div> */}
                        <div className="turn-dashboard">
                            <button onClick={handlePrintInvoice}><i className="bi bi-printer-fill text-danger fs-4"></i></button>
                            <button className="mx-3" onClick={() => navigate(0)}><i className="bi bi-arrow-counterclockwise fw-bold text-danger fs-4"></i></button>
                            <button onClick={() => navigate("/staff")}>
                                Về trang chủ
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
                                    <td colSpan={2} style={{ height: '20px' }}></td>
                                </tr>
                                {promotion != null && (
                                    <tr>
                                        <td>{promotion?.promotionName}</td>
                                        <td>{"- " + Math.floor(Number(promotion?.promotionValue)).toLocaleString() + " đ"}</td>
                                    </tr>)
                                }
                                {phoneNumber != null && phoneNumber.length >= 10 && (
                                    <tr>
                                        <td>Số điểm hiện có: {loyaltyPoints.toLocaleString() + " điểm"}</td>
                                        <td>
                                            <input
                                                style={{ borderBottom: '1px solid gray' }}
                                                className="w-50 m-0 p-0 fs-5"
                                                type="number"
                                                id="loyaltyPointsInput"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                placeholder="Nhập số điểm"
                                            />
                                        </td>
                                    </tr>
                                )}

                                {phoneNumber != null && phoneNumber.length >= 10 && (
                                    <tr>
                                        <td>Số điểm có thể dùng: {maxPointsUsable.toLocaleString() + " điểm"}</td>
                                        <td></td>
                                    </tr>
                                )}
                                <tr>
                                    <td>Tổng tiền hàng</td>
                                    <td>{Math.floor(amount).toLocaleString() + " đ"}</td>
                                </tr>
                                {pointsUsableDB != null && pointsUsableDB > 0 && (
                                    <tr>
                                        <td>Số điểm đã dùng:</td>
                                        <td>{"-" + pointsUsableDB.toLocaleString() + " đ"}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td>VAT</td>
                                    <td>{Math.floor(vat).toLocaleString() + " đ"}</td>
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

                            <button className="btn btn-danger mt-3" onClick={handleManualCheck}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>

    );
};

export default Checkout3;
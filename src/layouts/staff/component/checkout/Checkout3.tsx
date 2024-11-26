import React, { useContext, useEffect, useState } from "react";
import '../../assets/css/checkout_for_staff.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOrderDetailWithNameProduct, getOrderAmount, updateTotalAmount, updateTableStatus, payWithVNPay } from "../../../../api/apiStaff/orderForStaffApi";
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
    const {employeeUserId} = useContext(AuthContext);
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

    const checkoutClick = async () => {
        try {
            if (choicePayment === "1") {
                payWithVNPay(lastAmount, Number(employeeUserId), orderId);
            } else if (choicePayment === "2") {
                // const payment = new PaymentForStaffModel(
                //     lastAmount, //amountPaid
                //     "CASH", //paymentMethod
                //     false, //paymentStatus
                //     orderId, //orderId
                //     4 //userId
                // );

                updateAmount(Number(orderId), lastAmount);

                createPayment();

                alert("Thanh toán thành công!");
            }
        } catch (error) {
            console.error("Cannot checkout");
        }
    };

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
        </div>
    );
};

export default Checkout3;
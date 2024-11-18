import React, { useEffect, useState } from "react";
import '../../assets/css/checkout_for_staff.css'
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetailWithNameProduct, getOrderAmount, updateTotalAmount } from "../../../../api/apiStaff/orderForStaffApi";
import OrderDetailsWithNameProduct from "../../../../models/StaffModels/OrderDetailsWithNameProduct";

const Checkout3: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const [lastAmount, setLastAmount] = useState<number>(0);
    const [choicePayment, setChoicePayment] = useState<string | undefined>(undefined);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsWithNameProduct[]>([]);
    const navigate = useNavigate();
    const styleOfA: React.CSSProperties = {
        cursor: "pointer",
        color: "black"
    }

    useEffect(() => {
        const loadOrderDetails = async () => {
            try {
                const fetchedOrderDetails = await getOrderDetailWithNameProduct(Number(orderId));
                setOrderDetails(fetchedOrderDetails);
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
                    userId: 4
                })
            });
        } catch (error) {
            console.log(error, "Cannot creat payment");
        }
    }

    const checkoutClick = async () => {
        try {
            if (choicePayment === "3") {
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
                                    <td>{orderDetail.price + " đ"}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>Tổng tiền hàng</td>
                                <td>{amount + " đ"}</td>
                            </tr>
                            <tr>
                                <td>VAT</td>
                                <td>{vat + " đ"}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="container-price-all-sp">
                    <div>
                        <table className="price-all-sp">
                            <thead>
                                <th>Tổng tiền cần thanh toán</th>
                                <th>{lastAmount + " đ"}</th>
                            </thead>
                        </table>
                    </div>
                </div>
                <div className="container-method-checkout">
                    <div>
                        <div className="title-all-method-payment">
                            <div><i className="bi bi-wallet-fill"></i></div>
                            <h3>Tất cả các hình thức thanh toán</h3>
                        </div>
                        <div className="all-div-method-payment">
                            <div data-id="1" onClick={choiceClick} className={choicePayment === '1' ? 'selected' : ''}>
                                <div className="control-img">
                                    <img src="https://developers.momo.vn/v3/assets/images/icon-52bd5808cecdb1970e1aeec3c31a3ee1.png" alt="" />
                                </div>
                            </div>
                            <div data-id="2" onClick={choiceClick} className={choicePayment === '2' ? 'selected' : ''}>
                                <div className="control-img">
                                    <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="" />
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
                    <button onClick={() => navigate(`/checkout/order/${orderId}/step1`)}>1</button>
                    <button onClick={() => navigate(`/checkout/order/${orderId}/step2`)}>2</button>
                    <button onClick={() => navigate(`/checkout/order/${orderId}/step3`)}>3</button>
                </div>
            </div>
        </div>
    );
};

export default Checkout3;
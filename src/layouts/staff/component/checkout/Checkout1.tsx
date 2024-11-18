import React, { useEffect, useState } from "react";
import "../../assets/css/checkout_for_staff.css";
import { useParams, useNavigate } from "react-router-dom";
import OrderDetailsWithNameProduct from "../../../../models/StaffModels/OrderDetailsWithNameProduct";
import { getOrderDetailWithNameProduct, getTableNumberByOrderId } from "../../../../api/apiStaff/orderForStaffApi";

const Checkout1: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [error, setError] = useState<string | null>(null);
    const [orderTableNum, setOrderTableNum] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsWithNameProduct[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrderDetails = async () => {
            try {
                const fetchedOrderDetails = await getOrderDetailWithNameProduct(Number(orderId));
                setOrderDetails(fetchedOrderDetails);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch orderDetails";
                setError(errorMessage);
            }
        };

        const loadTableNum = async () => {
            try {
                const fetchedTableNum = await getTableNumberByOrderId(Number(orderId));
                setOrderTableNum(fetchedTableNum);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch tablenumber";
                setError(errorMessage);
            }
        };

        loadTableNum();
        loadOrderDetails();
    }, [orderId]);

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
                    <h2 className="title-table">Bàn số {orderTableNum} | Xác nhận kiểm đồ</h2>
                </div>
                <div className="container-table">
                    <div>
                        <table className="all-sp">
                            <thead>
                                <tr>
                                    <th>Tên món</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.map((orderDetail, index) => (
                                    <tr key={index}>
                                        <td>{orderDetail.productName}</td>
                                        <td>{orderDetail.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="container-method-checkout"></div>
                <div className="container-button">
                    <button onClick={() => navigate(`/checkout/order/${orderId}/step2`)}>Tiếp tục</button>
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

export default Checkout1;

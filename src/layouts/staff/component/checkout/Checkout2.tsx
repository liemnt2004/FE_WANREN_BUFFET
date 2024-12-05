import React, { useEffect, useState } from "react";
import '../../assets/css/checkout_for_staff.css'
import { useLocation, useNavigate } from "react-router-dom";
import { checkCustomer, getOrderAmount, updateCustomerInOrder, updateLoyaltyPoint } from "../../../../api/apiStaff/orderForStaffApi";
import { notification } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

const Checkout2: React.FC = () => {
    const location = useLocation();
    const { tableId, orderId } = location.state || {};
    const [amount, setAmount] = useState<number>(0);
    const [disable, setDisable] = useState<boolean>(false);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const styleOfA: React.CSSProperties = {
        marginRight: '10px',
        pointerEvents: disable ? "none" : "auto",
        backgroundColor: disable ? "gray" : "orange",
        cursor: disable ? "not-allowed" : "pointer",
    }

    const [inputValue, setInputValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const getAmount = async () => {
            try {
                const amountOfRs = await getOrderAmount(Number(orderId));
                setAmount(amountOfRs);
            } catch (err) {
            }
        }

        const customerExists = async () => {
            const status = await checkCustomer(orderId);
            if (status === "Customer exists for the specified order.") {
                setDisable(true);
            }
        }

        customerExists();
        getAmount();
    }, []);


    const updatePoints = async (phoneNumber: string, amount: number) => {
        try {
            updateLoyaltyPoint(phoneNumber, amount);
            updateCustomerInOrder(orderId, phoneNumber);
            openNotification(
                'Tích điểm',
                'Tích điểm thành công!',
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
            );
            setDisable(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Không thể tích điểm!';
            openNotification(
                'Tích điểm',
                errorMessage,
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
            );
        }
    }

    const handleClick = () => {
        try {
            if (inputValue.length < 10) {
                openNotification(
                    'Tích điểm',
                    'Số điện thoại không đúng định dạng!',
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                );
            } else {
                updatePoints(inputValue, amount);
            }
            
        } catch (error) {
            console.error("Cannot update loyalty point");
        }
    };

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

    return (
        <>
        {contextHolder}
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
                        <h2 className="title-table">Nhập số điện thoại để nhận tích điểm</h2>
                    </div>
                    <div className="container-table">
                        <div>
                            <input value={inputValue} onChange={handleChange} type="tel" placeholder="Nhập số điện thoại" disabled={disable} />
                        </div>
                    </div>
                    <div className="container-method-checkout">

                    </div>
                    <div className="container-button">
                        <button style={styleOfA} onClick={handleClick} disabled={disable} >Áp dụng</button>
                        <button onClick={() => navigate(`/staff/checkout/step3`, { state: { tableId: tableId, orderId: orderId, phoneNumber: inputValue } })}>Tiếp tục</button>
                    </div>
                </div>
                <div className="step-checkout">
                    <div>
                        <button style={{ backgroundColor: '#bd4242' }}>1</button>
                        <button style={{ backgroundColor: '#bd4242' }}>2</button>
                        <button>3</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout2;
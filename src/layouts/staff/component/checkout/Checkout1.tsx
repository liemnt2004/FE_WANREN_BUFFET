import React, { useCallback, useEffect, useState } from "react";
import "../../assets/css/checkout_for_staff.css";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchOrderDetailsAPI, fetchOrderIdByTableId, fetchOrderStatusAPI, fetchProductDetailsAPI, getTableNumberByOrderId, updateOrderAmount, updateQuantityOrderDetails, updateTableStatus } from "../../../../api/apiStaff/orderForStaffApi";
import ProductModel from "../../../../models/StaffModels/ProductModel";
import { notification } from 'antd';
import { InfoCircleOutlined } from "@ant-design/icons";

const Checkout1: React.FC = () => {
    const location = useLocation();
    const { tableId, orderId } = location.state || {};
    const [error, setError] = useState<string | null>(null);
    const [orderTableNum, setOrderTableNum] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState<{ orderDetailId: number, product: ProductModel; quantity: number; note: string }[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);  // Trạng thái chỉnh sửa
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (pauseOnHover: boolean) => () => {
        api.open({
            message: 'Cập nhật hóa đơn',
            description: (
                <>
                    <p>Order đang trong quá trình thanh toán, không thể cập nhật số lượng!</p>
                    <p>Liên hệ quầy thu ngân để hỗ trợ!</p>
                </>
            ),
            showProgress: true,
            pauseOnHover,
            placement: 'topRight',
            duration: 5,
            icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
        });
    };

    const fetchOrderDetails = useCallback(async (orderId: number) => {
        const data = await fetchOrderDetailsAPI(orderId);
        if (data) {
            const items = await Promise.all(data.map(async (item: any) => {
                const productData = await fetchProductDetailsAPI(item.productId);
                console.log("productData: ", productData);

                const updatedProduct = {
                    ...productData,
                    price: item.unitPrice,
                };

                return {
                    orderDetailId: item.orderDetailId,
                    product: updatedProduct,
                    quantity: item.quantity,
                };
            }));
            setOrderDetails(items);
        } else {
            throw new Error('Error fetching selected items');
        }
    }, []);


    useEffect(() => {
        fetchOrderDetails(Number(orderId));
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
    }, [fetchOrderDetails, orderId]);

    const handleQuantityChange = (index: number, operation: 'increase' | 'decrease') => {
        const updatedOrderDetails = [...orderDetails];
        const newQuantity = operation === 'increase' ? updatedOrderDetails[index].quantity! + 1 : updatedOrderDetails[index].quantity! - 1;

        if (newQuantity >= 0) {
            updatedOrderDetails[index].quantity = newQuantity;
            setOrderDetails(updatedOrderDetails);
        }
    };


    const saveOrderDetails = async (orderDetails: { orderDetailId: number, product: ProductModel; quantity: number }[]) => {
        try {
            const updatePayload = orderDetails.map((item) => ({
                id: item.orderDetailId,
                quantity: item.quantity,
            }));

            const updatedOrderDetails = await updateQuantityOrderDetails(updatePayload);
            console.log('Updated OrderDetails:', updatedOrderDetails);

            let totalAmount = 0;
            orderDetails.forEach((item: { quantity: number, product: ProductModel }) => {
                totalAmount += item.quantity * item.product.price;
            });

            await updateOrderAmount(Number(orderId), totalAmount);
            console.log('Total Amount:', totalAmount);

            return updatedOrderDetails;
        } catch (error) {
            console.error('Error updating order details:', error);
            throw error;
        }
    };



    const handleOpenModal = async () => {
        setIsModalOpen(true);
    };

    const handleSaveChanges = async () => {
        const currentPassword = '123';

        if (passwordInput === currentPassword) {
            try {
                const orderData = await fetchOrderStatusAPI(orderId);
                if (orderData.orderStatus === 'WAITING') {
                    await fetchOrderDetails(orderId);
                    openNotification(false)();
                    setIsEditing(false);
                    setIsModalOpen(false);
                } else {
                    await saveOrderDetails(orderDetails);
                    setIsEditing(false);
                    setIsModalOpen(false);
                    setErrorMessage('');
                }

            } catch (error) {
                setErrorMessage('Failed to save changes. Please try again.');
            }
        } else {
            setErrorMessage('Mật khẩu không chính xác');
        }
    };

    const handleContinue = () => {
        if (isEditing) {
            handleOpenModal();
        } else {
            navigate(`/staff/checkout/step2`, { state: { tableId: tableId, orderId: orderId, orderTableNum: orderTableNum } });
        }
    }

    const handleGoBack = async () => {
        try {
            const orderData = await fetchOrderStatusAPI(orderId);

            if (orderData.orderStatus === 'WAITING') {
                navigate('/staff');
            } else {
                navigate(-1);
            }
        } catch (error) {
            console.error('Error checking order status:', error);
        }
    };

    const handleGoHome = async () => {
        try {
            let newStatus = "EMPTY_TABLE";

            const orderId = await fetchOrderIdByTableId(Number(tableId));
            if (orderId) {
                const orderData = await fetchOrderStatusAPI(orderId);
                if (orderData.orderStatus === "IN_TRANSIT") {
                    newStatus = "OCCUPIED_TABLE";
                }
            }

            await updateTableStatus(Number(tableId), newStatus);
            navigate('/staff');
        } catch (error) {
            console.error('Error checking order status:', error);
        }
    };


    return (
        <>
            {contextHolder}
            <div className="ps36231-checkout-staff-1">

                {isModalOpen && (
                    <div className="ps36231 modal fade show d-block" id="modalPin" tabIndex={-1} role="dialog">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content p-4 text-center">
                                <h5>Nhập mật khẩu nhân viên để tiếp tục</h5>
                                <div className="input-field">
                                    <input
                                        type="password"
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        placeholder="Mật khẩu"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault(); // Ngăn hành động mặc định (submit form hoặc reload trang)
                                                handleSaveChanges(); // Gọi hàm handleSaveChanges khi nhấn Enter
                                            }
                                        }}
                                    />
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                </div>
                                <div className='d-flex justify-content-center align-items-center mt-2'>
                                    <button className="btn btn-secondary mt-2 me-4" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                    <button onClick={handleSaveChanges} className="btn btn-primary mt-2">Xác nhận</button>
                                </div>

                            </div>
                        </div>
                        <div className="modal-backdrop fade show" onClick={() => setIsModalOpen(false)}></div>
                    </div>
                )}
                <div className="call-staff" style={{ color: 'var(--text-color)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="turn-back">
                            <button onClick={() => handleGoBack()}>Quay lại</button>
                        </div>

                        <div className="call-staff-inner">
                            <i className="bi bi-bell-fill"></i>
                            Gọi nhân viên
                        </div>
                        <div className="turn-dashboard">
                            <button onClick={() => handleGoHome()}>
                                <i className="bi bi-arrow-counterclockwise"></i> Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 className="title-table" style={{ color: 'var(--text-color)' }}>Bàn số {orderTableNum} | Xác nhận kiểm đồ</h2>
                        {isEditing && (

                            <h5 style={{ cursor: 'pointer', color: 'var(--text-color)' }} onClick={handleOpenModal} className="title-table fs-6 text-decoration-underline"><i className="bi bi-gear pe-2"></i>Lưu thay đổi</h5>
                        )}
                        {!isEditing && (
                            <h5 style={{ cursor: 'pointer', color: 'var(--text-color)' }} onClick={() => setIsEditing(true)} className="title-table fs-6 text-decoration-underline"><i className="bi bi-gear pe-2"></i>Chỉnh sửa</h5>
                        )}

                    </div>
                    <div className="container-table" style={{ color: 'var(--text-color)' }}>
                        <div>
                            <table className="all-sp">
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: "var(--body-color)" }}>Tên món</th>
                                        <th style={{ backgroundColor: "var(--body-color)" }}>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map((orderDetail, index) => (
                                        <tr key={index}>
                                            <td className="pb-2">{orderDetail.product.productName}</td>
                                            {isEditing ? (
                                                <td className="pb-2 text-end">
                                                    <button
                                                        id="decrement"
                                                        className="btn"
                                                        onClick={() => handleQuantityChange(index, 'decrease')}
                                                        style={{ color: 'white' }}
                                                    >
                                                        <i className="bi bi-dash-lg"></i>
                                                    </button>

                                                    <span className="px-2" style={{ width: '40px', display: 'inline-block', textAlign: 'center', color: 'var(--text-color)' }}>
                                                        {orderDetail.quantity}
                                                    </span>

                                                    <button
                                                        id="increment"
                                                        className="btn"
                                                        onClick={() => handleQuantityChange(index, 'increase')}
                                                        style={{ color: 'white' }}
                                                    >
                                                        <i className="bi bi-plus-lg"></i>
                                                    </button>
                                                </td>
                                            ) : (
                                                <td className="text-end">
                                                    <span className="px-2" style={{ width: '40px', display: 'inline-block', textAlign: 'center', color: 'var(--text-color)' }}>
                                                        {orderDetail.quantity}
                                                    </span>
                                                </td>
                                            )}

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="container-method-checkout"></div>
                    <div className="container-button">
                        <button onClick={handleContinue}>Tiếp tục</button>
                    </div>
                </div>
                <div className="step-checkout">
                    <div>
                        <button style={{ backgroundColor: '#bd4242' }}>1</button>
                        <button>2</button>
                        <button>3</button>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Checkout1;

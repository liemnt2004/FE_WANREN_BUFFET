// OrderOnTable.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductModel from '../../../../models/StaffModels/ProductModel';
import Header from './Header';
import OffcanvasCart from './Cart';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ExitModal from './ExitModal';
import SwitchTableModal from './SwitchTableModal';
import '../../assets/css/styles.css'
import { fetchOrderIdByTableId, fetchOrderStatusAPI, updateTableStatus } from '../../../../api/apiStaff/orderForStaffApi';

type ContentType =
    | 'hotpot'
    | 'meat'
    | 'seafood'
    | 'meatballs'
    | 'vegetables'
    | 'noodles'
    | 'buffet_tickets'
    | 'dessert'
    | 'mixers'
    | 'cold_towel'
    | 'soft_drinks'
    | 'beer'
    | 'mushroom'
    | 'wine';

const OrderOnTable: React.FC = () => {
    const location = useLocation();
    const { tableId, tableNumber, adults, children, tableLocation } = location.state || {};
    const [selectedContent, setSelectedContent] = useState<ContentType>('hotpot');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSwitchTableModalOpen, setIsSwitchTableModalOpen] = useState(false);
    const [actionAfterPin, setActionAfterPin] = useState<'checkout' | 'switchTable' | null>(null); // Thêm trạng thái này
    const navigate = useNavigate();

    const [showCart, setShowCart] = useState(false);
    const [selectedItemsSubtotal, setSelectedItemsSubtotal] = useState(0);
    const [cartItems, setCartItems] = useState<{ product: ProductModel; quantity: number; note: string; totalPrice: number }[]>([]);

    const [isNavigating, setIsNavigating] = useState(false); // Thêm trạng thái này

    useEffect(() => {
        if (tableId) {
            const updateStatus = async () => {
                await updateTableStatus(Number(tableId), "LOCKED_TABLE");
            };
            updateStatus();
        }
    }, [tableId]);

    const getTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCartClick = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    const handleSidebarClick = (contentType: ContentType) => {
        setSelectedContent(contentType);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleCheckout = () => {
        console.log("Checkout");
        setIsModalOpen(false);
        setActionAfterPin('checkout'); // Thiết lập hành động
        setIsSwitchTableModalOpen(true); // Mở modal nhập PIN
    };

    const handleSwitchTable = () => {
        setIsSwitchTableModalOpen(true);
        setActionAfterPin('switchTable'); // Thiết lập hành động
        setIsModalOpen(false);
    };

    const handleConfirmSwitchTable = async () => {
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

            if (actionAfterPin === 'checkout') {
                handleConfirmOrder(); // Xóa giỏ hàng và đóng cart
            } else if (actionAfterPin === 'switchTable') {
                navigate('/staff'); // Điều hướng tới trang staff
            }

        } catch (error) {
            console.error("Error handling table switch:", error);
        } finally {
            setIsSwitchTableModalOpen(false);
            setActionAfterPin(null);
            setIsNavigating(false); // Đặt lại trạng thái
        }
    };

    const handleOpenExitModal = () => {
        setIsModalOpen(true);
    };

    const handleOpenSwitchTableModal = () => {
        setIsSwitchTableModalOpen(true);
    };

    const handleConfirmOrder = () => {
        setCartItems([]);
        setShowCart(false);
    };

    const handleUpdateSubtotal = (subtotal: number) => {
        setSelectedItemsSubtotal(subtotal);
    };

    // Back Button Handling
    useEffect(() => {
        // Push a dummy state to handle back button
        window.history.pushState({ preventBack: true }, '');

        const onPopState = (event: PopStateEvent) => {
            if (isNavigating) {
                
                return;
            }

            // Ngăn chặn điều hướng bằng cách đẩy lại trạng thái
            window.history.pushState({ preventBack: true }, '');

            // Mở ExitModal để yêu cầu xác nhận
            setIsModalOpen(true);
        };

        window.addEventListener('popstate', onPopState);

        return () => {
            window.removeEventListener('popstate', onPopState);
        };
    }, [isNavigating]);

    // Handle navigation after user confirms exit
    const handleProceedNavigation = useCallback(() => {
        setIsNavigating(true);
        navigate(-1); // Điều hướng quay lại trang trước
    }, [navigate]);

    // Cập nhật ExitModal để bao gồm tùy chọn hủy để ở lại trang
    const handleCancelExit = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header onCartClick={handleCartClick} selectedItemsSubtotal={selectedItemsSubtotal} totalCartQuantity={getTotalQuantity()} />
            <OffcanvasCart
                tableId={tableId}
                onUpdateSubtotal={handleUpdateSubtotal}
                show={showCart}
                onHide={handleCloseCart}
                cartItems={cartItems}
                onConfirmOrder={handleConfirmOrder}
                onUpdateQuantity={(productId, newQuantity) => {
                    setCartItems((prevItems) =>
                        prevItems.map((item) =>
                            item.product.productId === productId ? { ...item, quantity: newQuantity } : item
                        )
                    );
                }}
                onRemoveItem={(itemToRemove: { product: ProductModel; quantity: number; note: string }) => {
                    const updatedCartItems = cartItems.filter(item =>
                        item.product.productId !== itemToRemove.product.productId || item.note !== itemToRemove.note
                    );
                    setCartItems(updatedCartItems);
                }}
            />
            <Sidebar
                tableNumber={tableNumber}
                tableId={tableId}
                tableLocation={tableLocation}
                onClickContent={handleSidebarClick}
                onOpenExitModal={handleOpenExitModal}
                onOpenSwitchTableModal={handleOpenSwitchTableModal}
            />
            <MainContent tableId={tableId} content={selectedContent} cartItems={cartItems} setCartItems={setCartItems} area={tableLocation} />
            {isModalOpen && (
                <ExitModal
                    onClose={handleCancelExit}
                    onCheckout={() => {
                        handleCheckout();
                        handleProceedNavigation();
                    }}
                    onSwitchTable={() => {
                        handleSwitchTable();
                        handleProceedNavigation();
                    }}
                />
            )}
            {isSwitchTableModalOpen && (
                <SwitchTableModal
                    onClose={() => {
                        setIsSwitchTableModalOpen(false);
                        setActionAfterPin(null);
                    }}
                    onConfirm={handleConfirmSwitchTable}
                />
            )}
        </div>
    );
};
export default OrderOnTable;

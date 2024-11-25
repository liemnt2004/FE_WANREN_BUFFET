import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductModel from '../../../../models/StaffModels/ProductModel';
import Header from './Header';
import OffcanvasCart from './Cart';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ExitModal from './ExitModal';
import SwitchTableModal from './SwitchTableModal';
import '../../assets/css/styles.css'

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
    const navigate = useNavigate();

    const [showCart, setShowCart] = useState(false);
    const [selectedItemsSubtotal, setSelectedItemsSubtotal] = useState(0);
    const [cartItems, setCartItems] = useState<{ product: ProductModel; quantity: number; note: string; totalPrice: number }[]>([]);

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
    };

    const handleSwitchTable = () => {
        setIsSwitchTableModalOpen(true);
        setIsModalOpen(false);
    };

    const handleConfirmSwitchTable = () => {
        navigate('/staff');
        setIsSwitchTableModalOpen(false);
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

    return (
        <div>
            <Header onCartClick={handleCartClick} selectedItemsSubtotal={selectedItemsSubtotal} totalCartQuantity={getTotalQuantity()} />
            <OffcanvasCart tableId={tableId} onUpdateSubtotal={handleUpdateSubtotal} show={showCart} onHide={handleCloseCart} cartItems={cartItems} onConfirmOrder={handleConfirmOrder} onUpdateQuantity={(productId, newQuantity) => {
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
                }} />
            <Sidebar
                tableNumber={tableNumber}
                tableId={tableId}
                tableLocation={tableLocation}
                onClickContent={handleSidebarClick}
                onOpenExitModal={handleOpenExitModal}
                onOpenSwitchTableModal={handleOpenSwitchTableModal}
            />
            <MainContent content={selectedContent} cartItems={cartItems} setCartItems={setCartItems} area={tableLocation} />
            {isModalOpen && (
                <ExitModal
                    onClose={handleCloseModal}
                    onCheckout={handleCheckout}
                    onSwitchTable={handleSwitchTable}
                />
            )}
            {isSwitchTableModalOpen && (
                <SwitchTableModal
                    onClose={() => setIsSwitchTableModalOpen(false)}
                    onConfirm={handleConfirmSwitchTable}
                />
            )}
        </div>
    );
};

export default OrderOnTable;

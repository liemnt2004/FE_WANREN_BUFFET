import React, { useState, useEffect, useCallback } from 'react';
import { Offcanvas } from 'react-bootstrap';
import ProductModel from '../../../../models/ProductModel';
import '../../assets/css/menu.css';
import { useNavigate, useParams } from 'react-router-dom';

interface OffcanvasCartProps {
  show: boolean;
  onHide: () => void;
  cartItems: { product: ProductModel; quantity: number; note: string }[];
  onConfirmOrder: (items: { product: ProductModel; quantity: number; note: string }[]) => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onUpdateSubtotal: (subtotal: number) => void;
}

const OffcanvasCart: React.FC<OffcanvasCartProps> = ({
  show, onHide, cartItems, onConfirmOrder, onUpdateQuantity, onRemoveItem, onUpdateSubtotal,
}) => {
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId: string }>();
  const [selectedItems, setSelectedItems] = useState<{ product: ProductModel; quantity: number; note: string }[]>([]);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const selectedItemsSubtotal = selectedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const selectedItemsTax = selectedItemsSubtotal * 0.08;
  const selectedItemsTotal = selectedItemsSubtotal + selectedItemsTax;
  const [activeTab, setActiveTab] = useState('selecting');

  const fetchOrderDetails = useCallback(async (orderId: number) => {
    const response = await fetch(`http://localhost:8080/api/orders_detail_staff/${orderId}`);
    if (response.ok) {
      const data = await response.json();
      const items = await Promise.all(data.map(async (item: any) => {
        const productResponse = await fetch(`http://localhost:8080/api/product/${item.productId}`);
        if (!productResponse.ok) throw new Error(`Failed to fetch product ${item.productId}`);
        const productData = await productResponse.json();
        return {
          product: { ...productData },
          quantity: item.quantity,
          note: item.itemNotes,
        };
      }));
      setSelectedItems(items);
    } else {
      throw new Error('Error fetching selected items');
    }
  }, []);

  useEffect(() => {
    const fetchOrderId = async () => {
      const response = await fetch(`http://localhost:8080/api/order_staff/findOrderIdByTableId/${tableId}`);
      if (!response.ok) throw new Error('Error fetching orderId');
      const orderIdText = await response.text();
      const orderId = orderIdText ? Number(orderIdText) : null;

      if (orderId) {
        fetchOrderDetails(orderId);
      } else {
        const newOrderResponse = await fetch('http://localhost:8080/api/order_staff/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1,
            address: "145 Phan Xích Long",
            notes: "Order tại bàn",
            orderStatus: "IN_TRANSIT",
            totalAmount: 0,
            tableId: Number(tableId),
          }),
        });
        if (!newOrderResponse.ok) throw new Error('Error creating order');
      }
    };

    fetchOrderId().catch(console.error);
  }, [tableId, fetchOrderDetails]);

  useEffect(() => {
    onUpdateSubtotal(selectedItemsSubtotal);
  }, [selectedItemsSubtotal, onUpdateSubtotal]);

  const handleConfirmOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/order_staff/findOrderIdByTableId/${tableId}`);
      const orderIdText = await response.text();
      const orderId = orderIdText ? Number(orderIdText) : null;

      if (!orderId) throw new Error('Order ID not found');

      const orderDetails = cartItems.map(item => ({
        productId: item.product.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        itemNotes: item.note,
        orderId,
        createdDate: new Date().toISOString(),
      }));

      const detailsResponse = await fetch(`http://localhost:8080/api/orders_detail_staff/add_or_update/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });
      if (!detailsResponse.ok) throw new Error('Error adding or updating order details');

      await fetch(`http://localhost:8080/api/order_staff/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: selectedItemsTotal }),
      });
      
      await fetch(`http://localhost:8080/api/table/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableStatus: 'OCCUPIED_TABLE' }),
      });

      onConfirmOrder(cartItems);
      navigate(0);
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Giỏ Hàng</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ul className="nav nav-tabs" id="cartTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${activeTab === 'selecting' ? 'active' : ''}`} id="selecting-tab" data-bs-toggle="tab" data-bs-target="#selecting" type="button" role="tab" aria-controls="selecting" aria-selected={activeTab === 'selecting'}
              onClick={() => setActiveTab('selecting')}>
              Danh sách đang chọn
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={`nav-link ${activeTab === 'selected' ? 'active' : ''}`} id="selected-tab" data-bs-toggle="tab" data-bs-target="#selected" type="button" role="tab" aria-controls="selected" aria-selected={activeTab === 'selecting'}
              onClick={() => setActiveTab('selecting')}>
              Các món đã gọi
            </button>
          </li>
        </ul>

        <div className="tab-content mt-3" id="cartTabContent">
          <div className={`tab-pane fade ${activeTab === 'selecting' ? 'show active' : ''}`} id="selecting" role="tabpanel" aria-labelledby="selecting-tab">
            <div className="cart-page" style={{ height: '350px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th>Số Lượng</th>
                    <th className="text-end">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product.productId}>
                      <td className="cart-info d-flex align-items-center">
                        <img src={item.product.image} className="rounded" alt="" width="80" />
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{item.product.productName}</p>
                          <p>{item.note || ''}</p>
                          <button className="btn btn-link" onClick={() => onRemoveItem(item.product.productId)}>Remove</button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          defaultValue={item.quantity}
                          min={1}
                          onChange={e => onUpdateQuantity(item.product.productId, Number(e.target.value))}
                        />
                      </td>
                      <td className="text-end">{(item.product.price * item.quantity).toLocaleString()} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-price d-flex justify-content-end">
              <table className="table">
                <tbody>
                  <tr>
                  <td>Thông tin thanh toán trước VAT</td>
                    <td className="text-end fw-bold" style={{ color: 'var(--colorPrimary)' }}>{subtotal.toLocaleString()} VND</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button style={{ float: 'right' }} className="btn btn-danger" onClick={handleConfirmOrder}>
              Xác nhận gọi món
            </button>
          </div>

          <div className={`tab-pane fade ${activeTab === 'selected' ? 'show active' : ''}`} id="selected" role="tabpanel" aria-labelledby="selected-tab">
            <div className="cart-page" style={{ height: '350px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th>Số Lượng</th>
                    <th className="text-end">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => (
                    <tr key={item.product.productId}>
                      <td className="cart-info d-flex align-items-center">
                        <img src={item.product.image} className="rounded" alt="" width="80" />
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{item.product.productName}</p>
                          <p>{item.note || ''}</p>
                        </div>
                      </td>
                      <td className='align-middle'>{item.quantity}</td>
                      <td className="text-end">{(item.product.price * item.quantity).toLocaleString()} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-price d-flex justify-content-end">
              <table className="table">
                <tbody>
                  <tr>
                  <td>Thông tin thanh toán trước VAT</td>
                    <td className="text-end fw-bold">{selectedItemsSubtotal.toLocaleString()} VND</td>
                  </tr>
                  <tr>
                    <td>VAT</td>
                    <td className="text-end fw-bold">{selectedItemsTax.toLocaleString()} VND</td>
                  </tr>
                  <tr>
                    <td>Tổng thanh toán bao gồm VAT</td>
                    <td className="text-end fw-bold" style={{ color: 'var(--colorPrimary)' }}>{selectedItemsTotal.toLocaleString()} VND</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button style={{ float: 'right' }} className="btn btn-danger">
              Thanh Toán
            </button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasCart;

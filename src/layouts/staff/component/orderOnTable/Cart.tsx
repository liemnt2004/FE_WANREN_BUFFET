import React, { useState, useEffect, useCallback } from 'react';
import { Offcanvas } from 'react-bootstrap';
import '../../assets/css/styles.css'
import { useNavigate, useParams } from 'react-router-dom';
import ProductModel from '../../../../models/StaffModels/ProductModel';
import { createNewOrder, fetchOrderDetailsAPI, fetchOrderIdByTableId, fetchOrderStatusAPI, fetchProductDetailsAPI, updateOrderAmount, updateOrderDetails, updateTableStatus } from '../../../../api/apiStaff/orderForStaffApi';
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

interface OffcanvasCartProps {
  show: boolean;
  onHide: () => void;
  cartItems: { product: ProductModel; quantity: number; note: string }[];
  onConfirmOrder: (
    items: { product: ProductModel; quantity: number; note: string }[]
  ) => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (itemToRemove: {
    product: ProductModel;
    quantity: number;
    note: string;
  }) => void;
  onUpdateSubtotal: (subtotal: number) => void;
}

const OffcanvasCart: React.FC<OffcanvasCartProps> = ({
  show,
  onHide,
  cartItems,
  onConfirmOrder,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateSubtotal,
}) => {
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId: string }>();
  const [selectedItems, setSelectedItems] = useState<
    { product: ProductModel; quantity: number; note: string }[]
  >([]);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const selectedItemsSubtotal = selectedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const selectedItemsTax = selectedItemsSubtotal * 0.08;
  const selectedItemsTotal = selectedItemsSubtotal + selectedItemsTax;
  const [activeTab, setActiveTab] = useState("selecting");
  const [order_id, setOrderId] = useState<any>(0);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (pauseOnHover: boolean) => () => {
    api.open({
      message: 'Xác nhận gọi món',
      description: 'Gọi món thành công!',
      showProgress: true,
      pauseOnHover,
      placement: 'topRight',
      duration: 3,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    });
  };

  const fetchOrderDetails = useCallback(async (orderId: number) => {
    const data = await fetchOrderDetailsAPI(orderId);
    console.log(data);
    if (data) {
      const items = await Promise.all(
        data.map(async (item: any) => {
          const productData = await fetchProductDetailsAPI(item.productId);
          console.log("productData: ", productData);

          const updatedProduct = {
            ...productData,
            price: item.unitPrice,
          };

          return {
            product: updatedProduct,
            quantity: item.quantity,
            // note: item.itemNotes, Chỗ này không cần
          };
        })
      );
      setSelectedItems(items);
    } else {
      throw new Error("Error fetching selected items");
    }
  }, []);

  useEffect(() => {
    if (selectedItems.length >= 0) {
      fetchOrderDetails(order_id);
    }
  }, [selectedItems, fetchOrderDetails, order_id]);

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const orderId = await fetchOrderIdByTableId(Number(tableId));
        if (orderId) {
          setOrderId(orderId);
          const orderData = await fetchOrderStatusAPI(orderId);
          if (orderData.orderStatus === "DELIVERED") {
            await createNewOrder(Number(tableId));
          }
          fetchOrderDetails(orderId);
        } else {
          await createNewOrder(Number(tableId));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderId();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      setActiveTab("selecting");
    } else if (selectedItems.length > 0) {
      setActiveTab("selected");
    }
  }, [cartItems, selectedItems]);

  useEffect(() => {
    onUpdateSubtotal(selectedItemsSubtotal);
  }, [selectedItemsSubtotal, onUpdateSubtotal]);

  const handleConfirmOrder = async () => {
    try {
      const orderId = await fetchOrderIdByTableId(Number(tableId));
      if (!orderId) throw new Error("Order ID not found");
      setOrderId(orderId);

      const orderDetails = cartItems.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        itemNotes: item.note,
        orderId,
        createdDate: new Date().toISOString(),
      }));

      await updateOrderDetails(orderId, orderDetails);
      await updateOrderAmount(orderId, selectedItemsSubtotal + subtotal);
      await updateTableStatus(Number(tableId), "OCCUPIED_TABLE");

      onConfirmOrder(cartItems);
      openNotification(false)();
    } catch (error) {
      console.error("Error confirming order:", error);
      api.error({
        message: 'Order Failed',
        description: 'There was an issue confirming your order. Please try again.',
      });
    }
  };

  return (
    <>
      {contextHolder}
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
                            <button className="p-0 text-decoration-underline" onClick={() => onRemoveItem(item)}>Remove</button>
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
                        <td className="text-end">{(item.product.price * item.quantity).toLocaleString()} VNĐ</td>
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
                      <td className="text-end fw-bold" style={{ color: 'var(--colorPrimary)' }}>{subtotal.toLocaleString()} VNĐ</td>
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
                        <td className="text-end">{(item.product.price * item.quantity).toLocaleString()} VNĐ</td>
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
                      <td className="text-end fw-bold">{selectedItemsSubtotal.toLocaleString()} VNĐ</td>
                    </tr>
                    <tr>
                      <td>VAT</td>
                      <td className="text-end fw-bold">{selectedItemsTax.toLocaleString()} VNĐ</td>
                    </tr>
                    <tr>
                      <td>Tổng thanh toán bao gồm VAT</td>
                      <td className="text-end fw-bold" style={{ color: 'var(--colorPrimary)' }}>{selectedItemsTotal.toLocaleString()} VNĐ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button onClick={() => navigate(`/checkout/order/${order_id}/step1`, { state: { tableId: tableId } })} style={{ float: 'right' }} className="btn btn-danger">
                Thanh Toán
              </button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffcanvasCart;

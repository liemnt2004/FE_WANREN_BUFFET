import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Offcanvas } from 'react-bootstrap';
import '../../assets/css/styles.css'
import { useLocation, useNavigate } from 'react-router-dom';
import ProductModel from '../../../../models/StaffModels/ProductModel';
import { CreateNewOrder, fetchOrderDetailsAPI, fetchOrderIdByTableId, fetchOrderStatusAPI, fetchProductDetailsAPI, updateOrderAmount, updateOrderDetails, updateTableStatus } from '../../../../api/apiStaff/orderForStaffApi';
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../customer/component/AuthContext';
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
  tableId: number;
}

const OffcanvasCart: React.FC<OffcanvasCartProps> = ({
  show,
  onHide,
  cartItems,
  onConfirmOrder,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateSubtotal,
  tableId
}) => {
  const location = useLocation();
  const { adults } = location.state || {};
  const navigate = useNavigate();
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
  const [orderId, setOrderId] = useState<any>(0);
  const { employeeUserId } = useContext(AuthContext);
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
    const fetchOrderId = async () => {
      try {
        const orderId = await fetchOrderIdByTableId(Number(tableId));
        if (orderId) {
          setOrderId(orderId);
          const orderData = await fetchOrderStatusAPI(orderId);
          if (orderData.orderStatus === "DELIVERED") {
            setOrderId(null);
          } else {
            fetchOrderDetails(orderId);
          }
        } else {
          setOrderId(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderId();
  }, [fetchOrderDetails, tableId]);

  useEffect(() => {
    const fetchOrderStatusAndDetails = async () => {
      try {
        const orderData = await fetchOrderStatusAPI(orderId);
        if (orderData && orderData.orderStatus !== "DELIVERED" && selectedItems.length > 0) {
          fetchOrderDetails(orderId);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (orderId) {
      fetchOrderStatusAndDetails();
    }
  }, [fetchOrderDetails, orderId, selectedItems.length]);

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
      let orderIdToUse = orderId;
      if (orderId === null) {
        const newOrderId = await CreateNewOrder(Number(employeeUserId), tableId, Number(adults));
        if (newOrderId) {
          setOrderId(newOrderId.id);
          orderIdToUse = newOrderId.id;
        }
      }

      const orderDetails = cartItems.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        itemNotes: item.note,
        orderIdToUse,
        createdDate: new Date().toISOString(),
      }));

      await Promise.all([
        updateOrderDetails(orderIdToUse, orderDetails),
        updateOrderAmount(orderIdToUse, selectedItemsSubtotal + subtotal),
        updateTableStatus(Number(tableId), "OCCUPIED_TABLE"),
      ]);

      setSelectedItems((prev) => [
        ...prev,
        ...cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          note: item.note,
        })),
      ]);

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
              <button onClick={() => navigate(`/staff/checkout/step1`, { state: { tableId: tableId, orderId: orderId } })} style={{ float: 'right' }} className="btn btn-danger">
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

import axios from "axios";
import { request } from "./Request";
import OrderDetailsWithNameProduct from "../../models/StaffModels/OrderDetailsWithNameProduct";
import OrderDetailModel from "../../models/StaffModels/OrderDetaitModel";

export async function getAllOrderDetailsByOrderId(orderId: number): Promise<OrderDetailModel[]>{
    const rs: OrderDetailModel[] = [];
    try {
        const data = await request(`http://localhost:8080/Orders/${orderId}/orderDetails`);
        console.log(data._embedded.orderDetails);
        if (data && data._embedded && data._embedded.orderDetails) {
            for (const orderDetail of data._embedded.orderDetails) {
                const orderDetailModel = new OrderDetailModel(
                    orderDetail.orderDetailId,
                    orderDetail.quantity,
                    orderDetail.unitPrice,
                    orderDetail.itemNotes
                );
                rs.push(orderDetailModel);
            }
            return rs;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error, "Cannot log all orderDetail by orderId");
        return [];
    }
}

export async function getTableNumberByOrderId(orderId: number): Promise<number>{
    try {
        const response = await request(`http://localhost:8080/Orders/${orderId}/tablee`);
        const tableNumber = response.tableNumber;
        return tableNumber;
    } catch (error) {
        console.error(error, "Cannot log the number of table")
        return 0;
    }
}

export async function getOrderDetailWithNameProduct(orderId: number): Promise<OrderDetailsWithNameProduct[]> {
    const rs: OrderDetailsWithNameProduct[] = [];
    try{
        const data = await request(`http://localhost:8080/api/orders_detail_staff/get/order_details/with_name/${orderId}`);
        if (data && data.orderDetails) {
            for (const orderDetail of data.orderDetails) {
                const orderDetailModel = new OrderDetailsWithNameProduct(
                    orderDetail.productName,
                    orderDetail.quantity,
                    orderDetail.price
                );
                rs.push(orderDetailModel);
            }
            return rs;
        } else {
            return [];
        }
    }catch(error){
        console.error(error, "Cannot log all orderDetail by orderId");
        return [];
    }
}

export async function getOrderAmount(orderId: number): Promise<number>{
    try {
        const amountOfOrder = await request(`http://localhost:8080/api/order_staff/get_amount/${orderId}`);
        return amountOfOrder.amount;   
    } catch (error) {
        console.log(error, "Cannot get amount of order");
        return 0;
    }
}

export async function updateLoyaltyPoint(phoneNumber:string, amount:number): Promise<string> {
    try {
        const loyaltyPoint = await axios.put(`http://localhost:8080/api/customer/loyal_point/${phoneNumber}/${amount}`);
        const rs = await loyaltyPoint.data;
        const message = rs.message;
        return message;
    } catch (error) {
        console.log(error, "Cannot accumulate points");
        return "Không thể thực hiện tích điểm";
    }
}

export async function updateTotalAmount(orderId: number, total_amount:number): Promise<number>{
    try {
        const response = await axios.put(`http://localhost:8080/api/order_staff/update/total_amount/${orderId}/${total_amount}`);
        const data = response.data;
        return data.amount_last;
    } catch (error) {
        console.error(error, "Cannot update total amount");
        return 0;
    }
}

// ORDER ON TABLE

const BASE_URL = "http://localhost:8080/api";

const getHeaders = () => {
  const employeeToken = localStorage.getItem("employeeToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${employeeToken}`,
  };
};

export const fetchOrderDetailsAPI = async (orderId: number) => {
  const response = await fetch(`${BASE_URL}/orders_detail_staff/${orderId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Error fetching order details");
  return response.json();
};

export const fetchOrderStatusAPI = async (orderId: number) => {
    const response = await fetch(`${BASE_URL}/order_staff/status/${orderId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Error fetching order details");
    return response.json();
  };
  

export const fetchProductDetailsAPI = async (productId: number) => {
  const response = await fetch(`${BASE_URL}/product/${productId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`Error fetching product ${productId}`);
  return response.json();
};

export const fetchOrderIdByTableId = async (tableId: number) => {
  const response = await fetch(`${BASE_URL}/order_staff/findOrderIdByTableId/${tableId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Error fetching order ID");
  const text = await response.text();
  return text ? Number(text) : null;
};

export const createNewOrder = async (tableId: number) => {
  const response = await fetch(`${BASE_URL}/order_staff/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      userId: 1,
      address: "145 Phan Xích Long",
      notes: "Order tại bàn",
      orderStatus: "IN_TRANSIT",
      totalAmount: 0,
      tableId,
    }),
  });
  if (!response.ok) throw new Error("Error creating new order");
  return response.json();
};

export const updateOrderDetails = async (orderId: number, details: any) => {
  const response = await fetch(`${BASE_URL}/orders_detail_staff/add_or_update/${orderId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(details),
  });
  if (!response.ok) throw new Error("Error updating order details");
  return response.json();
};

export const updateOrderAmount = async (orderId: number, amount: number) => {
  const response = await fetch(`${BASE_URL}/order_staff/${orderId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ totalAmount: amount }),
  });
  if (!response.ok) throw new Error("Error updating order amount");
};

export const updateTableStatus = async (tableId: number, status: string) => {
  const response = await fetch(`${BASE_URL}/table/${tableId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ tableStatus: status }),
  });
  if (!response.ok) throw new Error("Error updating table status");
};
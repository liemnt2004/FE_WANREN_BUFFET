// orderApi.ts
import axios from "axios";
import { BASE_URL } from "./foodApi";

const getHeaders = () => {
  const employeeToken = localStorage.getItem("employeeToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${employeeToken}`,
  };
};

// Định nghĩa kiểu Order
export type Order = {
  createdDate: string; // Thời gian tạo đơn hàng (ISO 8601 string)
  orderId: number; // ID của đơn hàng
  orderStatus: string; // Trạng thái đơn hàng (tùy thuộc vào enum OrderStatus)
  totalAmount: number; // Tổng tiền
  notes: string | null; // Ghi chú đơn hàng
  address: string | null; // Địa chỉ giao hàng
  discountPointUsed: number | null; // Điểm khuyến mãi đã sử dụng
  numberPeople: number | null; // Số người
  phoneNumber: string | null; // Số điện thoại khách hàng
  fullName: string | null; // Tên đầy đủ của khách hàng
  tableId: number | null; // ID của bàn
    tableLink?: string;
    customerLink?: string;
    orderDetailsLink?: string;
  _links?: {
    orderDetails: { href: string };
  };
};

// // Định nghĩa kiểu Order
// export type Order = {
//   orderId?: number;
//   orderStatus?: string;
//   totalAmount?: number;
//   notes?: string;
//   address?: string;
//   customerLink?: string;
//   tableLink?: string;
//   username?: string;
//   tableId?: number | null;
//   orderDetailsLink?: string;
//   createdDate?: string;
//   _links?: {
//     orderDetails: { href: string };
//   };
// };


// Định nghĩa kiểu OrderDetail
export type OrderDetail = {
  createdDate?: string;
  itemNotes?: string;
  orderDetailId: number;
  quantity?: number;
  unitPrice?: number;
  productLink?: string;  // Link đến thông tin sản phẩm
  productImage?: string; // Hình ảnh sản phẩm
  productName?: string;  // Tên sản phẩm
  productId?: number;
};

// Hàm lấy thông tin chi tiết đơn hàng từ link
export const fetchOrderDetails = async (orderDetailsLink: string): Promise<OrderDetail[]> => {
  try {
    const response = await axios.get(orderDetailsLink, {
      method: "GET",
      headers: getHeaders(),
    });
    const orderDetailsData = response.data._embedded.orderDetails;

    return Promise.all(
      orderDetailsData.map(async (detail: any) => {
        const productLink = detail._links.product.href;
        const productData = await fetchProductInfo(productLink);

        return {
          orderDetailId: detail.orderDetailId,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          productLink,
          productImage: productData?.image,
          productName: productData?.productName,
          productId: productData?.productId,
          itemNotes: detail.itemNotes,
          createdDate: detail.createdDate,
        };
      })
    );
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Không log lỗi nếu là 404
      return [];
    }
    console.error("Lỗi khi lấy dữ liệu chi tiết đơn hàng:", error);
    return [];
  }
};


const fetchProductInfo = async (productLink: string): Promise<{ image?: string; productName?: string; productId?: number } | undefined> => {
  try {
    const productResponse = await axios.get(productLink, {
      method: "GET",
      headers: getHeaders(),
    });
    return {
      image: productResponse.data.image,
      productName: productResponse.data.productName,
      productId: productResponse.data.productId,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Không log nếu là lỗi 404
      return undefined;
    }
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    return undefined;
  }
};


// Hàm lấy orders từ API
export const fetchOrderDetailsByOrderId = async (orderId: number): Promise<OrderDetail[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Orders/${orderId}/orderDetails`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Orders/allWithTableNull`, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }
};
// export const fetchOrders = async (): Promise<Order[]> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/Orders`, {
//       method: "GET",
//       headers: getHeaders(),
//     });
//     const ordersData = response.data._embedded.orders;

//     return ordersData.map((order: any) => ({
//       orderId: order.orderId,
//       orderStatus: order.orderStatus,
//       totalAmount: order.totalAmount,
//       notes: order.notes,
//       address: order.address,
//       customerLink: order._links.customer?.href || undefined, // Dùng giá trị mặc định nếu không có link
//       tableLink: order._links?.tablee?.href || null,
//       orderDetailsLink: order._links.orderDetails?.href || undefined,
//     }));
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách đơn hàng:", error);
//     return [];
//   }
// };


export const fetchCustomerUsername = async (customerLink: string): Promise<string | undefined> => {
  try {
    const customerResponse = await axios.get(customerLink, {
      method: "GET",
      headers: getHeaders(),
    });
    return customerResponse.data.fullName;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined; // Không log lỗi nếu là 404
    }
    console.error("Lỗi khi lấy thông tin customer:", error);
    return undefined;
  }
};

export const fetchTableId = async (tableLink: string): Promise<number | null> => {
  try {
    const tableResponse = await axios.get(tableLink, {
      method: "GET",
      headers: getHeaders(),
    });
    return tableResponse.data.tableId;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // Không log lỗi nếu là 404
    }
    console.error("Lỗi khi lấy thông tin table:", error);
    return null;
  }
};


// Hàm cập nhật trạng thái sản phẩm
export const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    await axios.patch(`${BASE_URL}/api-data/Orders/${orderId}`, {
      orderStatus: newStatus
    }, {
      method: "PATCH",
      headers: getHeaders(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    throw error;
  }
};


// Hàm cập nhật trạng thái sản phẩm
export const updateOrderDetails = async (orderId: number, details: any[]) => {
  try {
    await axios.put(`${BASE_URL}/api-data/Orders/${orderId}/updateOrder`, details, {
      method: "PUT",
      headers: getHeaders(),
    }); // Gửi danh sách đơn giản
  } catch (error) {
    console.error("Lỗi khi cập nhật chi tiết đơn hàng:", error);
    throw error;
  }
};

export const updateTableIdOrder = async (orderId: number, tableId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/api/order_staff/${orderId}/transfer`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
            orderId: orderId,
            newTableId: tableId,
        }),
    });

    if (!response.ok) {
        throw new Error('Error transferring table');
    }

} catch (error) {
    console.error('Error transferring table:', error);
}
};

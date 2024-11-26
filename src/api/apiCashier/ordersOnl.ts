// orderApi.ts
import axios from "axios";

// Định nghĩa kiểu Order
export type Order = {
  orderId?: number;
  orderStatus?: string;
  totalAmount?: number;
  notes?: string;
  address?: string;
  customerLink?: string;
  tableLink?: string;
  username?: string;
  tableId?: number | null;
  orderDetailsLink?: string;
};


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
    const response = await axios.get(orderDetailsLink);
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
    const productResponse = await axios.get(productLink);
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
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get("http://localhost:8080/Orders");
    const ordersData = response.data._embedded.orders;

    return ordersData.map((order: any) => ({
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      notes: order.notes,
      address: order.address,
      customerLink: order._links.customer?.href || undefined, // Dùng giá trị mặc định nếu không có link
      tableLink: order._links?.tablee?.href || null,
      orderDetailsLink: order._links.orderDetails?.href || undefined,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return [];
  }
};


export const fetchCustomerUsername = async (customerLink: string): Promise<string | undefined> => {
  try {
    const customerResponse = await axios.get(customerLink);
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
    const tableResponse = await axios.get(tableLink);
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
    await axios.patch(`http://localhost:8080/Orders/${orderId}`, {
      orderStatus: newStatus
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    throw error;
  }
};


// Hàm cập nhật trạng thái sản phẩm
export const updateOrderDetails = async (orderId: number, details: any[]) => {
  try {
    await axios.put(`http://localhost:8080/Orders/${orderId}/updateOrder`, details); // Gửi danh sách đơn giản
  } catch (error) {
    console.error("Lỗi khi cập nhật chi tiết đơn hàng:", error);
    throw error;
  }
};



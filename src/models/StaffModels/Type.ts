// types.ts
export namespace StaffOrderDTO {
    export interface OrderWithDetailsRequest {
      orderStatus: string; // For example, "Pending" or "Confirmed"
      totalAmount: number;
      notes?: string;
      tablee: string;
      orderDetails: OrderDetail[];
    }
  
    export interface OrderDetail {
      productId: number;
      quantity: number;
      note: string;
    }
  }
  
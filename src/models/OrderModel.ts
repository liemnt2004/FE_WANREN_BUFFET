import React from "react";


 interface ProductModel {
    productId: number;
    productName: string;
    description: string;
    price: number;
    typefood: string;
    image: string;
    quantity: number;
    productStatus: string;
}

 interface OrderDetail {
    orderDetailId: number;
    quantity: number;
    unitPrice: number;
    itemNotes: string;
    product: ProductModel;
}

export interface OrderModel {
    orderId: number;
    customer: string;
    orderStatus: string;
    totalAmount: number;
    notes: string;
    address: string;
    payment: string;
    createdDate: string;
    updatedDate?: string | null;
    orderDetails: OrderDetail[];
}

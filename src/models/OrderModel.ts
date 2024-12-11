import React from "react";
import {ProductDetail} from "../layouts/customer/profileCustomer";




export interface OrderModel {
    orderId: number;
    customer: string;
    orderStatus: string;
    totalAmount: number;
    notes: string;
    address: string;
    payment: string;
    promotion:string;
    createdDate: string;
    updatedDate?: string | null;
    producHistorytDTOList:ProductDetail[];
    isReviewed: boolean;
}

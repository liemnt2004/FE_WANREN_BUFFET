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
    createdDate: string;
    updatedDate?: string | null;
    producHistorytDTO:ProductDetail;
}

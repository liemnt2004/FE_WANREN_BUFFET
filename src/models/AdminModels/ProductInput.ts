// src/interfaces/ProductInput.ts

import {Category} from "../../api/apiAdmin/categoryApiAdmin";

export interface ProductInput {
    productName: string;
    description: string;
    price: number;
    typeFood: string;
    image: string;
    quantity: number;
    productStatus: "IN_STOCK" | "OUT_OF_STOCK" | "HIDDEN";
    categoryId: Category; // Chỉ cần categoryId khi gửi đến backend
}

import React from "react";

class ProductModel {

    private _productId: number;


    private _productName: string;


    private _description: string;


    private _price: number;


    private _image: string;


    private _quantity:number


    private _productStatus: String;


    constructor(productId: number, productName: string, description: string, price: number, image: string, quantity: number, productStatus: String) {
        this._productId = productId;
        this._productName = productName;
        this._description = description;
        this._price = price;
        this._image = image;
        this._quantity = quantity;
        this._productStatus = productStatus;
    }


    get productId(): number {
        return this._productId;
    }

    set productId(value: number) {
        this._productId = value;
    }

    get productName(): string {
        return this._productName;
    }

    set productName(value: string) {
        this._productName = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get productStatus(): String {
        return this._productStatus;
    }

    set productStatus(value: String) {
        this._productStatus = value;
    }
}
export default ProductModel;

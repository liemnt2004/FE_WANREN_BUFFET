import React from "react";

class Promotion {
    private _promotion: number;
    private _promotionName: string;
    private _description: string;
    private _promotionType: string;
    private _promotionValue: number;
    private _startDate: string;
    private _endDate: string;
    private _promotionStatus: boolean;
    private _image: string;
    private _type_food: string;
    private _unitPrice:number

    constructor(
        promotion: number,
        promotionName: string,
        description: string,
        promotionType: string,
        promotionValue: number,
        startDate: string,
        endDate: string,
        promotionStatus: boolean,
        image: string,
        type_food: string,
        unitPrice: number
    ) {
        this._promotion = promotion;
        this._promotionName = promotionName;
        this._description = description;
        this._promotionType = promotionType;
        this._promotionValue = promotionValue;
        this._startDate = startDate;
        this._endDate = endDate;
        this._promotionStatus = promotionStatus;
        this._image = image;
        this._type_food = type_food;
        this._unitPrice = unitPrice; 
    }

    // Getters
    public get promotion(): number {
        return this._promotion;
    }

    public get promotionName(): string {
        return this._promotionName;
    }

    public get description(): string {
        return this._description;
    }

    public get promotionType(): string {
        return this._promotionType;
    }

    public get promotionValue(): number {
        return this._promotionValue;
    }

    public get startDate(): string {
        return this._startDate;
    }

    public get endDate(): string {
        return this._endDate;
    }

    public get promotionStatus(): boolean {
        return this._promotionStatus;
    }

    public get image(): string {
        return this._image;
    }

    public get type_food(): string {
        return this._type_food;
    }

    // Setters
    public set promotion(value: number) {
        this._promotion = value;
    }

    public set promotionName(value: string) {
        this._promotionName = value;
    }

    public set description(value: string) {
        this._description = value;
    }

    public set promotionType(value: string) {
        this._promotionType = value;
    }

    public set promotionValue(value: number) {
        this._promotionValue = value;
    }

    public set startDate(value: string) {
        this._startDate = value;
    }

    public set endDate(value: string) {
        this._endDate = value;
    }

    public set promotionStatus(value: boolean) {
        this._promotionStatus = value;
    }

    public set image(value: string) {
        this._image = value;
    }

    public set type_food(value: string) {
        this._type_food = value;
    }

    public get unitPrice(): number {
        return this._unitPrice;
    }

    public set unitPrice(value: number) {
        this._unitPrice = value;
    }
}

export default Promotion;

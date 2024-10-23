import React from "react";

class Promotion{
    private _PromotionId: number;
    private _promotionName:string;

    private _description:string;

    private _promotionType:string;

    private _promotionValue:number;

    private _startDate:string;

    private _endDate:string;

    private _promotionStatus:boolean;


    constructor(PromotionId: number, promotionName: string, description: string, promotionType: string, promotionValue: number, startDate: string, endDate: string, promotionStatus: boolean) {
        this._PromotionId = PromotionId;
        this._promotionName = promotionName;
        this._description = description;
        this._promotionType = promotionType;
        this._promotionValue = promotionValue;
        this._startDate = startDate;
        this._endDate = endDate;
        this._promotionStatus = promotionStatus;
    }


    get PromotionId(): number {
        return this._PromotionId;
    }

    set PromotionId(value: number) {
        this._PromotionId = value;
    }

    get promotionName(): string {
        return this._promotionName;
    }

    set promotionName(value: string) {
        this._promotionName = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get promotionType(): string {
        return this._promotionType;
    }

    set promotionType(value: string) {
        this._promotionType = value;
    }

    get promotionValue(): number {
        return this._promotionValue;
    }

    set promotionValue(value: number) {
        this._promotionValue = value;
    }

    get startDate(): string {
        return this._startDate;
    }

    set startDate(value: string) {
        this._startDate = value;
    }

    get endDate(): string {
        return this._endDate;
    }

    set endDate(value: string) {
        this._endDate = value;
    }

    get promotionStatus(): boolean {
        return this._promotionStatus;
    }

    set promotionStatus(value: boolean) {
        this._promotionStatus = value;
    }
}

export default Promotion;
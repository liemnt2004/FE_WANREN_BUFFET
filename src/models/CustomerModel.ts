import React from "react";

class CustomerModel{
    private _customerId:number;
    private _username:string;
    private _password:string;
    private _full_name:string;
    private _email:string;
    private _phoneNumber:string;
    private _address:string;
    private _loyaltyPoints:string;
    private _customerType:string;
    private _accountStatus:boolean;


    constructor(customerId: number, username: string, password: string, fullname: string, email: string, phoneNumber: string, address: string, loyaltyPoints: string, customerType: string, accountStatus: boolean) {
        this._customerId = customerId;
        this._username = username;
        this._password = password;
        this._full_name = fullname;
        this._email = email;
        this._phoneNumber = phoneNumber;
        this._address = address;
        this._loyaltyPoints = loyaltyPoints;
        this._customerType = customerType;
        this._accountStatus = accountStatus;
    }


    get customerId(): number {
        return this._customerId;
    }

    set customerId(value: number) {
        this._customerId = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get full_name(): string {
        return this._full_name;
    }

    set full_name(value: string) {
        this._full_name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get loyaltyPoints(): string {
        return this._loyaltyPoints;
    }

    set loyaltyPoints(value: string) {
        this._loyaltyPoints = value;
    }

    get customerType(): string {
        return this._customerType;
    }

    set customerType(value: string) {
        this._customerType = value;
    }

    get accountStatus(): boolean {
        return this._accountStatus;
    }

    set accountStatus(value: boolean) {
        this._accountStatus = value;
    }
}
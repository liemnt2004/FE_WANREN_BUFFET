class PaymentForStaffModel {
    private _amountPaid?: number;
    private _paymentMethod?: string;
    private _paymentStatus?: boolean;
    private _orderId?: number;
    private _userId?: number;

    constructor(
        amountPaid?: number,
        paymentMethod?: string,
        paymentStatus?: boolean,
        orderId?: number,
        userId?: number
      ) {
        this._amountPaid = amountPaid;
        this._paymentMethod = paymentMethod;
        this._paymentStatus = paymentStatus;
        this._orderId = orderId;
        this._userId = userId;
      }
    
      get amountPaid() {
        return this._amountPaid;
      }
    
      set amountPaid(amountPaid) {
        this._amountPaid = amountPaid;
      }
    
      get paymentMethod() {
        return this._paymentMethod;
      }
    
      set paymentMethod(paymentMethod) {
        this._paymentMethod = paymentMethod;
      }
    
      get paymentStatus() {
        return this._paymentStatus;
      }
    
      set paymentStatus(paymentStatus) {
        this._paymentStatus = paymentStatus;
      }
    
      get orderId() {
        return this._orderId;
      }
    
      set orderId(orderId) {
        this._orderId = orderId;
      }
    
      get userId() {
        return this._userId;
      }
    
      set userId(userId) {
        this._userId = userId;
      }
}

export default PaymentForStaffModel;
  
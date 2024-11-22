import ProductModel from "./ProductModel";

class OrderDetailModel {
    private _orderDetailId?: number;
    private _quantity?: number;
    private _unitPrice?: number;
    private _itemNotes?: number;
    private _product?: ProductModel;
  
    constructor(
      orderDetailId?: number,
      quantity?: number,
      unitPrice?: number,
      itemNotes?: number,
      product?: ProductModel
    ) {
      this._orderDetailId = orderDetailId;
      this._quantity = quantity;
      this._unitPrice = unitPrice;
      this._itemNotes = itemNotes;
      this._product = product;
    }
  
    get orderDetailId(): number | undefined {
      return this._orderDetailId;
    }
  
    set orderDetailId(value: number | undefined) {
      this._orderDetailId = value;
    }
  
    get quantity(): number | undefined {
      return this._quantity;
    }
  
    set quantity(value: number | undefined) {
      this._quantity = value;
    }
  
    get unitPrice(): number | undefined {
      return this._unitPrice;
    }
  
    set unitPrice(value: number | undefined) {
      this._unitPrice = value;
    }
  
    get itemNotes(): number | undefined {
      return this._itemNotes;
    }
  
    set itemNotes(value: number | undefined) {
      this._itemNotes = value;
    }
  
    get product(): ProductModel | undefined {
      return this._product;
    }
  
    set product(value: ProductModel | undefined) {
      this._product = value;
    }
  }

  export default OrderDetailModel;


class OrderDetailsWithNameProduct {
    private _productName?: string;
    private _quantity?: number;
    private _price?: number;
  
    constructor(productName?: string, quantity?: number, price?: number) {
      this._productName = productName;
      this._quantity = quantity;
      this._price = price;
    }
  
    get productName(): string | undefined {
      return this._productName;
    }
  
    set productName(value: string | undefined) {
      this._productName = value;
    }
  
    get quantity(): number | undefined {
      return this._quantity;
    }
  
    set quantity(value: number | undefined) {
      this._quantity = value;
    }
  
    get price(): number | undefined {
      return this._price;
    }
  
    set price(value: number | undefined) {
      this._price = value;
    }
  }

  export default OrderDetailsWithNameProduct;

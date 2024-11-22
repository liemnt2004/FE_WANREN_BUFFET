export interface CategoryModel {
    categoryId: number; // ID của danh mục
    categoryName: string; // Tên danh mục
    description?: string; // Mô tả (tuỳ chọn)
}

class ProductModel {
    private _productId: number;
    private _productName: string;
    private _description?: string; // Optional description
    private _price: number;
    private _typeFood?: string; // Optional type of food
    private _image: string;
    private _quantity?: number; // Optional quantity
    private _productStatus?: string; // Optional product status
    private _category?: CategoryModel; // Optional category

    constructor(
        productId: number,
        productName: string,
        description: string = '', // Default to empty string if not provided
        price: number,
        typeFood: string = '', // Default to empty string if not provided
        image: string,
        quantity: number = 0, // Default to 0 if not provided
        productStatus: string = '', // Default to empty string if not provided
        category?: CategoryModel // Optional category parameter
    ) {
        this._productId = productId;
        this._productName = productName;
        this._description = description;
        this._price = price;
        this._typeFood = typeFood;
        this._image = image;
        this._quantity = quantity;
        this._productStatus = productStatus;
        this._category = category; // Assign category
    }

    // Getter and Setter methods
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

    get description(): string | undefined {
        return this._description;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }

    get typeFood(): string | undefined {
        return this._typeFood;
    }

    set typeFood(value: string | undefined) {
        this._typeFood = value;
    }

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get quantity(): number | undefined {
        return this._quantity;
    }

    set quantity(value: number | undefined) {
        this._quantity = value;
    }

    get productStatus(): string | undefined {
        return this._productStatus;
    }

    set productStatus(value: string | undefined) {
        this._productStatus = value;
    }

    get category(): CategoryModel | undefined {
        return this._category;
    }

    set category(value: CategoryModel | undefined) {
        this._category = value;
    }
}

export default ProductModel;

import ProductModel from "../../models/ProductModel";
import {request} from "../Request";





export async function getAll(): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {

        const data = await request('http://localhost:8080/Product');

        if (data && data._embedded && data._embedded.products) {
            for (const product of data._embedded.products) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.image,
                    product.quantity,
                    product.productStatus
                );
                rs.push(productModel);
            }
            return rs;
        } else {

            return [];
        }
    } catch (error) {
        console.error("Không thể lấy danh sách sản phẩm:", error);
        return [];
    }
}



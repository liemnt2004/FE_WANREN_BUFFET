
import ProductModel from "../../models/ProductModel";
import { request } from "../Request";


// Get all products
export async function getAllProduct(): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const data = await request('http://localhost:8080/Product');

        console.log(data._embedded.products)// Đảm bảo đúng endpoint
        if (data && data._embedded && data._embedded.products) {

            for (const product of data._embedded.products) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typefood, // Đảm bảo truyền đủ tham số
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
        console.error("Cannot fetch product list:", error);
        return [];
    }
}



// Get hot products
export async function getProductHot(): Promise<ProductModel[]> {
    try {
        const productIds: number[] = await request('http://localhost:8080/ProductHot'); // Đảm bảo đúng endpoint
        console.log(productIds)
        if (Array.isArray(productIds)) {
            const productPromises = productIds.map(id => request(`http://localhost:8080/Product/${id}`));
            const productsData = await Promise.all(productPromises);

            return productsData.map((product: any) => new ProductModel(

                product.productId,
                product.productName,
                product.description,
                product.price,
                product.typefood,
                product.image,
                product.quantity,
                product.productStatus
            ));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching hot products:", error);
        return [];
    }
}

export async function fetchProductsByType(typeFood: string): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const data = await request(`http://localhost:8080/Product/search/findByTypeFood?typeFood=${typeFood}`);
        // Spring Data REST thường trả về dữ liệu trong _embedded
        if (data && data._embedded && data._embedded.products) {
            for (const product of data._embedded.products) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typefood, // Đảm bảo truyền đủ tham số
                    product.image,
                    product.quantity,
                    product.productStatus
                );
                rs.push(productModel);
            }
            console.log(rs)
            return rs;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Cannot fetch products of type ${typeFood}:`, error);
        throw error;
    }
}



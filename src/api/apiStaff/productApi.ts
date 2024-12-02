import ProductModel from "../../models/StaffModels/ProductModel";
import { request } from "./Request";


// Get all products
export async function getAllProduct(): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        let url = 'https://wanrenbuffet.online/api/Product';
        let hasNextPage = true;

        while (hasNextPage) {
            const data = await request(url);
            if (data && data._embedded && data._embedded.products) {
                // Add products from the current page
                for (const product of data._embedded.products) {
                    const productModel = new ProductModel(
                        product.productId,
                        product.productName,
                        product.description,
                        product.price,
                        product.typeFood,
                        product.image,
                        product.quantity,
                        product.productStatus
                    );
                    rs.push(productModel);
                }

                // Check if there is another page to fetch
                if (data._links && data._links.next) {
                    url = data._links.next.href;  // Update to the next page URL
                } else {
                    hasNextPage = false;  // No more pages to load
                }
            } else {
                hasNextPage = false;  // No products in the current page, stop fetching
            }
        }

        return rs;
    } catch (error) {
        console.error('Cannot fetch product list:', error);
        return [];
    }
}




// Get hot products
export async function getProductHot(): Promise<ProductModel[]> {
    try {
        const productIds: number[] = await request('https://wanrenbuffet.online/api/product/ProductHot'); // Đảm bảo đúng endpoint
        if (Array.isArray(productIds)) {
            const productPromises = productIds.map(id => request(`https://wanrenbuffet.online/Product/${id}`));
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
        const data = await request(`https://wanrenbuffet.online/api/Product/search/findByTypeFood?typeFood=${typeFood}`);
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
            return rs;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Cannot fetch products of type ${typeFood}:`, error);
        throw error;
    }
}

export async function SearchProduct(foodname: string): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const data = await request(`https://wanrenbuffet.online/api/Product/search/findByProductNameContaining?productName=${foodname}`);
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

            return rs;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Cannot fetch products of type ${foodname}:`, error);
        throw error;
    }

    
}



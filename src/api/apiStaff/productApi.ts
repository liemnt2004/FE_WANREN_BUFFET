import ProductModel from "../../models/StaffModels/ProductModel";
import axios from "axios";
import { request } from "../Request";

export async function getAllProduct(): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        let url = 'https://wanrenbuffet.online/api-data/Product';
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
        const { data: productIds } = await axios.get('https://wanrenbuffet.online/api/product/ProductHot'); // Ensure the endpoint is correct
        if (Array.isArray(productIds)) {
            const productPromises = productIds.map(id => axios.get(`https://wanrenbuffet.online/api-data/Product/${id}`)); // Ensure the correct path to the product
            const productsData = await Promise.all(productPromises);

            return productsData.map((response: any) => {
                const product = response.data;
                return new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typeFood, // Correct the naming consistency
                    product.image,
                    product.quantity,
                    product.productStatus
                );
            });
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching hot products:", error);
        return [];
    }
}

// Fetch products by type
export async function fetchProductsByType(typeFood: string): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const { data } = await axios.get(`https://wanrenbuffet.online/api-data/Product/search/findByTypeFood?typeFood=${typeFood}`);
        if (data && data._embedded && data._embedded.products) {
            for (const product of data._embedded.products) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typeFood, // Ensure consistency
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

// Search products by name
export async function SearchProduct(foodname: string): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const { data } = await axios.get(`https://wanrenbuffet.online/api-data/Product/search/findByProductNameContaining?productName=${foodname}`);
        if (data && data._embedded && data._embedded.products) {
            for (const product of data._embedded.products) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typeFood, // Ensure consistency
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

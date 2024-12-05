
import ProductModel from "../../models/ProductModel";
import { request } from "../Request";


// Get all products
export async function getAllProduct(): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const data = await request('https://wanrenbuffet.online/api-data/Product');
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
        const productIds: number[] = await request('https://wanrenbuffet.online/api/product/ProductHot'); // Đảm bảo đúng endpoint
        if (Array.isArray(productIds)) {
            const productPromises = productIds.map(id => request(`https://wanrenbuffet.online/api-data/Product/${id}`));
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
        // const data = await request(`https://wanrenbuffet.online/Product/search/findByTypeFood?typeFood=${typeFood}`);
        const data = await request(`https://wanrenbuffet.online/product/by-category?categoryName=${typeFood}`);
        // Spring Data REST thường trả về dữ liệu trong _embedded
        if (data && data._embedded && data._embedded.products) {
            for (const product of data._embedded.products) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typefood, 
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

export async function getOrderDetail(OrderDetailId:number): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const data = await request(`https://wanrenbuffet.online/api-data/Order_detail/${OrderDetailId}/product`);
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
        console.error( error);
        throw error;
    }
}

export async function SearchProduct(foodname: string): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    try {
        const data = await request(`https://wanrenbuffet.online/api-data/Product/search/findByProductNameContaining?productName=${foodname}`);
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

export async function fetchProductsByCategory(category: string): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];
    const employeeToken = localStorage.getItem("employeeToken");

    try {
        // Gọi API
        const response = await fetch(`https://wanrenbuffet.online/api/product/by-category?categoryName=${category}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${employeeToken}`,
            },
        });

        // Kiểm tra trạng thái HTTP
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse JSON từ response
        const data = await response.json();

        // Kiểm tra nếu `data` là mảng
        if (Array.isArray(data)) {
            for (const product of data) {
                const productModel = new ProductModel(
                    product.productId,
                    product.productName,
                    product.description,
                    product.price,
                    product.typeFood,
                    product.image,
                    product.quantity,
                    product.productStatus,
                );
                rs.push(productModel);
            }
        } else {
            console.warn("Data received is not an array", data);
        }

        return rs;
    } catch (error) {
        console.error(`Cannot fetch products of category ${category}:`, error);
        throw error;
    }
}

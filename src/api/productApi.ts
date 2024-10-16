import ProductModel from "../models/ProductModel";

// Hàm gửi yêu cầu đến API
async function request(endpoint: string, method: string = "GET", body?: any) {
    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        // Phân tích phản hồi JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Yêu cầu thất bại:", error);
        throw error;
    }
}

// Hàm lấy tất cả sản phẩm
export async function getAll(): Promise<ProductModel[]> {
    const rs: ProductModel[] = [];  // Tạo mảng rỗng để chứa danh sách sản phẩm
    try {
        // Gọi request và nhận phản hồi từ API
        const data = await request('http://localhost:8080/Product');

        // Kiểm tra nếu phản hồi có chứa _embedded và products
        if (data && data._embedded && data._embedded.products) {
            for (const product of data._embedded.products) {
                // Tạo một đối tượng ProductModel mới và thêm vào mảng rs
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
            console.log(rs)
            return rs;  // Trả về mảng sản phẩm đã xử lý
        } else {
            // Nếu không có danh sách sản phẩm, trả về mảng rỗng
            return [];
        }
    } catch (error) {
        console.error("Không thể lấy danh sách sản phẩm:", error);
        return [];  // Trả về mảng rỗng trong trường hợp thất bại
    }
}

export default request;

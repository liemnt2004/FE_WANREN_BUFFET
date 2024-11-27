export async function request(endpoint: string, method: string = "GET", body?: any) {
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


        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Yêu cầu thất bại:", error);
        throw error;
    }
}
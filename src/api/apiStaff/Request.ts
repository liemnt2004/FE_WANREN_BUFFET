import { log } from "console";

export async function request(endpoint: string, method: string = "GET", body?: any) {

    if (!endpoint.startsWith("https://") && !endpoint.startsWith("http://")) {
        endpoint = `https://${endpoint}`;  
    }

    console.log(endpoint);

    try {
        const employeeToken = localStorage.getItem("employeeToken");
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${employeeToken}`,
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

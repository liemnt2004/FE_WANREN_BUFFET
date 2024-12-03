import axios from "axios";

export async function createPaymentNormal(payment: any): Promise<number>{
    try {
        const response = await axios.post('https://wanrenbuffet.online/api/payment/create_payment/normal', payment, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const data = response.data;
        return data.payment_id;
    } catch (error) {
        console.error(error, "Cannot create payment");
        return 0;
    }
}
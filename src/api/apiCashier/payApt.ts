export const createPayment = async (paymentMethod: string, status: boolean, lastAmount: number, orderId: number, employeeUserId: number) => {
    try {
        const employeeToken = localStorage.getItem("employeeToken");
        const newOrderResponse = await fetch('http://localhost:8080/api/payment/create_payment/normal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${employeeToken}`
            },
            body: JSON.stringify({
                amountPaid: lastAmount,
                paymentMethod: paymentMethod,
                paymentStatus: status,
                orderId: orderId,
                userId: Number(employeeUserId)
            })
        });
    } catch (error) {
        console.log(error, "Cannot creat payment");
    }
}
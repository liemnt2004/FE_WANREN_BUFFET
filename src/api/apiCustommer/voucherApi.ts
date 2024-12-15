
export async function createVoucher(customerId: number, promotionId: number) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://wanrenbuffet.online/api/vouchers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            promotionId: promotionId,
            customerId: customerId,
            status: false
          })
      }
    );
    if (response) {
      return response;
    } 
  } catch (error) {
  }
}

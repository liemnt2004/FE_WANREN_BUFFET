import CustomerModelAdmin from "../../models/AdminModels/CustomerModel";

// Hàm lấy danh sách khách hàng
export async function getCustomerList(
  page: number
): Promise<{ data: CustomerModelAdmin[]; totalPages: number }> {
  try {
    const response = await fetch(`http://localhost:8080/Customer?page=${page}`);
    const data = await response.json();

    if (data?._embedded?.customers) {
      return {
        data: data._embedded.customers.map(
          (customer: any) =>
            new CustomerModelAdmin(
              customer.customerId,
              customer.username,
              customer.password,
              customer.fullname,
              customer.email,
              customer.phoneNumber,
              customer.address,
              customer.loyaltyPoints,
              customer.customerType,
              customer.createdDate,
              customer.accountStatus
            )
        ),
        totalPages: data.page.totalPages,
      };
    } else {
      return { data: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Cannot fetch customer list:", error);
    return { data: [], totalPages: 0 };
  }
}

// Hàm tạo khách hàng mới
export async function createCustomer(
  customerData: Partial<CustomerModelAdmin>
): Promise<CustomerModelAdmin | null> {
  try {
    const response = await fetch("http://localhost:8080/Customer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      console.error("Failed to create customer: HTTP error", response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.customerId) {
      return new CustomerModelAdmin(
        data.customerId,
        data.username,
        data.password,
        data.fullname,
        data.email,
        data.phoneNumber,
        data.address,
        data.loyaltyPoints,
        data.customerType,
        data.createdDate,
        data.accountStatus
      );
    } else {
      console.warn("Unexpected response format:", data);
      return null;
    }
  } catch (error) {
    console.error("Failed to create customer:", error);
    return null;
  }
}
export async function updateCustomer(
  customerId: number,
  customerData: Partial<CustomerModelAdmin>
): Promise<boolean> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/update/${customerId}`,
      {
        method: "PUT", // Use PUT to update all data; alternatively, PATCH can also be used.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData), // Send the complete customer data
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Failed to update customer:", error);
    return false;
  }
}
// Hàm xóa khách hàng
export async function deleteCustomer(customerId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/delete/${customerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error("Failed to delete customer: HTTP error", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return false;
  }
}

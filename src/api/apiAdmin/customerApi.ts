import CustomerModelAdmin from "../../models/AdminModels/CustomerModel";

// Function to fetch the list of customers

export async function fetchCustomerList(
  page: number,
  fullName?: string
): Promise<{ data: CustomerModelAdmin[]; totalPages: number }> {
  try {
    const url = fullName
      ? `http://localhost:8080/Customer/search?fullName=${encodeURIComponent(
          fullName
        )}`
      : `http://localhost:8080/Customer?page=${page}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      // Adjusting to handle direct array response if applicable
      return {
        data: data.map(
          (customer: any) =>
            new CustomerModelAdmin(
              customer.customerId,
              customer.username,
              customer.password,
              customer.fullName,
              customer.email,
              customer.phoneNumber,
              customer.address,
              customer.loyaltyPoints,
              customer.customerType,
              customer.accountStatus,
              customer.createdDate,
              customer.updatedDate
            )
        ),
        totalPages: 1,
      };
    } else if (data?._embedded?.customers) {
      return {
        data: data._embedded.customers.map(
          (customer: any) =>
            new CustomerModelAdmin(
              customer.customerId,
              customer.username,
              customer.password,
              customer.fullName,
              customer.email,
              customer.phoneNumber,
              customer.address,
              customer.loyaltyPoints,
              customer.customerType,
              customer.accountStatus,
              customer.createdDate,
              customer.updatedDate
            )
        ),
        totalPages: data.page ? data.page.totalPages : 1,
      };
    } else {
      return { data: [], totalPages: 0 };
    }
  } catch (error) {
    console.error("Cannot fetch customer data:", error);
    return { data: [], totalPages: 0 };
  }
}

// Function to create a new customer
export async function createCustomer(
  newCustomer: Partial<CustomerModelAdmin>
): Promise<void> {
  try {
    const response = await fetch(`http://localhost:8080/Customer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    });

    if (!response.ok) {
      // Fetch and log error details if creation fails
      const errorData = await response.json();
      console.error("Error creating customer:", errorData);
      throw new Error("Failed to create customer");
    }
  } catch (error) {
    console.error("Cannot create customer:", error);
  }
}

// Function to update an existing customer
export async function updateCustomer(
  customerId: number,
  updatedCustomer: Partial<CustomerModelAdmin>
): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/update/${customerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      }
    );

    if (!response.ok) {
      // Fetch and log error details if update fails
      const errorData = await response.json();
      console.error("Error updating customer:", errorData);
      throw new Error("Failed to update customer");
    }
  } catch (error) {
    console.error("Cannot update customer:", error);
  }
}

// Function to update only the account status of a customer
export async function updateAccountStatus(
  customerId: number,
  accountStatus: boolean
): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/updateAccountStatus/${customerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountStatus),
      }
    );

    if (!response.ok) {
      // Fetch and log error details if update fails
      const errorData = await response.json();
      console.error("Error updating account status:", errorData);
      throw new Error("Failed to update account status");
    }
  } catch (error) {
    console.error("Cannot update account status:", error);
  }
}

export async function deleteCustomer(customerId: number): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/delete/${customerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      // Fetch and log error details if deletion fails
      const errorData = await response.json();
      console.error("Error deleting customer:", errorData);
      throw new Error("Failed to delete customer");
    } else {
      console.log("Customer deleted successfully");
    }
  } catch (error) {
    console.error("Cannot delete customer:", error);
  }
}

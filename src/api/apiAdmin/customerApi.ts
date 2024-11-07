import CustomerModelAdmin from "../../models/AdminModels/CustomerModel";

// Function to fetch the list of customers
export async function getCustomerList(
  page: number
): Promise<{ data: CustomerModelAdmin[]; totalPages: number }> {
  try {
    const response = await fetch(`http://localhost:8080/Customer?page=${page}`);

    if (!response.ok) {
      throw new Error("Failed to fetch customer list");
    }

    const data = await response.json();

    if (data?._embedded?.customers) {
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

// Function to partially update an existing customer
export async function updateCustomer(
  id: number,
  updatedFields: Partial<CustomerModelAdmin>
): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
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
export async function updateCustomerAccountStatus(
  id: number,
  accountStatus: boolean
): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost:8080/Customer/updateAccountStatus/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountStatus }),
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
export async function searchCustomers(
  query: string
): Promise<CustomerModelAdmin[]> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query); // Use 'q' as the single search parameter

    const response = await fetch(
      `http://localhost:8080/Customer/search?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to search customers");
    }

    const data = await response.json();

    // Map the response to CustomerModelAdmin instances
    if (data?._embedded?.customers) {
      return data._embedded.customers.map(
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
      );
    } else {
      return [];
    }
  } catch (error) {
    console.error("Cannot search customers:", error);
    return [];
  }
}

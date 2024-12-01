import CustomerModelAdmin from "../../models/AdminModels/CustomerModel";
const API_URL = "https://wanrenbuffet.online";

// Function to fetch the list of customers
export async function fetchCustomerList(
  page: number
): Promise<{ data: CustomerModelAdmin[]; totalPages: number }> {
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    throw new Error("Employee token is missing. Please log in.");
  }

  try {
    // Removed the search condition for `fullName`
    const url = `${API_URL}/Customer?page=${page}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
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
        totalPages: 1, // If no pagination info is provided in the response, assume 1 page
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
        totalPages: data.page ? data.page.totalPages : 1, // Use pagination if available
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
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    throw new Error("Employee token is missing. Please log in.");
  }

  try {
    const response = await fetch(`${API_URL}/Customer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
      body: JSON.stringify(newCustomer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create customer: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Cannot create customer:", error);
    throw error; // Rethrow for higher-level handling
  }
}

// Function to update an existing customer
export async function updateCustomer(
  customerId: number,
  updatedCustomer: Partial<CustomerModelAdmin>
): Promise<void> {
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    throw new Error("Employee token is missing. Please log in.");
  }

  try {
    const response = await fetch(`${API_URL}/Customer/update/${customerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
      body: JSON.stringify(updatedCustomer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating customer:", errorData);
      throw new Error(`Failed to update customer: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Cannot update customer:", error);
    throw error; // Rethrow for higher-level handling
  }
}

// Function to update only the account status of a customer
export async function updateAccountStatus(
  customerId: number,
  accountStatus: boolean
): Promise<void> {
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    throw new Error("Employee token is missing. Please log in.");
  }

  try {
    const response = await fetch(
      `${API_URL}/Customer/updateAccountStatus/${customerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employeeToken}`,
        },
        body: JSON.stringify({ accountStatus }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating account status:", errorData);
      throw new Error(`Failed to update account status: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Cannot update account status:", error);
    throw error; // Rethrow for higher-level handling
  }
}

// Function to delete a customer
export async function deleteCustomer(customerId: number): Promise<void> {
  const employeeToken = localStorage.getItem("employeeToken");
  if (!employeeToken) {
    throw new Error("Employee token is missing. Please log in.");
  }

  try {
    const response = await fetch(`${API_URL}/Customer/delete/${customerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${employeeToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting customer:", errorData);
      throw new Error(`Failed to delete customer: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Cannot delete customer:", error);
    throw error; // Rethrow for higher-level handling
  }
}

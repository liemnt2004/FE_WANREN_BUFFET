import EmployeeAdmin from "../../models/AdminModels/EmployeeModel";

export async function getListUser(page: number = 1): Promise<{
  _embedded: { users: EmployeeAdmin[] };
}> {
  const employeeToken = localStorage.getItem("employeeToken");
  try {
    const response = await fetch(`http://localhost:3000/User?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Data returned by getListUser:", data);
    return data;
  } catch (error) {
    console.error("Lỗi", error);
    return { _embedded: { users: [] } };
  }
}

export async function createUser(
  user: EmployeeAdmin
): Promise<EmployeeAdmin | null> {
  const employeeToken = localStorage.getItem("employeeToken");
  try {
    const response = await fetch(`http://localhost:3000/User/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    const createdUser = await response.json();
    return createdUser;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function updateUser(
  id: number,
  updatedFields: Partial<EmployeeAdmin>
): Promise<EmployeeAdmin | null> {
  const employeeToken = localStorage.getItem("employeeToken");
  try {
    const response = await fetch(`http://localhost:3000/User/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function updateAccountStatus(
  id: number,
  accountStatus: boolean
): Promise<EmployeeAdmin | null> {
  const employeeToken = localStorage.getItem("employeeToken");
  try {
    const response = await fetch(
      `http://localhost:3000/User/updateAccountStatus/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employeeToken}`,
        },
        body: JSON.stringify(accountStatus),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  const employeeToken = localStorage.getItem("employeeToken");
  try {
    const response = await fetch(`http://localhost:3000/User/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${employeeToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    console.log(`User with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function searchUsers(
  searchParams: {
    username?: string;
    email?: string;
    fullName?: string;
    page?: number;
    size?: number;
  } = {}
): Promise<{ _embedded: { users: EmployeeAdmin[] } }> {
  const employeeToken = localStorage.getItem("employeeToken");
  try {
    const queryParams = new URLSearchParams();

    if (searchParams.username)
      queryParams.append("username", searchParams.username);
    if (searchParams.email) queryParams.append("email", searchParams.email);
    if (searchParams.fullName)
      queryParams.append("fullName", searchParams.fullName);
    queryParams.append("page", (searchParams.page || 0).toString());
    queryParams.append("size", (searchParams.size || 10).toString());

    const response = await fetch(
      `http://localhost:3000/User/search?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${employeeToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data returned by searchUsers:", data);

    if (data && data._embedded && Array.isArray(data._embedded.users)) {
      return data;
    } else {
      console.error("API response format is incorrect:", data);
      return { _embedded: { users: [] } };
    }
  } catch (error) {
    console.error("Error searching users:", error);
    return { _embedded: { users: [] } };
  }
}

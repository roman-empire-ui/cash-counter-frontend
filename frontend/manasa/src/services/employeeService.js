const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"

const authHeaders = () => ({

    headers: {
        'Content-Type': 'application/json',

    },
})

export const createEmployee = async (employeeData) => {
    const response = await fetch(`${apiUrl}/api/v1/employee/createEm`, {
        method: "POST",
        ...authHeaders(),
        body: JSON.stringify(employeeData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create employee");
    }

    return data;
};

export const updateEmployee = async (id, employeeData) => {
    const response = await fetch(`${apiUrl}/api/v1/employee/updateEmp/${id}`, {
      method: "PUT",
      ...authHeaders(),
      body: JSON.stringify(employeeData),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to update employee");
    }
  
    return data;
  };

  export const getAllEmployees = async() => {
    const response = await fetch(`${apiUrl}/api/v1/employee/getEmps`, {
        method : "GET",
        ...authHeaders(),
    })
    const data = await response.json()
    return data
  }


  export const deactivateEmployee = async(id)=>{
    const res = await fetch(`${apiUrl}/api/v1/employee/deactivateEmployee/${id}` ,{
        method: "DELETE",
        ...authHeaders(),
    })
    const data = await res.json()
    return data
  }
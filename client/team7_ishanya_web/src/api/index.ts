const API_BASE_URL = "/";

// Employee-related API calls
export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Student-related API calls
export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const fetchEducatorMapping = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/educator-mapping`);
    if (!response.ok) {
      throw new Error(`Failed to fetch educator mapping: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching educator mapping:", error);
    throw error;
  }
}

// Program-related API calls
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


export const fetchEmployeeImage = async (employeeId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_employee_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: employeeId })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employee image: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl || null;
  } catch (error) {
    console.error('Error fetching employee image:', error);
    return null;
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

export const fetchStudentImage = async (studentId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_student_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: studentId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch student image: ${response.status}`);
    }
    
    const data = await response.json();
    return data.imageUrl || null;
  } catch (error) {
    console.error('Error fetching student image:', error);
    return null;
  }
};

// Program-related API calls
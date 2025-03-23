import { USER_ROLES } from "../types";

const API_BASE_URL = "/";

export const login = async (Id: string, pwd: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-user-type`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Id, pwd })
    });

    if (!response.ok) {
      console.error(`Failed to fetch user type: ${response.status}`);
      const data = getDummyUser();
      return { id: Id, ...data }
    }

    const data = await response.json();
    return { id: Id, ...data }
  } catch (error) {
    console.error("Error fetching user type:", error);
    const data = getDummyUser();
    return { id: Id, ...data }
  }
}
export const fetchProfileData = async (id: string, userType: number) => {
  try {
    let endpoint = '';
    let payload = {};

    if (userType === USER_ROLES.STUDENT) {
      endpoint = '/get_student_by_id';
      payload = { S_ID: id };
    } else {
      endpoint = '/get_employee_by_id';
      payload = { Employee_ID: id };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`Failed to fetch profile data: ${response.status}`);
      return getDummyProfileData(id, userType);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return getDummyProfileData(id, userType);
  }
};

export const fetchUserType = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-user-type`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      console.error(`Failed to fetch user type: ${response.status}`);
      return getDummyUserType();
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user type:", error);
    return getDummyUserType();
  }
};

// Employee-related API calls
export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
      console.error(`Failed to fetch employees: ${response.status}`);
      return getDummyEmployees();
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    return getDummyEmployees();
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
      console.error(`Failed to fetch employee image: ${response.status}`);
      return getDummyEmployeeImage(employeeId);
    }

    const data = await response.json();
    return data.imageUrl || getDummyEmployeeImage(employeeId);
  } catch (error) {
    console.error('Error fetching employee image:', error);
    return getDummyEmployeeImage(employeeId);
  }
};

// Student-related API calls
export const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      console.error(`Failed to fetch students: ${response.status}`);
      return getDummyStudents();
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    return getDummyStudents();
  }
};

export const fetchEducatorMapping = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/educator_mapping`);
    if (!response.ok) {
      console.error(`Failed to fetch educator mapping: ${response.status}`);
      return getDummyEducatorMapping();
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching educator mapping:", error);
    return getDummyEducatorMapping();
  }
}
export const fetchProgramData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/programs`);
    if (!response.ok) {
      console.error(`Failed to fetch program mapping: ${response.status}`);
      return getDummyProgramData();
    }
  } catch (error) {
    console.error("Error fetching program mapping:", error);
    return getDummyProgramData();
  }
};
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
      console.error(`Failed to fetch student image: ${response.status}`);
      return getDummyStudentImage(studentId);
    }

    const data = await response.json();
    return data.imageUrl || getDummyStudentImage(studentId);
  } catch (error) {
    console.error('Error fetching student image:', error);
    return getDummyStudentImage(studentId);
  }
};
// Profile update API calls
export const updateProfileData = async (id: string, userType: number, formData: any) => {
  try {
    let endpoint = "";

    if (userType === USER_ROLES.STUDENT) {
      endpoint = '/update_student_data';
    } else if (userType > USER_ROLES.STUDENT) {
      endpoint = '/update_employee_data';
    } else {
      throw new Error("Invalid user type");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      console.error(`Failed to update profile: ${response.status}`);
      return simulateProfileUpdate(id, userType, formData);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile data:", error);
    return simulateProfileUpdate(id, userType, formData);
  }
};
// Dashboard data API call
export const fetchDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard-stats`);

    if (!response.ok) {
      console.error(`Failed to fetch dashboard data: ${response.status}`);
      return getDummyDashboardData();
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return getDummyDashboardData();
  }
};

// Dummy data generator for dashboard stats
const getDummyDashboardData = () => {
  return {
    totalStudents: 125,
    totalEmployees: 32,
    totalPrograms: 8,
    totalReports: 245
  };
};


// Simulate successful profile update for development/testing
const simulateProfileUpdate = (id: string, userType: number, formData: any) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Profile update simulation for:", id, userType);
      console.log("Updated data:", formData);

      resolve({
        success: true,
        message: "Profile updated successfully",
        data: formData
      });
    }, 800);
  });
};
// Dummy data generators
const getDummyUser = () => {
  return { 'Authenticated': true, 'Type': 3 };
}
const getDummyUserType = () => {
  // Default role
  const userType = 3;

  return { userType };
};
const getDummyEmployees = () => {
  return [
    {
      Employee_ID: "E001",
      Name: "John Doe",
      Gender: "Male",
      Photo: "",
      Designation: "Special Educator",
      Department: "Early Intervention",
      Employment_Type: "Full-time",
      Email: "john.doe@ishanya.org",
      Phone: "9876543210",
      Date_of_Birth: "1985-05-15",
      Date_of_Joining: "2020-01-10",
      Date_of_Leaving: null,
      Status: "Active",
      Tenure: "3 years",
      Work_Location: "Main Campus",
      Emergency_Contact_Name: "Jane Doe",
      Emergency_Contact_Number: "9876543211",
      Blood_Group: "O+"
    },
    {
      Employee_ID: "E002",
      Name: "Jane Smith",
      Gender: "Female",
      Photo: "",
      Designation: "Therapist",
      Department: "Therapy Services",
      Employment_Type: "Part-time",
      Email: "jane.smith@ishanya.org",
      Phone: "9876543212",
      Date_of_Birth: "1990-08-20",
      Date_of_Joining: "2021-03-15",
      Date_of_Leaving: null,
      Status: "Active",
      Tenure: "2 years",
      Work_Location: "Satellite Center",
      Emergency_Contact_Name: "John Smith",
      Emergency_Contact_Number: "9876543213",
      Blood_Group: "A+"
    }
  ];
};

const getDummyEmployeeImage = (employeeId: string) => {
  return `https://randomuser.me/api/portraits/${employeeId.includes('2') ? 'women' : 'men'}/${employeeId.slice(-1)}.jpg`;
};

const getDummyStudents = () => {
  return [
    {
      S_ID: "S001",
      Fname: "Rahul",
      Lname: "Kumar",
      Photo: "",
      Gender: "Male",
      DOB: "2015-03-10",
      Primary_Diagnosis: "Autism Spectrum Disorder",
      Comorbidity: "ADHD",
      UDID: "UDID12345",
      Enrollment_Year: 2022,
      Status: "Active",
      Email: "rahul.k@example.com",
      Program_ID: 1,
      Program2_ID: null,
      Sessions: 3,
      Timings: "Morning",
      Days_of_Week: "Mon,Wed,Fri",
      Primary_E_ID: "E001",
      Secondary_E_ID: "E002",
      Session_Type: "Individual",
      Father: "Rajesh Kumar",
      Mother: "Priya Kumar",
      Blood_Grp: "B+",
      Allergies: "None",
      Contact_No: "9876543214",
      Alt_Contact_No: "9876543215",
      Parent_Email: "rajesh.kumar@example.com"
    },
    {
      S_ID: "S002",
      Fname: "Priya",
      Lname: "Singh",
      Photo: "",
      Gender: "Female",
      DOB: "2016-07-22",
      Primary_Diagnosis: "Down Syndrome",
      Comorbidity: "None",
      UDID: "UDID67890",
      Enrollment_Year: 2023,
      Status: "Active",
      Email: "priya.s@example.com",
      Program_ID: 2,
      Program2_ID: 4,
      Sessions: 2,
      Timings: "Afternoon",
      Days_of_Week: "Tue,Thu",
      Primary_E_ID: "E002",
      Secondary_E_ID: null,
      Session_Type: "Group",
      Father: "Amit Singh",
      Mother: "Neha Singh",
      Blood_Grp: "A+",
      Allergies: "Peanuts",
      Contact_No: "9876543216",
      Alt_Contact_No: "9876543217",
      Parent_Email: "amit.singh@example.com"
    }
  ];
};

const getDummyStudentImage = (studentId: string) => {
  return `https://randomuser.me/api/portraits/children/${studentId.slice(-1)}.jpg`;
};

const getDummyEducatorMapping = () => {
  return {
    "E001": "John Doe (Special Educator)",
    "E002": "Jane Smith (Therapist)",
    "E003": "Amit Patel (Vocational Trainer)",
    "E004": "Sunita Sharma (Speech Therapist)"
  };
};
// Dummy data generator for profile data
const getDummyProfileData = (id: string, userType: number) => {
  if (userType === USER_ROLES.STUDENT) {
    return {
      S_ID: id,
      Fname: "Rahul",
      Lname: "Kumar",
      Photo: `https://randomuser.me/api/portraits/children/${id.slice(-1)}.jpg`,
      Gender: "Male",
      DOB: "2015-03-10",
      Primary_Diagnosis: "Autism Spectrum Disorder",
      Comorbidity: "ADHD",
      UDID: "UDID12345",
      Enrollment_Year: 2022,
      Status: "Active",
      Email: "rahul.k@example.com",
      Program_ID: 1,
      Program2_ID: null,
      Sessions: 3,
      Timings: "Morning",
      Days_of_Week: "Mon,Wed,Fri",
      Primary_E_ID: "E001",
      Secondary_E_ID: "E002",
      Session_Type: "Individual",
      Father: "Rajesh Kumar",
      Mother: "Priya Kumar",
      Blood_Grp: "B+",
      Allergies: "None",
      Contact_No: "9876543214",
      Alt_Contact_No: "9876543215",
      Parent_Email: "rajesh.kumar@example.com"
    };
  } else {
    return {
      Employee_ID: id,
      Name: "John Doe",
      Gender: "Male",
      Photo: `https://randomuser.me/api/portraits/${id.includes('2') ? 'women' : 'men'}/${id.slice(-1)}.jpg`,
      Designation: "Special Educator",
      Department: "Early Intervention",
      Employment_Type: "Full-time",
      Email: "john.doe@ishanya.org",
      Phone: "9876543210",
      Date_of_Birth: "1985-05-15",
      Date_of_Joining: "2020-01-10",
      Date_of_Leaving: null,
      Status: "Active",
      Tenure: "3 years",
      Work_Location: "Main Campus",
      Emergency_Contact_Name: "Jane Doe",
      Emergency_Contact_Number: "9876543211",
      Blood_Group: "O+"
    };
  }
};
// Dummy data function for program mapping
const getDummyProgramData = () => {
  return {
    "P001": {
      Program_ID: "P001",
      Program_Name: "Early Intervention Program",
      Student_IDs: ["S001", "S002", "S005", "S008"],
      Employee_IDs: ["E001", "E003", "E007"]
    },
    "P002": {
      Program_ID: "P002",
      Program_Name: "Special Education Program",
      Student_IDs: ["S003", "S004", "S009", "S012"],
      Employee_IDs: ["E002", "E005", "E008"]
    },
    "P003": {
      Program_ID: "P003",
      Program_Name: "Vocational Training Program",
      Student_IDs: ["S006", "S010", "S013", "S015"],
      Employee_IDs: ["E004", "E009", "E011"]
    },
    "P004": {
      Program_ID: "P004",
      Program_Name: "Therapy Services Program",
      Student_IDs: ["S007", "S011", "S014", "S016"],
      Employee_IDs: ["E006", "E010", "E012"]
    }
  };
};
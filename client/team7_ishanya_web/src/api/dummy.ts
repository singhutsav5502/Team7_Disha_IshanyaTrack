  
  //////////////////////////
  // Dummy data generators
  //////////////////////////
  
  
// import { USER_ROLES } from "../types";
// Dummy data generator for dashboard stats
export const getDummyDashboardData = () => {
    return {
      totalStudents: 125,
      totalEmployees: 32,
      totalPrograms: 8,
      totalReports: 245
    };
  };
  
  
  // Simulate successful profile update for development/testing
  export const simulateProfileUpdate = (id: string, userType: number, formData: any) => {
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

  export const getDummyUser = () => {
    return { 'Authenticated': true, 'Type': 3 };
  }
  export const getDummyUserType = () => {
    // Default role
    const userType = 3;
  
    return { userType };
  };
  export const getDummyEmployees = () => {
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
  
  export const getDummyEmployeeImage = (employeeId: string) => {
    return `https://randomuser.me/api/portraits/${employeeId.includes('2') ? 'women' : 'men'}/${employeeId.slice(-1)}.jpg`;
  };
  
  export const getDummyStudents = () => {
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
  
  export const getDummyStudentImage = (studentId: string) => {
    return `https://randomuser.me/api/portraits/children/${studentId.slice(-1)}.jpg`;
  };
  
  export const getDummyEducatorMapping = () => {
    return [
      {
        Employee_ID: "E001",
        Name: "John Doe (Special Educator)"
      },
      {
        Employee_ID: "E002",
        Name: "Jane Smith (Therapist)"
      },
      {
        Employee_ID: "E003",
        Name: "Amit Patel (Vocational Trainer)"
      },
      {
        Employee_ID: "E004",
        Name: "Sunita Sharma (Speech Therapist)"
      },
    ];
  };
  // Dummy data generator for profile data
  export const getDummyProfileData = (id: string, userType: number) => {
    if (userType == USER_ROLES.STUDENT) {
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
  export const getDummyProgramData = () => {
    return [
      {
        Program_ID: "P001",
        Program_Name: "Early Intervention Program",
        Student_IDs: ["S001", "S002", "S005", "S008"],
        Employee_IDs: ["E001", "E003", "E007"],
      },
      {
        Program_ID: "P002",
        Program_Name: "Special Education Program",
        Student_IDs: ["S003", "S004", "S009", "S012"],
        Employee_IDs: ["E002", "E005", "E008"],
      },
      {
        Program_ID: "P003",
        Program_Name: "Vocational Training Program",
        Student_IDs: ["S006", "S010", "S013", "S015"],
        Employee_IDs: ["E004", "E009", "E011"],
      },
      {
        Program_ID: "P004",
        Program_Name: "Therapy Services Program",
        Student_IDs: ["S007", "S011", "S014", "S016"],
        Employee_IDs: ["E006", "E010", "E012"],
      },
    ];
  };
  
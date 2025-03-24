export interface Student {
  S_ID: string;
  Fname: string;
  Lname: string;
  Photo: string;
  Gender: string;
  DOB: string;
  Primary_Diagnosis: string;
  Comorbidity: string;
  UDID: string;
  Enrollment_Year: number;
  Status: string;
  Email: string;
  Sessions: number;
  Timings: string;
  Days_of_Week: string;
  Primary_E_ID: string;
  Secondary_E_ID: string;
  Session_Type: string;
  Father: string;
  Mother: string;
  Blood_Grp: string;
  Allergies: string;
  Contact_No: string;
  Alt_Contact_No: string;
  Parent_Email: string;
}

export interface Employee {
  Employee_ID: string;
  Name: string;
  Gender: string;
  Photo: string;
  Designation: string;
  Department: string;
  Employment_Type: string;
  Email: string;
  Phone: string;
  Date_of_Birth: string;
  Date_of_Joining: string;
  Date_of_Leaving: string | null;
  Status: string;
  Tenure: string;
  Work_Location: string;
  Emergency_Contact_Name: string;
  Emergency_Contact_Number: string;
  Blood_Group: string;
}

export interface Educator {
  Employee_ID: string;
  Educator_Name: string;
  Photo: string;
  Designation: string;
  Email: string;
  Phone: string;
  Date_of_Birth: string;
  Date_of_Joining: string;
  Work_Location: string;
}

export interface Performance {
  Performance_ID: number;
  Student_ID: string;
  Metric_1: number;
  Metric_2: number;
  Metric_3: number;
  Metric_4: number;
}

export interface Report {
  Report_ID: number;
  Student_ID: string;
  Report_File: string;
}

export interface Program {
  Program_ID: number;
  Program_Name: string;
}

export interface Program_Students {
  Student_ID: string;
  Program_ID: number;
}

export interface Program_Employees {
  Employee_ID: string;
  Program_ID: number;
}

export interface Auth {
  id: string;
  pwd: string;
  Type: number;
}

export interface Notification {
  Notification_ID: number;
  Title: string;
  Description: string;
  Link: string;
  Media: string;
}
export interface UserRole {
  STUDENT: 0;
  EDUCATOR: 1;
  ADMIN: 2;
  SUPERUSER: 3;
}

export const USER_ROLES: UserRole = {
  STUDENT: 0,
  EDUCATOR: 1,
  ADMIN: 2,
  SUPERUSER: 3
};


// Role options for employees
export const roleOptions = [
  { value: USER_ROLES.EDUCATOR, label: "Educator" },
  { value: USER_ROLES.ADMIN, label: "Admin" },
  { value: USER_ROLES.SUPERUSER, label: "Super User" },
];


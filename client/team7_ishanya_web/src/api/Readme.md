
# API Service Module
This module provides a structured and modular approach to API communication for the application.

# Structure
The API module is organized into the following structure:

- /api/index.ts - Main export file that re-exports all API functions
- /api/config.ts - API configuration including base URL and axios instance
- /api/core/ - Core functionality like authentication and profile management
- /api/services/ - Domain-specific API services
- /api/utils/ - Utility functions for API operations

# Usage
Import API functions directly from the main API module:

```
javascript
import { login, fetchStudents, sendNotifications } from '../api';

// Authentication
const userCredentials = await login('userId', 'password');

// Fetch data
const students = await fetchStudents();

// Send notifications
await sendNotifications(['student1', 'student2'], 'Title', 'Message body');
Available Services
Authentication
login(id, password) - Authenticate a user
```

- fetchUserType(userId) - Get user role type

- updatePassword(userId, currentPassword, newPassword) - Change user password

# Profile Management
- fetchProfileData(id, userType) - Get profile information

- updateProfileData(id, userType, formData) - Update profile information

# Student Management
- fetchStudents() - Get all students

- fetchStudentImage(studentId) - Get student profile image

- create_new_student(studentData) - Create a new student

- fetchStudentPrograms(studentId) - Get programs for a student

- fetchStudentPerformance(studentId, quarter) - Get performance data

- updateStudentPerformance(studentId, quarter, performanceData) - Update student performance

# Employee Management
- fetchEmployees() - Get all employees

- fetchEmployeeImage(employeeId) - Get employee profile image

- create_new_employee(employeeData) - Create a new employee

- create_new_educator(educatorData) - Create a new educator

- updateEmployeeRole(employeeId, roleType) - Update employee role

- fetchEducatorDetails(educatorId) - Get educator details

- fetchEducatorMapping() - Get educator assignments

- deleteEmployee(employeeId) - Remove an employee

# Program Management
- fetchProgramData() - Get all programs

- addProgram(programData) - Create a new program

- removeProgram(programId) - Remove a program

- addEducatorToProgram(programId, educatorId) - Assign educator to program

- addStudentToProgram(programId, studentId) - Enroll student in program

# Attendance
- addAttendance(attendanceData) - Record attendance

- fetchStudentAttendance(studentId) - Get student attendance

- fetchAttendanceHistory(studentId) - Get attendance history

# Notifications and Messaging
- sendNotifications(studentIds, title, body) - Send notifications to students

- sendAppNotifications(studentIds, title, body) - Send in-app notifications

- sendEmailBroadcast(subject, body, sendToStudentParents, sendToEmployees) - 
Send email broadcast

- saveNotificationToken(studentId, token) - Register device for notifications

- sendNotificationToStudent(studentId, title, body) - Send notification to single student

# Reports
- fetchReports(userId, userType) - Get reports for user

- addReport(studentId, quarter, reportUrl) - Add new report

# Contact Queries
- submitContactQuery(queryData) - Submit a contact query

- fetchContactQueries() - Get all contact queries

- resolveContactQuery(queryId) - Mark query as resolved

# Dashboard
- fetchDashboardData() - Get dashboard statistics

# Error Handling
All API functions include error handling that logs errors to the console and either:

- Throws the error for promise chaining

- Returns a standardized error response object with success status and message

# Configuration
The API uses axios with a base configuration pointing to the backend server. The base URL and default headers are configured in the config.ts file.
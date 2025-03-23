import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Student, USER_ROLES } from "../types";
import { toast } from "react-toastify";
import {
  getUserType,
  getUserId,
  getProgramMapping,
} from "../store/slices/authSlice";
import { fetchEducatorMapping, fetchStudents } from "../api";

const ManageStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [educatorMapping, setEducatorMapping] = useState<any>({});
  const [filters, setFilters] = useState<any>({});
  const [sortField, setSortField] = useState<any>("S_ID");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const userType = useSelector(getUserType);
  const userId = useSelector(getUserId);
  const PROGRAMS = useSelector(getProgramMapping);
  console.log(PROGRAMS);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await fetchStudents();

        // Filter students based on user role
        let filteredData = studentsData;
        if (userType === USER_ROLES.EDUCATOR) {
          // Educators can only see students assigned to them
          filteredData = studentsData.filter(
            (student: Student) =>
              student.Primary_E_ID === userId ||
              student.Secondary_E_ID === userId
          );
        }

        setStudents(filteredData);
        setFilteredStudents(filteredData);

        const educatorMappingData = await fetchEducatorMapping();
        setEducatorMapping(educatorMappingData);

        setLoading(false);
      } catch (error) {
        toast.error(`Failed to fetch data with error: ${error}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [userType, userId, navigate]);

  useEffect(() => {
    const filtered = students.filter((student) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const studentValue = student[key as keyof Student];
        return typeof studentValue === "string"
          ? studentValue
              ?.toLowerCase()
              .includes((value as string).toLowerCase())
          : studentValue === value;
      })
    );

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStudents(sorted);
  }, [students, filters, sortField, sortDirection]);

  const handleFilterChange = (field: keyof Student, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSortDirection = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const navigateToProfile = (studentId: string) => {
    navigate(`/profile/${studentId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-[60vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Students</h1>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Search by ID</span>
              </label>
              <input
                type="text"
                placeholder="Enter student ID"
                value={filters.S_ID || ""}
                onChange={(e) => handleFilterChange("S_ID", e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Search by Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter first or last name"
                value={filters.Fname || ""}
                onChange={(e) => handleFilterChange("Fname", e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Primary Educator</span>
              </label>
              <input
                type="text"
                placeholder="Enter educator ID"
                value={filters.Primary_E_ID || ""}
                onChange={(e) =>
                  handleFilterChange("Primary_E_ID", e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <input
                type="text"
                placeholder="Active/Inactive"
                value={filters.Status || ""}
                onChange={(e) => handleFilterChange("Status", e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer"
                  onClick={() => toggleSortDirection("S_ID")}
                >
                  <div className="flex items-center">
                    ID
                    {sortField === "S_ID" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => toggleSortDirection("Fname")}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === "Fname" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => toggleSortDirection("Program_ID")}
                >
                  <div className="flex items-center">
                    Program
                    {sortField === "Program_ID" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => toggleSortDirection("Status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "Status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => toggleSortDirection("Primary_E_ID")}
                >
                  <div className="flex items-center">
                    Primary Educator
                    {sortField === "Primary_E_ID" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => toggleSortDirection("Secondary_E_ID")}
                >
                  <div className="flex items-center">
                    Secondary Educator
                    {sortField === "Secondary_E_ID" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.S_ID} className="hover:bg-base-200">
                    <td>{student.S_ID}</td>
                    <td>{`${student.Fname} ${student.Lname}`}</td>
                    <td>
                      {PROGRAMS[student.Program_ID] || student.Program_ID}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          student.Status === "Active"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {student.Status}
                      </span>
                    </td>
                    <td>
                      {educatorMapping[student.Primary_E_ID] ||
                        student.Primary_E_ID}
                    </td>
                    <td>
                      {educatorMapping[student.Secondary_E_ID] ||
                        student.Secondary_E_ID}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-ghost btn-sm text-primary"
                        onClick={() => navigateToProfile(student.S_ID)}
                      >
                        <FiEye className="mr-2" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsPage;

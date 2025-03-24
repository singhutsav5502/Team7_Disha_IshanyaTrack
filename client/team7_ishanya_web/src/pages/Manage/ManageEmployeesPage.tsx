import React, { useState, useEffect } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Employee } from "../../types";
import { toast } from "react-toastify";
import { fetchEmployees, deleteEmployee } from "../../api";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const ManageEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<Employee>>({});
  const [sortField, setSortField] = useState<keyof Employee>("Employee_ID");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await fetchEmployees();
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        setLoading(false);
      } catch (error) {
        toast.error(`Failed to fetch employee data ${error}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const employeeValue = employee[key as keyof Employee];
        return typeof employeeValue === "string"
          ? employeeValue
              ?.toLowerCase()
              .includes((value as string).toLowerCase())
          : employeeValue === value;
      })
    );

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue && bValue && aValue < bValue)
        return sortDirection === "asc" ? -1 : 1;
      if (aValue && bValue && aValue > bValue)
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(sorted);
  }, [employees, filters, sortField, sortDirection]);

  const handleFilterChange = (field: keyof Employee, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSortDirection = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const navigateToProfile = (employeeId: string) => {
    navigate(`/profile/${employeeId}`);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    try {
      console.log(employeeToDelete)
      await deleteEmployee(employeeToDelete.Employee_ID);
      setEmployees(
        employees.filter(
          (emp) => emp.Employee_ID !== employeeToDelete.Employee_ID
        )
      );
      toast.success(
        `Employee ${employeeToDelete.Name} has been deleted successfully`
      );
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete employee: ${error}`);
    }
  };

  // Function to close the modal
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  return (
    <>
      {loading ? (
        <div className="container mx-auto py-10 flex justify-center items-center h-[60vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6 ml-4">Manage Employees</h1>

          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Search by ID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter employee ID"
                    value={filters.Employee_ID || ""}
                    onChange={(e) =>
                      handleFilterChange("Employee_ID", e.target.value)
                    }
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Search by Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={filters.Name || ""}
                    onChange={(e) => handleFilterChange("Name", e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={filters.Department || ""}
                    onChange={(e) =>
                      handleFilterChange("Department", e.target.value)
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
                    onChange={(e) =>
                      handleFilterChange("Status", e.target.value)
                    }
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
                      onClick={() => toggleSortDirection("Employee_ID")}
                    >
                      <div className="flex items-center">
                        ID
                        {sortField === "Employee_ID" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer"
                      onClick={() => toggleSortDirection("Name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === "Name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer"
                      onClick={() => toggleSortDirection("Designation")}
                    >
                      <div className="flex items-center">
                        Designation
                        {sortField === "Designation" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer"
                      onClick={() => toggleSortDirection("Department")}
                    >
                      <div className="flex items-center">
                        Department
                        {sortField === "Department" && (
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
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee.Employee_ID}
                        className="hover:bg-base-200"
                      >
                        <td>{employee.Employee_ID}</td>
                        <td>{employee.Name}</td>
                        <td>{employee.Designation}</td>
                        <td>{employee.Department}</td>
                        <td>
                          <span
                            className={`badge ${
                              employee.Status === "Active"
                                ? "badge-success"
                                : employee.Status === "Relieved"
                                  ? "badge-error"
                                  : "badge-warning"
                            }`}
                          >
                            {employee.Status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              className="btn btn-ghost btn-sm text-primary"
                              onClick={() =>
                                navigateToProfile(employee.Employee_ID)
                              }
                            >
                              <FiEye className="mr-1" />
                              View
                            </button>
                            <button
                              className="btn btn-ghost btn-sm text-error"
                              onClick={() => handleDeleteClick(employee)}
                            >
                              <FiTrash2 className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showModal={showDeleteModal}
        hideModal={handleDeleteCancel}
        confirmModal={handleDeleteConfirm}
        message={`Are you sure you want to delete employee ${employeeToDelete?.Name}? This action cannot be undone.`}
      />
    </>
  );
};

export default ManageEmployeesPage;

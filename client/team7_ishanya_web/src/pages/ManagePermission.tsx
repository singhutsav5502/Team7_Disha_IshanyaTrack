import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Employee, roleOptions } from "../types";
import { fetchEmployees, updateEmployeeRole } from "../api";

const ManagePermission = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await fetchEmployees();
        setEmployees(employeesData);
        setLoading(false);
      } catch (error) {
        toast.error(`Failed to fetch employee data ${error}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee || selectedRole === null) {
      toast.error("Please select both an employee and a role");
      return;
    }

    setUpdating(true);
    try {
      const response = await updateEmployeeRole(selectedEmployee, selectedRole);

      if (response.success) {
        toast.success(`Role updated successfully for ${response.data.Name}`);
        setSelectedEmployee("");
        setSelectedRole(null);
      } else {
        toast.error(`Failed to update role: ${response.message}`);
      }
    } catch (error: any) {
      toast.error(`Error updating role: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Assign User Permissions</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Select Employee</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select an employee
                      </option>
                      {employees.map((employee) => (
                        <option
                          key={employee.Employee_ID}
                          value={employee.Employee_ID}
                        >
                          {employee.Name} ({employee.Designation})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Assign Access Level</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedRole === null ? "" : selectedRole}
                      onChange={(e) => setSelectedRole(Number(e.target.value))}
                      required
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${updating ? "loading" : ""}`}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Permission"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {employees.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Current Employee Roles</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Current Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.Employee_ID}>
                    <td>{employee.Employee_ID}</td>
                    <td>{employee.Name}</td>
                    <td>{employee.Department}</td>
                    <td>
                      <span className="badge badge-primary">
                        {employee.Designation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePermission;

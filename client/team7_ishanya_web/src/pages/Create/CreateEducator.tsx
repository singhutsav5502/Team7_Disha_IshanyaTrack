import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { create_new_educator,fetchEmployees, fetchProgramData } from "../../api";

const AssignEducatorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    Employee_ID: "",
    Educator_Name: "",
    Photo: "",
    Designation: "",
    Email: "",
    Phone: "",
    Date_of_Birth: "",
    Date_of_Joining: "",
    Work_Location: "",
    Program_ID: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, programsData] = await Promise.all([
          fetchEmployees(),
          fetchProgramData(),
        ]);
        setEmployees(employeesData);
        setPrograms(programsData);
      } catch (error) {
        toast.error(`Error fetching data: ${error.message}`);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.Employee_ID === employeeId);
    
    if (selectedEmployee) {
      setFormData({
        Employee_ID: selectedEmployee.Employee_ID,
        Educator_Name: selectedEmployee.Name,
        Photo: selectedEmployee.Photo || "",
        Designation: selectedEmployee.Designation,
        Email: selectedEmployee.Email,
        Phone: selectedEmployee.Phone,
        Date_of_Birth: selectedEmployee.Date_of_Birth,
        Date_of_Joining: selectedEmployee.Date_of_Joining,
        Work_Location: selectedEmployee.Work_Location,
        Program_ID: formData.Program_ID,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await create_new_educator(formData);
      
      if (response.success) {
        toast.success("Educator assigned successfully!");
        navigate("/manage-educators");
      } else {
        toast.error(`Failed to assign educator: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error assigning educator: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
      <h1 className="text-3xl font-bold mb-6">Assign New Educator</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Select Employee</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    onChange={handleEmployeeSelect}
                    required
                  >
                    <option value="" disabled selected>
                      Select an employee
                    </option>
                    {employees.map((employee) => (
                      <option key={employee.Employee_ID} value={employee.Employee_ID}>
                        {employee.Name} ({employee.Employee_ID})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Program</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="Program_ID"
                    value={formData.Program_ID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select program
                    </option>
                    {programs.map((program) => (
                      <option key={program.Program_ID} value={program.Program_ID}>
                        {program.Program_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Employee ID</span>
                  </label>
                  <input
                    type="text"
                    name="Employee_ID"
                    value={formData.Employee_ID}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Educator Name</span>
                  </label>
                  <input
                    type="text"
                    name="Educator_Name"
                    value={formData.Educator_Name}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Designation</span>
                  </label>
                  <input
                    type="text"
                    name="Designation"
                    value={formData.Designation}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    className="input input-bordered w-full"
                    readOnly
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                  disabled={loading || !formData.Employee_ID || !formData.Program_ID}
                >
                  {loading ? "Assigning..." : "Assign as Educator"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignEducatorPage;
